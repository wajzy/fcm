let fcm = {
  lambda: 5, // steepness of threshold function
  tMax: 500, // max. number of simulation time steps to calculate
  
  // connection matrix
  connMtx: [ 
    [0, 1, 1, -1, 1, -0.484304],
    [0.790687, 0, 1, -1, 1, -1],
    [-0.092198, 1, 0, -1, 1, -1],
    [-0.541233, 0.663399, -1, 0, 1, -1],
    [1, 1, 1, -1, 0, -1],
    [-0.351297, 0.763554, -1, -1, 1, 0]
  ],
  
  // initial state of the model
  t0: [
    [0.2], 
    [0.15], 
    [0.1], 
    [0.1], 
    [0.1], 
    [0.1]
  ],
  
  // these member variables should be constants
  FP: 0, // fixed-poin attractor
  LC: 1, // limit cycle
  CB: 2, // chaotic behavior
  
  simulationResult: null, // result of the last simulation
  limitCycle: null, // state vectors of the limit cycle, if it is found
  
  // matrix multiplication
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
  
  // sigmoidal (logistic) threshold function
  threshold: function(vector) {
    for(let key in vector) {
      vector[key][0] = 1/(1+Math.exp(-this.lambda*vector[key][0]));
    }
    return vector;
  },
  
  // executes a simulation. Stops automatically before 'tMax' if 
  // the activation values of all concepts are considered stable.
  simulation: function() {
    this.simulationResult = [this.t0];
    let currentState = this.t0;
    let stable = false;
    this.stability.init(this.connMtx.length);
    for(let t=0; !stable && t<this.tMax; t++) {
      currentState = this.threshold(this.mtxMul(this.connMtx, currentState));
      this.simulationResult.push(currentState);
      this.stability.refreshWindows(currentState);
      stable = this.stability.isStable();
    }
  },
  
  // return the last simulation's complete time series data
  getSimulationResult: function() {
    return this.simulationResult;
  },
  
  // returns the fixed-point attractor, if exists (last state vector of simulation data)
  getFP: function() {
    return this.simulationResult.slice(-1)[0];
  },
  
  // returns the limit cycle, if exists (call findLC() first to look for it)
  getLC: function() {
    return this.limitCycle;
  },
  
  // compares two arrays with a predetermined precision
  isEqual: function(a1, a2) {
    let n = Math.min(a1.length, a2.length);
    let equal = true;
    for(let i=0; equal && i<n; i++) {
      if(Math.abs(a1[i]-a2[i]) > 1e-3) {
        equal = false;
      }
    }
    return equal;
  },
  
  // searches for a limit cycle and stores it in the 'limitCycle' member if it is found
  findLC: function() {
    let lastState = this.simulationResult.slice(-1)[0][0];
    let equalFound = false;
    let seqEnd;
    let lastPossible = Math.floor((this.simulationResult.length-1)/2);
    for(seqEnd=this.simulationResult.length-2; seqEnd>=lastPossible && !equalFound;) {
      if(this.isEqual(lastState, this.simulationResult[seqEnd][0])) {
        equalFound = true;
      } else {
        seqEnd--;
      }
    }
    if(equalFound) {
      if(seqEnd == this.simulationResult.length-2) { // the last states are equal; it is a FP
        this.limitCycle = null;
      } else {
        let cycle = true;
        let i, j;
        for(i=seqEnd-1, j=this.simulationResult.length-2; cycle && j>seqEnd; i--, j--) {
          cycle = isEqual(this.simulationResult[i][0], this.simulationResult[j][0]);
        }
        if(cycle) {
          this.limitCycle = this.simulationResult.slice(-(this.simulationResult.length-seqEnd-1));
        } else { // even if there are two identical state vectors, other vectors between them are different
          this.limitCycle = null;
        }
      }
    } else { // all investigated state vectors are unique
      this.limitCycle = null;
    }
  },

  // tells simulation outcome, and returns a value according to FP, LC or CB
  getOutcome: function() {
    if(this.simulationResult.length < this.tMax+1) {
      this.findLC();
      if(this.limitCycle != null) {
        return this.LC;
      } else {
        return this.FP;
      }
    } else {
      return this.CB;
    }
  },
  
  // detects the stability of concept states
  stability: {
    concepts: 0, // number of concepts
    windowSize: 5, // number of stored, consecutive concept states
    windows: null, // array of concept state objects; all concepts have a specific object to record it's state and speed-up the calculation of the std. dev. of the last states
    stabilityLimit: 1e-13, // upper limit on concept states' standard deviation
    
    // initializes the 'windows'
    init: function(concepts) {
      this.concepts = concepts;
      this.windows = [];
      for(let i=0; i<this.concepts; i++) {
        this.windows.push({
          sumSqr: 0, // square of stored state values
          sum: 0,    // sum of stored state values
          states: [] // stored state values
        });
      }
    },
  
    // refreshes the content of 'windows'
    // stores the last concept state, updates the sum and sum of squares
    // erases the oldest state if the number of stored states exceeds 'windowSize'
    refreshWindows: function(mtx) {
      mtx.forEach((value, key) => {
        let window = this.windows[key];
        window.states.push(value[0]);
        window.sumSqr += value[0]*value[0];
        window.sum += value[0];
        if(window.states.length > this.windowSize) {
          let old = window.states.shift();
          window.sumSqr -= old*old;
          window.sum -= old;
        }
      });
    },
  
    // detect the stability of the fcm model
    // The model is considered stable if all of its concepts are stable
    // A concept is considered stable if the std. dev. of the last 'windowSize' states is not greater than 'stabilityLimit'
    isStable: function() {
      if(this.windows[0].states.length < this.windowSize) {
        return false;
      } else {
        let allStable = true;
        for(let i=0; allStable && i<this.windows.length; i++) {
          let window = this.windows[i];
          let stdDev = (window.sumSqr - window.sum*window.sum/this.windowSize)/this.windowSize;
          if(stdDev > this.stabilityLimit) {
            allStable = false;
          }
        }
        return allStable;
      }
    }
  }
};
