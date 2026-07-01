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
    {
      id: "supplier-a",
      name: "Importateur A",
      defaultCurrency: "EUR",
      averageLeadTimeDays: 28,
      reliabilityPct: 94,
      incoterms: "CIF",
      paymentTerms: "30 jours",
      certifications: "Bio sur demande"
    },
    {
      id: "supplier-b",
      name: "Importateur B",
      defaultCurrency: "EUR",
      averageLeadTimeDays: 35,
      reliabilityPct: 88,
      incoterms: "FOB",
      paymentTerms: "Acompte + solde livraison",
      certifications: "Rainforest"
    }
  ],
  beans: [
    {
      id: "bean-bresil-santos",
      commercialName: "Brésil Santos",
      countryId: "country-br",
      defaultSupplierId: "supplier-a",
      species: "arabica",
      process: "naturel",
      region: "Santos",
      variety: "Mundo Novo",
      harvestYear: 2026,
      container: "BR-ABC123",
      arrivalDate: "2026-01-12",
      altitudeM: 950,
      scaScore: 82.5,
      moisturePct: 10.8,
      density: 690,
      screenSize: "17/18",
      landedCostPerKg: 5.95,
      location: "Dépôt A - Rack 1",
      qualityNotes: "Lot stable, profil chocolat/noisette."
    },
    {
      id: "bean-colombie-excelso",
      commercialName: "Colombie Excelso",
      countryId: "country-co",
      defaultSupplierId: "supplier-b",
      species: "arabica",
      process: "lavé",
      region: "Huila",
      variety: "Caturra",
      harvestYear: 2026,
      container: "CO-EX456",
      arrivalDate: "2026-01-20",
      altitudeM: 1600,
      scaScore: 84,
      moisturePct: 10.5,
      density: 715,
      screenSize: "16+",
      landedCostPerKg: 7.45,
      location: "Dépôt A - Rack 2",
      qualityNotes: "Bonne sucrosité, acidité moyenne."
    },
    {
      id: "bean-ethiopie-sidamo",
      commercialName: "Éthiopie Sidamo",
      countryId: "country-et",
      defaultSupplierId: "supplier-b",
      species: "arabica",
      process: "lavé",
      region: "Sidamo",
      variety: "Heirloom",
      harvestYear: 2026,
      container: "ET-SD789",
      arrivalDate: "2026-02-03",
      altitudeM: 1900,
      scaScore: 86,
      moisturePct: 10.2,
      density: 730,
      screenSize: "15+",
      landedCostPerKg: 8.25,
      location: "Dépôt B - Rack 1",
      qualityNotes: "Floral, agrumes, très bon niveau tasse."
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
    { beanId: "bean-bresil-santos", quantityKg: 115, incomingKg: 250, eta: "2026-08-12" },
    { beanId: "bean-colombie-excelso", quantityKg: 82, incomingKg: 0, eta: "" },
    { beanId: "bean-ethiopie-sidamo", quantityKg: 54, incomingKg: 0, eta: "" }
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
  batchMachine: document.querySelector("#batchMachine"),
  batchOperator: document.querySelector("#batchOperator"),
  batchCurve: document.querySelector("#batchCurve"),
  batchRows: document.querySelector("#batchRows"),
  countryForm: document.querySelector("#countryForm"),
  countryName: document.querySelector("#countryName"),
  countryRegion: document.querySelector("#countryRegion"),
  countryRows: document.querySelector("#countryRows"),
  supplierForm: document.querySelector("#supplierForm"),
  supplierName: document.querySelector("#supplierName"),
  supplierCurrency: document.querySelector("#supplierCurrency"),
  supplierLeadTime: document.querySelector("#supplierLeadTime"),
  supplierReliability: document.querySelector("#supplierReliability"),
  supplierIncoterms: document.querySelector("#supplierIncoterms"),
  supplierPaymentTerms: document.querySelector("#supplierPaymentTerms"),
  supplierCertifications: document.querySelector("#supplierCertifications"),
  supplierRows: document.querySelector("#supplierRows"),
  beanForm: document.querySelector("#beanForm"),
  beanName: document.querySelector("#beanName"),
  beanCountry: document.querySelector("#beanCountry"),
  beanSupplier: document.querySelector("#beanSupplier"),
  beanSpecies: document.querySelector("#beanSpecies"),
  beanProcess: document.querySelector("#beanProcess"),
  beanRegion: document.querySelector("#beanRegion"),
  beanVariety: document.querySelector("#beanVariety"),
  beanHarvestYear: document.querySelector("#beanHarvestYear"),
  beanContainer: document.querySelector("#beanContainer"),
  beanArrivalDate: document.querySelector("#beanArrivalDate"),
  beanAltitude: document.querySelector("#beanAltitude"),
  beanScaScore: document.querySelector("#beanScaScore"),
  beanMoisture: document.querySelector("#beanMoisture"),
  beanDensity: document.querySelector("#beanDensity"),
  beanScreenSize: document.querySelector("#beanScreenSize"),
  beanLandedCost: document.querySelector("#beanLandedCost"),
  beanLocation: document.querySelector("#beanLocation"),
  beanQualityNotes: document.querySelector("#beanQualityNotes"),
  beanRows: document.querySelector("#beanRows"),
  blendForm: document.querySelector("#blendForm"),
  blendName: document.querySelector("#blendName"),
  blendLoss: document.querySelector("#blendLoss"),
  blendTargetPrice: document.querySelector("#blendTargetPrice"),
  blendMaxCost: document.querySelector("#blendMaxCost"),
  blendPackaging: document.querySelector("#blendPackaging"),
  blendEnergy: document.querySelector("#blendEnergy"),
  blendLogistics: document.querySelector("#blendLogistics"),
  blendComponentBeans: document.querySelectorAll(".blend-component-bean"),
  blendComponentPercentages: document.querySelectorAll(".blend-component-percentage"),
  blendRows: document.querySelector("#blendRows"),
  stockForm: document.querySelector("#stockForm"),
  stockBean: document.querySelector("#stockBean"),
  stockQuantity: document.querySelector("#stockQuantity"),
  stockIncoming: document.querySelector("#stockIncoming"),
  stockEta: document.querySelector("#stockEta"),
  stockRows: document.querySelector("#stockRows"),
  historyForm: document.querySelector("#historyForm"),
  historyDate: document.querySelector("#historyDate"),
  historyBlend: document.querySelector("#historyBlend"),
  historyKg: document.querySelector("#historyKg"),
  historyChannel: document.querySelector("#historyChannel"),
  historyRows: document.querySelector("#historyRows"),
  historyRowsCount: document.querySelector("#historyRowsCount"),
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

function toFiniteNumber(value) {
  if (value === null || value === undefined || value === "") return NaN;
  const number = Number(value);
  return Number.isFinite(number) ? number : NaN;
}

function formatDays(value) {
  if (!Number.isFinite(value)) return "-";
  if (value > 365) return "> 1 an";
  return `${Math.round(value)} j`;
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

function slugify(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 48);
}

function createId(prefix, label) {
  const suffix = slugify(label) || crypto.randomUUID().slice(0, 8);
  return `${prefix}-${suffix}-${crypto.randomUUID().slice(0, 8)}`;
}

function numberValue(input, fallback = 0) {
  const value = Number(input.value);
  return Number.isFinite(value) ? value : fallback;
}

function optionalNumberValue(input) {
  const value = Number(input.value);
  return Number.isFinite(value) && input.value !== "" ? value : null;
}

function emptyTableRow(colspan, label = "Aucune donnée") {
  return `<tr><td colspan="${colspan}">${escapeHtml(label)}</td></tr>`;
}

function getStock(beanId) {
  return state.greenStocks.find((stock) => stock.beanId === beanId) || {
    beanId,
    quantityKg: 0,
    incomingKg: 0,
    eta: ""
  };
}

function getHistoricalGreenUsage(beanId) {
  const usageByDate = new Map();

  (state.historicalOrders || []).forEach((order) => {
    const blend = getById("blends", order.blendId);
    if (!blend) return;

    const component = blend.components.find((item) => item.beanId === beanId);
    if (!component) return;

    const greenKg = Number(order.roastedKg || 0) / (1 - Number(blend.roastLossPct || 0) / 100);
    const beanKg = greenKg * (Number(component.percentage || 0) / 100);
    usageByDate.set(order.date, (usageByDate.get(order.date) || 0) + beanKg);
  });

  const dailyValues = [...usageByDate.values()];
  const totalKg = dailyValues.reduce((sum, value) => sum + value, 0);

  return {
    totalKg,
    activeDays: dailyValues.length,
    averageDailyKg: dailyValues.length > 0 ? totalKg / dailyValues.length : 0
  };
}

function getStockInfo(bean) {
  const stock = getStock(bean.id);
  const usage = getHistoricalGreenUsage(bean.id);
  const quantityKg = Number(stock.quantityKg || 0);
  const incomingKg = Number(stock.incomingKg || 0);
  const averageDailyKg = usage.averageDailyKg;
  const autonomyDays = averageDailyKg > 0 ? quantityKg / averageDailyKg : null;
  const landedCost = toFiniteNumber(bean.landedCostPerKg);
  const stockValue = landedCost > 0 ? quantityKg * landedCost : null;
  const risk =
    autonomyDays === null
      ? "À qualifier"
      : autonomyDays < 14
        ? "Rupture"
        : autonomyDays < 30
          ? "Surveiller"
          : "OK";

  return {
    stock,
    quantityKg,
    incomingKg,
    eta: stock.eta || "",
    averageDailyKg,
    autonomyDays,
    stockValue,
    risk
  };
}

function getBlendCoverage(blend) {
  const roastedCapacities = blend.components
    .map((component) => {
      const stock = getStock(component.beanId);
      const pct = Number(component.percentage || 0) / 100;
      if (pct <= 0) return Infinity;
      return Number(stock.quantityKg || 0) * (1 - Number(blend.roastLossPct || 0) / 100) / pct;
    })
    .filter((value) => Number.isFinite(value));

  if (roastedCapacities.length === 0) return null;
  return Math.min(...roastedCapacities);
}

function averageSupplierScaScore(supplierId) {
  const scores = state.beans
    .map((bean) => (bean.defaultSupplierId === supplierId ? toFiniteNumber(bean.scaScore) : NaN))
    .filter((score) => Number.isFinite(score));

  if (scores.length === 0) return null;
  return scores.reduce((sum, score) => sum + score, 0) / scores.length;
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
    const bean = getById("beans", beanId);
    const landedCost = toFiniteNumber(bean?.landedCostPerKg);
    if (Number.isFinite(landedCost) && landedCost > 0) {
      return {
        status: "ok",
        price: {
          id: `landed-${beanId}`,
          beanId,
          supplierId,
          pricePerKg: landedCost,
          currency: "EUR",
          validFrom: "",
          validTo: "",
          notes: "Coût réel rendu entrepôt"
        },
        matches: []
      };
    }

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
    const stock = getStock(need.bean?.id);
    const stockKg = Number(stock.quantityKg || 0);
    const incomingKg = Number(stock.incomingKg || 0);
    const requiredWithSafetyKg = need.requiredKg * (1 + Number(safeSettings.safetyStockPct || 0) / 100);
    return {
      ...need,
      stockKg,
      incomingKg,
      eta: stock.eta || "",
      safetyStockPct: Number(safeSettings.safetyStockPct || 0),
      requiredWithSafetyKg,
      orderKg: Math.max(0, requiredWithSafetyKg - stockKg - incomingKg)
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

  state.beans.forEach((bean) => {
    const stockInfo = getStockInfo(bean);
    if (stockInfo.risk === "Rupture") {
      alerts.push({
        severity: "danger",
        title: bean.commercialName,
        message: `Risque de rupture dans ${formatDays(stockInfo.autonomyDays)}`
      });
    } else if (stockInfo.risk === "Surveiller") {
      alerts.push({
        severity: "warning",
        title: bean.commercialName,
        message: `Autonomie courte : ${formatDays(stockInfo.autonomyDays)}`
      });
    }

    const moisturePct = toFiniteNumber(bean.moisturePct);
    const scaScore = toFiniteNumber(bean.scaScore);

    if (moisturePct > 12) {
      alerts.push({
        severity: "warning",
        title: bean.commercialName,
        message: `Humidité élevée : ${formatPct(moisturePct)}`
      });
    }

    if (Number.isFinite(scaScore) && scaScore < 82) {
      alerts.push({
        severity: "warning",
        title: bean.commercialName,
        message: `Score SCA à surveiller : ${scaScore.toFixed(1).replace(".", ",")}`
      });
    }
  });

  state.suppliers.forEach((supplier) => {
    const reliabilityPct = toFiniteNumber(supplier.reliabilityPct);
    if (Number.isFinite(reliabilityPct) && reliabilityPct < 80) {
      alerts.push({
        severity: "warning",
        title: supplier.name,
        message: `Fiabilité fournisseur basse : ${formatPct(reliabilityPct)}`
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
  const beanOptionsWithBlank = `<option value="">Choisir un grain</option>${beanOptions}`;
  const supplierOptions = state.suppliers
    .map((supplier) => `<option value="${escapeHtml(supplier.id)}">${escapeHtml(supplier.name)}</option>`)
    .join("");
  const countryOptions = state.countries
    .map((country) => `<option value="${escapeHtml(country.id)}">${escapeHtml(country.name)}</option>`)
    .join("");
  const blendOptions = state.blends
    .map((blend) => `<option value="${escapeHtml(blend.id)}">${escapeHtml(blend.name)}</option>`)
    .join("");

  els.priceBean.innerHTML = beanOptions;
  els.priceSupplier.innerHTML = supplierOptions;
  els.calcBlend.innerHTML = blendOptions;
  els.batchBlend.innerHTML = blendOptions;
  els.beanCountry.innerHTML = countryOptions;
  els.beanSupplier.innerHTML = supplierOptions;
  els.stockBean.innerHTML = beanOptions;
  els.historyBlend.innerHTML = blendOptions;
  els.blendComponentBeans.forEach((select) => {
    select.innerHTML = beanOptionsWithBlank;
  });
}

function renderMetrics() {
  const alerts = calculateAlerts();
  const validPrices = state.prices.filter((price) => dateInRange(today, price.validFrom, price.validTo));
  const forecast = calculateForecast();
  const stockInfos = state.beans.map((bean) => getStockInfo(bean));
  const stockValue = stockInfos.reduce((sum, info) => sum + Number(info.stockValue || 0), 0);
  const riskCount = stockInfos.filter((info) => ["Rupture", "Surveiller"].includes(info.risk)).length;

  els.metrics.innerHTML = [
    ["Grains suivis", state.beans.length, `${riskCount} à surveiller`],
    ["Tarifs saisis", state.prices.length, `${validPrices.length} actifs aujourd'hui`],
    ["Stock valorisé", formatMoney(stockValue), "Café vert disponible"],
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
      const result = calculateBlend(blend.id, today);
      const cost = result.status === "ok" ? formatMoney(result.totalCostPerKg) : "Prix manquant";
      const coverageKg = getBlendCoverage(blend);
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
          <span>Production possible avec stock actuel : ${escapeHtml(formatKg(coverageKg))}</span>
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
          <th class="numeric">En cours</th>
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
                <td class="numeric">${escapeHtml(formatKg(row.incomingKg))}</td>
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
      ${emptyTableRow(8, "Aucun batch figé pour le moment.")}
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
          <td>${escapeHtml(batch.machine || "-")}</td>
          <td>${escapeHtml(batch.operator || "-")}</td>
          <td class="numeric">${escapeHtml(batch.roastedQuantityKg.toFixed(1))}</td>
          <td class="numeric">${escapeHtml(formatPct(Number(batch.actualRoastLossPct)))}</td>
          <td class="numeric">${escapeHtml(formatMoney(batch.frozenTotalCostPerKg))}</td>
          <td class="numeric">${escapeHtml(formatMoney(batch.frozenBatchCost))}</td>
        </tr>
      `;
    })
    .join("");
}

function renderDataTables() {
  els.countryRows.innerHTML = state.countries.length
    ? state.countries
        .map(
          (country) => `
            <tr>
              <td>${escapeHtml(country.name)}</td>
              <td>${escapeHtml(country.region || "-")}</td>
            </tr>
          `
        )
        .join("")
    : emptyTableRow(2);

  els.supplierRows.innerHTML = state.suppliers.length
    ? state.suppliers
        .map((supplier) => {
          const averageScore = averageSupplierScaScore(supplier.id);
          return `
            <tr>
                <td>${escapeHtml(supplier.name)}</td>
                <td>${escapeHtml(supplier.defaultCurrency || "EUR")}</td>
                <td class="numeric">${escapeHtml(formatDays(toFiniteNumber(supplier.averageLeadTimeDays)))}</td>
                <td class="numeric">${escapeHtml(formatPct(toFiniteNumber(supplier.reliabilityPct)))}</td>
              <td>${escapeHtml(supplier.incoterms || "-")}</td>
              <td>${escapeHtml(supplier.paymentTerms || "-")}</td>
              <td class="numeric">${escapeHtml(Number.isFinite(averageScore) ? averageScore.toFixed(1).replace(".", ",") : "-")}</td>
            </tr>
          `;
        })
        .join("")
    : emptyTableRow(7);

  els.beanRows.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Grain</th>
          <th>Pays</th>
          <th>Fournisseur</th>
          <th>Origine</th>
          <th>Récolte</th>
          <th>Container</th>
          <th class="numeric">SCA</th>
          <th class="numeric">Humidité</th>
          <th class="numeric">Densité</th>
          <th>Calibre</th>
          <th>Emplacement</th>
          <th class="numeric">Coût rendu</th>
        </tr>
      </thead>
      <tbody>
        ${
          state.beans.length
            ? state.beans
                .map((bean) => {
                  const country = getById("countries", bean.countryId);
                  const supplier = getById("suppliers", bean.defaultSupplierId);
                  return `
                    <tr>
                      <td>${escapeHtml(bean.commercialName)}</td>
                      <td>${escapeHtml(country?.name || "-")}</td>
                      <td>${escapeHtml(supplier?.name || "-")}</td>
                      <td>${escapeHtml([bean.region, bean.variety, bean.process].filter(Boolean).join(" / ") || "-")}</td>
                      <td>${escapeHtml(bean.harvestYear || "-")}</td>
                      <td>${escapeHtml(bean.container || "-")}</td>
                      <td class="numeric">${escapeHtml(Number.isFinite(toFiniteNumber(bean.scaScore)) ? toFiniteNumber(bean.scaScore).toFixed(1).replace(".", ",") : "-")}</td>
                      <td class="numeric">${escapeHtml(formatPct(toFiniteNumber(bean.moisturePct)))}</td>
                      <td class="numeric">${escapeHtml(Number.isFinite(toFiniteNumber(bean.density)) ? toFiniteNumber(bean.density).toFixed(0) : "-")}</td>
                      <td>${escapeHtml(bean.screenSize || "-")}</td>
                      <td>${escapeHtml(bean.location || "-")}</td>
                      <td class="numeric">${escapeHtml(formatMoney(toFiniteNumber(bean.landedCostPerKg)))}</td>
                    </tr>
                  `;
                })
                .join("")
            : emptyTableRow(12)
        }
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
          <th class="numeric">Prix cible</th>
          <th class="numeric">Seuil</th>
          <th class="numeric">Prod. possible</th>
        </tr>
      </thead>
      <tbody>
        ${
          state.blends.length
            ? state.blends
                .map((blend) => {
                  const composition = blend.components
                    .map((component) => {
                      const bean = getById("beans", component.beanId);
                      return `${component.percentage}% ${bean?.commercialName || "Grain"}`;
                    })
                    .join(" / ");
                  const coverageKg = getBlendCoverage(blend);

                  return `
                    <tr>
                      <td>${escapeHtml(blend.name)}</td>
                      <td>${escapeHtml(composition)}</td>
                      <td class="numeric">${escapeHtml(formatPct(blend.roastLossPct))}</td>
                      <td class="numeric">${escapeHtml(formatMoney(blend.targetSalePricePerKg))}</td>
                      <td class="numeric">${escapeHtml(formatMoney(blend.maxCostPerKg))}</td>
                      <td class="numeric">${escapeHtml(formatKg(coverageKg))}</td>
                    </tr>
                  `;
                })
                .join("")
            : emptyTableRow(6)
        }
      </tbody>
    </table>
  `;

  els.stockRows.innerHTML = state.beans.length
    ? state.beans
        .map((bean) => {
          const stockInfo = getStockInfo(bean);
          const statusClass = stockInfo.risk
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/\s+/g, "-");
          return `
            <tr>
              <td>${escapeHtml(bean.commercialName)}</td>
              <td class="numeric">${escapeHtml(formatKg(stockInfo.quantityKg))}</td>
              <td class="numeric">${escapeHtml(formatKg(stockInfo.averageDailyKg))}</td>
              <td class="numeric">${escapeHtml(formatDays(stockInfo.autonomyDays))}</td>
              <td class="numeric">${escapeHtml(formatKg(stockInfo.incomingKg))}</td>
              <td>${escapeHtml(stockInfo.eta || "-")}</td>
              <td><span class="status-pill ${escapeHtml(statusClass)}">${escapeHtml(stockInfo.risk)}</span></td>
            </tr>
          `;
        })
        .join("")
    : emptyTableRow(7);

  const historicalRows = [...(state.historicalOrders || [])]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 30);

  els.historyRowsCount.textContent = `${state.historicalOrders.length} lignes`;
  els.historyRows.innerHTML = historicalRows.length
    ? historicalRows
        .map((order) => {
          const blend = getById("blends", order.blendId);
          return `
            <tr>
              <td>${escapeHtml(order.date)}</td>
              <td>${escapeHtml(blend?.name || "-")}</td>
              <td class="numeric">${escapeHtml(formatKg(Number(order.roastedKg || 0)))}</td>
              <td>${escapeHtml(order.channel || "-")}</td>
            </tr>
          `;
        })
        .join("")
    : emptyTableRow(4);
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
  els.historyDate.value = previousYearDate(today);
}

async function addCountry(event) {
  event.preventDefault();
  const name = els.countryName.value.trim();
  const region = els.countryRegion.value.trim();

  if (!name) return;

  const exists = state.countries.some((country) => country.name.toLowerCase() === name.toLowerCase());
  if (exists) {
    window.alert("Ce pays existe déjà.");
    return;
  }

  state.countries.push({
    id: createId("country", name),
    name,
    region
  });

  await saveState();
  els.countryForm.reset();
  renderAll();
}

async function addSupplier(event) {
  event.preventDefault();
  const name = els.supplierName.value.trim();

  if (!name) return;

  const exists = state.suppliers.some((supplier) => supplier.name.toLowerCase() === name.toLowerCase());
  if (exists) {
    window.alert("Ce fournisseur existe déjà.");
    return;
  }

  state.suppliers.push({
    id: createId("supplier", name),
    name,
    defaultCurrency: els.supplierCurrency.value,
    averageLeadTimeDays: optionalNumberValue(els.supplierLeadTime),
    reliabilityPct: optionalNumberValue(els.supplierReliability),
    incoterms: els.supplierIncoterms.value.trim(),
    paymentTerms: els.supplierPaymentTerms.value.trim(),
    certifications: els.supplierCertifications.value.trim()
  });

  await saveState();
  els.supplierForm.reset();
  renderAll();
}

async function addBean(event) {
  event.preventDefault();
  const commercialName = els.beanName.value.trim();

  if (!commercialName) return;

  if (!els.beanCountry.value || !els.beanSupplier.value) {
    window.alert("Ajoute au moins un pays et un fournisseur avant de créer un grain.");
    return;
  }

  const exists = state.beans.some((bean) => bean.commercialName.toLowerCase() === commercialName.toLowerCase());
  if (exists) {
    window.alert("Ce grain existe déjà.");
    return;
  }

  const bean = {
    id: createId("bean", commercialName),
    commercialName,
    countryId: els.beanCountry.value,
    defaultSupplierId: els.beanSupplier.value,
    species: els.beanSpecies.value.trim() || "arabica",
    process: els.beanProcess.value.trim(),
    region: els.beanRegion.value.trim(),
    variety: els.beanVariety.value.trim(),
    harvestYear: optionalNumberValue(els.beanHarvestYear),
    container: els.beanContainer.value.trim(),
    arrivalDate: els.beanArrivalDate.value,
    altitudeM: optionalNumberValue(els.beanAltitude),
    scaScore: optionalNumberValue(els.beanScaScore),
    moisturePct: optionalNumberValue(els.beanMoisture),
    density: optionalNumberValue(els.beanDensity),
    screenSize: els.beanScreenSize.value.trim(),
    landedCostPerKg: optionalNumberValue(els.beanLandedCost),
    location: els.beanLocation.value.trim(),
    qualityNotes: els.beanQualityNotes.value.trim()
  };

  state.beans.push(bean);
  state.greenStocks.push({ beanId: bean.id, quantityKg: 0, incomingKg: 0, eta: "" });

  await saveState();
  els.beanForm.reset();
  renderAll();
}

function collectBlendComponents() {
  const components = [];

  els.blendComponentBeans.forEach((select, index) => {
    const percentageInput = els.blendComponentPercentages[index];
    const hasBean = Boolean(select.value);
    const hasPercentage = percentageInput.value !== "";

    if (!hasBean && !hasPercentage) return;

    const percentage = Number(percentageInput.value);
    if (!hasBean || !Number.isFinite(percentage) || percentage <= 0) {
      components.push({ error: true });
      return;
    }

    components.push({
      beanId: select.value,
      percentage
    });
  });

  return components;
}

async function addBlend(event) {
  event.preventDefault();
  const name = els.blendName.value.trim();
  const components = collectBlendComponents();

  if (!name) return;

  if (components.some((component) => component.error)) {
    window.alert("Chaque ligne de composition doit avoir un grain et un pourcentage supérieur à 0.");
    return;
  }

  if (components.length === 0) {
    window.alert("Ajoute au moins un grain dans la composition.");
    return;
  }

  const uniqueBeanIds = new Set(components.map((component) => component.beanId));
  if (uniqueBeanIds.size !== components.length) {
    window.alert("Un même grain ne peut être saisi qu'une seule fois dans un assemblage.");
    return;
  }

  const totalPct = components.reduce((sum, component) => sum + component.percentage, 0);
  if (Math.abs(totalPct - 100) > 0.1) {
    window.alert(`La composition doit totaliser 100 %. Total actuel : ${formatPct(totalPct)}`);
    return;
  }

  state.blends.push({
    id: createId("blend", name),
    name,
    roastLossPct: numberValue(els.blendLoss, 15),
    packagingCostPerKg: numberValue(els.blendPackaging, 0),
    energyCostPerKg: numberValue(els.blendEnergy, 0),
    logisticsCostPerKg: numberValue(els.blendLogistics, 0),
    targetSalePricePerKg: els.blendTargetPrice.value ? numberValue(els.blendTargetPrice, 0) : null,
    maxCostPerKg: els.blendMaxCost.value ? numberValue(els.blendMaxCost, 0) : null,
    components
  });

  await saveState();
  els.blendForm.reset();
  els.blendLoss.value = "15";
  els.blendPackaging.value = "0.55";
  els.blendEnergy.value = "0.22";
  els.blendLogistics.value = "0.18";
  renderAll();
}

async function updateStock(event) {
  event.preventDefault();
  const beanId = els.stockBean.value;
  const quantityKg = numberValue(els.stockQuantity, NaN);
  const incomingKg = els.stockIncoming.value ? numberValue(els.stockIncoming, 0) : 0;
  const eta = els.stockEta.value;

  if (!beanId) {
    window.alert("Ajoute un grain avant de saisir un stock.");
    return;
  }

  if (!Number.isFinite(quantityKg) || quantityKg < 0) {
    window.alert("Le stock doit être supérieur ou égal à 0.");
    return;
  }

  const existing = state.greenStocks.find((stock) => stock.beanId === beanId);
  if (existing) {
    existing.quantityKg = quantityKg;
    existing.incomingKg = incomingKg;
    existing.eta = eta;
  } else {
    state.greenStocks.push({ beanId, quantityKg, incomingKg, eta });
  }

  await saveState();
  els.stockForm.reset();
  renderAll();
}

async function addHistoricalOrder(event) {
  event.preventDefault();
  const roastedKg = numberValue(els.historyKg, NaN);

  if (!els.historyBlend.value) {
    window.alert("Ajoute un assemblage avant de saisir l'activité N-1.");
    return;
  }

  if (!Number.isFinite(roastedKg) || roastedKg <= 0) {
    window.alert("La quantité torréfiée doit être supérieure à 0.");
    return;
  }

  state.historicalOrders.push({
    id: createId("order", `${els.historyDate.value}-${els.historyBlend.value}`),
    date: els.historyDate.value,
    blendId: els.historyBlend.value,
    roastedKg,
    channel: els.historyChannel.value
  });

  await saveState();
  els.historyForm.reset();
  els.historyDate.value = previousYearDate(today);
  renderAll();
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

  if (!price.beanId || !price.supplierId) {
    window.alert("Ajoute au moins un grain et un fournisseur avant de saisir un tarif.");
    return;
  }

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
    machine: els.batchMachine.value.trim(),
    operator: els.batchOperator.value.trim(),
    curveNotes: els.batchCurve.value.trim(),
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

function setupNavigation() {
  els.navTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const viewId = tab.dataset.view;
      els.navTabs.forEach((item) => item.classList.toggle("active", item === tab));
      els.views.forEach((view) => view.classList.toggle("active", view.id === viewId));
    });
  });
}

els.countryForm.addEventListener("submit", addCountry);
els.supplierForm.addEventListener("submit", addSupplier);
els.beanForm.addEventListener("submit", addBean);
els.blendForm.addEventListener("submit", addBlend);
els.stockForm.addEventListener("submit", updateStock);
els.historyForm.addEventListener("submit", addHistoricalOrder);
els.priceForm.addEventListener("submit", addPrice);
els.calculatorForm.addEventListener("submit", runCalculator);
els.forecastForm.addEventListener("submit", runForecast);
els.batchForm.addEventListener("submit", addBatch);
els.exportData.addEventListener("click", exportData);

async function initializeApp() {
  setupNavigation();
  await loadState();
  setupDefaults();
  renderAll();
  renderCalculation(calculateBlend(els.calcBlend.value, els.calcDate.value), calculateBlend(els.calcBlend.value, els.compareDate.value));
}

void initializeApp();
