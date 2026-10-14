(function () {
  "use strict()";

  const STORAGE_KEY = "greenhouse_sensor_records_v1";

  // Bringing the DOM elements
  const sensorForm = document.getElementById("sensor-form");
  const errorBanner = document.getElementById("form-error-banner");
  const recordsList = document.getElementById("records-list");
  const emptyState = document.getElementById("empty-state");
  const btnClearAll = document.getElementById("btn-clear-all");
  const btnSubmit = document.getElementById("btn-submit");

  //information overview
  const queueCount = document.getElementById("queue-count");
  const optimalTotal = document.getElementById("optimal-total");
  const warningTotal = document.getElementById("warning-total");
  const criticalTotal = document.getElementById("critical-total");

  // grab the input field within the html form
  const inputName = document.getElementById("sensor-name");
  const inputPh = document.getElementById("ph");
  const inputConductivity = document.getElementById("conductivity");
  const inputTemp = document.getElementById("temp");
  const inputSpo2 = document.getElementById("spo2");

  // initial the state
  let records = loadRecords();

  // initial UI call/ render
  render();

  //   STORAGE OPS: READ AND WRITE TO STORE

  //   READ operations
  function loadRecords() {
    try {
      // establish connection with your data store
      const stored = localStorage.getItem(STORAGE_KEY);
      // check if anything was returned or if store is empty
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Failed to load records from your data store", error);
      return [];
    }
  }

  //   WRITE operation to the data store
  function saveRecords() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    } catch (error) {
      console.error("Failed to write to your data store", error);
    }
  }

  //   DOM RENDER FUNCTION BODY
  function render() {
    queueCount.textContent = records.length;

    //#region  this was newly imlemented. must check later if it works.
    // side note: the levels should be nums not strings to avoid typos later or maybe a tuple?
    optimalTotal.textContent = records.where(
      (p) => p.status.level == "optimal",
    ).length;

    warningTotal.textContent = records.where(
      (p) => p.status.level == "warning",
    ).length;

    criticalTotal.textContent = records.where(
      (p) => p.status.level == "critical",
    ).length;

    //#endregion

    if (records.length === 0) {
      emptyState.classList.remove("hidden");
      recordsList.innerHTML = "";
      return;
    }

    // if not emppty
    emptyState.classList.add("hidden");

    // create a virtual DOM.
    const fragment = document.createDocumentFragment();

    // create the sensor cards
    records.forEach(function (rec) {
      const li = document.createElement("li");
      li.className = "sensor-card status-" + rec.status.level;

      // create our dynamic card
      //
      li.innerHTML = `<div class="card-top">
            <div>
                <div class="sensor-name-text">${escapeHtml(rec.name)} </div>
                <div class="timestamp">Logged at ${rec.timestamp} </div> 
                <span class="risk-badge ${rec.risk.level}">${rec.risk.label}</span>            
            </div>

            // vitals starts here
        
        </div>`;
    });

    // Write the body of escapeHtml*() here!!!
  }
})();
