const STORAGE_KEY = "cout-cafe-prototype-v1";

const today = new Date().toISOString().slice(0, 10);
let storageMode = "browser";
let editingSupplierId = null;
let editingBeanId = null;
let editingBlendId = null;
let editingHistoricalOrderId = null;

const defaultDataSection = "references";

const dataSectionRoutes = {
  references: "/donnees",
  beans: "/donnees/grains",
  blends: "/donnees/assemblages",
  stocks: "/donnees/stocks",
  history: "/donnees/activite-n-1",
  imports: "/donnees/imports"
};

const viewRoutes = {
  dashboard: "/",
  prices: "/tarifs",
  calculator: "/calculateur",
  forecast: "/previsions",
  production: "/production",
  data: dataSectionRoutes.references
};

const routeViews = Object.fromEntries(
  Object.entries(viewRoutes).map(([viewId, route]) => [route, viewId])
);

const dataRouteSections = Object.fromEntries(
  Object.entries(dataSectionRoutes).map(([sectionId, route]) => [route, sectionId])
);

const referenceCountries = [
  { id: "country-ao", name: "Angola", region: "Afrique" },
  { id: "country-bj", name: "Bénin", region: "Afrique" },
  { id: "country-bo", name: "Bolivie", region: "Amérique latine" },
  { id: "country-br", name: "Brésil", region: "Amérique latine" },
  { id: "country-bi", name: "Burundi", region: "Afrique" },
  { id: "country-cm", name: "Cameroun", region: "Afrique" },
  { id: "country-cn", name: "Chine", region: "Asie-Pacifique" },
  { id: "country-co", name: "Colombie", region: "Amérique latine" },
  { id: "country-cg", name: "Congo", region: "Afrique" },
  { id: "country-cr", name: "Costa Rica", region: "Amérique latine" },
  { id: "country-ci", name: "Côte d'Ivoire", region: "Afrique" },
  { id: "country-cu", name: "Cuba", region: "Caraïbes" },
  { id: "country-sv", name: "Salvador", region: "Amérique latine" },
  { id: "country-ec", name: "Équateur", region: "Amérique latine" },
  { id: "country-et", name: "Éthiopie", region: "Afrique" },
  { id: "country-ga", name: "Gabon", region: "Afrique" },
  { id: "country-gh", name: "Ghana", region: "Afrique" },
  { id: "country-gt", name: "Guatemala", region: "Amérique latine" },
  { id: "country-gn", name: "Guinée", region: "Afrique" },
  { id: "country-ht", name: "Haïti", region: "Caraïbes" },
  { id: "country-hn", name: "Honduras", region: "Amérique latine" },
  { id: "country-in", name: "Inde", region: "Asie-Pacifique" },
  { id: "country-id", name: "Indonésie", region: "Asie-Pacifique" },
  { id: "country-jm", name: "Jamaïque", region: "Caraïbes" },
  { id: "country-ke", name: "Kenya", region: "Afrique" },
  { id: "country-la", name: "Laos", region: "Asie-Pacifique" },
  { id: "country-lr", name: "Liberia", region: "Afrique" },
  { id: "country-mg", name: "Madagascar", region: "Afrique" },
  { id: "country-mw", name: "Malawi", region: "Afrique" },
  { id: "country-my", name: "Malaisie", region: "Asie-Pacifique" },
  { id: "country-mx", name: "Mexique", region: "Amérique latine" },
  { id: "country-mz", name: "Mozambique", region: "Afrique" },
  { id: "country-mm", name: "Myanmar", region: "Asie-Pacifique" },
  { id: "country-np", name: "Népal", region: "Asie-Pacifique" },
  { id: "country-ni", name: "Nicaragua", region: "Amérique latine" },
  { id: "country-ng", name: "Nigeria", region: "Afrique" },
  { id: "country-ug", name: "Ouganda", region: "Afrique" },
  { id: "country-pa", name: "Panama", region: "Amérique latine" },
  { id: "country-pg", name: "Papouasie-Nouvelle-Guinée", region: "Asie-Pacifique" },
  { id: "country-py", name: "Paraguay", region: "Amérique latine" },
  { id: "country-pe", name: "Pérou", region: "Amérique latine" },
  { id: "country-ph", name: "Philippines", region: "Asie-Pacifique" },
  { id: "country-cf", name: "République centrafricaine", region: "Afrique" },
  { id: "country-cd", name: "République démocratique du Congo", region: "Afrique" },
  { id: "country-do", name: "République dominicaine", region: "Caraïbes" },
  { id: "country-rw", name: "Rwanda", region: "Afrique" },
  { id: "country-sl", name: "Sierra Leone", region: "Afrique" },
  { id: "country-lk", name: "Sri Lanka", region: "Asie-Pacifique" },
  { id: "country-tz", name: "Tanzanie", region: "Afrique" },
  { id: "country-th", name: "Thaïlande", region: "Asie-Pacifique" },
  { id: "country-tl", name: "Timor oriental", region: "Asie-Pacifique" },
  { id: "country-tg", name: "Togo", region: "Afrique" },
  { id: "country-ve", name: "Venezuela", region: "Amérique latine" },
  { id: "country-vn", name: "Vietnam", region: "Asie-Pacifique" },
  { id: "country-ye", name: "Yémen", region: "Moyen-Orient" },
  { id: "country-zm", name: "Zambie", region: "Afrique" },
  { id: "country-zw", name: "Zimbabwe", region: "Afrique" }
];

const supplyCategories = {
  greenCoffee: "Grain café",
  packaging: "Packaging",
  energy: "Énergie",
  transport: "Transport",
  consumable: "Consommable",
  other: "Autre"
};

const supplyUnits = {
  kg: "kg",
  bag: "sac",
  piece: "pièce",
  kwh: "kWh",
  pallet: "palette",
  lot: "lot"
};

const supplyStatuses = {
  planned: "Prévu",
  ordered: "Commandé",
  received: "Reçu",
  cancelled: "Annulé"
};

const stockMovementTypes = {
  manual: "Inventaire manuel",
  ordered: "Commande",
  received: "Réception"
};

const importTypeLabels = {
  suppliers: "Fournisseurs",
  beans: "Grains",
  history: "Activité N-1",
  prices: "Tarifs",
  stocks: "Stocks"
};

const businessStateKeys = [
  "countries",
  "suppliers",
  "beans",
  "otherSupplies",
  "prices",
  "blends",
  "batches",
  "greenStocks",
  "stockMovements",
  "historicalOrders",
  "forecastSettings"
];

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
  otherSupplies: [],
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
  stockMovements: [],
  historicalOrders: buildHistoricalOrders(),
  importHistory: [],
  lastImportBackup: null,
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
  dataTabs: document.querySelectorAll(".sub-tab"),
  dataSections: document.querySelectorAll(".data-section"),
  views: document.querySelectorAll(".view"),
  dataQualityList: document.querySelector("#dataQualityList"),
  dataQualityCount: document.querySelector("#dataQualityCount"),
  metrics: document.querySelector("#metrics"),
  alertsList: document.querySelector("#alertsList"),
  alertCount: document.querySelector("#alertCount"),
  blendCards: document.querySelector("#blendCards"),
  qualityList: document.querySelector("#qualityList"),
  qualityCount: document.querySelector("#qualityCount"),
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
  quickPurchaseForm: document.querySelector("#quickPurchaseForm"),
  quickPurchaseCategory: document.querySelector("#quickPurchaseCategory"),
  quickPurchaseDate: document.querySelector("#quickPurchaseDate"),
  quickPurchaseBean: document.querySelector("#quickPurchaseBean"),
  quickPurchaseCountry: document.querySelector("#quickPurchaseCountry"),
  quickPurchaseSupplier: document.querySelector("#quickPurchaseSupplier"),
  quickPurchasePrice: document.querySelector("#quickPurchasePrice"),
  quickPurchaseQuantity: document.querySelector("#quickPurchaseQuantity"),
  quickPurchaseUnit: document.querySelector("#quickPurchaseUnit"),
  quickPurchaseCurrency: document.querySelector("#quickPurchaseCurrency"),
  quickPurchaseStatus: document.querySelector("#quickPurchaseStatus"),
  quickPurchaseEta: document.querySelector("#quickPurchaseEta"),
  quickPurchaseValidTo: document.querySelector("#quickPurchaseValidTo"),
  quickPurchaseNotes: document.querySelector("#quickPurchaseNotes"),
  quickBeanOptions: document.querySelector("#quickBeanOptions"),
  quickSupplierOptions: document.querySelector("#quickSupplierOptions"),
  supplyRows: document.querySelector("#supplyRows"),
  otherSupplyRows: document.querySelector("#otherSupplyRows"),
  otherSupplyRowsCount: document.querySelector("#otherSupplyRowsCount"),
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
  supplierSubmit: document.querySelector("#supplierSubmit"),
  cancelSupplierEdit: document.querySelector("#cancelSupplierEdit"),
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
  beanSubmit: document.querySelector("#beanSubmit"),
  cancelBeanEdit: document.querySelector("#cancelBeanEdit"),
  beanRows: document.querySelector("#beanRows"),
  blendForm: document.querySelector("#blendForm"),
  blendName: document.querySelector("#blendName"),
  blendLoss: document.querySelector("#blendLoss"),
  blendTargetPrice: document.querySelector("#blendTargetPrice"),
  blendMaxCost: document.querySelector("#blendMaxCost"),
  blendPackaging: document.querySelector("#blendPackaging"),
  blendEnergy: document.querySelector("#blendEnergy"),
  blendLogistics: document.querySelector("#blendLogistics"),
  blendComponents: document.querySelector("#blendComponents"),
  addBlendComponent: document.querySelector("#addBlendComponent"),
  blendSubmit: document.querySelector("#blendSubmit"),
  cancelBlendEdit: document.querySelector("#cancelBlendEdit"),
  blendRows: document.querySelector("#blendRows"),
  stockForm: document.querySelector("#stockForm"),
  stockBean: document.querySelector("#stockBean"),
  stockQuantity: document.querySelector("#stockQuantity"),
  stockIncoming: document.querySelector("#stockIncoming"),
  stockEta: document.querySelector("#stockEta"),
  stockRows: document.querySelector("#stockRows"),
  stockMovementRows: document.querySelector("#stockMovementRows"),
  stockMovementRowsCount: document.querySelector("#stockMovementRowsCount"),
  historyForm: document.querySelector("#historyForm"),
  historyDate: document.querySelector("#historyDate"),
  historyBlend: document.querySelector("#historyBlend"),
  historyKg: document.querySelector("#historyKg"),
  historyChannel: document.querySelector("#historyChannel"),
  historySubmit: document.querySelector("#historySubmit"),
  cancelHistoryEdit: document.querySelector("#cancelHistoryEdit"),
  historyRows: document.querySelector("#historyRows"),
  historyRowsCount: document.querySelector("#historyRowsCount"),
  exportCsvButtons: document.querySelectorAll("[data-export-csv]"),
  importLogRows: document.querySelector("#importLogRows"),
  undoLastImport: document.querySelector("#undoLastImport"),
  historyImportForm: document.querySelector("#historyImportForm"),
  historyImportFile: document.querySelector("#historyImportFile"),
  historyImportMode: document.querySelector("#historyImportMode"),
  downloadHistoryTemplate: document.querySelector("#downloadHistoryTemplate"),
  historyImportStatus: document.querySelector("#historyImportStatus"),
  supplierImportForm: document.querySelector("#supplierImportForm"),
  supplierImportFile: document.querySelector("#supplierImportFile"),
  downloadSupplierTemplate: document.querySelector("#downloadSupplierTemplate"),
  supplierImportStatus: document.querySelector("#supplierImportStatus"),
  beanImportForm: document.querySelector("#beanImportForm"),
  beanImportFile: document.querySelector("#beanImportFile"),
  downloadBeanTemplate: document.querySelector("#downloadBeanTemplate"),
  beanImportStatus: document.querySelector("#beanImportStatus"),
  priceImportForm: document.querySelector("#priceImportForm"),
  priceImportFile: document.querySelector("#priceImportFile"),
  priceImportMode: document.querySelector("#priceImportMode"),
  downloadPriceTemplate: document.querySelector("#downloadPriceTemplate"),
  priceImportStatus: document.querySelector("#priceImportStatus"),
  stockImportForm: document.querySelector("#stockImportForm"),
  stockImportFile: document.querySelector("#stockImportFile"),
  stockImportMode: document.querySelector("#stockImportMode"),
  downloadStockTemplate: document.querySelector("#downloadStockTemplate"),
  stockImportStatus: document.querySelector("#stockImportStatus"),
  logoutButton: document.querySelector("#logoutButton")
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
    otherSupplies: Array.isArray(candidate.otherSupplies) ? candidate.otherSupplies : base.otherSupplies,
    prices: Array.isArray(candidate.prices) ? candidate.prices : base.prices,
    blends: Array.isArray(candidate.blends) ? candidate.blends : base.blends,
    batches: Array.isArray(candidate.batches) ? candidate.batches : base.batches,
    greenStocks: Array.isArray(candidate.greenStocks) ? candidate.greenStocks : base.greenStocks,
    stockMovements: Array.isArray(candidate.stockMovements) ? candidate.stockMovements : base.stockMovements,
    historicalOrders: Array.isArray(candidate.historicalOrders) ? candidate.historicalOrders : base.historicalOrders,
    importHistory: Array.isArray(candidate.importHistory) ? candidate.importHistory : base.importHistory,
    lastImportBackup: candidate.lastImportBackup && typeof candidate.lastImportBackup === "object" ? candidate.lastImportBackup : null,
    forecastSettings: {
      ...base.forecastSettings,
      ...(candidate.forecastSettings || {})
    }
  };
}

