import { createServer } from "node:http";
import { createHash, createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { Pool } from "pg";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const publicDir = join(__dirname, "public");
const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || "0.0.0.0";
const databaseUrl = process.env.DATABASE_URL;
const stateKey = "default";
const authUsername = process.env.AUTH_USERNAME || "admin";
const authPassword = process.env.AUTH_PASSWORD || "";
const authPasswordHash = process.env.AUTH_PASSWORD_HASH || "";
const sessionSecret = process.env.SESSION_SECRET || randomBytes(48).toString("hex");
const sessionCookieName = "mkaf_session";
const sessionDurationSeconds = 8 * 60 * 60;
const authConfigured = Boolean(authPassword || authPasswordHash);

function createPool(connectionString) {
  const parsedUrl = new URL(connectionString);
  const sslMode = parsedUrl.searchParams.get("sslmode");
  const useSsl = ["require", "verify-ca", "verify-full", "no-verify"].includes(sslMode || "");

  return new Pool({
    connectionString,
    ssl: useSsl ? { rejectUnauthorized: sslMode === "verify-full" } : false
  });
}

const pool = databaseUrl ? createPool(databaseUrl) : null;

let databaseReady = false;

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon"
};

function resolveStaticPath(pathname) {
  const cleanPath = pathname === "/" ? "/index.html" : pathname;
  const decodedPath = decodeURIComponent(cleanPath);
  const normalized = normalize(decodedPath).replace(/^(\.\.[/\\])+/, "");
  return join(publicDir, normalized);
}

function sendJson(response, statusCode, data) {
  response.writeHead(statusCode, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store"
  });
  response.end(JSON.stringify(data));
}

function sendJsonWithHeaders(response, statusCode, data, headers = {}) {
  response.writeHead(statusCode, {
    ...headers,
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store"
  });
  response.end(JSON.stringify(data));
}

function parseCookies(request) {
  const header = request.headers.cookie || "";

  return header.split(";").reduce((cookies, part) => {
    const [rawName, ...rawValueParts] = part.trim().split("=");
    if (!rawName) return cookies;

    try {
      cookies[rawName] = decodeURIComponent(rawValueParts.join("=") || "");
    } catch {
      cookies[rawName] = "";
    }
    return cookies;
  }, {});
}

function safeCompare(left, right) {
  if (!left || !right) return false;

  const leftHash = createHash("sha256").update(String(left)).digest();
  const rightHash = createHash("sha256").update(String(right)).digest();
  return timingSafeEqual(leftHash, rightHash);
}

function hashPassword(password, salt) {
  return scryptSync(password, salt, 64).toString("hex");
}

function verifyPassword(password) {
  if (authPasswordHash) {
    const [algorithm, salt, expectedHash] = authPasswordHash.split(":");
    if (algorithm !== "scrypt" || !salt || !expectedHash) {
      console.error("AUTH_PASSWORD_HASH doit utiliser le format scrypt:<salt>:<hash>.");
      return false;
    }

    return safeCompare(hashPassword(password, salt), expectedHash);
  }

  return safeCompare(password, authPassword);
}

function signSessionPayload(encodedPayload) {
  return createHmac("sha256", sessionSecret).update(encodedPayload).digest("base64url");
}

