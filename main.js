window.addEventListener("load", function() {
  document.body.appendChild(
    gui.createConnMtx(fcm.connMtx, "Connection matrix")
  );
  document.body.appendChild(
    gui.createInitialState(fcm.t0, "Initial state")
  );
  fcm.simulation();
  let outcome = fcm.getOutcome();
  if(outcome == fcm.FP) {
    document.body.appendChild(
      gui.createParagraph("The simulation led to a fixed-point attractor.")
    );
    document.body.appendChild(
      gui.createInitialState(fcm.getFP(), "Fixed-point attractor")
    );
  } else if(outcome == fcm.LC) {
    document.body.appendChild(
      gui.createParagraph("The simulation led to a limit cycle.")
    );
    document.body.appendChild(
      gui.createSimulationResults(fcm.getLC(), "State vectors of the limit cycle")
    );
  } else {
    document.body.appendChild(
      gui.createParagraph("The model behaved chaotically.")
    );
  }
  document.body.appendChild(
    gui.createSummary("You can see all time steps of the simulation by clicking here if you're interested in",
      gui.createSimulationResults(fcm.getSimulationResult(), "Simulation results"))
  );
}, false);