function normalizeKey(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function hydrateReferenceData() {
  let changed = false;

  state.countries = state.countries.map((country) => {
    const referenceCountry = findReferenceCountry(country.name);
    if (!referenceCountry) return country;

    if (country.name === referenceCountry.name && country.region === referenceCountry.region) {
      return country;
    }

    changed = true;
    return {
      ...country,
      name: referenceCountry.name,
      region: referenceCountry.region
    };
  });

  state.countries = state.countries.sort((a, b) => a.name.localeCompare(b.name, "fr"));

  return changed;
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

function saveBrowserState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function redirectToLogin() {
  const nextPath = `${window.location.pathname}${window.location.search}`;
  window.location.assign(`/login?next=${encodeURIComponent(nextPath)}`);
}

function isAuthExpired(response) {
  if (response.status !== 401) return false;
  redirectToLogin();
  return true;
}

async function loadState() {
  const browserState = loadBrowserState();
  state = browserState;

  try {
    const response = await fetch("/api/state", {
      headers: { accept: "application/json" }
    });

    if (isAuthExpired(response)) return;
    if (!response.ok) throw new Error("API state unavailable");

    const payload = await response.json();
    if (payload.storage !== "database") {
      storageMode = "browser";
      const changed = hydrateReferenceData();
      if (changed) await saveState();
      return;
    }

    storageMode = "database";
    state = normalizeState(payload.state || browserState);
    const changed = hydrateReferenceData();
    saveBrowserState();

    if (!payload.state || changed) {
      await saveState();
      return;
    }
  } catch {
    storageMode = "browser";
    const changed = hydrateReferenceData();
    if (changed) await saveState();
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

    if (isAuthExpired(response)) return;
    if (!response.ok) throw new Error("Database save failed");
  } catch {
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

function formatQuantity(value, unit = "kg") {
  if (!Number.isFinite(value)) return "-";
  const unitLabel = supplyUnits[unit] || unit || "";
  return `${value.toFixed(2).replace(/\.?0+$/, "").replace(".", ",")} ${unitLabel}`.trim();
}

function toFiniteNumber(value) {
  if (value === null || value === undefined || value === "") return NaN;
  const number = Number(value);
  return Number.isFinite(number) ? number : NaN;
}

function parseLocaleNumber(value) {
  if (value === null || value === undefined) return NaN;
  const normalized = String(value).trim().replace(/\s/g, "").replace(",", ".");
  if (!normalized) return NaN;
  const number = Number(normalized);
  return Number.isFinite(number) ? number : NaN;
}

function isIsoDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(String(value || ""));
}

function formatDays(value) {
  if (!Number.isFinite(value)) return "-";
  if (value > 365) return "> 1 an";
  return `${Math.round(value)} j`;
}

function formatDateTime(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "short",
    timeStyle: "short"
  }).format(date);
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

function findByName(collection, fieldName, value) {
  const key = normalizeKey(value);
  if (!key) return null;
  return state[collection].find((item) => normalizeKey(item[fieldName]) === key) || null;
}

function findReferenceCountry(value) {
  const key = normalizeKey(value);
  if (!key) return null;
  return referenceCountries.find((country) => normalizeKey(country.name) === key) || null;
}

function ensureCountry(name, fallbackRegion = "") {
  const cleanName = name.trim();
  const cleanRegion = fallbackRegion.trim();
  const referenceCountry = findReferenceCountry(cleanName);
  const existing = findByName("countries", "name", cleanName);
  if (existing) {
    if (referenceCountry) {
      existing.name = referenceCountry.name;
      existing.region = referenceCountry.region;
    } else if (cleanRegion && !existing.region) {
      existing.region = cleanRegion;
    }
    return existing;
  }

  const country = {
    id: referenceCountry?.id || createId("country", cleanName),
    name: referenceCountry?.name || cleanName,
    region: referenceCountry?.region || cleanRegion
  };

  state.countries.push(country);
  state.countries.sort((a, b) => a.name.localeCompare(b.name, "fr"));
  return country;
}

function ensureSupplier(name, currency = "EUR") {
  const cleanName = name.trim();
  const existing = findByName("suppliers", "name", cleanName);
  if (existing) {
    existing.defaultCurrency = existing.defaultCurrency || currency;
    return existing;
  }

  const supplier = {
    id: createId("supplier", cleanName),
    name: cleanName,
    defaultCurrency: currency,
    averageLeadTimeDays: null,
    reliabilityPct: null,
    incoterms: "",
    paymentTerms: "",
    certifications: ""
  };

  state.suppliers.push(supplier);
  state.suppliers.sort((a, b) => a.name.localeCompare(b.name, "fr"));
  return supplier;
}

function ensureBean(commercialName, countryId, supplierId, landedCostPerKg) {
  const cleanName = commercialName.trim();
  const existing = findByName("beans", "commercialName", cleanName);

  if (existing) {
    existing.countryId = countryId || existing.countryId;
    existing.defaultSupplierId = supplierId || existing.defaultSupplierId;
    existing.landedCostPerKg = landedCostPerKg;
    if (!state.greenStocks.some((stock) => stock.beanId === existing.id)) {
      state.greenStocks.push({ beanId: existing.id, quantityKg: 0, incomingKg: 0, eta: "" });
    }
    return existing;
  }

  const bean = {
    id: createId("bean", cleanName),
    commercialName: cleanName,
    countryId,
    defaultSupplierId: supplierId,
    species: "arabica",
    process: "",
    region: "",
    variety: "",
    harvestYear: null,
    container: "",
    arrivalDate: "",
    altitudeM: null,
    scaScore: null,
    moisturePct: null,
    density: null,
    screenSize: "",
    landedCostPerKg,
    location: "",
    qualityNotes: ""
  };

  state.beans.push(bean);
  state.beans.sort((a, b) => a.commercialName.localeCompare(b.commercialName, "fr"));
  state.greenStocks.push({ beanId: bean.id, quantityKg: 0, incomingKg: 0, eta: "" });
  return bean;
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

function blendComponentRows() {
  return [...els.blendComponents.querySelectorAll(".component-row")];
}

function blendComponentBeanSelects() {
  return [...els.blendComponents.querySelectorAll(".blend-component-bean")];
}

function blendComponentPercentageInputs() {
  return [...els.blendComponents.querySelectorAll(".blend-component-percentage")];
}

function getStock(beanId) {
  return state.greenStocks.find((stock) => stock.beanId === beanId) || {
    beanId,
    quantityKg: 0,
    incomingKg: 0,
    eta: ""
  };
}

function upsertStockSnapshot(beanId, quantityKg, incomingKg, eta) {
  const existing = state.greenStocks.find((stock) => stock.beanId === beanId);
  const hasQuantity = Number.isFinite(quantityKg);
  const hasIncoming = Number.isFinite(incomingKg);

  if (existing) {
    if (hasQuantity) existing.quantityKg = quantityKg;
    if (hasIncoming) existing.incomingKg = incomingKg;
    if (eta) existing.eta = eta;
    return existing;
  }

  const stock = {
    beanId,
    quantityKg: hasQuantity ? quantityKg : 0,
    incomingKg: hasIncoming ? incomingKg : 0,
    eta: eta || ""
  };

  state.greenStocks.push(stock);
  return stock;
}

function addStockMovement({ beanId, type, date, quantity, unit, supplierId = "", unitCost = null, currency = "EUR", eta = "", notes = "" }) {
  const movement = {
    id: `movement-${crypto.randomUUID()}`,
    beanId,
    type,
    date,
    quantity,
    unit,
    supplierId,
    unitCost,
    currency,
    eta,
    notes
  };

  state.stockMovements.unshift(movement);

  if (unit === "kg" && type === "received") {
    const stock = getStock(beanId);
    upsertStockSnapshot(beanId, Number(stock.quantityKg || 0) + quantity, Number(stock.incomingKg || 0), eta);
  }

  if (unit === "kg" && type === "ordered") {
    const stock = getStock(beanId);
    upsertStockSnapshot(beanId, Number(stock.quantityKg || 0), Number(stock.incomingKg || 0) + quantity, eta);
  }

  return movement;
}

function getLatestPrice(beanId) {
  return state.prices
    .filter((price) => price.beanId === beanId)
    .sort((a, b) => {
      const dateCompare = b.validFrom.localeCompare(a.validFrom);
      if (dateCompare !== 0) return dateCompare;
      return b.id.localeCompare(a.id);
    })[0] || null;
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

function purchaseUnitPrice(bean, supplierId, date) {
  const landedCost = toFiniteNumber(bean?.landedCostPerKg);
  if (!bean) return { unitCost: null, currency: "EUR" };

  if (supplierId) {
    const priceResult = findPrice(bean.id, supplierId, date);
    if (priceResult.status === "ok") {
      return {
        unitCost: toFiniteNumber(priceResult.price.pricePerKg),
        currency: priceResult.price.currency || "EUR"
      };
    }
  }

  const latestPrice = getLatestPrice(bean.id);
  if (latestPrice) {
    return {
      unitCost: toFiniteNumber(latestPrice.pricePerKg),
      currency: latestPrice.currency || "EUR"
    };
  }

  return {
    unitCost: Number.isFinite(landedCost) ? landedCost : null,
    currency: "EUR"
  };
}

function purchaseRisk(orderKg, stockCoverageDays, leadTimeDays) {
  if (orderKg <= 0) return "Couvert";
  if (!Number.isFinite(stockCoverageDays)) return "À qualifier";
  if (stockCoverageDays <= leadTimeDays) return "Risque rupture";
  if (stockCoverageDays <= leadTimeDays + 7) return "À commander";
  return "Planifier";
}

function purchaseRiskClass(risk) {
  if (risk === "Risque rupture") return "rupture";
  if (risk === "À commander") return "surveiller";
  if (risk === "À qualifier") return "a-qualifier";
  return "";
}

function purchaseActionClass(action) {
  if (action === "Urgent") return "urgent";
  if (action === "À commander") return "a-commander";
  if (action === "Surveiller") return "surveiller";
  if (action === "À qualifier") return "a-qualifier";
  return "attendre";
}

function purchaseActionRank(action) {
  const ranks = {
    Urgent: 0,
    "À commander": 1,
    "À qualifier": 2,
    Surveiller: 3,
    Attendre: 4
  };
  return ranks[action] ?? 5;
}

function buildPurchaseAction(row, settings) {
  if (!row.bean || !row.supplier) {
    return {
      action: "À qualifier",
      reason: "Grain ou fournisseur par défaut manquant."
    };
  }

  if (row.orderKg <= 0) {
    if (row.incomingKg > 0 && row.eta && row.depletionDate && row.eta > row.depletionDate) {
      return {
        action: "Surveiller",
        reason: `ETA ${row.eta} après épuisement estimé ${row.depletionDate}.`
      };
    }

    return {
      action: "Attendre",
      reason: "Stock et commandes couvrent le besoin prévu."
    };
  }

  if (!row.orderByDate || !Number.isFinite(row.stockCoverageDays)) {
    return {
      action: "À qualifier",
      reason: "Stock ou consommation moyenne insuffisamment qualifiés."
    };
  }

  if (row.orderByDate <= settings.startDate) {
    return {
      action: "Urgent",
      reason: `Commander maintenant : autonomie ${formatDays(row.stockCoverageDays)}, délai ${row.leadTimeDays} j.`
    };
  }

  if (row.orderByDate <= addDays(settings.startDate, 7)) {
    return {
      action: "À commander",
      reason: `Date limite ${row.orderByDate}, délai fournisseur ${row.leadTimeDays} j.`
    };
  }

  return {
    action: "Surveiller",
    reason: `Préparer avant le ${row.orderByDate}.`
  };
}

function comparePurchasePlanRows(left, right) {
  const rankDelta = purchaseActionRank(left.action) - purchaseActionRank(right.action);
  if (rankDelta !== 0) return rankDelta;

  const leftDate = left.orderByDate || "9999-12-31";
  const rightDate = right.orderByDate || "9999-12-31";
  if (leftDate !== rightDate) return leftDate.localeCompare(rightDate);

  return Number(right.orderKg || 0) - Number(left.orderKg || 0);
}

function buildPurchasePlanRow(need, settings, horizonDays) {
  const bean = need.bean;
  const supplier = getById("suppliers", bean?.defaultSupplierId);
  const supplierLeadTime = toFiniteNumber(supplier?.averageLeadTimeDays);
  const leadTimeDays = Math.max(0, Math.round(Number.isFinite(supplierLeadTime) ? supplierLeadTime : 30));
  const dailyNeedKg = need.requiredKg / Math.max(horizonDays, 1);
  const stockCoverageDays = dailyNeedKg > 0 ? need.stockKg / dailyNeedKg : null;
  const depletionDate = Number.isFinite(stockCoverageDays) ? addDays(settings.startDate, Math.floor(stockCoverageDays)) : "";
  const orderByDate = need.orderKg > 0 && depletionDate ? addDays(depletionDate, -leadTimeDays) : "";
  const price = purchaseUnitPrice(bean, supplier?.id, settings.startDate);
  const estimatedCost = Number.isFinite(price.unitCost) ? need.orderKg * price.unitCost : null;
  const risk = purchaseRisk(need.orderKg, stockCoverageDays, leadTimeDays);
  const row = {
    ...need,
    supplier,
    leadTimeDays,
    dailyNeedKg,
    stockCoverageDays,
    depletionDate,
    orderByDate,
    unitCost: price.unitCost,
    currency: price.currency,
    estimatedCost,
    risk
  };
  const decision = buildPurchaseAction(row, settings);

  return {
    ...row,
    action: decision.action,
    actionReason: decision.reason
  };
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
  const purchasePlan = beanNeeds
    .map((need) => buildPurchasePlanRow(need, safeSettings, horizonDays))
    .sort(comparePurchasePlanRows);

  const totalForecastRoastedKg = dailyRows.reduce((sum, row) => sum + row.forecastKg, 0);
  const totalGreenRequiredKg = beanNeeds.reduce((sum, row) => sum + row.requiredKg, 0);
  const totalOrderKg = beanNeeds.reduce((sum, row) => sum + row.orderKg, 0);
  const totalRecommendedPurchaseCost = purchasePlan.reduce((sum, row) => sum + Number(row.estimatedCost || 0), 0);

  return {
    settings: safeSettings,
    dailyRows,
    blendNeeds: [...blendTotals.values()],
    beanNeeds,
    purchasePlan,
    totalForecastRoastedKg,
    totalGreenRequiredKg,
    totalOrderKg,
    totalRecommendedPurchaseCost,
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

function addQualityIssue(issues, severity, title, message) {
  issues.push({ severity, title, message });
}

function addDuplicateIssues(issues, rows, getLabel, label) {
  const groups = new Map();

  rows.forEach((row) => {
    const value = String(getLabel(row) || "").trim();
    const key = normalizeKey(value);
    if (!key) return;
    const group = groups.get(key) || [];
    group.push(value);
    groups.set(key, group);
  });

  [...groups.values()]
    .filter((group) => group.length > 1)
    .forEach((group) => {
      addQualityIssue(
        issues,
        "warning",
        `Doublon ${label}`,
        `${group[0]} apparaît ${group.length} fois.`
      );
    });
}

function countRows(rows, predicate) {
  return rows.reduce((count, row) => count + (predicate(row) ? 1 : 0), 0);
}

function dateRangesOverlap(left, right) {
  const leftTo = left.validTo || "9999-12-31";
  const rightTo = right.validTo || "9999-12-31";
  return left.validFrom <= rightTo && right.validFrom <= leftTo;
}

function pricePeriodLabel(price) {
  return `${price.validFrom} -> ${price.validTo || "ouvert"}`;
}

function priceScopeLabel(price) {
  const bean = getById("beans", price.beanId);
  const supplier = getById("suppliers", price.supplierId);
  return `${bean?.commercialName || "Grain"} / ${supplier?.name || "fournisseur"}`;
}

function splitPriceOverlaps(candidate) {
  const overlaps = state.prices.filter((price) => {
    return (
      price.id !== candidate.id &&
      price.beanId === candidate.beanId &&
      price.supplierId === candidate.supplierId &&
      dateRangesOverlap(price, candidate)
    );
  });

  return {
    closable: overlaps.filter((price) => !price.validTo && price.validFrom < candidate.validFrom),
    blocking: overlaps.filter((price) => price.validTo || price.validFrom >= candidate.validFrom)
  };
}

function closePreviousOpenPrices(prices, nextValidFrom) {
  const closedDate = addDays(nextValidFrom, -1);
  prices.forEach((price) => {
    price.validTo = closedDate;
  });
}

function priceOverlapMessage(candidate, conflicts) {
  const periods = conflicts
    .slice(0, 3)
    .map(pricePeriodLabel)
    .join(", ");
  return `Tarif déjà actif pour ${priceScopeLabel(candidate)} : ${periods}. Ajuste la période avant d'enregistrer.`;
}

function calculateDataQualityIssues() {
  const issues = [];
  const countryIds = new Set(state.countries.map((country) => country.id));
  const supplierIds = new Set(state.suppliers.map((supplier) => supplier.id));
  const beanIds = new Set(state.beans.map((bean) => bean.id));
  const blendIds = new Set(state.blends.map((blend) => blend.id));

  addDuplicateIssues(issues, state.countries, (country) => country.name, "pays");
  addDuplicateIssues(issues, state.suppliers, (supplier) => supplier.name, "fournisseur");
  addDuplicateIssues(issues, state.beans, (bean) => bean.commercialName, "grain");
  addDuplicateIssues(issues, state.blends, (blend) => blend.name, "assemblage");

  state.countries.forEach((country) => {
    if (!country.region?.trim()) {
      addQualityIssue(issues, "warning", country.name || "Pays", "Région non renseignée.");
    }
  });

  state.suppliers.forEach((supplier) => {
    const leadTime = toFiniteNumber(supplier.averageLeadTimeDays);
    const reliability = toFiniteNumber(supplier.reliabilityPct);

    if (!supplier.name?.trim()) {
      addQualityIssue(issues, "danger", "Fournisseur", "Nom fournisseur manquant.");
    }

    if (Number.isFinite(leadTime) && leadTime < 0) {
      addQualityIssue(issues, "danger", supplier.name || "Fournisseur", "Délai moyen négatif.");
    }

    if (Number.isFinite(reliability) && (reliability < 0 || reliability > 100)) {
      addQualityIssue(issues, "danger", supplier.name || "Fournisseur", "Fiabilité hors plage 0-100 %.");
    }
  });

  state.beans.forEach((bean) => {
    const name = bean.commercialName || "Grain";
    const landedCost = toFiniteNumber(bean.landedCostPerKg);
    const scaScore = toFiniteNumber(bean.scaScore);
    const moisturePct = toFiniteNumber(bean.moisturePct);
    const density = toFiniteNumber(bean.density);

    if (!bean.commercialName?.trim()) {
      addQualityIssue(issues, "danger", "Grain", "Nom commercial manquant.");
    }

    if (!countryIds.has(bean.countryId)) {
      addQualityIssue(issues, "danger", name, "Pays introuvable dans les référentiels.");
    }

    if (!supplierIds.has(bean.defaultSupplierId)) {
      addQualityIssue(issues, "danger", name, "Fournisseur par défaut introuvable.");
    }

    if (!Number.isFinite(landedCost) || landedCost <= 0) {
      addQualityIssue(issues, "warning", name, "Coût rendu / kg absent ou nul.");
    }

    if (Number.isFinite(scaScore) && (scaScore < 0 || scaScore > 100)) {
      addQualityIssue(issues, "danger", name, "Score SCA hors plage 0-100.");
    }

    if (Number.isFinite(moisturePct) && (moisturePct < 0 || moisturePct > 25)) {
      addQualityIssue(issues, "danger", name, "Humidité hors plage cohérente.");
    }

    if (Number.isFinite(density) && density < 0) {
      addQualityIssue(issues, "danger", name, "Densité négative.");
    }

    if (!state.greenStocks.some((stock) => stock.beanId === bean.id)) {
      addQualityIssue(issues, "warning", name, "Aucune ligne de stock associée.");
    }
  });

  state.prices.forEach((price) => {
    const bean = getById("beans", price.beanId);
    const supplier = getById("suppliers", price.supplierId);
    const priceValue = toFiniteNumber(price.pricePerKg);
    const title = bean?.commercialName || "Tarif";

    if (!beanIds.has(price.beanId)) {
      addQualityIssue(issues, "danger", "Tarif", "Grain introuvable sur une ligne de tarif.");
    }

    if (!supplierIds.has(price.supplierId)) {
      addQualityIssue(issues, "danger", title, "Fournisseur introuvable sur une ligne de tarif.");
    }

    if (!Number.isFinite(priceValue) || priceValue <= 0) {
      addQualityIssue(issues, "danger", title, "Prix / kg absent, nul ou négatif.");
    }

    if (!isIsoDate(price.validFrom)) {
      addQualityIssue(issues, "danger", title, "Date de début de tarif invalide.");
    }

    if (price.validTo && !isIsoDate(price.validTo)) {
      addQualityIssue(issues, "danger", title, "Date de fin de tarif invalide.");
    }

    if (isIsoDate(price.validFrom) && price.validTo && isIsoDate(price.validTo) && price.validTo < price.validFrom) {
      addQualityIssue(issues, "danger", title, "Date de fin antérieure à la date de début.");
    }

    if (!price.currency?.trim()) {
      addQualityIssue(issues, "warning", title, "Devise non renseignée.");
    }

    if (supplier && price.currency && supplier.defaultCurrency && price.currency !== supplier.defaultCurrency) {
      addQualityIssue(
        issues,
        "warning",
        title,
        `Devise ${price.currency} différente de la devise fournisseur ${supplier.defaultCurrency}.`
      );
    }
  });

  const validPriceGroups = state.prices
    .filter((price) => {
      return (
        beanIds.has(price.beanId) &&
        supplierIds.has(price.supplierId) &&
        isIsoDate(price.validFrom) &&
        (!price.validTo || isIsoDate(price.validTo)) &&
        (!price.validTo || price.validTo >= price.validFrom)
      );
    })
    .reduce((groups, price) => {
      const key = `${price.beanId}|${price.supplierId}`;
      const rows = groups.get(key) || [];
      rows.push(price);
      groups.set(key, rows);
      return groups;
    }, new Map());

  validPriceGroups.forEach((prices) => {
    const sortedPrices = [...prices].sort((a, b) => a.validFrom.localeCompare(b.validFrom));
    let hasOverlap = false;

    for (let index = 0; index < sortedPrices.length; index += 1) {
      for (let next = index + 1; next < sortedPrices.length; next += 1) {
        if (dateRangesOverlap(sortedPrices[index], sortedPrices[next])) {
          hasOverlap = true;
          break;
        }
      }
      if (hasOverlap) break;
    }

    if (hasOverlap) {
      const bean = getById("beans", sortedPrices[0].beanId);
      const supplier = getById("suppliers", sortedPrices[0].supplierId);
      addQualityIssue(
        issues,
        "danger",
        "Tarifs qui se chevauchent",
        `${bean?.commercialName || "Grain"} / ${supplier?.name || "fournisseur"} a plusieurs tarifs actifs sur une même période.`
      );
    }
  });

  state.blends.forEach((blend) => {
    const title = blend.name || "Assemblage";
    const roastLossPct = toFiniteNumber(blend.roastLossPct);
    const totalPct = (blend.components || []).reduce((sum, component) => sum + Number(component.percentage || 0), 0);
    const componentBeanKeys = new Map();

    if (!blend.name?.trim()) {
      addQualityIssue(issues, "danger", "Assemblage", "Nom d'assemblage manquant.");
    }

    if (!blend.components?.length) {
      addQualityIssue(issues, "danger", title, "Composition vide.");
    }

    if (blend.components?.length && Math.abs(totalPct - 100) > 0.1) {
      addQualityIssue(issues, "danger", title, `Composition à ${formatPct(totalPct)} au lieu de 100 %.`);
    }

    if (!Number.isFinite(roastLossPct) || roastLossPct <= 0 || roastLossPct >= 50) {
      addQualityIssue(issues, "warning", title, "Perte de torréfaction absente ou hors plage courante.");
    }

    ["packagingCostPerKg", "energyCostPerKg", "logisticsCostPerKg", "targetSalePricePerKg", "maxCostPerKg"].forEach((field) => {
      const value = toFiniteNumber(blend[field]);
      if (Number.isFinite(value) && value < 0) {
        addQualityIssue(issues, "danger", title, "Un coût ou prix cible est négatif.");
      }
    });

    (blend.components || []).forEach((component) => {
      const bean = getById("beans", component.beanId);
      const percentage = toFiniteNumber(component.percentage);
      const beanKey = component.beanId || "";

      if (!beanIds.has(component.beanId)) {
        addQualityIssue(issues, "danger", title, "Un grain de la composition est introuvable.");
      }

      if (!Number.isFinite(percentage) || percentage <= 0) {
        addQualityIssue(issues, "warning", title, `${bean?.commercialName || "Une ligne"} a un pourcentage absent ou nul.`);
      }

      if (beanKey) {
        componentBeanKeys.set(beanKey, (componentBeanKeys.get(beanKey) || 0) + 1);
      }
    });

    componentBeanKeys.forEach((count, beanId) => {
      if (count <= 1) return;
      const bean = getById("beans", beanId);
      addQualityIssue(issues, "warning", title, `${bean?.commercialName || "Un grain"} apparaît ${count} fois dans la composition.`);
    });
  });

  const stockGroups = state.greenStocks.reduce((groups, stock) => {
    const rows = groups.get(stock.beanId) || [];
    rows.push(stock);
    groups.set(stock.beanId, rows);
    return groups;
  }, new Map());

  stockGroups.forEach((rows, beanId) => {
    if (rows.length <= 1) return;
    const bean = getById("beans", beanId);
    addQualityIssue(issues, "danger", bean?.commercialName || "Stock", "Plusieurs lignes de stock pour le même grain.");
  });

  state.greenStocks.forEach((stock) => {
    const bean = getById("beans", stock.beanId);
    const quantityKg = toFiniteNumber(stock.quantityKg);
    const incomingKg = toFiniteNumber(stock.incomingKg);
    const title = bean?.commercialName || "Stock";

    if (!beanIds.has(stock.beanId)) {
      addQualityIssue(issues, "danger", "Stock", "Ligne de stock associée à un grain introuvable.");
    }

    if (Number.isFinite(quantityKg) && quantityKg < 0) {
      addQualityIssue(issues, "danger", title, "Stock négatif.");
    }

    if (Number.isFinite(incomingKg) && incomingKg < 0) {
      addQualityIssue(issues, "danger", title, "Commande en cours négative.");
    }

    if (stock.eta && !isIsoDate(stock.eta)) {
      addQualityIssue(issues, "warning", title, "ETA invalide.");
    }
  });

  const invalidHistoryDates = countRows(state.historicalOrders, (order) => !isIsoDate(order.date));
  const missingHistoryBlends = countRows(state.historicalOrders, (order) => !blendIds.has(order.blendId));
  const invalidHistoryKg = countRows(state.historicalOrders, (order) => {
    const roastedKg = toFiniteNumber(order.roastedKg);
    return !Number.isFinite(roastedKg) || roastedKg <= 0;
  });

  if (invalidHistoryDates > 0) {
    addQualityIssue(issues, "warning", "Activité N-1", `${invalidHistoryDates} ligne(s) avec date invalide.`);
  }
  if (missingHistoryBlends > 0) {
    addQualityIssue(issues, "warning", "Activité N-1", `${missingHistoryBlends} ligne(s) avec assemblage introuvable.`);
  }
  if (invalidHistoryKg > 0) {
    addQualityIssue(issues, "warning", "Activité N-1", `${invalidHistoryKg} ligne(s) avec kg torréfiés absents ou nuls.`);
  }

  const otherSupplies = state.otherSupplies || [];
  const invalidOtherSupplyDates = countRows(otherSupplies, (item) => !isIsoDate(item.validFrom));
  const invalidOtherSupplyAmounts = countRows(otherSupplies, (item) => {
    const quantity = toFiniteNumber(item.quantity);
    const unitCost = toFiniteNumber(item.unitCost);
    return !Number.isFinite(quantity) || quantity <= 0 || !Number.isFinite(unitCost) || unitCost <= 0;
  });
  const missingOtherSupplySuppliers = countRows(otherSupplies, (item) => item.supplierId && !supplierIds.has(item.supplierId));

  if (invalidOtherSupplyDates > 0) {
    addQualityIssue(issues, "warning", "Autres approvisionnements", `${invalidOtherSupplyDates} ligne(s) avec date invalide.`);
  }
  if (invalidOtherSupplyAmounts > 0) {
    addQualityIssue(issues, "warning", "Autres approvisionnements", `${invalidOtherSupplyAmounts} ligne(s) avec quantité ou coût invalide.`);
  }
  if (missingOtherSupplySuppliers > 0) {
    addQualityIssue(issues, "warning", "Autres approvisionnements", `${missingOtherSupplySuppliers} ligne(s) avec fournisseur introuvable.`);
  }

  const invalidBatches = countRows(state.batches, (batch) => {
    const roastedQuantityKg = toFiniteNumber(batch.roastedQuantityKg);
    return !blendIds.has(batch.blendId) || !Number.isFinite(roastedQuantityKg) || roastedQuantityKg <= 0;
  });

  if (invalidBatches > 0) {
    addQualityIssue(issues, "warning", "Production", `${invalidBatches} batch(es) avec assemblage ou quantité invalide.`);
  }

  return issues.sort((a, b) => {
    const severityOrder = { danger: 0, warning: 1 };
    return severityOrder[a.severity] - severityOrder[b.severity] || a.title.localeCompare(b.title, "fr");
  });
}

function renderQualityIssueList(issues, totalCount = issues.length) {
  if (issues.length === 0) {
    return `
      <div class="result-card">
        <strong>Données cohérentes</strong>
        <span>Référentiels, tarifs, stocks et assemblages ne présentent pas d'incohérence détectée.</span>
      </div>
    `;
  }

  const hiddenCount = Math.max(0, totalCount - issues.length);
  const rows = issues
    .map(
      (issue) => `
        <div class="alert-row ${escapeHtml(issue.severity)}">
          <strong>${escapeHtml(issue.title)}</strong>
          <span>${escapeHtml(issue.message)}</span>
        </div>
      `
    )
    .join("");
  const hiddenRow = hiddenCount
    ? `
      <div class="result-card">
        <strong>${hiddenCount} autre${hiddenCount > 1 ? "s" : ""} point${hiddenCount > 1 ? "s" : ""}</strong>
        <span>Ouvre l'onglet Données pour voir la liste complète.</span>
      </div>
    `
    : "";

  return `${rows}${hiddenRow}`;
}

function renderQualityIssues() {
  const issues = calculateDataQualityIssues();
  const dashboardIssues = issues.slice(0, 6);

  if (els.qualityCount) els.qualityCount.textContent = issues.length;
  if (els.dataQualityCount) els.dataQualityCount.textContent = issues.length;
  if (els.qualityList) els.qualityList.innerHTML = renderQualityIssueList(dashboardIssues, issues.length);
  if (els.dataQualityList) els.dataQualityList.innerHTML = renderQualityIssueList(issues);
}

function emptyState() {
  return document.querySelector("#emptyStateTemplate").innerHTML;
}

function renderSelects() {
  const sortedReferenceCountries = [...referenceCountries].sort((a, b) => a.name.localeCompare(b.name, "fr"));
  const existingCountryKeys = new Set(state.countries.map((country) => normalizeKey(country.name)));
  const availableReferenceCountries = sortedReferenceCountries.filter((country) => !existingCountryKeys.has(normalizeKey(country.name)));
  const referenceCountryOptions = `<option value="">Choisir un pays</option>${sortedReferenceCountries
    .map((country) => `<option value="${escapeHtml(country.name)}">${escapeHtml(country.name)}</option>`)
    .join("")}`;
  const addCountryOptions = availableReferenceCountries.length
    ? `<option value="">Choisir un pays</option>${availableReferenceCountries
        .map((country) => `<option value="${escapeHtml(country.name)}">${escapeHtml(country.name)}</option>`)
        .join("")}`
    : "<option value=\"\">Tous les pays référencés sont déjà ajoutés</option>";
  const beanOptions = state.beans
    .map((bean) => `<option value="${escapeHtml(bean.id)}">${escapeHtml(bean.commercialName)}</option>`)
    .join("");
  const beanOptionsWithBlank = `<option value="">Choisir un grain</option>${beanOptions}`;
  const beanDatalistOptions = state.beans
    .map((bean) => `<option value="${escapeHtml(bean.commercialName)}"></option>`)
    .join("");
  const supplierOptions = state.suppliers
    .map((supplier) => `<option value="${escapeHtml(supplier.id)}">${escapeHtml(supplier.name)}</option>`)
    .join("");
  const supplierDatalistOptions = state.suppliers
    .map((supplier) => `<option value="${escapeHtml(supplier.name)}"></option>`)
    .join("");
  const countryOptions = state.countries
    .map((country) => `<option value="${escapeHtml(country.id)}">${escapeHtml(country.name)}</option>`)
    .join("");
  const blendOptions = state.blends
    .map((blend) => `<option value="${escapeHtml(blend.id)}">${escapeHtml(blend.name)}</option>`)
    .join("");

  els.countryName.innerHTML = addCountryOptions;
  els.quickPurchaseCountry.innerHTML = referenceCountryOptions;
  els.quickBeanOptions.innerHTML = beanDatalistOptions;
  els.quickSupplierOptions.innerHTML = supplierDatalistOptions;
  els.priceBean.innerHTML = beanOptions;
  els.priceSupplier.innerHTML = supplierOptions;
  els.calcBlend.innerHTML = blendOptions;
  els.batchBlend.innerHTML = blendOptions;
  els.beanCountry.innerHTML = countryOptions;
  els.beanSupplier.innerHTML = supplierOptions;
  els.stockBean.innerHTML = beanOptions;
  els.historyBlend.innerHTML = blendOptions;
  blendComponentBeanSelects().forEach((select) => {
    const currentValue = select.value;
    select.innerHTML = beanOptionsWithBlank;
    if (currentValue) select.value = currentValue;
  });
}

function syncSelectedCountryRegion() {
  const referenceCountry = findReferenceCountry(els.countryName.value);
  els.countryRegion.value = referenceCountry?.region || "";
}

function syncQuickPurchaseCategory() {
  const isGreenCoffee = els.quickPurchaseCategory.value === "greenCoffee";
  els.quickPurchaseCountry.disabled = !isGreenCoffee;
  els.quickPurchaseCountry.required = isGreenCoffee;

  if (!isGreenCoffee) {
    els.quickPurchaseCountry.value = "";
  } else if (!els.quickPurchaseUnit.value) {
    els.quickPurchaseUnit.value = "kg";
  }
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
    ["Stock valorisé", formatMoney(stockValue), "Grains café disponibles"],
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

function renderSupplyOverview() {
  els.supplyRows.innerHTML = state.beans.length
    ? state.beans
        .map((bean) => {
          const country = getById("countries", bean.countryId);
          const supplier = getById("suppliers", bean.defaultSupplierId);
          const latestPrice = getLatestPrice(bean.id);
          const stockInfo = getStockInfo(bean);
          const statusClass = stockInfo.risk
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/\s+/g, "-");
          const landedCost = toFiniteNumber(bean.landedCostPerKg);
          const costLabel = latestPrice
            ? formatMoney(latestPrice.pricePerKg, latestPrice.currency)
            : formatMoney(landedCost);

          return `
            <tr>
              <td>${escapeHtml(bean.commercialName)}</td>
              <td>${escapeHtml(country?.name || "-")}</td>
              <td>${escapeHtml(supplier?.name || "-")}</td>
              <td class="numeric">${escapeHtml(costLabel)}</td>
              <td class="numeric">${escapeHtml(formatKg(stockInfo.quantityKg))}</td>
              <td class="numeric">${escapeHtml(formatKg(stockInfo.incomingKg))}</td>
              <td>${escapeHtml(stockInfo.eta || "-")}</td>
              <td><span class="status-pill ${escapeHtml(statusClass)}">${escapeHtml(stockInfo.risk)}</span></td>
            </tr>
          `;
        })
        .join("")
    : emptyTableRow(8);
}

function renderOtherSupplies() {
  const rows = [...(state.otherSupplies || [])].sort((a, b) => b.validFrom.localeCompare(a.validFrom));
  els.otherSupplyRowsCount.textContent = `${rows.length} lignes`;
  els.otherSupplyRows.innerHTML = rows.length
    ? rows
        .map((item) => {
          const supplier = getById("suppliers", item.supplierId);
          return `
            <tr>
              <td>${escapeHtml(supplyCategories[item.category] || "Autre")}</td>
              <td>${escapeHtml(item.label)}</td>
              <td>${escapeHtml(supplier?.name || "-")}</td>
              <td class="numeric">${escapeHtml(formatQuantity(toFiniteNumber(item.quantity), item.unit))}</td>
              <td class="numeric">${escapeHtml(formatMoney(item.unitCost, item.currency))}</td>
              <td class="numeric">${escapeHtml(formatMoney(Number(item.quantity || 0) * Number(item.unitCost || 0), item.currency))}</td>
              <td>${escapeHtml(supplyStatuses[item.status] || "-")}</td>
              <td>${escapeHtml(item.validFrom)}</td>
              <td>${escapeHtml(item.validTo || "Ouvert")}</td>
              <td>${escapeHtml(item.notes || "")}</td>
              <td><button class="secondary table-action" data-delete-other-supply="${escapeHtml(item.id)}" type="button">Supprimer</button></td>
            </tr>
          `;
        })
        .join("")
    : emptyTableRow(11);
}

function renderPrices() {
  const rows = [...state.prices].sort((a, b) => b.validFrom.localeCompare(a.validFrom));
  els.priceRowsCount.textContent = `${rows.length} lignes`;

  els.priceRows.innerHTML = rows.length
    ? rows
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
              <td><button class="secondary table-action" data-delete-price="${escapeHtml(price.id)}" type="button">Supprimer</button></td>
            </tr>
          `;
        })
        .join("")
    : emptyTableRow(7);
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
      <span>Coût matière grain café / kg</span>
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
    ["Besoin en grains café", formatKg(result.totalGreenRequiredKg), "Avant stock de sécurité"],
    ["À commander", formatKg(result.totalOrderKg), "Après stock disponible"],
    ["Budget achat estimé", formatMoney(result.totalRecommendedPurchaseCost), "Plan d'achat prévisionnel"]
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

  els.forecastBeanNeeds.innerHTML = renderPurchasePlanTable(result.purchasePlan);
  els.forecastBlendNeeds.innerHTML = renderBlendNeedsTable(result.blendNeeds);
  els.forecastDailyRows.innerHTML = renderDailyForecastTable(result.dailyRows, result.multiplier);
}

function renderPurchasePlanTable(rows) {
  if (!rows || rows.length === 0) return emptyState();

  return `
    <table>
      <thead>
        <tr>
          <th>Grain</th>
          <th>Fournisseur</th>
          <th>Action</th>
          <th>Pourquoi</th>
          <th class="numeric">Stock</th>
          <th class="numeric">En cours</th>
          <th class="numeric">Besoin prévu</th>
          <th class="numeric">À acheter</th>
          <th>Date limite</th>
          <th class="numeric">Coût estimé</th>
          <th>Risque</th>
        </tr>
      </thead>
      <tbody>
        ${rows
          .map(
            (row) => {
              const actionClass = purchaseActionClass(row.action);
              const riskClass = purchaseRiskClass(row.risk);
              return `
                <tr>
                  <td>${escapeHtml(row.bean?.commercialName || "-")}</td>
                  <td>${escapeHtml(row.supplier?.name || "-")}</td>
                  <td><span class="status-pill ${escapeHtml(actionClass)}">${escapeHtml(row.action)}</span></td>
                  <td>${escapeHtml(row.actionReason || "-")}</td>
                  <td class="numeric">${escapeHtml(formatKg(row.stockKg))}</td>
                  <td class="numeric">${escapeHtml(formatKg(row.incomingKg))}</td>
                  <td class="numeric">${escapeHtml(formatKg(row.requiredWithSafetyKg))}</td>
                  <td class="numeric"><strong>${escapeHtml(formatKg(row.orderKg))}</strong></td>
                  <td>${escapeHtml(row.orderByDate || "-")}</td>
                  <td class="numeric">${escapeHtml(formatMoney(row.estimatedCost, row.currency || "EUR"))}</td>
                  <td><span class="status-pill ${escapeHtml(riskClass)}">${escapeHtml(row.risk)}</span></td>
                </tr>
              `;
            }
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

function rowActions(type, id) {
  return `
    <div class="row-actions">
      <button class="secondary table-action" data-edit-${type}="${escapeHtml(id)}" type="button">Modifier</button>
      <button class="secondary table-action" data-delete-${type}="${escapeHtml(id)}" type="button">Supprimer</button>
    </div>
  `;
}

function supplierUsage(supplierId) {
  return {
    beans: state.beans.filter((bean) => bean.defaultSupplierId === supplierId).length,
    prices: state.prices.filter((price) => price.supplierId === supplierId).length,
    batches: state.batches.filter((batch) => batch.lines?.some((line) => line.supplierId === supplierId)).length
  };
}

function beanUsage(beanId) {
  return {
    blends: state.blends.filter((blend) => blend.components.some((component) => component.beanId === beanId)).length,
    prices: state.prices.filter((price) => price.beanId === beanId).length,
    batches: state.batches.filter((batch) => batch.lines?.some((line) => line.beanId === beanId)).length
  };
}

function blendUsage(blendId) {
  return {
    orders: state.historicalOrders.filter((order) => order.blendId === blendId).length,
    batches: state.batches.filter((batch) => batch.blendId === blendId).length
  };
}

function renderDataTables() {
  if (state.countries.length === 0) {
    els.countryRows.innerHTML = `
      <div class="empty-state">
        <strong>Aucune donnée</strong>
        <span>Ajoute un pays producteur pour l'afficher ici.</span>
      </div>
    `;
  } else {
    const countriesByRegion = state.countries.reduce((groups, country) => {
      const region = country.region?.trim() || "Sans région";
      const countries = groups.get(region) || [];
      countries.push(country);
      groups.set(region, countries);
      return groups;
    }, new Map());

    els.countryRows.innerHTML = [...countriesByRegion.entries()]
      .sort(([regionA], [regionB]) => regionA.localeCompare(regionB, "fr"))
      .map(([region, countries], index) => {
        const sortedCountries = [...countries].sort((a, b) => a.name.localeCompare(b.name, "fr"));
        return `
          <details class="region-group" ${index === 0 ? "open" : ""}>
            <summary>
              <span class="region-name">${escapeHtml(region)}</span>
              <span class="region-count">${escapeHtml(String(sortedCountries.length))} pays</span>
            </summary>
            <ul class="country-list">
              ${sortedCountries
                .map((country) => {
                  const isUsed = state.beans.some((bean) => bean.countryId === country.id);
                  return `
                    <li class="country-item">
                      <span>${escapeHtml(country.name)}</span>
                      <button class="secondary table-action" data-delete-country="${escapeHtml(country.id)}" type="button" ${isUsed ? "disabled" : ""}>Retirer</button>
                    </li>
                  `;
                })
                .join("")}
            </ul>
          </details>
        `;
      })
      .join("");
  }

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
              <td>${rowActions("supplier", supplier.id)}</td>
            </tr>
          `;
        })
        .join("")
    : emptyTableRow(8);

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
          <th>Action</th>
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
                      <td>${rowActions("bean", bean.id)}</td>
                    </tr>
                  `;
                })
                .join("")
            : emptyTableRow(13)
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
          <th class="numeric">Prix cible / kg fini</th>
          <th class="numeric">Alerte coût</th>
          <th class="numeric">Prod. possible</th>
          <th>Action</th>
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
                      <td>${rowActions("blend", blend.id)}</td>
                    </tr>
                  `;
                })
                .join("")
            : emptyTableRow(7)
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

  const stockMovements = [...(state.stockMovements || [])]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 50);
  els.stockMovementRowsCount.textContent = `${(state.stockMovements || []).length} lignes`;
  els.stockMovementRows.innerHTML = stockMovements.length
    ? stockMovements
        .map((movement) => {
          const bean = getById("beans", movement.beanId);
          const supplier = getById("suppliers", movement.supplierId);
          return `
            <tr>
              <td>${escapeHtml(movement.date)}</td>
              <td>${escapeHtml(bean?.commercialName || "-")}</td>
              <td>${escapeHtml(stockMovementTypes[movement.type] || movement.type || "-")}</td>
              <td class="numeric">${escapeHtml(formatQuantity(toFiniteNumber(movement.quantity), movement.unit))}</td>
              <td>${escapeHtml(supplier?.name || "-")}</td>
              <td>${escapeHtml(movement.notes || "")}</td>
            </tr>
          `;
        })
        .join("")
    : emptyTableRow(6);

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
              <td>${rowActions("history", order.id)}</td>
            </tr>
          `;
        })
        .join("")
    : emptyTableRow(5);
}

function renderImportHistory() {
  if (!els.importLogRows) return;

  const rows = [...(state.importHistory || [])].slice(0, 20);
  els.undoLastImport.disabled = !state.lastImportBackup;

  els.importLogRows.innerHTML = rows.length
    ? rows
        .map((entry) => {
          const status = entry.status === "undone" ? "Annulé" : "Importé";
          const errors = (entry.errors || []).slice(0, 3).join(" | ");
          return `
            <tr>
              <td>${escapeHtml(formatDateTime(entry.createdAt))}</td>
              <td>${escapeHtml(importTypeLabels[entry.type] || entry.type || "-")}</td>
              <td>${escapeHtml(entry.fileName || "-")}</td>
              <td class="numeric">${escapeHtml(String(entry.inserted || 0))}</td>
              <td class="numeric">${escapeHtml(String(entry.updated || 0))}</td>
              <td class="numeric">${escapeHtml(String(entry.skipped || 0))}</td>
              <td>${escapeHtml(errors || "-")}</td>
              <td>${escapeHtml(status)}</td>
            </tr>
          `;
        })
        .join("")
    : emptyTableRow(8, "Aucun import enregistré");
}

function renderAll() {
  renderSelects();
  renderMetrics();
  renderAlerts();
  renderQualityIssues();
  renderBlendCards();
  renderSupplyOverview();
  renderOtherSupplies();
  renderPrices();
  renderForecast();
  renderBatches();
  renderDataTables();
  renderImportHistory();
}

function setupDefaults() {
  const forecastSettings = {
    ...seedState.forecastSettings,
    ...(state.forecastSettings || {})
  };

  els.priceFrom.value = today;
  els.quickPurchaseCategory.value = "greenCoffee";
  els.quickPurchaseDate.value = today;
  els.quickPurchaseUnit.value = "kg";
  els.quickPurchaseStatus.value = "received";
  syncQuickPurchaseCategory();
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
  const referenceCountry = findReferenceCountry(name);
  const region = referenceCountry?.region || "";

  if (!name) return;

  if (!referenceCountry) {
    window.alert("Choisis un pays dans la liste.");
    return;
  }

  const exists = state.countries.some((country) => country.name.toLowerCase() === name.toLowerCase());
  if (exists) {
    window.alert("Ce pays existe déjà.");
    return;
  }

  state.countries.push({
    id: referenceCountry.id,
    name: referenceCountry.name,
    region
  });

  await saveState();
  els.countryForm.reset();
  syncSelectedCountryRegion();
  renderAll();
}

async function deleteCountry(event) {
  const button = event.target.closest("[data-delete-country]");
  if (!button) return;

  const country = getById("countries", button.dataset.deleteCountry);
  if (!country) return;

  if (state.beans.some((bean) => bean.countryId === country.id)) {
    window.alert("Ce pays est utilisé par au moins un grain.");
    return;
  }

  if (!window.confirm(`Retirer ${country.name} ?`)) return;

  state.countries = state.countries.filter((item) => item.id !== country.id);
  await saveState();
  renderAll();
}

function resetSupplierForm() {
  editingSupplierId = null;
  els.supplierForm.reset();
  els.supplierSubmit.textContent = "Ajouter";
  els.cancelSupplierEdit.hidden = true;
}

function editSupplier(supplierId) {
  const supplier = getById("suppliers", supplierId);
  if (!supplier) return;

  editingSupplierId = supplier.id;
  els.supplierName.value = supplier.name || "";
  els.supplierCurrency.value = supplier.defaultCurrency || "EUR";
  els.supplierLeadTime.value = supplier.averageLeadTimeDays ?? "";
  els.supplierReliability.value = supplier.reliabilityPct ?? "";
  els.supplierIncoterms.value = supplier.incoterms || "";
  els.supplierPaymentTerms.value = supplier.paymentTerms || "";
  els.supplierCertifications.value = supplier.certifications || "";
  els.supplierSubmit.textContent = "Enregistrer";
  els.cancelSupplierEdit.hidden = false;
  els.supplierForm.scrollIntoView({ behavior: "smooth", block: "start" });
}

async function deleteSupplier(supplierId) {
  const supplier = getById("suppliers", supplierId);
  if (!supplier) return;

  const usage = supplierUsage(supplierId);
  if (usage.beans || usage.prices || usage.batches) {
    window.alert("Ce fournisseur est encore utilisé par des grains, tarifs ou batchs.");
    return;
  }

  if (!window.confirm(`Supprimer ${supplier.name} ?`)) return;

  state.suppliers = state.suppliers.filter((item) => item.id !== supplierId);
  state.stockMovements = (state.stockMovements || []).filter((movement) => movement.supplierId !== supplierId);
  await saveState();
  resetSupplierForm();
  renderAll();
}

async function handleSupplierRowsClick(event) {
  const editButton = event.target.closest("[data-edit-supplier]");
  if (editButton) {
    editSupplier(editButton.dataset.editSupplier);
    return;
  }

  const deleteButton = event.target.closest("[data-delete-supplier]");
  if (deleteButton) {
    await deleteSupplier(deleteButton.dataset.deleteSupplier);
  }
}

async function addSupplier(event) {
  event.preventDefault();
  const name = els.supplierName.value.trim();

  if (!name) return;

  const exists = state.suppliers.some((supplier) => supplier.id !== editingSupplierId && normalizeKey(supplier.name) === normalizeKey(name));
  if (exists) {
    window.alert("Ce fournisseur existe déjà.");
    return;
  }

  const supplier = editingSupplierId ? getById("suppliers", editingSupplierId) : null;
  const payload = {
    name,
    defaultCurrency: els.supplierCurrency.value,
    averageLeadTimeDays: optionalNumberValue(els.supplierLeadTime),
    reliabilityPct: optionalNumberValue(els.supplierReliability),
    incoterms: els.supplierIncoterms.value.trim(),
    paymentTerms: els.supplierPaymentTerms.value.trim(),
    certifications: els.supplierCertifications.value.trim()
  };

  if (supplier) {
    Object.assign(supplier, payload);
  } else {
    state.suppliers.push({
      id: createId("supplier", name),
      ...payload
    });
  }

  state.suppliers.sort((a, b) => a.name.localeCompare(b.name, "fr"));

  await saveState();
  resetSupplierForm();
  renderAll();
}

function resetBeanForm() {
  editingBeanId = null;
  els.beanForm.reset();
  els.beanSubmit.textContent = "Ajouter le grain";
  els.cancelBeanEdit.hidden = true;
}

function editBean(beanId) {
  const bean = getById("beans", beanId);
  if (!bean) return;

  editingBeanId = bean.id;
  els.beanName.value = bean.commercialName || "";
  els.beanCountry.value = bean.countryId || "";
  els.beanSupplier.value = bean.defaultSupplierId || "";
  els.beanSpecies.value = bean.species || "";
  els.beanProcess.value = bean.process || "";
  els.beanRegion.value = bean.region || "";
  els.beanVariety.value = bean.variety || "";
  els.beanHarvestYear.value = bean.harvestYear ?? "";
  els.beanContainer.value = bean.container || "";
  els.beanArrivalDate.value = bean.arrivalDate || "";
  els.beanAltitude.value = bean.altitudeM ?? "";
  els.beanScaScore.value = bean.scaScore ?? "";
  els.beanMoisture.value = bean.moisturePct ?? "";
  els.beanDensity.value = bean.density ?? "";
  els.beanScreenSize.value = bean.screenSize || "";
  els.beanLandedCost.value = bean.landedCostPerKg ?? "";
  els.beanLocation.value = bean.location || "";
  els.beanQualityNotes.value = bean.qualityNotes || "";
  els.beanSubmit.textContent = "Enregistrer";
  els.cancelBeanEdit.hidden = false;
  els.beanForm.scrollIntoView({ behavior: "smooth", block: "start" });
}

async function deleteBean(beanId) {
  const bean = getById("beans", beanId);
  if (!bean) return;

  const usage = beanUsage(beanId);
  if (usage.blends || usage.batches) {
    window.alert("Ce grain est utilisé dans un assemblage ou un batch.");
    return;
  }

  const linkedPrices = state.prices.filter((price) => price.beanId === beanId).length;
  const confirmMessage = linkedPrices
    ? `Supprimer ${bean.commercialName} et ${linkedPrices} tarif(s) lié(s) ?`
    : `Supprimer ${bean.commercialName} ?`;
  if (!window.confirm(confirmMessage)) return;

  state.beans = state.beans.filter((item) => item.id !== beanId);
  state.prices = state.prices.filter((price) => price.beanId !== beanId);
  state.greenStocks = state.greenStocks.filter((stock) => stock.beanId !== beanId);
  state.stockMovements = (state.stockMovements || []).filter((movement) => movement.beanId !== beanId);

  await saveState();
  resetBeanForm();
  renderAll();
}

async function handleBeanRowsClick(event) {
  const editButton = event.target.closest("[data-edit-bean]");
  if (editButton) {
    editBean(editButton.dataset.editBean);
    return;
  }

  const deleteButton = event.target.closest("[data-delete-bean]");
  if (deleteButton) {
    await deleteBean(deleteButton.dataset.deleteBean);
  }
}

async function addBean(event) {
  event.preventDefault();
  const commercialName = els.beanName.value.trim();

  if (!commercialName) return;

  if (!els.beanCountry.value || !els.beanSupplier.value) {
    window.alert("Ajoute au moins un pays et un fournisseur avant de créer un grain.");
    return;
  }

  const exists = state.beans.some((bean) => bean.id !== editingBeanId && normalizeKey(bean.commercialName) === normalizeKey(commercialName));
  if (exists) {
    window.alert("Ce grain existe déjà.");
    return;
  }

  const bean = editingBeanId ? getById("beans", editingBeanId) : null;
  const payload = {
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

  if (bean) {
    Object.assign(bean, payload);
  } else {
    const newBean = {
      id: createId("bean", commercialName),
      ...payload
    };
    state.beans.push(newBean);
    state.greenStocks.push({ beanId: newBean.id, quantityKg: 0, incomingKg: 0, eta: "" });
  }

  state.beans.sort((a, b) => a.commercialName.localeCompare(b.commercialName, "fr"));

  await saveState();
  resetBeanForm();
  renderAll();
}

function createBlendComponentRow() {
  const row = document.createElement("div");
  row.className = "component-row";
  row.innerHTML = `
    <select class="blend-component-bean"></select>
    <input class="blend-component-percentage" inputmode="decimal" min="0" max="100" step="0.1" type="number" placeholder="%" />
    <button class="secondary component-remove" type="button">Retirer</button>
  `;
  els.blendComponents.append(row);
  renderSelects();
}

function setBlendComponentRows(components = [{ beanId: "", percentage: "" }]) {
  const rows = components.length ? components : [{ beanId: "", percentage: "" }];
  els.blendComponents.innerHTML = rows
    .map((component) => `
      <div class="component-row">
        <select class="blend-component-bean"></select>
        <input class="blend-component-percentage" inputmode="decimal" min="0" max="100" step="0.1" type="number" placeholder="%" value="${escapeHtml(component.percentage ?? "")}" />
        <button class="secondary component-remove" type="button" ${rows.length <= 1 ? "hidden" : ""}>Retirer</button>
      </div>
    `)
    .join("");
  renderSelects();
  blendComponentRows().forEach((row, index) => {
    row.querySelector(".blend-component-bean").value = rows[index]?.beanId || "";
  });
}

function resetBlendComponentRows() {
  setBlendComponentRows();
}

function removeBlendComponentRow(event) {
  const button = event.target.closest(".component-remove");
  if (!button) return;

  const row = button.closest(".component-row");
  if (!row || blendComponentRows().length <= 1) return;
  row.remove();
}

function collectBlendComponents() {
  const components = [];

  blendComponentRows().forEach((row) => {
    const select = row.querySelector(".blend-component-bean");
    const percentageInput = row.querySelector(".blend-component-percentage");
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

function resetBlendForm() {
  editingBlendId = null;
  els.blendForm.reset();
  els.blendLoss.value = "15";
  els.blendPackaging.value = "0.55";
  els.blendEnergy.value = "0.22";
  els.blendLogistics.value = "0.18";
  els.blendSubmit.textContent = "Créer l'assemblage";
  els.cancelBlendEdit.hidden = true;
  resetBlendComponentRows();
}

function editBlend(blendId) {
  const blend = getById("blends", blendId);
  if (!blend) return;

  editingBlendId = blend.id;
  els.blendName.value = blend.name || "";
  els.blendLoss.value = blend.roastLossPct ?? 15;
  els.blendTargetPrice.value = blend.targetSalePricePerKg ?? "";
  els.blendMaxCost.value = blend.maxCostPerKg ?? "";
  els.blendPackaging.value = blend.packagingCostPerKg ?? "";
  els.blendEnergy.value = blend.energyCostPerKg ?? "";
  els.blendLogistics.value = blend.logisticsCostPerKg ?? "";
  setBlendComponentRows(blend.components);
  els.blendSubmit.textContent = "Enregistrer";
  els.cancelBlendEdit.hidden = false;
  els.blendForm.scrollIntoView({ behavior: "smooth", block: "start" });
}

async function deleteBlend(blendId) {
  const blend = getById("blends", blendId);
  if (!blend) return;

  const usage = blendUsage(blendId);
  if (usage.orders || usage.batches) {
    window.alert("Cet assemblage est utilisé dans l'activité N-1 ou la production.");
    return;
  }

  if (!window.confirm(`Supprimer ${blend.name} ?`)) return;

  state.blends = state.blends.filter((item) => item.id !== blendId);
  await saveState();
  resetBlendForm();
  renderAll();
}

async function handleBlendRowsClick(event) {
  const editButton = event.target.closest("[data-edit-blend]");
  if (editButton) {
    editBlend(editButton.dataset.editBlend);
    return;
  }

  const deleteButton = event.target.closest("[data-delete-blend]");
  if (deleteButton) {
    await deleteBlend(deleteButton.dataset.deleteBlend);
  }
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

  const exists = state.blends.some((blend) => blend.id !== editingBlendId && normalizeKey(blend.name) === normalizeKey(name));
  if (exists) {
    window.alert("Cet assemblage existe déjà.");
    return;
  }

  const blend = editingBlendId ? getById("blends", editingBlendId) : null;
  const payload = {
    name,
    roastLossPct: numberValue(els.blendLoss, 15),
    packagingCostPerKg: numberValue(els.blendPackaging, 0),
    energyCostPerKg: numberValue(els.blendEnergy, 0),
    logisticsCostPerKg: numberValue(els.blendLogistics, 0),
    targetSalePricePerKg: els.blendTargetPrice.value ? numberValue(els.blendTargetPrice, 0) : null,
    maxCostPerKg: els.blendMaxCost.value ? numberValue(els.blendMaxCost, 0) : null,
    components
  };

  if (blend) {
    Object.assign(blend, payload);
  } else {
    state.blends.push({
      id: createId("blend", name),
      ...payload
    });
  }

  state.blends.sort((a, b) => a.name.localeCompare(b.name, "fr"));

  await saveState();
  resetBlendForm();
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

  addStockMovement({
    beanId,
    type: "manual",
    date: today,
    quantity: quantityKg,
    unit: "kg",
    eta,
    notes: "Mise à jour manuelle du stock"
  });

  await saveState();
  els.stockForm.reset();
  renderAll();
}

function resetHistoryForm() {
  editingHistoricalOrderId = null;
  els.historyForm.reset();
  els.historyDate.value = previousYearDate(today);
  els.historySubmit.textContent = "Ajouter";
  els.cancelHistoryEdit.hidden = true;
}

function editHistoricalOrder(orderId) {
  const order = state.historicalOrders.find((item) => item.id === orderId);
  if (!order) return;

  editingHistoricalOrderId = order.id;
  els.historyDate.value = order.date || previousYearDate(today);
  els.historyBlend.value = order.blendId || "";
  els.historyKg.value = order.roastedKg ?? "";
  els.historyChannel.value = order.channel || "mixte";
  els.historySubmit.textContent = "Enregistrer";
  els.cancelHistoryEdit.hidden = false;
  els.historyForm.scrollIntoView({ behavior: "smooth", block: "start" });
}

async function deleteHistoricalOrder(orderId) {
  const order = state.historicalOrders.find((item) => item.id === orderId);
  if (!order) return;

  if (!window.confirm("Supprimer cette ligne d'activité N-1 ?")) return;

  state.historicalOrders = state.historicalOrders.filter((item) => item.id !== orderId);
  await saveState();
  resetHistoryForm();
  renderAll();
}

async function handleHistoryRowsClick(event) {
  const editButton = event.target.closest("[data-edit-history]");
  if (editButton) {
    editHistoricalOrder(editButton.dataset.editHistory);
    return;
  }

  const deleteButton = event.target.closest("[data-delete-history]");
  if (deleteButton) {
    await deleteHistoricalOrder(deleteButton.dataset.deleteHistory);
  }
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

  const existingOrder = editingHistoricalOrderId ? state.historicalOrders.find((order) => order.id === editingHistoricalOrderId) : null;
  const payload = {
    date: els.historyDate.value,
    blendId: els.historyBlend.value,
    roastedKg,
    channel: els.historyChannel.value
  };

  if (existingOrder) {
    Object.assign(existingOrder, payload);
  } else {
    state.historicalOrders.push({
      id: createId("order", `${els.historyDate.value}-${els.historyBlend.value}`),
      ...payload
    });
  }

  await saveState();
  resetHistoryForm();
  renderAll();
}

async function addQuickPurchase(event) {
  event.preventDefault();

  const snapshot = createBusinessSnapshot();
  const category = els.quickPurchaseCategory.value;
  const isGreenCoffee = category === "greenCoffee";
  const date = els.quickPurchaseDate.value;
  const itemLabel = els.quickPurchaseBean.value.trim();
  const countryName = els.quickPurchaseCountry.value.trim();
  const supplierName = els.quickPurchaseSupplier.value.trim();
  const unitCost = numberValue(els.quickPurchasePrice, NaN);
  const quantity = numberValue(els.quickPurchaseQuantity, NaN);
  const unit = els.quickPurchaseUnit.value;
  const status = els.quickPurchaseStatus.value;
  const validTo = els.quickPurchaseValidTo.value || null;

  if (!date || !itemLabel || !supplierName || (isGreenCoffee && !countryName)) {
    window.alert("Renseigne au minimum la date, l'article, le fournisseur et le pays pour un grain café.");
    return;
  }

  if (!Number.isFinite(unitCost) || unitCost <= 0) {
    window.alert("Le coût unitaire doit être supérieur à 0.");
    return;
  }

  if (!Number.isFinite(quantity) || quantity <= 0) {
    window.alert("La quantité doit être supérieure à 0.");
    return;
  }

  if (validTo && validTo < date) {
    window.alert("La date de fin du tarif doit être après la date d'effet.");
    return;
  }

  const supplier = ensureSupplier(supplierName, els.quickPurchaseCurrency.value);
  const notes = els.quickPurchaseNotes.value.trim();

  if (!isGreenCoffee) {
    state.otherSupplies.unshift({
      id: `supply-${crypto.randomUUID()}`,
      category,
      label: itemLabel,
      supplierId: supplier.id,
      quantity,
      unit,
      unitCost,
      currency: els.quickPurchaseCurrency.value,
      status,
      validFrom: date,
      validTo,
      eta: els.quickPurchaseEta.value,
      notes
    });

    await saveState();
    els.quickPurchaseForm.reset();
    els.quickPurchaseDate.value = today;
    els.quickPurchaseUnit.value = "kg";
    els.quickPurchaseStatus.value = "received";
    syncQuickPurchaseCategory();
    renderAll();
    return;
  }

  const country = ensureCountry(countryName);
  const bean = ensureBean(itemLabel, country.id, supplier.id, unitCost);

  const candidatePrice = {
    id: `price-${crypto.randomUUID()}`,
    beanId: bean.id,
    supplierId: supplier.id,
    pricePerKg: unitCost,
    currency: els.quickPurchaseCurrency.value,
    validFrom: date,
    validTo,
    notes
  };
  const existingPrice = state.prices.find((price) => {
    return (
      price.beanId === bean.id &&
      price.supplierId === supplier.id &&
      price.validFrom === date &&
      (price.validTo || null) === validTo
    );
  });

  if (existingPrice) {
    existingPrice.pricePerKg = unitCost;
    existingPrice.currency = els.quickPurchaseCurrency.value;
    existingPrice.notes = notes;
  } else {
    const { closable, blocking } = splitPriceOverlaps(candidatePrice);
    if (blocking.length > 0) {
      restoreBusinessSnapshot(snapshot);
      window.alert(priceOverlapMessage(candidatePrice, blocking));
      return;
    }
    closePreviousOpenPrices(closable, candidatePrice.validFrom);
    state.prices.unshift(candidatePrice);
  }

  if (["ordered", "received"].includes(status)) {
    addStockMovement({
      beanId: bean.id,
      type: status,
      date,
      quantity,
      unit,
      supplierId: supplier.id,
      unitCost,
      currency: els.quickPurchaseCurrency.value,
      eta: els.quickPurchaseEta.value,
      notes
    });
  }

  await saveState();
  els.quickPurchaseForm.reset();
  els.quickPurchaseDate.value = today;
  els.quickPurchaseUnit.value = "kg";
  els.quickPurchaseStatus.value = "received";
  syncQuickPurchaseCategory();
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

  const { closable, blocking } = splitPriceOverlaps(price);
  if (blocking.length > 0) {
    window.alert(priceOverlapMessage(price, blocking));
    return;
  }
  closePreviousOpenPrices(closable, price.validFrom);

  state.prices.unshift(price);
  await saveState();
  els.priceForm.reset();
  els.priceFrom.value = today;
  renderAll();
}

async function deletePrice(event) {
  const button = event.target.closest("[data-delete-price]");
  if (!button) return;

  if (!window.confirm("Supprimer ce tarif ?")) return;

  state.prices = state.prices.filter((price) => price.id !== button.dataset.deletePrice);
  await saveState();
  renderAll();
}

async function deleteOtherSupply(event) {
  const button = event.target.closest("[data-delete-other-supply]");
  if (!button) return;

  if (!window.confirm("Supprimer cet approvisionnement ?")) return;

  state.otherSupplies = state.otherSupplies.filter((item) => item.id !== button.dataset.deleteOtherSupply);
  await saveState();
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

function downloadTextFile(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function csvEscape(value, delimiter = ";") {
  const text = value === null || value === undefined ? "" : String(value);
  const needsQuotes = text.includes(delimiter) || text.includes("\n") || text.includes("\r") || text.includes('"');
  const escaped = text.replaceAll('"', '""');
  return needsQuotes ? `"${escaped}"` : escaped;
}

function buildCsv(columns, rows, delimiter = ";") {
  const header = columns.map((column) => csvEscape(column.label, delimiter)).join(delimiter);
  const body = rows.map((row) => {
    return columns.map((column) => csvEscape(row[column.key], delimiter)).join(delimiter);
  });
  return `\ufeff${[header, ...body].join("\n")}`;
}

function downloadCsv(filename, columns, rows) {
  downloadTextFile(filename, buildCsv(columns, rows), "text/csv;charset=utf-8");
}

function exportBeansCsv() {
  const rows = state.beans.map((bean) => {
    const country = getById("countries", bean.countryId);
    const supplier = getById("suppliers", bean.defaultSupplierId);
    return {
      grain: bean.commercialName,
      pays: country?.name || "",
      region_monde: country?.region || "",
      fournisseur: supplier?.name || "",
      type: bean.species || "",
      process: bean.process || "",
      region_origine: bean.region || "",
      variete: bean.variety || "",
      recolte: bean.harvestYear || "",
      container: bean.container || "",
      date_arrivee: bean.arrivalDate || "",
      altitude_m: bean.altitudeM || "",
      score_sca: bean.scaScore || "",
      humidite_pct: bean.moisturePct || "",
      densite: bean.density || "",
      calibre: bean.screenSize || "",
      cout_rendu_kg: bean.landedCostPerKg || "",
      emplacement: bean.location || "",
      notes_qualite: bean.qualityNotes || ""
    };
  });

  downloadCsv(`mkaf-grains-${today}.csv`, [
    { key: "grain", label: "grain" },
    { key: "pays", label: "pays" },
    { key: "region_monde", label: "region_monde" },
    { key: "fournisseur", label: "fournisseur" },
    { key: "type", label: "type" },
    { key: "process", label: "process" },
    { key: "region_origine", label: "region_origine" },
    { key: "variete", label: "variete" },
    { key: "recolte", label: "recolte" },
    { key: "container", label: "container" },
    { key: "date_arrivee", label: "date_arrivee" },
    { key: "altitude_m", label: "altitude_m" },
    { key: "score_sca", label: "score_sca" },
    { key: "humidite_pct", label: "humidite_pct" },
    { key: "densite", label: "densite" },
    { key: "calibre", label: "calibre" },
    { key: "cout_rendu_kg", label: "cout_rendu_kg" },
    { key: "emplacement", label: "emplacement" },
    { key: "notes_qualite", label: "notes_qualite" }
  ], rows);
}

function exportSuppliersCsv() {
  const rows = state.suppliers.map((supplier) => ({
    fournisseur: supplier.name,
    devise: supplier.defaultCurrency || "EUR",
    delai_moyen_jours: supplier.averageLeadTimeDays || "",
    fiabilite_pct: supplier.reliabilityPct || "",
    incoterms: supplier.incoterms || "",
    paiement: supplier.paymentTerms || "",
    certifications: supplier.certifications || ""
  }));

  downloadCsv(`mkaf-fournisseurs-${today}.csv`, [
    { key: "fournisseur", label: "fournisseur" },
    { key: "devise", label: "devise" },
    { key: "delai_moyen_jours", label: "delai_moyen_jours" },
    { key: "fiabilite_pct", label: "fiabilite_pct" },
    { key: "incoterms", label: "incoterms" },
    { key: "paiement", label: "paiement" },
    { key: "certifications", label: "certifications" }
  ], rows);
}

function exportPricesCsv() {
  const rows = state.prices.map((price) => {
    const bean = getById("beans", price.beanId);
    const country = getById("countries", bean?.countryId);
    const supplier = getById("suppliers", price.supplierId);
    return {
      grain: bean?.commercialName || "",
      pays: country?.name || "",
      fournisseur: supplier?.name || "",
      prix_kg: price.pricePerKg,
      devise: price.currency || "EUR",
      valable_du: price.validFrom || "",
      valable_au: price.validTo || "",
      note: price.notes || ""
    };
  });

  downloadCsv(`mkaf-tarifs-${today}.csv`, [
    { key: "grain", label: "grain" },
    { key: "pays", label: "pays" },
    { key: "fournisseur", label: "fournisseur" },
    { key: "prix_kg", label: "prix_kg" },
    { key: "devise", label: "devise" },
    { key: "valable_du", label: "valable_du" },
    { key: "valable_au", label: "valable_au" },
    { key: "note", label: "note" }
  ], rows);
}

function exportStocksCsv() {
  const rows = state.beans.map((bean) => {
    const country = getById("countries", bean.countryId);
    const supplier = getById("suppliers", bean.defaultSupplierId);
    const stockInfo = getStockInfo(bean);
    return {
      grain: bean.commercialName,
      pays: country?.name || "",
      fournisseur: supplier?.name || "",
      stock_kg: stockInfo.quantityKg,
      commande_kg: stockInfo.incomingKg,
      eta: stockInfo.eta,
      conso_jour_kg: stockInfo.averageDailyKg,
      autonomie_jours: stockInfo.autonomyDays ?? "",
      risque: stockInfo.risk,
      valeur_stock_eur: stockInfo.stockValue ?? ""
    };
  });

  downloadCsv(`mkaf-stocks-${today}.csv`, [
    { key: "grain", label: "grain" },
    { key: "pays", label: "pays" },
    { key: "fournisseur", label: "fournisseur" },
    { key: "stock_kg", label: "stock_kg" },
    { key: "commande_kg", label: "commande_kg" },
    { key: "eta", label: "eta" },
    { key: "conso_jour_kg", label: "conso_jour_kg" },
    { key: "autonomie_jours", label: "autonomie_jours" },
    { key: "risque", label: "risque" },
    { key: "valeur_stock_eur", label: "valeur_stock_eur" }
  ], rows);
}

function historicalRowsForCsv() {
  return [...(state.historicalOrders || [])]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((order) => {
      const blend = getById("blends", order.blendId);
      return {
        date: order.date,
        assemblage: blend?.name || "",
        kg_torrefies: order.roastedKg,
        canal: order.channel || "mixte"
      };
    });
}

function exportHistoryCsv() {
  downloadCsv(`mkaf-activite-n-1-${today}.csv`, [
    { key: "date", label: "date" },
    { key: "assemblage", label: "assemblage" },
    { key: "kg_torrefies", label: "kg_torrefies" },
    { key: "canal", label: "canal" }
  ], historicalRowsForCsv());
}

function exportForecastCsv() {
  const forecast = calculateForecast(state.forecastSettings);
  const rows = forecast.dailyRows.map((row) => ({
    date: row.date,
    reference_n1: row.n1Date,
    kg_n1: row.n1Kg,
    kg_prevu: row.forecastKg,
    facteur_pct: (forecast.multiplier - 1) * 100,
    confiance: row.confidence
  }));

  downloadCsv(`mkaf-previsions-${today}.csv`, [
    { key: "date", label: "date" },
    { key: "reference_n1", label: "reference_n1" },
    { key: "kg_n1", label: "kg_n1" },
    { key: "kg_prevu", label: "kg_prevu" },
    { key: "facteur_pct", label: "facteur_pct" },
    { key: "confiance", label: "confiance" }
  ], rows);
}

function purchasePlanRowsForCsv(forecast = calculateForecast(state.forecastSettings)) {
  return forecast.purchasePlan.map((row) => ({
    grain: row.bean?.commercialName || "",
    fournisseur: row.supplier?.name || "",
    action: row.action,
    raison_action: row.actionReason,
    stock_kg: row.stockKg,
    commande_en_cours_kg: row.incomingKg,
    besoin_prevu_kg: row.requiredWithSafetyKg,
    quantite_a_acheter_kg: row.orderKg,
    date_limite_commande: row.orderByDate || "",
    delai_fournisseur_jours: row.leadTimeDays,
    cout_unitaire_estime: row.unitCost ?? "",
    devise: row.currency || "EUR",
    cout_total_estime: row.estimatedCost ?? "",
    risque: row.risk
  }));
}

function exportPurchasePlanCsv() {
  downloadCsv(`mkaf-plan-achat-${today}.csv`, [
    { key: "grain", label: "grain" },
    { key: "fournisseur", label: "fournisseur" },
    { key: "action", label: "action" },
    { key: "raison_action", label: "raison_action" },
    { key: "stock_kg", label: "stock_kg" },
    { key: "commande_en_cours_kg", label: "commande_en_cours_kg" },
    { key: "besoin_prevu_kg", label: "besoin_prevu_kg" },
    { key: "quantite_a_acheter_kg", label: "quantite_a_acheter_kg" },
    { key: "date_limite_commande", label: "date_limite_commande" },
    { key: "delai_fournisseur_jours", label: "delai_fournisseur_jours" },
    { key: "cout_unitaire_estime", label: "cout_unitaire_estime" },
    { key: "devise", label: "devise" },
    { key: "cout_total_estime", label: "cout_total_estime" },
    { key: "risque", label: "risque" }
  ], purchasePlanRowsForCsv());
}

function exportCsv(event) {
  const button = event.target.closest("[data-export-csv]");
  if (!button) return;

  const exporters = {
    beans: exportBeansCsv,
    suppliers: exportSuppliersCsv,
    prices: exportPricesCsv,
    stocks: exportStocksCsv,
    history: exportHistoryCsv,
    forecast: exportForecastCsv,
    purchasePlan: exportPurchasePlanCsv
  };

  exporters[button.dataset.exportCsv]?.();
}

function detectCsvDelimiter(text) {
  const firstLine = text.split(/\r?\n/).find((line) => line.trim()) || "";
  const semicolonCount = (firstLine.match(/;/g) || []).length;
  const commaCount = (firstLine.match(/,/g) || []).length;
  return semicolonCount >= commaCount ? ";" : ",";
}

function parseCsvRows(text) {
  const delimiter = detectCsvDelimiter(text);
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const nextChar = text[index + 1];

    if (char === '"') {
      if (quoted && nextChar === '"') {
        field += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
      continue;
    }

    if (char === delimiter && !quoted) {
      row.push(field.trim());
      field = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && nextChar === "\n") index += 1;
      row.push(field.trim());
      rows.push(row);
      row = [];
      field = "";
      continue;
    }

    field += char;
  }

  row.push(field.trim());
  rows.push(row);
  return rows.filter((item) => item.some((cell) => cell.trim() !== ""));
}

function normalizeCsvHeader(value) {
  return slugify(value).replaceAll("-", "_");
}

function csvRecords(text) {
  const rows = parseCsvRows(text.replace(/^\ufeff/, ""));
  if (rows.length < 2) return [];

  const headers = rows[0].map(normalizeCsvHeader);
  return rows.slice(1).map((row) => {
    return headers.reduce((record, header, index) => {
      record[header] = row[index] || "";
      return record;
    }, {});
  });
}

function csvValue(record, keys) {
  const key = keys.find((candidate) => record[candidate] !== undefined);
  return key ? record[key] : "";
}

function parseHistoricalImport(text) {
  const records = csvRecords(text);
  const errors = [];
  const orders = [];

  records.forEach((record, index) => {
    const lineNumber = index + 2;
    const date = csvValue(record, ["date", "jour"]);
    const blendName = csvValue(record, ["assemblage", "melange", "recette", "blend"]);
    const kg = parseLocaleNumber(csvValue(record, ["kg_torrefies", "kg_torrefie", "kg", "roasted_kg", "quantite", "quantite_kg"]));
    const channel = csvValue(record, ["canal", "channel", "type"]) || "mixte";
    const blend = findByName("blends", "name", blendName);

    if (!isIsoDate(date)) {
      errors.push(`Ligne ${lineNumber} : date invalide`);
      return;
    }

    if (!blend) {
      errors.push(`Ligne ${lineNumber} : assemblage introuvable`);
      return;
    }

    if (!Number.isFinite(kg) || kg <= 0) {
      errors.push(`Ligne ${lineNumber} : kg invalide`);
      return;
    }

    orders.push({
      id: createId("order", `${date}-${blend.id}-${channel}`),
      date,
      blendId: blend.id,
      roastedKg: Number(kg.toFixed(3)),
      channel: channel.trim() || "mixte"
    });
  });

  return { orders, errors };
}

function csvOptionalText(record, keys) {
  const value = csvValue(record, keys).trim();
  return value || undefined;
}

function csvOptionalNumber(record, keys) {
  const raw = csvValue(record, keys);
  if (raw === "") return { hasValue: false, value: null };
  return { hasValue: true, value: parseLocaleNumber(raw) };
}

function parseSupplierImport(text) {
  const records = csvRecords(text);
  const errors = [];
  const suppliers = [];

  records.forEach((record, index) => {
    const lineNumber = index + 2;
    const name = csvValue(record, ["fournisseur", "supplier", "importateur", "nom", "name"]).trim();
    const currency = csvOptionalText(record, ["devise", "currency"])?.toUpperCase();
    const leadTime = csvOptionalNumber(record, ["delai_moyen_jours", "delai_jours", "delai", "lead_time_days"]);
    const reliability = csvOptionalNumber(record, ["fiabilite_pct", "fiabilite", "reliability_pct"]);

    if (!name) {
      errors.push(`Ligne ${lineNumber} : fournisseur manquant`);
      return;
    }

    if (leadTime.hasValue && (!Number.isFinite(leadTime.value) || leadTime.value < 0)) {
      errors.push(`Ligne ${lineNumber} : délai moyen invalide`);
      return;
    }

    if (reliability.hasValue && (!Number.isFinite(reliability.value) || reliability.value < 0 || reliability.value > 100)) {
      errors.push(`Ligne ${lineNumber} : fiabilité invalide`);
      return;
    }

    suppliers.push({
      name,
      defaultCurrency: currency,
      averageLeadTimeDays: leadTime.hasValue ? Number(leadTime.value.toFixed(0)) : undefined,
      reliabilityPct: reliability.hasValue ? Number(reliability.value.toFixed(1)) : undefined,
      incoterms: csvOptionalText(record, ["incoterms", "incoterm"]),
      paymentTerms: csvOptionalText(record, ["paiement", "conditions_paiement", "payment_terms"]),
      certifications: csvOptionalText(record, ["certifications", "certification", "notes", "commentaire"])
    });
  });

  return { suppliers, errors };
}

function parseBeanImport(text) {
  const records = csvRecords(text);
  const errors = [];
  const beans = [];

  records.forEach((record, index) => {
    const lineNumber = index + 2;
    const commercialName = csvValue(record, ["grain", "nom_commercial", "article", "cafe", "coffee", "bean"]).trim();
    const countryName = csvValue(record, ["pays", "country", "origine", "origin"]).trim();
    const supplierName = csvValue(record, ["fournisseur", "supplier", "importateur"]).trim();
    const harvestYear = csvOptionalNumber(record, ["recolte", "annee_recolte", "harvest_year"]);
    const altitudeM = csvOptionalNumber(record, ["altitude_m", "altitude"]);
    const scaScore = csvOptionalNumber(record, ["score_sca", "sca", "score"]);
    const moisturePct = csvOptionalNumber(record, ["humidite_pct", "humidite", "moisture_pct"]);
    const density = csvOptionalNumber(record, ["densite", "density"]);
    const landedCostPerKg = csvOptionalNumber(record, ["cout_rendu_kg", "cout_rendu", "landed_cost_per_kg", "cost_kg"]);
    const arrivalDate = csvOptionalText(record, ["date_arrivee", "arrivee", "arrival_date"]);

    if (!commercialName) {
      errors.push(`Ligne ${lineNumber} : grain manquant`);
      return;
    }

    if (!countryName) {
      errors.push(`Ligne ${lineNumber} : pays manquant`);
      return;
    }

    if (!supplierName) {
      errors.push(`Ligne ${lineNumber} : fournisseur manquant`);
      return;
    }

    if (harvestYear.hasValue && (!Number.isFinite(harvestYear.value) || harvestYear.value < 2000 || harvestYear.value > 2100)) {
      errors.push(`Ligne ${lineNumber} : récolte invalide`);
      return;
    }

    if (arrivalDate && !isIsoDate(arrivalDate)) {
      errors.push(`Ligne ${lineNumber} : date d'arrivée invalide`);
      return;
    }

    if (altitudeM.hasValue && (!Number.isFinite(altitudeM.value) || altitudeM.value < 0)) {
      errors.push(`Ligne ${lineNumber} : altitude invalide`);
      return;
    }

    if (scaScore.hasValue && (!Number.isFinite(scaScore.value) || scaScore.value < 0 || scaScore.value > 100)) {
      errors.push(`Ligne ${lineNumber} : score SCA invalide`);
      return;
    }

    if (moisturePct.hasValue && (!Number.isFinite(moisturePct.value) || moisturePct.value < 0 || moisturePct.value > 100)) {
      errors.push(`Ligne ${lineNumber} : humidité invalide`);
      return;
    }

    if (density.hasValue && (!Number.isFinite(density.value) || density.value < 0)) {
      errors.push(`Ligne ${lineNumber} : densité invalide`);
      return;
    }

    if (landedCostPerKg.hasValue && (!Number.isFinite(landedCostPerKg.value) || landedCostPerKg.value < 0)) {
      errors.push(`Ligne ${lineNumber} : coût rendu invalide`);
      return;
    }

    beans.push({
      commercialName,
      countryName,
      countryRegion: csvOptionalText(record, ["region_monde", "region_du_monde", "zone", "continent"]),
      supplierName,
      supplierCurrency: (csvValue(record, ["devise", "currency"]) || "EUR").trim().toUpperCase(),
      species: csvOptionalText(record, ["type", "espece", "species"]),
      process: csvOptionalText(record, ["process", "processus", "traitement"]),
      originRegion: csvOptionalText(record, ["region_origine", "region_productrice", "region"]),
      variety: csvOptionalText(record, ["variete", "variety"]),
      harvestYear: harvestYear.hasValue ? Number(harvestYear.value.toFixed(0)) : undefined,
      container: csvOptionalText(record, ["container", "conteneur", "lot"]),
      arrivalDate,
      altitudeM: altitudeM.hasValue ? Number(altitudeM.value.toFixed(0)) : undefined,
      scaScore: scaScore.hasValue ? Number(scaScore.value.toFixed(1)) : undefined,
      moisturePct: moisturePct.hasValue ? Number(moisturePct.value.toFixed(1)) : undefined,
      density: density.hasValue ? Number(density.value.toFixed(1)) : undefined,
      screenSize: csvOptionalText(record, ["calibre", "screen_size"]),
      landedCostPerKg: landedCostPerKg.hasValue ? Number(landedCostPerKg.value.toFixed(4)) : undefined,
      location: csvOptionalText(record, ["emplacement", "location"]),
      qualityNotes: csvOptionalText(record, ["notes_qualite", "analyses", "analyse", "note", "notes", "commentaire"])
    });
  });

  return { beans, errors };
}

function resolveImportBean(record, lineNumber, errors, supplier, landedCostPerKg) {
  const grainName = csvValue(record, ["grain", "article", "cafe", "coffee", "bean"]);
  if (!grainName) {
    errors.push(`Ligne ${lineNumber} : grain manquant`);
    return null;
  }

  const existingBean = findByName("beans", "commercialName", grainName);
  if (existingBean) return existingBean;

  const countryName = csvValue(record, ["pays", "country", "origine", "origin"]);
  if (!countryName) {
    errors.push(`Ligne ${lineNumber} : grain inconnu, ajoute un pays pour le créer`);
    return null;
  }

  if (!supplier) {
    errors.push(`Ligne ${lineNumber} : grain inconnu, ajoute un fournisseur pour le créer`);
    return null;
  }

  const country = ensureCountry(countryName);
  return ensureBean(grainName, country.id, supplier.id, landedCostPerKg);
}

function parsePriceImport(text) {
  const records = csvRecords(text);
  const errors = [];
  const prices = [];

  records.forEach((record, index) => {
    const lineNumber = index + 2;
    const supplierName = csvValue(record, ["fournisseur", "supplier", "importateur"]);
    const unitCost = parseLocaleNumber(csvValue(record, ["prix_kg", "prix", "cout_kg", "cout", "price_per_kg"]));
    const currency = (csvValue(record, ["devise", "currency"]) || "EUR").trim().toUpperCase();
    const validFrom = csvValue(record, ["valable_du", "date", "debut", "valid_from"]);
    const validTo = csvValue(record, ["valable_au", "fin", "valid_to"]) || null;
    const notes = csvValue(record, ["note", "notes", "commentaire"]);

    if (!supplierName) {
      errors.push(`Ligne ${lineNumber} : fournisseur manquant`);
      return;
    }

    if (!Number.isFinite(unitCost) || unitCost <= 0) {
      errors.push(`Ligne ${lineNumber} : prix invalide`);
      return;
    }

    if (!isIsoDate(validFrom)) {
      errors.push(`Ligne ${lineNumber} : date de début invalide`);
      return;
    }

    if (validTo && (!isIsoDate(validTo) || validTo < validFrom)) {
      errors.push(`Ligne ${lineNumber} : date de fin invalide`);
      return;
    }

    const supplier = ensureSupplier(supplierName, currency);
    const bean = resolveImportBean(record, lineNumber, errors, supplier, unitCost);
    if (!bean) return;

    prices.push({
      id: `price-${crypto.randomUUID()}`,
      beanId: bean.id,
      supplierId: supplier.id,
      pricePerKg: Number(unitCost.toFixed(4)),
      currency,
      validFrom,
      validTo,
      notes
    });
  });

  return { prices, errors };
}

function parseStockImport(text) {
  const records = csvRecords(text);
  const errors = [];
  const stocks = [];

  records.forEach((record, index) => {
    const lineNumber = index + 2;
    const supplierName = csvValue(record, ["fournisseur", "supplier", "importateur"]);
    const stockRaw = csvValue(record, ["stock_kg", "stock", "quantite_stock", "quantity"]);
    const incomingRaw = csvValue(record, ["commande_kg", "commande", "incoming_kg", "en_cours"]);
    const quantityKg = stockRaw === "" ? NaN : parseLocaleNumber(stockRaw);
    const incomingKg = incomingRaw === "" ? NaN : parseLocaleNumber(incomingRaw);
    const eta = csvValue(record, ["eta", "arrivee", "date_arrivee"]);
    const notes = csvValue(record, ["note", "notes", "commentaire"]);
    const supplier = supplierName ? ensureSupplier(supplierName) : null;
    const bean = resolveImportBean(record, lineNumber, errors, supplier, NaN);

    if (!bean) return;

    if (!Number.isFinite(quantityKg) && !Number.isFinite(incomingKg)) {
      errors.push(`Ligne ${lineNumber} : stock ou commande manquant`);
      return;
    }

    if (Number.isFinite(quantityKg) && quantityKg < 0) {
      errors.push(`Ligne ${lineNumber} : stock invalide`);
      return;
    }

    if (Number.isFinite(incomingKg) && incomingKg < 0) {
      errors.push(`Ligne ${lineNumber} : commande invalide`);
      return;
    }

    if (eta && !isIsoDate(eta)) {
      errors.push(`Ligne ${lineNumber} : ETA invalide`);
      return;
    }

    stocks.push({
      beanId: bean.id,
      supplierId: supplier?.id || bean.defaultSupplierId || "",
      quantityKg,
      incomingKg,
      eta,
      notes
    });
  });

  return { stocks, errors };
}

function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(String(reader.result || "")));
    reader.addEventListener("error", () => reject(reader.error));
    reader.readAsText(file);
  });
}

function setImportStatus(element, message, status = "muted") {
  element.textContent = message;
  element.className = `import-status ${status}`;
}

function createBusinessSnapshot() {
  return businessStateKeys.reduce((snapshot, key) => {
    snapshot[key] = structuredClone(state[key]);
    return snapshot;
  }, {});
}

function restoreBusinessSnapshot(snapshot) {
  businessStateKeys.forEach((key) => {
    if (snapshot[key] !== undefined) {
      state[key] = structuredClone(snapshot[key]);
    }
  });
}

function recordImport({ type, fileName, mode = "", inserted = 0, updated = 0, skipped = 0, errors = [], snapshot }) {
  const id = `import-${crypto.randomUUID()}`;
  const createdAt = new Date().toISOString();

  state.lastImportBackup = {
    importId: id,
    type,
    fileName,
    createdAt,
    snapshot
  };

  state.importHistory = [
    {
      id,
      createdAt,
      type,
      fileName,
      mode,
      inserted,
      updated,
      skipped,
      errors: errors.slice(0, 20),
      status: "imported"
    },
    ...(state.importHistory || [])
  ].slice(0, 50);
}

function importErrorSuffix(errors) {
  if (errors.length === 0) return "";
  const preview = errors.slice(0, 2).join(" | ");
  const more = errors.length > 2 ? "..." : "";
  return `, ${errors.length} ignorée(s) : ${preview}${more}`;
}

function upsertSupplierFromImport(row) {
  const existing = findByName("suppliers", "name", row.name);
  const payload = {
    name: row.name,
    defaultCurrency: row.defaultCurrency || existing?.defaultCurrency || "EUR",
    averageLeadTimeDays: row.averageLeadTimeDays !== undefined ? row.averageLeadTimeDays : existing?.averageLeadTimeDays ?? null,
    reliabilityPct: row.reliabilityPct !== undefined ? row.reliabilityPct : existing?.reliabilityPct ?? null,
    incoterms: row.incoterms !== undefined ? row.incoterms : existing?.incoterms || "",
    paymentTerms: row.paymentTerms !== undefined ? row.paymentTerms : existing?.paymentTerms || "",
    certifications: row.certifications !== undefined ? row.certifications : existing?.certifications || ""
  };

  if (existing) {
    Object.assign(existing, payload);
    return "updated";
  }

  state.suppliers.push({
    id: createId("supplier", row.name),
    ...payload
  });
  return "inserted";
}

function upsertBeanFromImport(row) {
  const supplier = ensureSupplier(row.supplierName, row.supplierCurrency || "EUR");
  const country = ensureCountry(row.countryName, row.countryRegion || "");
  const existing = findByName("beans", "commercialName", row.commercialName);
  const payload = {
    commercialName: row.commercialName,
    countryId: country.id,
    defaultSupplierId: supplier.id,
    species: row.species !== undefined ? row.species : existing?.species || "arabica",
    process: row.process !== undefined ? row.process : existing?.process || "",
    region: row.originRegion !== undefined ? row.originRegion : existing?.region || "",
    variety: row.variety !== undefined ? row.variety : existing?.variety || "",
    harvestYear: row.harvestYear !== undefined ? row.harvestYear : existing?.harvestYear ?? null,
    container: row.container !== undefined ? row.container : existing?.container || "",
    arrivalDate: row.arrivalDate !== undefined ? row.arrivalDate : existing?.arrivalDate || "",
    altitudeM: row.altitudeM !== undefined ? row.altitudeM : existing?.altitudeM ?? null,
    scaScore: row.scaScore !== undefined ? row.scaScore : existing?.scaScore ?? null,
    moisturePct: row.moisturePct !== undefined ? row.moisturePct : existing?.moisturePct ?? null,
    density: row.density !== undefined ? row.density : existing?.density ?? null,
    screenSize: row.screenSize !== undefined ? row.screenSize : existing?.screenSize || "",
    landedCostPerKg: row.landedCostPerKg !== undefined ? row.landedCostPerKg : existing?.landedCostPerKg ?? null,
    location: row.location !== undefined ? row.location : existing?.location || "",
    qualityNotes: row.qualityNotes !== undefined ? row.qualityNotes : existing?.qualityNotes || ""
  };

  if (existing) {
    Object.assign(existing, payload);
    if (!state.greenStocks.some((stock) => stock.beanId === existing.id)) {
      state.greenStocks.push({ beanId: existing.id, quantityKg: 0, incomingKg: 0, eta: "" });
    }
    return "updated";
  }

  const bean = {
    id: createId("bean", row.commercialName),
    ...payload
  };
  state.beans.push(bean);
  state.greenStocks.push({ beanId: bean.id, quantityKg: 0, incomingKg: 0, eta: "" });
  return "inserted";
}

function sortImportedReferences() {
  state.countries.sort((a, b) => a.name.localeCompare(b.name, "fr"));
  state.suppliers.sort((a, b) => a.name.localeCompare(b.name, "fr"));
  state.beans.sort((a, b) => a.commercialName.localeCompare(b.commercialName, "fr"));
}

function downloadSupplierTemplate() {
  const sampleSupplier = state.suppliers[0];
  const rows = [
    {
      fournisseur: sampleSupplier?.name || "Importateur A",
      devise: sampleSupplier?.defaultCurrency || "EUR",
      delai_moyen_jours: sampleSupplier?.averageLeadTimeDays || "28",
      fiabilite_pct: sampleSupplier?.reliabilityPct || "94",
      incoterms: sampleSupplier?.incoterms || "CIF",
      paiement: sampleSupplier?.paymentTerms || "30 jours",
      certifications: sampleSupplier?.certifications || "Bio, Rainforest..."
    }
  ];

  downloadCsv(`modele-fournisseurs-${today}.csv`, [
    { key: "fournisseur", label: "fournisseur" },
    { key: "devise", label: "devise" },
    { key: "delai_moyen_jours", label: "delai_moyen_jours" },
    { key: "fiabilite_pct", label: "fiabilite_pct" },
    { key: "incoterms", label: "incoterms" },
    { key: "paiement", label: "paiement" },
    { key: "certifications", label: "certifications" }
  ], rows);
}

function downloadBeanTemplate() {
  const sampleBean = state.beans[0];
  const sampleCountry = getById("countries", sampleBean?.countryId);
  const sampleSupplier = getById("suppliers", sampleBean?.defaultSupplierId);
  const rows = [
    {
      grain: sampleBean?.commercialName || "Brésil Santos",
      pays: sampleCountry?.name || "Brésil",
      region_monde: sampleCountry?.region || "Amérique latine",
      fournisseur: sampleSupplier?.name || "Importateur A",
      type: sampleBean?.species || "arabica",
      process: sampleBean?.process || "naturel",
      region_origine: sampleBean?.region || "Santos",
      variete: sampleBean?.variety || "Mundo Novo",
      recolte: sampleBean?.harvestYear || "2026",
      container: sampleBean?.container || "BR-ABC123",
      date_arrivee: sampleBean?.arrivalDate || today,
      altitude_m: sampleBean?.altitudeM || "950",
      score_sca: sampleBean?.scaScore || "82.5",
      humidite_pct: sampleBean?.moisturePct || "10.8",
      densite: sampleBean?.density || "690",
      calibre: sampleBean?.screenSize || "17/18",
      cout_rendu_kg: sampleBean?.landedCostPerKg || "5.95",
      emplacement: sampleBean?.location || "Dépôt A - Rack 1",
      notes_qualite: sampleBean?.qualityNotes || "Profil chocolat/noisette"
    }
  ];

  downloadCsv(`modele-grains-${today}.csv`, [
    { key: "grain", label: "grain" },
    { key: "pays", label: "pays" },
    { key: "region_monde", label: "region_monde" },
    { key: "fournisseur", label: "fournisseur" },
    { key: "type", label: "type" },
    { key: "process", label: "process" },
    { key: "region_origine", label: "region_origine" },
    { key: "variete", label: "variete" },
    { key: "recolte", label: "recolte" },
    { key: "container", label: "container" },
    { key: "date_arrivee", label: "date_arrivee" },
    { key: "altitude_m", label: "altitude_m" },
    { key: "score_sca", label: "score_sca" },
    { key: "humidite_pct", label: "humidite_pct" },
    { key: "densite", label: "densite" },
    { key: "calibre", label: "calibre" },
    { key: "cout_rendu_kg", label: "cout_rendu_kg" },
    { key: "emplacement", label: "emplacement" },
    { key: "notes_qualite", label: "notes_qualite" }
  ], rows);
}

function downloadHistoryTemplate() {
  const sampleBlend = state.blends[0]?.name || "Espresso Maison";
  const rows = [
    {
      date: previousYearDate(today),
      assemblage: sampleBlend,
      kg_torrefies: "12.5",
      canal: "boutique"
    }
  ];

  downloadCsv(`modele-activite-n-1-${today}.csv`, [
    { key: "date", label: "date" },
    { key: "assemblage", label: "assemblage" },
    { key: "kg_torrefies", label: "kg_torrefies" },
    { key: "canal", label: "canal" }
  ], rows);
}

function downloadPriceTemplate() {
  const sampleBean = state.beans[0];
  const sampleCountry = getById("countries", sampleBean?.countryId);
  const sampleSupplier = getById("suppliers", sampleBean?.defaultSupplierId);
  const rows = [
    {
      grain: sampleBean?.commercialName || "Brésil Santos",
      pays: sampleCountry?.name || "Brésil",
      fournisseur: sampleSupplier?.name || "Importateur A",
      prix_kg: "5.95",
      devise: "EUR",
      valable_du: today,
      valable_au: "",
      note: "Contrat ou cotation"
    }
  ];

  downloadCsv(`modele-tarifs-${today}.csv`, [
    { key: "grain", label: "grain" },
    { key: "pays", label: "pays" },
    { key: "fournisseur", label: "fournisseur" },
    { key: "prix_kg", label: "prix_kg" },
    { key: "devise", label: "devise" },
    { key: "valable_du", label: "valable_du" },
    { key: "valable_au", label: "valable_au" },
    { key: "note", label: "note" }
  ], rows);
}

function downloadStockTemplate() {
  const sampleBean = state.beans[0];
  const sampleCountry = getById("countries", sampleBean?.countryId);
  const sampleSupplier = getById("suppliers", sampleBean?.defaultSupplierId);
  const rows = [
    {
      grain: sampleBean?.commercialName || "Brésil Santos",
      pays: sampleCountry?.name || "Brésil",
      fournisseur: sampleSupplier?.name || "Importateur A",
      stock_kg: "120",
      commande_kg: "250",
      eta: addDays(today, 30),
      note: "Inventaire ou commande en cours"
    }
  ];

  downloadCsv(`modele-stocks-${today}.csv`, [
    { key: "grain", label: "grain" },
    { key: "pays", label: "pays" },
    { key: "fournisseur", label: "fournisseur" },
    { key: "stock_kg", label: "stock_kg" },
    { key: "commande_kg", label: "commande_kg" },
    { key: "eta", label: "eta" },
    { key: "note", label: "note" }
  ], rows);
}

async function importSuppliers(event) {
  event.preventDefault();

  const file = els.supplierImportFile.files[0];
  if (!file) return;

  const snapshot = createBusinessSnapshot();

  try {
    const text = await readFileAsText(file);
    const { suppliers, errors } = parseSupplierImport(text);

    if (suppliers.length === 0) {
      restoreBusinessSnapshot(snapshot);
      setImportStatus(els.supplierImportStatus, errors[0] || "Aucune ligne importable.", "warning");
      return;
    }

    let inserted = 0;
    let updated = 0;

    suppliers.forEach((supplier) => {
      const result = upsertSupplierFromImport(supplier);
      if (result === "inserted") inserted += 1;
      if (result === "updated") updated += 1;
    });

    sortImportedReferences();
    recordImport({
      type: "suppliers",
      fileName: file.name,
      inserted,
      updated,
      skipped: errors.length,
      errors,
      snapshot
    });
    await saveState();
    els.supplierImportForm.reset();
    renderAll();

    setImportStatus(
      els.supplierImportStatus,
      `${inserted} ajouté(s), ${updated} mis à jour${importErrorSuffix(errors)}.`,
      errors.length ? "warning" : "success"
    );
  } catch {
    restoreBusinessSnapshot(snapshot);
    setImportStatus(els.supplierImportStatus, "Import impossible.", "warning");
  }
}

async function importBeans(event) {
  event.preventDefault();

  const file = els.beanImportFile.files[0];
  if (!file) return;

  const snapshot = createBusinessSnapshot();

  try {
    const text = await readFileAsText(file);
    const { beans, errors } = parseBeanImport(text);

    if (beans.length === 0) {
      restoreBusinessSnapshot(snapshot);
      setImportStatus(els.beanImportStatus, errors[0] || "Aucune ligne importable.", "warning");
      return;
    }

    let inserted = 0;
    let updated = 0;

    beans.forEach((bean) => {
      const result = upsertBeanFromImport(bean);
      if (result === "inserted") inserted += 1;
      if (result === "updated") updated += 1;
    });

    sortImportedReferences();
    recordImport({
      type: "beans",
      fileName: file.name,
      inserted,
      updated,
      skipped: errors.length,
      errors,
      snapshot
    });
    await saveState();
    els.beanImportForm.reset();
    renderAll();

    setImportStatus(
      els.beanImportStatus,
      `${inserted} ajouté(s), ${updated} mis à jour${importErrorSuffix(errors)}.`,
      errors.length ? "warning" : "success"
    );
  } catch {
    restoreBusinessSnapshot(snapshot);
    setImportStatus(els.beanImportStatus, "Import impossible.", "warning");
  }
}

async function importHistoricalOrders(event) {
  event.preventDefault();

  const file = els.historyImportFile.files[0];
  if (!file) return;

  const snapshot = createBusinessSnapshot();

  try {
    const text = await readFileAsText(file);
    const { orders, errors } = parseHistoricalImport(text);

    if (orders.length === 0) {
      restoreBusinessSnapshot(snapshot);
      setImportStatus(els.historyImportStatus, errors[0] || "Aucune ligne importable.", "warning");
      return;
    }

    let inserted = 0;
    let updated = 0;

    if (els.historyImportMode.value === "replace") {
      state.historicalOrders = [];
    }

    orders.forEach((order) => {
      const existing = state.historicalOrders.find((item) => {
        return item.date === order.date && item.blendId === order.blendId && (item.channel || "mixte") === order.channel;
      });

      if (existing) {
        existing.roastedKg = order.roastedKg;
        updated += 1;
      } else {
        state.historicalOrders.push(order);
        inserted += 1;
      }
    });

    state.historicalOrders.sort((a, b) => b.date.localeCompare(a.date));
    recordImport({
      type: "history",
      fileName: file.name,
      mode: els.historyImportMode.value,
      inserted,
      updated,
      skipped: errors.length,
      errors,
      snapshot
    });
    await saveState();
    els.historyImportForm.reset();
    renderAll();

    const skipped = errors.length ? `, ${errors.length} ignorée(s)` : "";
    setImportStatus(els.historyImportStatus, `${inserted} ajoutée(s), ${updated} mise(s) à jour${skipped}.`, errors.length ? "warning" : "success");
  } catch {
    restoreBusinessSnapshot(snapshot);
    setImportStatus(els.historyImportStatus, "Import impossible.", "warning");
  }
}

async function importPrices(event) {
  event.preventDefault();

  const file = els.priceImportFile.files[0];
  if (!file) return;

  const snapshot = createBusinessSnapshot();

  try {
    const text = await readFileAsText(file);
    const { prices, errors } = parsePriceImport(text);

    if (prices.length === 0) {
      restoreBusinessSnapshot(snapshot);
      setImportStatus(els.priceImportStatus, errors[0] || "Aucune ligne importable.", "warning");
      return;
    }

    let inserted = 0;
    let updated = 0;

    if (els.priceImportMode.value === "replace") {
      state.prices = [];
    }

    prices.forEach((price) => {
      const existing = state.prices.find((item) => {
        return (
          item.beanId === price.beanId &&
          item.supplierId === price.supplierId &&
          item.validFrom === price.validFrom &&
          (item.validTo || null) === (price.validTo || null)
        );
      });

      if (existing) {
        existing.pricePerKg = price.pricePerKg;
        existing.currency = price.currency;
        existing.notes = price.notes;
        updated += 1;
      } else {
        const { closable, blocking } = splitPriceOverlaps(price);
        if (blocking.length > 0) {
          errors.push(`${priceScopeLabel(price)} ignoré : chevauchement avec ${blocking.slice(0, 2).map(pricePeriodLabel).join(", ")}.`);
          return;
        }
        closePreviousOpenPrices(closable, price.validFrom);
        state.prices.unshift(price);
        inserted += 1;
      }
    });

    state.prices.sort((a, b) => b.validFrom.localeCompare(a.validFrom));
    recordImport({
      type: "prices",
      fileName: file.name,
      mode: els.priceImportMode.value,
      inserted,
      updated,
      skipped: errors.length,
      errors,
      snapshot
    });
    await saveState();
    els.priceImportForm.reset();
    renderAll();

    const skipped = errors.length ? `, ${errors.length} ignorée(s)` : "";
    setImportStatus(els.priceImportStatus, `${inserted} ajouté(s), ${updated} mis à jour${skipped}.`, errors.length ? "warning" : "success");
  } catch {
    restoreBusinessSnapshot(snapshot);
    setImportStatus(els.priceImportStatus, "Import impossible.", "warning");
  }
}

async function importStocks(event) {
  event.preventDefault();

  const file = els.stockImportFile.files[0];
  if (!file) return;

  const snapshot = createBusinessSnapshot();

  try {
    const text = await readFileAsText(file);
    const { stocks, errors } = parseStockImport(text);

    if (stocks.length === 0) {
      restoreBusinessSnapshot(snapshot);
      setImportStatus(els.stockImportStatus, errors[0] || "Aucune ligne importable.", "warning");
      return;
    }

    stocks.forEach((stockRow) => {
      const quantityKg = els.stockImportMode.value === "reset" && !Number.isFinite(stockRow.quantityKg) ? 0 : stockRow.quantityKg;
      const incomingKg = els.stockImportMode.value === "reset" && !Number.isFinite(stockRow.incomingKg) ? 0 : stockRow.incomingKg;
      const snapshot = upsertStockSnapshot(stockRow.beanId, quantityKg, incomingKg, stockRow.eta);

      state.stockMovements.unshift({
        id: `movement-${crypto.randomUUID()}`,
        beanId: stockRow.beanId,
        type: "manual",
        date: today,
        quantity: Number(snapshot.quantityKg || 0),
        unit: "kg",
        supplierId: stockRow.supplierId,
        unitCost: null,
        currency: "EUR",
        eta: stockRow.eta,
        notes: stockRow.notes || "Import CSV stock"
      });
    });

    recordImport({
      type: "stocks",
      fileName: file.name,
      mode: els.stockImportMode.value,
      updated: stocks.length,
      skipped: errors.length,
      errors,
      snapshot
    });
    await saveState();
    els.stockImportForm.reset();
    renderAll();

    const skipped = errors.length ? `, ${errors.length} ignorée(s)` : "";
    setImportStatus(els.stockImportStatus, `${stocks.length} stock(s) mis à jour${skipped}.`, errors.length ? "warning" : "success");
  } catch {
    restoreBusinessSnapshot(snapshot);
    setImportStatus(els.stockImportStatus, "Import impossible.", "warning");
  }
}

async function undoLastImport() {
  const backup = state.lastImportBackup;
  if (!backup?.snapshot) return;

  const label = importTypeLabels[backup.type] || "import";
  const fileLabel = backup.fileName ? ` (${backup.fileName})` : "";
  if (!window.confirm(`Annuler le dernier import ${label}${fileLabel} ?`)) return;

  restoreBusinessSnapshot(backup.snapshot);
  state.importHistory = (state.importHistory || []).map((entry) => {
    if (entry.id !== backup.importId) return entry;
    return {
      ...entry,
      status: "undone",
      undoneAt: new Date().toISOString()
    };
  });
  state.lastImportBackup = null;

  await saveState();
  renderAll();
}

async function logout() {
  try {
    await fetch("/api/logout", {
      method: "POST",
      headers: { accept: "application/json" }
    });
  } finally {
    window.location.assign("/login");
  }
}

function normalizePath(pathname) {
  if (!pathname || pathname === "/") return "/";
  return pathname.replace(/\/+$/, "") || "/";
}

function routeToView(pathname) {
  const normalizedPath = normalizePath(pathname);
  if (dataRouteSections[normalizedPath]) return "data";
  return routeViews[normalizedPath] || "dashboard";
}

function routeToDataSection(pathname) {
  return dataRouteSections[normalizePath(pathname)] || defaultDataSection;
}

function activateDataSection(sectionId) {
  const activeSectionId = dataSectionRoutes[sectionId] ? sectionId : defaultDataSection;

  els.dataTabs.forEach((item) => {
    const isActive = item.dataset.dataSection === activeSectionId;
    item.classList.toggle("active", isActive);
    item.setAttribute("aria-selected", String(isActive));
  });

  els.dataSections.forEach((section) => {
    section.classList.toggle("active", section.dataset.dataSectionPanel === activeSectionId);
  });
}

function setupDataNavigation() {
  els.dataTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const sectionId = tab.dataset.dataSection;
      activateDataSection(sectionId);

      const route = dataSectionRoutes[sectionId] || dataSectionRoutes[defaultDataSection];
      if (normalizePath(window.location.pathname) !== route) {
        window.history.pushState({ viewId: "data", dataSection: sectionId }, "", route);
      }
    });
  });

  activateDataSection(routeToDataSection(window.location.pathname));
}

function setupNavigation() {
  function activateView(viewId) {
    els.navTabs.forEach((item) => item.classList.toggle("active", item.dataset.view === viewId));
    els.views.forEach((view) => view.classList.toggle("active", view.id === viewId));
  }

  function navigateToView(viewId) {
    activateView(viewId);
    if (viewId === "data") {
      activateDataSection(defaultDataSection);
    }

    const route = viewRoutes[viewId] || "/";
    if (normalizePath(window.location.pathname) !== route) {
      window.history.pushState({ viewId, dataSection: viewId === "data" ? defaultDataSection : undefined }, "", route);
    }
  }

  els.navTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      navigateToView(tab.dataset.view);
    });
  });

  window.addEventListener("popstate", () => {
    const viewId = routeToView(window.location.pathname);
    activateView(viewId);
    if (viewId === "data") {
      activateDataSection(routeToDataSection(window.location.pathname));
    }
  });

  const initialPath = normalizePath(window.location.pathname);
  const initialViewId = routeToView(initialPath);
  activateView(initialViewId);

  if (initialViewId === "data") {
    activateDataSection(routeToDataSection(initialPath));
  }

  if (initialViewId === "data" && !dataRouteSections[initialPath]) {
    window.history.replaceState({ viewId: "data", dataSection: defaultDataSection }, "", dataSectionRoutes[defaultDataSection]);
  } else if (initialViewId !== "data" && initialPath !== (viewRoutes[initialViewId] || "/")) {
    window.history.replaceState({ viewId: initialViewId }, "", viewRoutes[initialViewId] || "/");
  }
}

