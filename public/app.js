const STORAGE_KEY = "cout-cafe-prototype-v1";

const today = new Date().toISOString().slice(0, 10);
let storageMode = "browser";

function addDays(date, days) {
  const next = new Date(`${date}T12:00:00Z`);
  next.setUTCDate(next.getUTCDate() + days);
  return next.toISOString().slice(0, 10);
}

function previousYearDate(date) {
  const previous = new Date(`${date}T12:00:00Z`);
  previous.setUTCFullYear(previous.getUTCFullYear() - 1);
  return previous.toISOString().slice(0, 10);
}

function weekdayIndex(date) {
  return new Date(`${date}T12:00:00Z`).getUTCDay();
}

function buildHistoricalOrders() {
  const start = "2025-06-30";
  const orders = [];

  for (let day = 0; day < 70; day += 1) {
    const date = addDays(start, day);
    const weekday = weekdayIndex(date);
    const weekendBoost = weekday === 0 || weekday === 6 ? 1.32 : 1;
    const fridayBoost = weekday === 5 ? 1.18 : 1;
    const summerBoost = date >= "2025-07-10" && date <= "2025-08-25" ? 1.16 : 1;
    const localEventBoost = ["2025-07-14", "2025-08-15"].includes(date) ? 1.45 : 1;
    const rhythm = 1 + Math.sin(day / 4) * 0.08;
    const multiplier = weekendBoost * fridayBoost * summerBoost * localEventBoost * rhythm;

    orders.push({
      id: `order-${date}-espresso`,
      date,
      blendId: "blend-espresso-maison",
      roastedKg: Number((18 * multiplier).toFixed(2)),
      channel: weekday === 0 || weekday === 6 ? "boutique" : "mixte"
    });

    orders.push({
      id: `order-${date}-filtre`,
      date,
      blendId: "blend-filtre-doux",
      roastedKg: Number((9 * multiplier * (weekday === 2 ? 1.2 : 1)).toFixed(2)),
      channel: "mixte"
    });
  }

  return orders;
}

const seedState = {
  countries: [
    { id: "country-br", name: "Brésil", region: "Amérique latine" },
    { id: "country-co", name: "Colombie", region: "Amérique latine" },
    { id: "country-et", name: "Éthiopie", region: "Afrique" }
  ],
  suppliers: [
    { id: "supplier-a", name: "Importateur A", defaultCurrency: "EUR" },
    { id: "supplier-b", name: "Importateur B", defaultCurrency: "EUR" }
  ],
  beans: [
    {
      id: "bean-bresil-santos",
      commercialName: "Brésil Santos",
      countryId: "country-br",
      defaultSupplierId: "supplier-a",
      species: "arabica",
      process: "naturel"
    },
    {
      id: "bean-colombie-excelso",
      commercialName: "Colombie Excelso",
      countryId: "country-co",
      defaultSupplierId: "supplier-b",
      species: "arabica",
      process: "lavé"
    },
    {
      id: "bean-ethiopie-sidamo",
      commercialName: "Éthiopie Sidamo",
      countryId: "country-et",
      defaultSupplierId: "supplier-b",
      species: "arabica",
      process: "lavé"
    }
  ],
  prices: [
    {
      id: "price-1",
      beanId: "bean-bresil-santos",
      supplierId: "supplier-a",
      pricePerKg: 5.8,
      currency: "EUR",
      validFrom: "2026-01-01",
      validTo: "2026-03-31",
      notes: "Contrat T1"
    },
    {
      id: "price-2",
      beanId: "bean-colombie-excelso",
      supplierId: "supplier-b",
      pricePerKg: 7.2,
      currency: "EUR",
      validFrom: "2026-01-01",
      validTo: "2026-01-31",
      notes: "Prix janvier"
    },
    {
      id: "price-3",
      beanId: "bean-colombie-excelso",
      supplierId: "supplier-b",
      pricePerKg: 7.55,
      currency: "EUR",
      validFrom: "2026-02-01",
      validTo: "2026-03-31",
      notes: "Renégociation février"
    },
    {
      id: "price-4",
      beanId: "bean-ethiopie-sidamo",
      supplierId: "supplier-b",
      pricePerKg: 8.1,
      currency: "EUR",
      validFrom: "2026-01-01",
      validTo: "2026-03-31",
      notes: "Contrat T1"
    }
  ],
  blends: [
    {
      id: "blend-espresso-maison",
      name: "Espresso Maison",
      roastLossPct: 15,
      packagingCostPerKg: 0.55,
      energyCostPerKg: 0.22,
      logisticsCostPerKg: 0.18,
      targetSalePricePerKg: 22,
      maxCostPerKg: 9.2,
      components: [
        { beanId: "bean-bresil-santos", percentage: 50 },
        { beanId: "bean-colombie-excelso", percentage: 30 },
        { beanId: "bean-ethiopie-sidamo", percentage: 20 }
      ]
    },
    {
      id: "blend-filtre-doux",
      name: "Filtre Doux",
      roastLossPct: 13,
      packagingCostPerKg: 0.5,
      energyCostPerKg: 0.2,
      logisticsCostPerKg: 0.18,
      targetSalePricePerKg: 24,
      maxCostPerKg: 10.1,
      components: [
        { beanId: "bean-colombie-excelso", percentage: 60 },
        { beanId: "bean-ethiopie-sidamo", percentage: 40 }
      ]
    }
  ],
  batches: [],
  greenStocks: [
    { beanId: "bean-bresil-santos", quantityKg: 115 },
    { beanId: "bean-colombie-excelso", quantityKg: 82 },
    { beanId: "bean-ethiopie-sidamo", quantityKg: 54 }
  ],
  historicalOrders: buildHistoricalOrders(),
  forecastSettings: {
    startDate: "2026-07-01",
    horizonDays: 14,
    growthPct: 6,
    seasonalityPct: 4,
    externalPct: 0,
    knownOrdersPct: 0,
    safetyStockPct: 12
  }
};

