let fcm = {
  lambda: 5,
  
  tMax: 10,
  
  connMtx: [
    [0, 1, 1, -1, 1, -0.484304],
    [0.790687, 0, 1, -1, 1, -1],
    [-0.092198, 1, 0, -1, 1, -1],
    [-0.541233, 0.663399, -1, 0, 1, -1],
    [1, 1, 1, -1, 0, -1],
    [-0.351297, 0.763554, -1, -1, 1, 0]
  ],
  
  t0: [
    [0.2], 
    [0.15], 
    [0.1], 
    [0.1], 
    [0.1], 
    [0.1]
  ],
  
  mtxMul: function(left, right) {
    let i = left.length; // Rows of left matrix and result matrix
    let j = right[0].length; // Columns of right matrix and res. matrix
    let k = right.length; // Columns of left matrix and rows of right matrix
    let res = [];
    for(let r=0; r<i; r++) {
        let resRow = [];
        for(let c=0; c<j; c++) {
            let val = 0;
            for(let item=0; item<k; item++) {
                val += left[r][item]*right[item][c];
            }
            resRow.push(val);
        }
        res.push(resRow);
    }
    return res;
  },
  
  threshold: function(vector) {
    for(let key in vector) {
      vector[key][0] = 1/(1+Math.exp(-this.lambda*vector[key][0]));
    }
    return vector;
  },
  
  simulation: function() {
    let states = [this.t0];
    let currentState = this.t0;
    for(let t=0; t<this.tMax; t++) {
      currentState = this.threshold(this.mtxMul(this.connMtx, currentState));
      states.push(currentState);
    }
    return states;
  }
};

function createTable(mtx, title) {
  let table = document.createElement("table");
  let caption = document.createElement("caption");
  caption.textContent = title;
  table.appendChild(caption);
  for(let rowKey in mtx) {
    let row = document.createElement("tr");
    for(let colKey in mtx[rowKey]) {
      let data = document.createElement("td");
      data.textContent = (+mtx[rowKey][colKey]).toFixed(6);
      row.appendChild(data);
    }
    table.appendChild(row);
  }
  return table;
}

window.addEventListener("load", function() {
  document.body.appendChild(
    createTable(fcm.connMtx, "Connection matrix")
  );
  document.body.appendChild(
    createTable(fcm.t0, "Initial state")
  );
  document.body.appendChild(
    createTable(fcm.simulation(), "Simulation results")
  );
}, false);