els.countryForm.addEventListener("submit", addCountry);
els.countryRows.addEventListener("click", deleteCountry);
els.supplierForm.addEventListener("submit", addSupplier);
els.cancelSupplierEdit.addEventListener("click", resetSupplierForm);
els.supplierRows.addEventListener("click", handleSupplierRowsClick);
els.beanForm.addEventListener("submit", addBean);
els.cancelBeanEdit.addEventListener("click", resetBeanForm);
els.beanRows.addEventListener("click", handleBeanRowsClick);
els.blendForm.addEventListener("submit", addBlend);
els.cancelBlendEdit.addEventListener("click", resetBlendForm);
els.addBlendComponent.addEventListener("click", createBlendComponentRow);
els.blendComponents.addEventListener("click", removeBlendComponentRow);
els.blendRows.addEventListener("click", handleBlendRowsClick);
els.stockForm.addEventListener("submit", updateStock);
els.historyForm.addEventListener("submit", addHistoricalOrder);
els.cancelHistoryEdit.addEventListener("click", resetHistoryForm);
els.historyRows.addEventListener("click", handleHistoryRowsClick);
els.countryName.addEventListener("change", syncSelectedCountryRegion);
els.quickPurchaseCategory.addEventListener("change", syncQuickPurchaseCategory);
els.quickPurchaseForm.addEventListener("submit", addQuickPurchase);
els.otherSupplyRows.addEventListener("click", deleteOtherSupply);
els.priceForm.addEventListener("submit", addPrice);
els.priceRows.addEventListener("click", deletePrice);
els.calculatorForm.addEventListener("submit", runCalculator);
els.forecastForm.addEventListener("submit", runForecast);
els.batchForm.addEventListener("submit", addBatch);
els.exportCsvButtons.forEach((button) => button.addEventListener("click", exportCsv));
els.undoLastImport.addEventListener("click", undoLastImport);
els.supplierImportForm.addEventListener("submit", importSuppliers);
els.downloadSupplierTemplate.addEventListener("click", downloadSupplierTemplate);
els.beanImportForm.addEventListener("submit", importBeans);
els.downloadBeanTemplate.addEventListener("click", downloadBeanTemplate);
els.historyImportForm.addEventListener("submit", importHistoricalOrders);
els.downloadHistoryTemplate.addEventListener("click", downloadHistoryTemplate);
els.priceImportForm.addEventListener("submit", importPrices);
els.downloadPriceTemplate.addEventListener("click", downloadPriceTemplate);
els.stockImportForm.addEventListener("submit", importStocks);
els.downloadStockTemplate.addEventListener("click", downloadStockTemplate);
els.logoutButton.addEventListener("click", logout);

async function initializeApp() {
  setupNavigation();
  setupDataNavigation();
  await loadState();
  setupDefaults();
  renderAll();
  renderCalculation(calculateBlend(els.calcBlend.value, els.calcDate.value), calculateBlend(els.calcBlend.value, els.compareDate.value));
}

void initializeApp();
