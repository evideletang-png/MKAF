import { createServer } from "node:http";
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

async function handleStaticRequest(request, response, pathname) {
  if (!["GET", "HEAD"].includes(request.method || "")) {
    response.writeHead(405, { "content-type": "text/plain; charset=utf-8" });
    response.end("Method not allowed");
    return;
  }

  try {
    const filePath = resolveStaticPath(pathname);
    if (!filePath.startsWith(publicDir)) {
      response.writeHead(403, { "content-type": "text/plain; charset=utf-8" });
      response.end("Forbidden");
      return;
    }

    const content = await readFile(filePath);
    const contentType = mimeTypes[extname(filePath)] || "application/octet-stream";
    response.writeHead(200, {
      "content-type": contentType,
      "cache-control": "no-store"
    });
    response.end(request.method === "HEAD" ? undefined : content);
  } catch {
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

  await handleStaticRequest(request, response, requestUrl.pathname);
});

server.listen(port, host, () => {
  console.log(`Outil cout cafe disponible sur http://${host}:${port}`);
  console.log(`Stockage: ${pool ? "PostgreSQL" : "navigateur"}`);
});