let state = structuredClone(seedState);

const els = {
  navTabs: document.querySelectorAll(".nav-tab"),
  views: document.querySelectorAll(".view"),
  storageStatus: document.querySelector("#storageStatus"),
  metrics: document.querySelector("#metrics"),
  alertsList: document.querySelector("#alertsList"),
  alertCount: document.querySelector("#alertCount"),
  blendCards: document.querySelector("#blendCards"),
  priceForm: document.querySelector("#priceForm"),
  priceBean: document.querySelector("#priceBean"),
  priceSupplier: document.querySelector("#priceSupplier"),
  priceValue: document.querySelector("#priceValue"),
  priceCurrency: document.querySelector("#priceCurrency"),
  priceFrom: document.querySelector("#priceFrom"),
  priceTo: document.querySelector("#priceTo"),
  priceNotes: document.querySelector("#priceNotes"),
  priceRows: document.querySelector("#priceRows"),
  priceRowsCount: document.querySelector("#priceRowsCount"),
  calculatorForm: document.querySelector("#calculatorForm"),
  calcBlend: document.querySelector("#calcBlend"),
  calcDate: document.querySelector("#calcDate"),
  compareDate: document.querySelector("#compareDate"),
  calcResult: document.querySelector("#calcResult"),
  calcLines: document.querySelector("#calcLines"),
  forecastForm: document.querySelector("#forecastForm"),
  forecastStart: document.querySelector("#forecastStart"),
  forecastHorizon: document.querySelector("#forecastHorizon"),
  forecastGrowth: document.querySelector("#forecastGrowth"),
  forecastSeason: document.querySelector("#forecastSeason"),
  forecastExternal: document.querySelector("#forecastExternal"),
  forecastKnownOrders: document.querySelector("#forecastKnownOrders"),
  forecastSafety: document.querySelector("#forecastSafety"),
  forecastMetrics: document.querySelector("#forecastMetrics"),
  forecastBeanNeeds: document.querySelector("#forecastBeanNeeds"),
  forecastBlendNeeds: document.querySelector("#forecastBlendNeeds"),
  forecastDailyRows: document.querySelector("#forecastDailyRows"),
  batchForm: document.querySelector("#batchForm"),
  batchBlend: document.querySelector("#batchBlend"),
  batchDate: document.querySelector("#batchDate"),
  batchQuantity: document.querySelector("#batchQuantity"),
  batchLoss: document.querySelector("#batchLoss"),
  batchRows: document.querySelector("#batchRows"),
  beanRows: document.querySelector("#beanRows"),
  blendRows: document.querySelector("#blendRows"),
  resetDemo: document.querySelector("#resetDemo"),
  exportData: document.querySelector("#exportData")
};

function normalizeState(candidate) {
  const base = structuredClone(seedState);
  if (!candidate || typeof candidate !== "object") return base;

  return {
    ...base,
    ...candidate,
    countries: Array.isArray(candidate.countries) ? candidate.countries : base.countries,
    suppliers: Array.isArray(candidate.suppliers) ? candidate.suppliers : base.suppliers,
    beans: Array.isArray(candidate.beans) ? candidate.beans : base.beans,
    prices: Array.isArray(candidate.prices) ? candidate.prices : base.prices,
    blends: Array.isArray(candidate.blends) ? candidate.blends : base.blends,
    batches: Array.isArray(candidate.batches) ? candidate.batches : base.batches,
    greenStocks: Array.isArray(candidate.greenStocks) ? candidate.greenStocks : base.greenStocks,
    historicalOrders: Array.isArray(candidate.historicalOrders) ? candidate.historicalOrders : base.historicalOrders,
    forecastSettings: {
      ...base.forecastSettings,
      ...(candidate.forecastSettings || {})
    }
  };
}

function loadBrowserState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return structuredClone(seedState);

  try {
    return normalizeState(JSON.parse(raw));
  } catch {
    return structuredClone(seedState);
  }
}

function setStorageStatus(label, status = "muted") {
  if (!els.storageStatus) return;
  els.storageStatus.textContent = label;
  els.storageStatus.className = `storage-status ${status}`;
}

