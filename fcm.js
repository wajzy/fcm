let fcm = {
  lambda: 5,
  
  tMax: 100,
  
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
    let stable = false;
    this.outcome.init(this.connMtx.length);
    for(let t=0; !stable && t<this.tMax; t++) {
      currentState = this.threshold(this.mtxMul(this.connMtx, currentState));
      states.push(currentState);
      this.outcome.refreshWindows(currentState);
      stable = this.outcome.isStable();
    }
    return states;
  },
  
  outcome: {
    concepts: 0,
    windowSize: 5,
    windows: null,
    stabilityLimit: 1e-13,
    
    init: function(concepts) {
      this.concepts = concepts;
      this.windows = [];
      for(let i=0; i<this.concepts; i++) {
        this.windows.push([]);
      }
    },
  
    refreshWindows: function(mtx) {
      mtx.forEach((value, key) => {
        let window = this.windows[key];
        window.push(value[0]);
        if(window.length > this.windowSize) {
          window.shift();
        }
      });
    },
  
    isStable: function() {
      if(this.windows[0].length < this.windowSize) {
        return false;
      } else {
        let allStable = true;
        for(let i=0; allStable && i<this.windows.length; i++) {
          let window = this.windows[i];
          let sumSqr = 0;
          let sum = 0;
          window.forEach((value) => {
            sumSqr += value*value;
            sum += value;
          });
          let stdDev = (sumSqr - sum*sum/this.windowSize)/this.windowSize;
          if(stdDev > this.stabilityLimit) {
            allStable = false;
          }
        }
        return allStable;
      }
    }
  }
};