function createSessionValue(username) {
  const payload = {
    username,
    exp: Math.floor(Date.now() / 1000) + sessionDurationSeconds
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${encodedPayload}.${signSessionPayload(encodedPayload)}`;
}

function readSession(request) {
  const cookieValue = parseCookies(request)[sessionCookieName];
  if (!cookieValue) return null;

  const [encodedPayload, signature] = cookieValue.split(".");
  if (!encodedPayload || !signature || !safeCompare(signature, signSessionPayload(encodedPayload))) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8"));
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return null;
    if (payload.username !== authUsername) return null;
    return payload;
  } catch {
    return null;
  }
}

function isAuthenticated(request) {
  return authConfigured && Boolean(readSession(request));
}

function isSecureRequest(request) {
  const forwardedProto = String(request.headers["x-forwarded-proto"] || "").split(",")[0].trim();
  return forwardedProto === "https" || Boolean(request.socket.encrypted);
}

function sessionCookie(value, request) {
  const secure = isSecureRequest(request) ? "; Secure" : "";
  return `${sessionCookieName}=${encodeURIComponent(value)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${sessionDurationSeconds}${secure}`;
}

function clearSessionCookie(request) {
  const secure = isSecureRequest(request) ? "; Secure" : "";
  return `${sessionCookieName}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0${secure}`;
}

function sendRedirect(response, location) {
  response.writeHead(302, {
    location,
    "cache-control": "no-store"
  });
  response.end();
}

function isPublicPath(pathname) {
  return (
    pathname === "/login" ||
    pathname === "/login.html" ||
    pathname === "/styles.css" ||
    pathname === "/favicon.ico" ||
    pathname.startsWith("/assets/")
  );
}

function safeNextPath(value) {
  if (!value || typeof value !== "string") return "/";
  if (!value.startsWith("/") || value.startsWith("//") || /[\r\n]/.test(value)) return "/";

  try {
    const nextUrl = new URL(value, "http://localhost");
    return `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`;
  } catch {
    return "/";
  }
}

async function sendStaticFile(request, response, filePath) {
  const content = await readFile(filePath);
  const contentType = mimeTypes[extname(filePath)] || "application/octet-stream";
  response.writeHead(200, {
    "content-type": contentType,
    "cache-control": "no-store"
  });
  response.end(request.method === "HEAD" ? undefined : content);
}

async function readJsonBody(request) {
  const chunks = [];
  let size = 0;
  const maxSize = 2 * 1024 * 1024;

  for await (const chunk of request) {
    size += chunk.length;
    if (size > maxSize) {
      throw new Error("Payload too large");
    }
    chunks.push(chunk);
  }

  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

async function initializeDatabase() {
  if (!pool) return;

  await pool.query(`
    CREATE TABLE IF NOT EXISTS app_state (
      key TEXT PRIMARY KEY,
      data JSONB NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  databaseReady = true;
}

async function ensureDatabase(response) {
  if (!pool) {
    sendJson(response, 200, {
      ok: true,
      storage: "browser",
      database: "disabled",
      message: "DATABASE_URL n'est pas configuree."
    });
    return false;
  }

  if (!databaseReady) {
    try {
      await initializeDatabase();
    } catch (error) {
      console.error("Database initialization failed:", error);
      sendJson(response, 503, {
        ok: false,
        storage: "browser",
        database: "unavailable",
        message: "La base de donnees est indisponible."
      });
      return false;
    }
  }

  return true;
}

async function handleHealth(response) {
  if (!pool) {
    sendJson(response, 200, {
      ok: true,
      storage: "browser",
      database: "disabled"
    });
    return;
  }

  try {
    await initializeDatabase();
    await pool.query("SELECT 1");
    sendJson(response, 200, {
      ok: true,
      storage: "database",
      database: "connected"
    });
  } catch (error) {
    console.error("Database health check failed:", error);
    sendJson(response, 503, {
      ok: false,
      storage: "browser",
      database: "unavailable"
    });
  }
}

function handleSession(request, response) {
  const session = readSession(request);
  sendJson(response, 200, {
    ok: true,
    authenticated: Boolean(session),
    username: session?.username || null,
    authConfigured
  });
}

async function handleLogin(request, response) {
  if (!authConfigured) {
    sendJson(response, 503, {
      ok: false,
      message: "L'authentification n'est pas configuree. Ajoutez AUTH_PASSWORD ou AUTH_PASSWORD_HASH dans Railway."
    });
    return;
  }

  const body = await readJsonBody(request);
  const username = typeof body.username === "string" ? body.username.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (username !== authUsername || !verifyPassword(password)) {
    sendJson(response, 401, {
      ok: false,
      message: "Identifiant ou mot de passe incorrect."
    });
    return;
  }

  const redirectTo = safeNextPath(body.next);
  sendJsonWithHeaders(response, 200, {
    ok: true,
    redirectTo
  }, {
    "set-cookie": sessionCookie(createSessionValue(username), request)
  });
}

function handleLogout(request, response) {
  sendJsonWithHeaders(response, 200, {
    ok: true
  }, {
    "set-cookie": clearSessionCookie(request)
  });
}

async function handleGetState(response) {
  const canUseDatabase = await ensureDatabase(response);
  if (!canUseDatabase) return;

  const result = await pool.query("SELECT data, updated_at FROM app_state WHERE key = $1", [stateKey]);
  const row = result.rows[0];

  sendJson(response, 200, {
    ok: true,
    storage: "database",
    state: row?.data || null,
    updatedAt: row?.updated_at || null
  });
}

async function handleSaveState(request, response) {
  if (!pool) {
    sendJson(response, 503, {
      ok: false,
      storage: "browser",
      database: "disabled",
      message: "DATABASE_URL n'est pas configuree."
    });
    return;
  }

  const canUseDatabase = await ensureDatabase(response);
  if (!canUseDatabase) return;

  const body = await readJsonBody(request);
  if (!body.state || typeof body.state !== "object") {
    sendJson(response, 400, {
      ok: false,
      message: "Le corps de la requete doit contenir un objet state."
    });
    return;
  }

  const result = await pool.query(
    `
      INSERT INTO app_state (key, data, updated_at)
      VALUES ($1, $2::jsonb, NOW())
      ON CONFLICT (key)
      DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()
      RETURNING updated_at
    `,
    [stateKey, JSON.stringify(body.state)]
  );

  sendJson(response, 200, {
    ok: true,
    storage: "database",
    updatedAt: result.rows[0].updated_at
  });
}

async function handleApiRequest(request, response, pathname) {
  try {
    if (pathname === "/api/health" && request.method === "GET") {
      await handleHealth(response);
      return;
    }

    if (pathname === "/api/session" && request.method === "GET") {
      handleSession(request, response);
      return;
    }

    if (pathname === "/api/login" && request.method === "POST") {
      await handleLogin(request, response);
      return;
    }

    if (pathname === "/api/logout" && request.method === "POST") {
      handleLogout(request, response);
      return;
    }

    if (!authConfigured) {
      sendJson(response, 503, {
        ok: false,
        message: "L'authentification n'est pas configuree."
      });
      return;
    }

    if (!isAuthenticated(request)) {
      sendJson(response, 401, {
        ok: false,
        message: "Authentification requise."
      });
      return;
    }

    if (pathname === "/api/state" && request.method === "GET") {
      await handleGetState(response);
      return;
    }

    if (pathname === "/api/state" && request.method === "POST") {
      await handleSaveState(request, response);
      return;
    }

    sendJson(response, 404, {
      ok: false,
      message: "Endpoint introuvable."
    });
  } catch (error) {
    console.error("API request failed:", error);
    sendJson(response, error.message === "Payload too large" ? 413 : 500, {
      ok: false,
      message: "Erreur serveur."
    });
  }
}

async function handleStaticRequest(request, response, requestUrl) {
  if (!["GET", "HEAD"].includes(request.method || "")) {
    response.writeHead(405, { "content-type": "text/plain; charset=utf-8" });
    response.end("Method not allowed");
    return;
  }

  const pathname = requestUrl.pathname;
  const publicPath = isPublicPath(pathname);
  const authenticated = isAuthenticated(request);

  if ((pathname === "/login" || pathname === "/login.html") && authenticated) {
    sendRedirect(response, "/");
    return;
  }

  if (!publicPath && !authenticated) {
    const nextPath = safeNextPath(`${pathname}${requestUrl.search}`);
    sendRedirect(response, `/login?next=${encodeURIComponent(nextPath)}`);
    return;
  }

  try {
    const staticPathname = pathname === "/login" ? "/login.html" : pathname;
    const filePath = resolveStaticPath(staticPathname);
    if (!filePath.startsWith(publicDir)) {
      response.writeHead(403, { "content-type": "text/plain; charset=utf-8" });
      response.end("Forbidden");
      return;
    }

    await sendStaticFile(request, response, filePath);
  } catch {
    if (extname(pathname) === "") {
      await sendStaticFile(request, response, join(publicDir, "index.html"));
      return;
    }

    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("Not found");
  }
}

const databaseInitialization = initializeDatabase().catch((error) => {
  console.error("Database initialization failed:", error);
});

const server = createServer(async (request, response) => {
  if (!request.url) {
    response.writeHead(400, { "content-type": "text/plain; charset=utf-8" });
    response.end("Bad request");
    return;
  }

  const requestUrl = new URL(request.url, `http://${request.headers.host || "localhost"}`);

  if (requestUrl.pathname.startsWith("/api/")) {
    await databaseInitialization;
    await handleApiRequest(request, response, requestUrl.pathname);
    return;
  }

  await handleStaticRequest(request, response, requestUrl);
});

server.listen(port, host, () => {
  console.log(`Outil cout cafe disponible sur http://${host}:${port}`);
  console.log(`Stockage: ${pool ? "PostgreSQL" : "navigateur"}`);
  console.log(`Authentification: ${authConfigured ? "active" : "non configuree"}`);
});
