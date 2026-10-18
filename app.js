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
  const inputHumidity = document.getElementById("humidity");

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
    //#region counters info
    queueCount.textContent = records.length;

    optimalTotal.textContent = records.filter(
      (p) => p.status.level == "optimal",
    ).length;

    warningTotal.textContent = records.filter(
      (p) => p.status.level == "warning",
    ).length;

    criticalTotal.textContent = records.filter(
      (p) => p.status.level == "critical",
    ).length;

    //#endregion

    if (records.length === 0) {
      emptyState.classList.remove("hidden");
      recordsList.innerHTML = "";
      return;
    }

    // if not empty
    emptyState.classList.add("hidden");

    // create a virtual DOM.
    const fragment = document.createDocumentFragment();

    // create the sensor cards
    records.forEach((rec) => {
      const li = document.createElement("li");
      li.className = "sensor-card status-" + rec.status.level;

      // create dynamic card
      li.innerHTML = `
      <div class="card-top">
            <div class="card-header">
                <div class="sensor-name-text">${escapeHtml(rec.name)} 
                <p class="timestamp"> Logged at ${rec.timestamp} </p> 
                </div>
                
                <span class="risk-badge ${rec.status.level}">${rec.status.label}</span>            
            </div>

            <div class="data-stats">
              <div class="stat-item"><span>pH</span>${rec.ph}</div>
              <div class="stat-item"><span>Electrical Conductivity</span>${rec.ec} mS/cm </div>
              <div class="stat-item"><span>Relative Humidity</span>${rec.rh}% </div>
              <div class="stat-item"><span>Temperature</span>${rec.temp.toFixed(1)} F </div> 
            </div>
            <button class="btn btn-outline-danger btn-sm btn-discharge" data-id="${rec.id}">Delete Entry</button>        
        
        </div>`;
      // add the above html to the virtual dom
      fragment.appendChild(li);
    });

    // reset the UI
    recordsList.innerHTML = "";

    recordsList.appendChild(fragment);
  }

  // procsesing logic - to create dynamic badges for classification
  function evaluateRisk(ph, ec, temp, rh) {
    if (
      (ph < 5 || ph > 7.5) &&
      (ec < 0.2 || ec > 4.5) &&
      (rh < 30 || rh > 90) &&
      (temp < 55 || temp > 95)
    ) {
      return { level: "critical", label: "Critical Hazard" };
    }
    if (
      ph >= 5.5 &&
      ph <= 6.5 &&
      temp >= 64.4 &&
      temp <= 71.6 &&
      ec >= 1.0 &&
      ec <= 2.0 &&
      rh >= 50 &&
      rh <= 70
    ) {
      return { level: "optimal", label: "Optimal" };
    }
    return { level: "warning", label: "Warning" };
  }

  // Input form validation:
  function validateInput(data) {
    const errors = [];

    // start the error validation
    if (!data.name.trim()) {
      errors.push("Sensor Name is a required Field");
    }
    if (isNaN(data.ph) || data.ph < 0.0 || data.ph > 14.0) {
      errors.push("pH must be a number and between 0 to 14");
    }
    if (isNaN(data.ec) || data.ec < 0 || data.ec > 5.0) {
      errors.push(
        "Electrical Conductivity must be a number and between 0 to 5 mS/cm",
      );
    }
    if (isNaN(data.temp) || data.temp < 50.0 || data.temp > 100.0) {
      errors.push("Temperature must be a number and between 50 to 100 F");
    }
    if (isNaN(data.rh) || data.rh < 20 || data.rh > 100) {
      errors.push("Relative Humidity must be a number and between 20 to 100 %");
    }

    return errors;
  }

  /////////// event handlers /////////////

  sensorForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = {
      id: crypto.randomUUID(),
      name: inputName.value,
      ph: parseFloat(inputPh.value),
      ec: parseFloat(inputConductivity.value),
      rh: parseFloat(inputHumidity.value),
      temp: parseFloat(inputTemp.value),
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const validationErrors = validateInput(formData);

    if (validationErrors.length > 0) {
      displayError(validationErrors.join(" "));
      return;
    }

    hideError();

    // classify risk level
    formData.status = evaluateRisk(
      formData.ph,
      formData.ec,
      formData.temp,
      formData.rh,
    );

    records.unshift(formData);

    // commit this to the memory
    saveRecords();

    // reset the user form after data is committed to data store
    sensorForm.reset();

    // bring the input focus to the first input field
    inputName.focus();

    //refresh record list UI
    render();
  });

  recordsList.addEventListener("click", function (event) {
    // identify which card's delete btn was clicked
    const target = event.target;
    if (target.classList.contains("btn-discharge")) {
      const recordId = target.dataset.id;
      records = records.filter((record) => record.id !== recordId);
      saveRecords();
      render();
    }
  });

  // delete all event
  btnClearAll.addEventListener("click", (event) => {
    if (records.length === 0) return;
    if (confirm("Are you sure you want to delete all patient records?")) {
      records = [];
      saveRecords();
      render();
    }
  });

  // dynamically show error msg
  function displayError(message) {
    errorBanner.textContent = message;
    errorBanner.classList.remove("hidden");
  }

  // dynamically hide the error msg on correct input
  function hideError() {
    errorBanner.textContent = "";
    errorBanner.classList.add("hidden");
  }

  // sanitize input
  function escapeHtml(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
})();
