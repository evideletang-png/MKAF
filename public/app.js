const STORAGE_KEY = "cout-cafe-prototype-v1";

const today = new Date().toISOString().slice(0, 10);

const seedState = {
  countries: [
    { id: "country-br", name: "Bresil", region: "Amerique latine" },
    { id: "country-co", name: "Colombie", region: "Amerique latine" },
    { id: "country-et", name: "Ethiopie", region: "Afrique" }
  ],
  suppliers: [
    { id: "supplier-a", name: "Importateur A", defaultCurrency: "EUR" },
    { id: "supplier-b", name: "Importateur B", defaultCurrency: "EUR" }
  ],
  beans: [
    {
      id: "bean-bresil-santos",
      commercialName: "Bresil Santos",
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
      process: "lave"
    },
    {
      id: "bean-ethiopie-sidamo",
      commercialName: "Ethiopie Sidamo",
      countryId: "country-et",
      defaultSupplierId: "supplier-b",
      species: "arabica",
      process: "lave"
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
      notes: "Renego fevrier"
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
  batches: []
};

let state = loadState();

const els = {
  navTabs: document.querySelectorAll(".nav-tab"),
  views: document.querySelectorAll(".view"),
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

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return structuredClone(seedState);

  try {
    return { ...structuredClone(seedState), ...JSON.parse(raw) };
  } catch {
    return structuredClone(seedState);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
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
        message: `Cout ${formatMoney(result.totalCostPerKg)} au-dessus du seuil ${formatMoney(blend.maxCostPerKg)}`
      });
    }

    if (blend.targetSalePricePerKg && result.marginPct < 55) {
      alerts.push({
        severity: "warning",
        title: blend.name,
        message: `Marge estimee basse : ${formatPct(result.marginPct)}`
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
        title: "Tarif bientot expire",
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
  const latestBatch = state.batches[0];

  els.metrics.innerHTML = [
    ["Grains suivis", state.beans.length, "References cafe vert"],
    ["Tarifs saisis", state.prices.length, `${validPrices.length} actifs aujourd'hui`],
    ["Assemblages", state.blends.length, "Recettes surveillees"],
    ["Dernier batch", latestBatch ? formatMoney(latestBatch.frozenTotalCostPerKg) : "-", latestBatch ? latestBatch.productionDate : "Aucun batch"]
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
        <span>Les tarifs et seuils sont coherents pour la date du jour.</span>
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
      <span>Cout matiere cafe vert / kg</span>
    </div>
    <div class="result-card">
      <strong>${formatMoney(result.roastedCostPerKg)}</strong>
      <span>Cout apres perte de torrefaction (${formatPct(result.lossPct)})</span>
    </div>
    <div class="result-card">
      <strong>${formatMoney(result.totalCostPerKg)}</strong>
      <span>Cout total avec frais (${formatMoney(result.fees)})</span>
    </div>
    <div class="result-card">
      <strong>${formatMoney(result.margin)} / ${formatPct(result.marginPct)}</strong>
      <span>Marge estimee sur prix cible</span>
    </div>
    <div class="result-card">
      <strong>${deltaLabel}</strong>
      <span>Variation vs date comparee</span>
    </div>
  `;

  els.calcLines.innerHTML = renderLinesTable(result.lines);
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
        <td colspan="5">Aucun batch fige pour le moment.</td>
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
  renderBatches();
  renderDataTables();
}

function setupDefaults() {
  els.priceFrom.value = today;
  els.calcDate.value = "2026-02-15";
  els.compareDate.value = "2026-01-15";
  els.batchDate.value = today;
  els.batchQuantity.value = "20";
}

function addPrice(event) {
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
    window.alert("Le prix doit etre superieur a 0.");
    return;
  }

  if (price.validTo && price.validTo < price.validFrom) {
    window.alert("La date de fin doit etre apres la date de debut.");
    return;
  }

  state.prices.unshift(price);
  saveState();
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

function addBatch(event) {
  event.preventDefault();

  const actualLoss = els.batchLoss.value ? Number(els.batchLoss.value) : null;
  const result = calculateBlend(els.batchBlend.value, els.batchDate.value, actualLoss);
  const quantity = Number(els.batchQuantity.value);

  if (result.status !== "ok") {
    window.alert(`Impossible de figer le batch : ${result.errors.join(" | ")}`);
    return;
  }

  if (!quantity || quantity <= 0) {
    window.alert("La quantite doit etre superieure a 0.");
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
  saveState();
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

function resetDemo() {
  const ok = window.confirm("Reinitialiser les donnees de demonstration ?");
  if (!ok) return;
  state = structuredClone(seedState);
  saveState();
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
els.batchForm.addEventListener("submit", addBatch);
els.exportData.addEventListener("click", exportData);
els.resetDemo.addEventListener("click", resetDemo);

setupNavigation();
setupDefaults();
renderAll();
renderCalculation(calculateBlend(els.calcBlend.value, els.calcDate.value), calculateBlend(els.calcBlend.value, els.compareDate.value));