function saveBrowserState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

async function loadState() {
  const browserState = loadBrowserState();
  state = browserState;

  try {
    const response = await fetch("/api/state", {
      headers: { accept: "application/json" }
    });

    if (!response.ok) throw new Error("API state unavailable");

    const payload = await response.json();
    if (payload.storage !== "database") {
      storageMode = "browser";
      setStorageStatus("Mode navigateur", "muted");
      return;
    }

    storageMode = "database";
    state = normalizeState(payload.state || browserState);
    saveBrowserState();

    if (!payload.state) {
      await saveState();
      setStorageStatus("Base initialisée", "success");
      return;
    }

    setStorageStatus("Base connectée", "success");
  } catch {
    storageMode = "browser";
    setStorageStatus("Base indisponible", "warning");
  }
}

async function saveState() {
  saveBrowserState();

  if (storageMode !== "database") return;

  try {
    const response = await fetch("/api/state", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ state })
    });

    if (!response.ok) throw new Error("Database save failed");
    setStorageStatus("Base synchronisée", "success");
  } catch {
    setStorageStatus("Sauvegarde locale", "warning");
  }
}

function formatMoney(value, currency = "EUR") {
  if (!Number.isFinite(value)) return "-";
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

function formatPct(value) {
  if (!Number.isFinite(value)) return "-";
  return `${value.toFixed(1).replace(".", ",")} %`;
}

function formatKg(value) {
  if (!Number.isFinite(value)) return "-";
  return `${value.toFixed(1).replace(".", ",")} kg`;
}

function getById(collection, id) {
  return state[collection].find((item) => item.id === id);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function dateInRange(date, from, to) {
  return from <= date && (!to || to >= date);
}

function daysBetween(dateA, dateB) {
  const dayMs = 24 * 60 * 60 * 1000;
  return Math.round((new Date(dateB) - new Date(dateA)) / dayMs);
}

function findPrice(beanId, supplierId, date) {
  const matches = state.prices.filter((price) => {
    return price.beanId === beanId && price.supplierId === supplierId && dateInRange(date, price.validFrom, price.validTo);
  });

  if (matches.length === 0) {
    return { status: "missing", price: null, matches };
  }

  if (matches.length > 1) {
    return { status: "conflict", price: null, matches };
  }

  return { status: "ok", price: matches[0], matches };
}

function calculateBlend(blendId, date, overrideLossPct) {
  const blend = getById("blends", blendId);
  if (!blend) {
    return { status: "error", errors: ["Assemblage introuvable"], lines: [] };
  }

  const lines = blend.components.map((component) => {
    const bean = getById("beans", component.beanId);
    const supplierId = component.forcedSupplierId || bean?.defaultSupplierId;
    const supplier = getById("suppliers", supplierId);
    const priceResult = findPrice(component.beanId, supplierId, date);

    if (priceResult.status !== "ok") {
      return {
        bean,
        supplier,
        component,
        status: priceResult.status,
        price: null,
        lineCost: null
      };
    }

    const lineCost = priceResult.price.pricePerKg * (component.percentage / 100);
    return {
      bean,
      supplier,
      component,
      status: "ok",
      price: priceResult.price,
      lineCost
    };
  });

  const errors = lines
    .filter((line) => line.status !== "ok")
    .map((line) => {
      const grain = line.bean?.commercialName || "Grain inconnu";
      if (line.status === "conflict") return `Conflit de tarifs pour ${grain}`;
      return `Prix manquant pour ${grain}`;
    });

  if (errors.length > 0) {
    return {
      status: "error",
      blend,
      date,
      errors,
      lines
    };
  }

  const greenCostPerKg = lines.reduce((sum, line) => sum + line.lineCost, 0);
  const lossPct = Number.isFinite(overrideLossPct) ? overrideLossPct : blend.roastLossPct;
  const roastedCostPerKg = greenCostPerKg / (1 - lossPct / 100);
  const fees =
    blend.packagingCostPerKg +
    blend.energyCostPerKg +
    blend.logisticsCostPerKg;
  const totalCostPerKg = roastedCostPerKg + fees;
  const margin = blend.targetSalePricePerKg ? blend.targetSalePricePerKg - totalCostPerKg : null;
  const marginPct = blend.targetSalePricePerKg ? (margin / blend.targetSalePricePerKg) * 100 : null;

  return {
    status: "ok",
    blend,
    date,
    lines,
    greenCostPerKg,
    lossPct,
    roastedCostPerKg,
    fees,
    totalCostPerKg,
    margin,
    marginPct
  };
}

function sumHistoricalKg(date, blendId) {
  return (state.historicalOrders || [])
    .filter((order) => order.date === date && order.blendId === blendId)
    .reduce((sum, order) => sum + Number(order.roastedKg || 0), 0);
}

function averageHistoricalKgForWeekday(blendId, weekday) {
  const rows = (state.historicalOrders || []).filter((order) => {
    return order.blendId === blendId && weekdayIndex(order.date) === weekday;
  });

  if (rows.length === 0) return 0;
  return rows.reduce((sum, order) => sum + Number(order.roastedKg || 0), 0) / rows.length;
}

function averageHistoricalKg(blendId) {
  const rows = (state.historicalOrders || []).filter((order) => order.blendId === blendId);
  if (rows.length === 0) return 0;
  return rows.reduce((sum, order) => sum + Number(order.roastedKg || 0), 0) / rows.length;
}

function factorMultiplier(settings) {
  return [
    settings.growthPct,
    settings.seasonalityPct,
    settings.externalPct,
    settings.knownOrdersPct
  ].reduce((multiplier, pct) => multiplier * (1 + Number(pct || 0) / 100), 1);
}

function calculateForecast(settings = state.forecastSettings) {
  const safeSettings = {
    ...seedState.forecastSettings,
    ...(settings || {})
  };
  const horizonDays = Math.max(1, Math.min(90, Number(safeSettings.horizonDays || 14)));
  const multiplier = factorMultiplier(safeSettings);
  const dailyRows = [];
  const blendTotals = new Map();
  const beanTotals = new Map();

  for (let day = 0; day < horizonDays; day += 1) {
    const date = addDays(safeSettings.startDate, day);
    const n1Date = previousYearDate(date);
    const weekday = weekdayIndex(date);
    let dayN1Kg = 0;
    let dayForecastKg = 0;
    let confidenceScore = 0;

    state.blends.forEach((blend) => {
      const n1Kg = sumHistoricalKg(n1Date, blend.id);
      const weekdayAverage = averageHistoricalKgForWeekday(blend.id, weekday);
      const fallbackAverage = averageHistoricalKg(blend.id);
      const statisticalBase = weekdayAverage || fallbackAverage;
      const baseKg = n1Kg > 0 ? n1Kg * 0.75 + statisticalBase * 0.25 : statisticalBase;
      const forecastKg = baseKg * multiplier;
      const confidence = n1Kg > 0 ? "Haute" : statisticalBase > 0 ? "Moyenne" : "Faible";

      dayN1Kg += n1Kg;
      dayForecastKg += forecastKg;
      confidenceScore += confidence === "Haute" ? 3 : confidence === "Moyenne" ? 2 : 1;

      const existingBlend = blendTotals.get(blend.id) || {
        blend,
        n1Kg: 0,
        forecastRoastedKg: 0,
        forecastGreenKg: 0
      };
      const greenKg = forecastKg / (1 - blend.roastLossPct / 100);
      existingBlend.n1Kg += n1Kg;
      existingBlend.forecastRoastedKg += forecastKg;
      existingBlend.forecastGreenKg += greenKg;
      blendTotals.set(blend.id, existingBlend);

      blend.components.forEach((component) => {
        const beanNeed = greenKg * (component.percentage / 100);
        const existingBean = beanTotals.get(component.beanId) || {
          bean: getById("beans", component.beanId),
          requiredKg: 0
        };
        existingBean.requiredKg += beanNeed;
        beanTotals.set(component.beanId, existingBean);
      });
    });

    dailyRows.push({
      date,
      n1Date,
      n1Kg: dayN1Kg,
      forecastKg: dayForecastKg,
      confidence:
        confidenceScore / Math.max(state.blends.length, 1) >= 2.7
          ? "Haute"
          : confidenceScore / Math.max(state.blends.length, 1) >= 1.8
            ? "Moyenne"
            : "Faible"
    });
  }

  const beanNeeds = [...beanTotals.values()].map((need) => {
    const stock = (state.greenStocks || []).find((item) => item.beanId === need.bean?.id);
    const stockKg = Number(stock?.quantityKg || 0);
    const requiredWithSafetyKg = need.requiredKg * (1 + Number(safeSettings.safetyStockPct || 0) / 100);
    return {
      ...need,
      stockKg,
      safetyStockPct: Number(safeSettings.safetyStockPct || 0),
      requiredWithSafetyKg,
      orderKg: Math.max(0, requiredWithSafetyKg - stockKg)
    };
  });

  const totalForecastRoastedKg = dailyRows.reduce((sum, row) => sum + row.forecastKg, 0);
  const totalGreenRequiredKg = beanNeeds.reduce((sum, row) => sum + row.requiredKg, 0);
  const totalOrderKg = beanNeeds.reduce((sum, row) => sum + row.orderKg, 0);

  return {
    settings: safeSettings,
    dailyRows,
    blendNeeds: [...blendTotals.values()],
    beanNeeds,
    totalForecastRoastedKg,
    totalGreenRequiredKg,
    totalOrderKg,
    multiplier
  };
}

function calculateAlerts(date = today) {
  const alerts = [];

  state.blends.forEach((blend) => {
    const result = calculateBlend(blend.id, date);

    if (result.status === "error") {
      result.errors.forEach((message) => {
        alerts.push({ severity: "danger", title: blend.name, message });
      });
      return;
    }

    if (blend.maxCostPerKg && result.totalCostPerKg > blend.maxCostPerKg) {
      alerts.push({
        severity: "warning",
        title: blend.name,
        message: `Coût ${formatMoney(result.totalCostPerKg)} au-dessus du seuil ${formatMoney(blend.maxCostPerKg)}`
      });
    }

    if (blend.targetSalePricePerKg && result.marginPct < 55) {
      alerts.push({
        severity: "warning",
        title: blend.name,
        message: `Marge estimée basse : ${formatPct(result.marginPct)}`
      });
    }
  });

  state.prices.forEach((price) => {
    if (!price.validTo) return;
    const remainingDays = daysBetween(date, price.validTo);
    if (remainingDays >= 0 && remainingDays <= 30) {
      const bean = getById("beans", price.beanId);
      alerts.push({
        severity: "warning",
        title: "Tarif bientôt à expiration",
        message: `${bean?.commercialName || "Grain"} expire le ${price.validTo}`
      });
    }
  });

  return alerts;
}

function emptyState() {
  return document.querySelector("#emptyStateTemplate").innerHTML;
}

function renderSelects() {
  const beanOptions = state.beans
    .map((bean) => `<option value="${escapeHtml(bean.id)}">${escapeHtml(bean.commercialName)}</option>`)
    .join("");
  const supplierOptions = state.suppliers
    .map((supplier) => `<option value="${escapeHtml(supplier.id)}">${escapeHtml(supplier.name)}</option>`)
    .join("");
  const blendOptions = state.blends
    .map((blend) => `<option value="${escapeHtml(blend.id)}">${escapeHtml(blend.name)}</option>`)
    .join("");

  els.priceBean.innerHTML = beanOptions;
  els.priceSupplier.innerHTML = supplierOptions;
  els.calcBlend.innerHTML = blendOptions;
  els.batchBlend.innerHTML = blendOptions;
}

function renderMetrics() {
  const alerts = calculateAlerts();
  const validPrices = state.prices.filter((price) => dateInRange(today, price.validFrom, price.validTo));
  const forecast = calculateForecast();

  els.metrics.innerHTML = [
    ["Grains suivis", state.beans.length, "Références café vert"],
    ["Tarifs saisis", state.prices.length, `${validPrices.length} actifs aujourd'hui`],
    ["Assemblages", state.blends.length, "Recettes surveillées"],
    ["Prévision 14 j", formatKg(forecast.totalForecastRoastedKg), `${formatKg(forecast.totalOrderKg)} à commander`]
  ]
    .map(
      ([label, value, helper]) => `
        <article class="metric">
          <span>${escapeHtml(label)}</span>
          <strong>${escapeHtml(value)}</strong>
          <small>${escapeHtml(helper)}</small>
        </article>
      `
    )
    .join("");

  els.alertCount.textContent = alerts.length;
}

function renderAlerts() {
  const alerts = calculateAlerts();

  if (alerts.length === 0) {
    els.alertsList.innerHTML = `
      <div class="result-card">
        <strong>Aucune alerte</strong>
        <span>Les tarifs et les seuils sont cohérents pour la date du jour.</span>
      </div>
    `;
    return;
  }

  els.alertsList.innerHTML = alerts
    .map(
      (alert) => `
        <div class="alert-row ${escapeHtml(alert.severity)}">
          <strong>${escapeHtml(alert.title)}</strong>
          <span>${escapeHtml(alert.message)}</span>
        </div>
      `
    )
    .join("");
}

function renderBlendCards() {
  els.blendCards.innerHTML = state.blends
    .map((blend) => {
      const result = calculateBlend(blend.id, "2026-02-15");
      const cost = result.status === "ok" ? formatMoney(result.totalCostPerKg) : "Prix manquant";
      const composition = blend.components
        .map((component) => {
          const bean = getById("beans", component.beanId);
          return `${component.percentage}% ${bean?.commercialName || "Grain"}`;
        })
        .join(" / ");

      return `
        <article class="card-row">
          <strong>${escapeHtml(blend.name)} - ${escapeHtml(cost)}</strong>
          <span>${escapeHtml(composition)}</span>
        </article>
      `;
    })
    .join("");
}

function renderPrices() {
  const rows = [...state.prices].sort((a, b) => b.validFrom.localeCompare(a.validFrom));
  els.priceRowsCount.textContent = `${rows.length} lignes`;

  els.priceRows.innerHTML = rows
    .map((price) => {
      const bean = getById("beans", price.beanId);
      const supplier = getById("suppliers", price.supplierId);
      return `
        <tr>
          <td>${escapeHtml(bean?.commercialName || "-")}</td>
          <td>${escapeHtml(supplier?.name || "-")}</td>
          <td>${escapeHtml(formatMoney(price.pricePerKg, price.currency))}</td>
          <td>${escapeHtml(price.validFrom)}</td>
          <td>${escapeHtml(price.validTo || "Ouvert")}</td>
          <td>${escapeHtml(price.notes || "")}</td>
        </tr>
      `;
    })
    .join("");
}

function renderCalculation(result, compareResult) {
  if (!result) {
    els.calcResult.innerHTML = emptyState();
    els.calcLines.innerHTML = emptyState();
    return;
  }

  if (result.status === "error") {
    els.calcResult.innerHTML = `
      <div class="alert-row danger">
        <strong>Calcul impossible</strong>
        <span>${escapeHtml(result.errors.join(" | "))}</span>
      </div>
    `;
    els.calcLines.innerHTML = renderLinesTable(result.lines);
    return;
  }

  const delta = compareResult?.status === "ok" ? result.totalCostPerKg - compareResult.totalCostPerKg : null;
  const deltaClass = delta > 0 ? "delta-up" : "delta-down";
  const deltaLabel = Number.isFinite(delta)
    ? `<span class="${deltaClass}">${delta >= 0 ? "+" : ""}${formatMoney(delta)}</span>`
    : "<span class=\"muted\">Aucune comparaison</span>";

  els.calcResult.innerHTML = `
    <div class="result-card">
      <strong>${escapeHtml(result.blend.name)}</strong>
      <span>Date : ${escapeHtml(result.date)}</span>
    </div>
    <div class="result-card">
      <strong>${formatMoney(result.greenCostPerKg)}</strong>
      <span>Coût matière café vert / kg</span>
    </div>
    <div class="result-card">
      <strong>${formatMoney(result.roastedCostPerKg)}</strong>
      <span>Coût après perte de torréfaction (${formatPct(result.lossPct)})</span>
    </div>
    <div class="result-card">
      <strong>${formatMoney(result.totalCostPerKg)}</strong>
      <span>Coût total avec frais (${formatMoney(result.fees)})</span>
    </div>
    <div class="result-card">
      <strong>${formatMoney(result.margin)} / ${formatPct(result.marginPct)}</strong>
      <span>Marge estimée sur prix cible</span>
    </div>
    <div class="result-card">
      <strong>${deltaLabel}</strong>
      <span>Variation vs date comparée</span>
    </div>
  `;

  els.calcLines.innerHTML = renderLinesTable(result.lines);
}

function renderForecast(result = calculateForecast()) {
  els.forecastMetrics.innerHTML = [
    ["Demande prévue", formatKg(result.totalForecastRoastedKg), "Café torréfié sur l'horizon"],
    ["Besoin café vert", formatKg(result.totalGreenRequiredKg), "Avant stock de sécurité"],
    ["À commander", formatKg(result.totalOrderKg), "Après stock disponible"],
    ["Facteur global", formatPct((result.multiplier - 1) * 100), "Croissance, saison, contexte"]
  ]
    .map(
      ([label, value, helper]) => `
        <article class="metric">
          <span>${escapeHtml(label)}</span>
          <strong>${escapeHtml(value)}</strong>
          <small>${escapeHtml(helper)}</small>
        </article>
      `
    )
    .join("");

  els.forecastBeanNeeds.innerHTML = renderBeanNeedsTable(result.beanNeeds);
  els.forecastBlendNeeds.innerHTML = renderBlendNeedsTable(result.blendNeeds);
  els.forecastDailyRows.innerHTML = renderDailyForecastTable(result.dailyRows, result.multiplier);
}

function renderBeanNeedsTable(rows) {
  if (!rows || rows.length === 0) return emptyState();

  return `
    <table>
      <thead>
        <tr>
          <th>Grain</th>
          <th class="numeric">Besoin brut</th>
          <th class="numeric">Avec sécurité</th>
          <th class="numeric">Stock</th>
          <th class="numeric">À commander</th>
        </tr>
      </thead>
      <tbody>
        ${rows
          .map(
            (row) => `
              <tr>
                <td>${escapeHtml(row.bean?.commercialName || "-")}</td>
                <td class="numeric">${escapeHtml(formatKg(row.requiredKg))}</td>
                <td class="numeric">${escapeHtml(formatKg(row.requiredWithSafetyKg))}</td>
                <td class="numeric">${escapeHtml(formatKg(row.stockKg))}</td>
                <td class="numeric"><strong>${escapeHtml(formatKg(row.orderKg))}</strong></td>
              </tr>
            `
          )
          .join("")}
      </tbody>
    </table>
  `;
}

function renderBlendNeedsTable(rows) {
  if (!rows || rows.length === 0) return emptyState();

  return `
    <table>
      <thead>
        <tr>
          <th>Assemblage</th>
          <th class="numeric">N-1</th>
          <th class="numeric">Prévu torréfié</th>
          <th class="numeric">Besoin vert</th>
        </tr>
      </thead>
      <tbody>
        ${rows
          .map(
            (row) => `
              <tr>
                <td>${escapeHtml(row.blend.name)}</td>
                <td class="numeric">${escapeHtml(formatKg(row.n1Kg))}</td>
                <td class="numeric"><strong>${escapeHtml(formatKg(row.forecastRoastedKg))}</strong></td>
                <td class="numeric">${escapeHtml(formatKg(row.forecastGreenKg))}</td>
              </tr>
            `
          )
          .join("")}
      </tbody>
    </table>
  `;
}

function renderDailyForecastTable(rows, multiplier) {
  if (!rows || rows.length === 0) return emptyState();

  return `
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Référence N-1</th>
          <th class="numeric">Activité N-1</th>
          <th class="numeric">Prévision</th>
          <th class="numeric">Facteur</th>
          <th>Confiance</th>
        </tr>
      </thead>
      <tbody>
        ${rows
          .map(
            (row) => `
              <tr>
                <td>${escapeHtml(row.date)}</td>
                <td>${escapeHtml(row.n1Date)}</td>
                <td class="numeric">${escapeHtml(formatKg(row.n1Kg))}</td>
                <td class="numeric"><strong>${escapeHtml(formatKg(row.forecastKg))}</strong></td>
                <td class="numeric">${escapeHtml(formatPct((multiplier - 1) * 100))}</td>
                <td>${escapeHtml(row.confidence)}</td>
              </tr>
            `
          )
          .join("")}
      </tbody>
    </table>
  `;
}

function renderLinesTable(lines) {
  if (!lines || lines.length === 0) return emptyState();

  const rows = lines
    .map((line) => {
      const status = line.status === "ok" ? formatMoney(line.price.pricePerKg, line.price.currency) : line.status;
      return `
        <tr>
          <td>${escapeHtml(line.bean?.commercialName || "-")}</td>
          <td>${escapeHtml(line.supplier?.name || "-")}</td>
          <td class="numeric">${escapeHtml(formatPct(line.component.percentage))}</td>
          <td class="numeric">${escapeHtml(status)}</td>
          <td class="numeric">${escapeHtml(line.lineCost === null ? "-" : formatMoney(line.lineCost))}</td>
        </tr>
      `;
    })
    .join("");

  return `
    <table>
      <thead>
        <tr>
          <th>Grain</th>
          <th>Fournisseur</th>
          <th class="numeric">Part</th>
          <th class="numeric">Prix</th>
          <th class="numeric">Contribution</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

function renderBatches() {
  if (state.batches.length === 0) {
    els.batchRows.innerHTML = `
      <tr>
        <td colspan="5">Aucun batch figé pour le moment.</td>
      </tr>
    `;
    return;
  }

  els.batchRows.innerHTML = state.batches
    .map((batch) => {
      const blend = getById("blends", batch.blendId);
      return `
        <tr>
          <td>${escapeHtml(batch.productionDate)}</td>
          <td>${escapeHtml(blend?.name || "-")}</td>
          <td class="numeric">${escapeHtml(batch.roastedQuantityKg.toFixed(1))}</td>
          <td class="numeric">${escapeHtml(formatMoney(batch.frozenTotalCostPerKg))}</td>
          <td class="numeric">${escapeHtml(formatMoney(batch.frozenBatchCost))}</td>
        </tr>
      `;
    })
    .join("");
}

function renderDataTables() {
  els.beanRows.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Grain</th>
          <th>Pays</th>
          <th>Fournisseur</th>
          <th>Type</th>
        </tr>
      </thead>
      <tbody>
        ${state.beans
          .map((bean) => {
            const country = getById("countries", bean.countryId);
            const supplier = getById("suppliers", bean.defaultSupplierId);
            return `
              <tr>
                <td>${escapeHtml(bean.commercialName)}</td>
                <td>${escapeHtml(country?.name || "-")}</td>
                <td>${escapeHtml(supplier?.name || "-")}</td>
                <td>${escapeHtml(bean.species)}</td>
              </tr>
            `;
          })
          .join("")}
      </tbody>
    </table>
  `;

  els.blendRows.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Assemblage</th>
          <th>Composition</th>
          <th class="numeric">Perte</th>
          <th class="numeric">Seuil</th>
        </tr>
      </thead>
      <tbody>
        ${state.blends
          .map((blend) => {
            const composition = blend.components
              .map((component) => {
                const bean = getById("beans", component.beanId);
                return `${component.percentage}% ${bean?.commercialName || "Grain"}`;
              })
              .join(" / ");

            return `
              <tr>
                <td>${escapeHtml(blend.name)}</td>
                <td>${escapeHtml(composition)}</td>
                <td class="numeric">${escapeHtml(formatPct(blend.roastLossPct))}</td>
                <td class="numeric">${escapeHtml(formatMoney(blend.maxCostPerKg))}</td>
              </tr>
            `;
          })
          .join("")}
      </tbody>
    </table>
  `;
}

function renderAll() {
  renderSelects();
  renderMetrics();
  renderAlerts();
  renderBlendCards();
  renderPrices();
  renderForecast();
  renderBatches();
  renderDataTables();
}

function setupDefaults() {
  const forecastSettings = {
    ...seedState.forecastSettings,
    ...(state.forecastSettings || {})
  };

  els.priceFrom.value = today;
  els.calcDate.value = "2026-02-15";
  els.compareDate.value = "2026-01-15";
  els.forecastStart.value = forecastSettings.startDate;
  els.forecastHorizon.value = forecastSettings.horizonDays;
  els.forecastGrowth.value = forecastSettings.growthPct;
  els.forecastSeason.value = forecastSettings.seasonalityPct;
  els.forecastExternal.value = forecastSettings.externalPct;
  els.forecastKnownOrders.value = forecastSettings.knownOrdersPct;
  els.forecastSafety.value = forecastSettings.safetyStockPct;
  els.batchDate.value = today;
  els.batchQuantity.value = "20";
}

async function addPrice(event) {
  event.preventDefault();

  const price = {
    id: `price-${crypto.randomUUID()}`,
    beanId: els.priceBean.value,
    supplierId: els.priceSupplier.value,
    pricePerKg: Number(els.priceValue.value),
    currency: els.priceCurrency.value,
    validFrom: els.priceFrom.value,
    validTo: els.priceTo.value || null,
    notes: els.priceNotes.value.trim()
  };

  if (!price.pricePerKg || price.pricePerKg <= 0) {
    window.alert("Le prix doit être supérieur à 0.");
    return;
  }

  if (price.validTo && price.validTo < price.validFrom) {
    window.alert("La date de fin doit être après la date de début.");
    return;
  }

  state.prices.unshift(price);
  await saveState();
  els.priceForm.reset();
  els.priceFrom.value = today;
  renderAll();
}

function runCalculator(event) {
  event.preventDefault();
  const result = calculateBlend(els.calcBlend.value, els.calcDate.value);
  const compareResult = els.compareDate.value ? calculateBlend(els.calcBlend.value, els.compareDate.value) : null;
  renderCalculation(result, compareResult);
}

async function runForecast(event) {
  event.preventDefault();

  state.forecastSettings = {
    startDate: els.forecastStart.value,
    horizonDays: Number(els.forecastHorizon.value),
    growthPct: Number(els.forecastGrowth.value || 0),
    seasonalityPct: Number(els.forecastSeason.value || 0),
    externalPct: Number(els.forecastExternal.value || 0),
    knownOrdersPct: Number(els.forecastKnownOrders.value || 0),
    safetyStockPct: Number(els.forecastSafety.value || 0)
  };

  await saveState();
  renderMetrics();
  renderForecast(calculateForecast(state.forecastSettings));
}

async function addBatch(event) {
  event.preventDefault();

  const actualLoss = els.batchLoss.value ? Number(els.batchLoss.value) : null;
  const result = calculateBlend(els.batchBlend.value, els.batchDate.value, actualLoss);
  const quantity = Number(els.batchQuantity.value);

  if (result.status !== "ok") {
    window.alert(`Impossible de figer le batch : ${result.errors.join(" | ")}`);
    return;
  }

  if (!quantity || quantity <= 0) {
    window.alert("La quantité doit être supérieure à 0.");
    return;
  }

  const batch = {
    id: `batch-${crypto.randomUUID()}`,
    productionDate: els.batchDate.value,
    blendId: els.batchBlend.value,
    roastedQuantityKg: quantity,
    greenQuantityKg: quantity / (1 - result.lossPct / 100),
    actualRoastLossPct: result.lossPct,
    frozenGreenCostPerKg: result.greenCostPerKg,
    frozenRoastedCostPerKg: result.roastedCostPerKg,
    frozenTotalCostPerKg: result.totalCostPerKg,
    frozenBatchCost: result.totalCostPerKg * quantity,
    lines: result.lines.map((line) => ({
      beanId: line.bean.id,
      supplierId: line.supplier.id,
      percentage: line.component.percentage,
      pricePerKgSnapshot: line.price.pricePerKg,
      currencySnapshot: line.price.currency,
      lineCostPerKg: line.lineCost
    }))
  };

  state.batches.unshift(batch);
  await saveState();
  renderAll();
}

function exportData() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `outil-cout-cafe-${today}.json`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

async function resetDemo() {
  const target = storageMode === "database" ? "la base partagée" : "les données de démonstration";
  const ok = window.confirm(`Réinitialiser ${target} ?`);
  if (!ok) return;
  state = structuredClone(seedState);
  await saveState();
  setupDefaults();
  renderAll();
  renderCalculation(calculateBlend(els.calcBlend.value, els.calcDate.value), calculateBlend(els.calcBlend.value, els.compareDate.value));
}

function setupNavigation() {
  els.navTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const viewId = tab.dataset.view;
      els.navTabs.forEach((item) => item.classList.toggle("active", item === tab));
      els.views.forEach((view) => view.classList.toggle("active", view.id === viewId));
    });
  });
}

els.priceForm.addEventListener("submit", addPrice);
els.calculatorForm.addEventListener("submit", runCalculator);
els.forecastForm.addEventListener("submit", runForecast);
els.batchForm.addEventListener("submit", addBatch);
els.exportData.addEventListener("click", exportData);
els.resetDemo.addEventListener("click", resetDemo);

async function initializeApp() {
  setupNavigation();
  await loadState();
  setupDefaults();
  renderAll();
  renderCalculation(calculateBlend(els.calcBlend.value, els.calcDate.value), calculateBlend(els.calcBlend.value, els.compareDate.value));
}

void initializeApp();
