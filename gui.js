let gui = {
  // creates the DOM <table> node of a connection matrix
  showConnMtx: function(mtx, title) {
    let table = document.createElement("table");
    let caption = document.createElement("caption");
    caption.textContent = title;
    table.appendChild(caption);
    let row = document.createElement("tr");
    let data = document.createElement("th");
    row.appendChild(data);
    mtx[0].forEach(function(value, key) {
      data = document.createElement("th");
      data.textContent = "C" + (key+1);
      row.appendChild(data);
    });
    table.appendChild(row);
    mtx.forEach((value, key) => {
      row = document.createElement("tr");
      data = document.createElement("th");
      data.textContent = "C" + (key+1);
      row.appendChild(data);
      value.forEach((v, k) => {
        data = document.createElement("td");
        data.textContent = (+v).toFixed(6);
        row.appendChild(data);
      });
      table.appendChild(row);
    });
    return table;
  },
  
  // creates the DOM <table> node of an initial state
  showInitialState: function(mtx, title) {
    let table = document.createElement("table");
    let caption = document.createElement("caption");
    caption.textContent = title;
    table.appendChild(caption);
    let row1 = document.createElement("tr");
    let row2 = document.createElement("tr");
    mtx.forEach((value, key) => {
      let head = document.createElement("th");
      head.textContent = "C" + (key+1);
      row1.appendChild(head);
      let data = document.createElement("td");
      data.textContent = (+value[0]).toFixed(6);
      row2.appendChild(data);
    });
    table.appendChild(row1);
    table.appendChild(row2);
    return table;
  },
  
  // creates the DOM <table> node of simulation results (activation vector for all calculated time steps)
  showSimulationResults: function(mtx, title) {
    let table = document.createElement("table");
    let caption = document.createElement("caption");
    caption.textContent = title;
    table.appendChild(caption);
    let row = document.createElement("tr");
    let data = document.createElement("th");
    data.textContent = "t";
    row.appendChild(data);
    mtx[0].forEach(function(value, key) {
      data = document.createElement("th");
      data.textContent = "C" + (key+1);
      row.appendChild(data);
    });
    table.appendChild(row);
    mtx.forEach((vr, kr) => {
      row = document.createElement("tr");
      data = document.createElement("th");
      data.textContent = kr;
      row.appendChild(data);
      vr.forEach((vc, kc) => {
        data = document.createElement("td");
        data.textContent = (+vc).toFixed(6);
        row.appendChild(data);
      });
      table.appendChild(row);
    });
    return table;
  }

};

window.addEventListener("load", function() {
  document.body.appendChild(
    gui.showConnMtx(fcm.connMtx, "Connection matrix")
  );
  document.body.appendChild(
    gui.showInitialState(fcm.t0, "Initial state")
  );
  document.body.appendChild(
    gui.showSimulationResults(fcm.simulation(), "Simulation results")
  );
}, false);
