'use strict';
let gui;

$(document).ready(function(){
  // enables bootstrap popups
  $('[data-toggle="tooltip"]').tooltip();
  
  gui = new GUI();
});

// chart.js example
var ctx = document.getElementById('myChart').getContext('2d');
var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['0', '1', '2', '3'],
        datasets: [{
            label: 'C1',
            data: [0, 0.25, 0.45, 0.55],
            borderColor: 'rgb(255, 0, 0)',
            fill: false
        },
        {
            label: 'C2',
            data: [1, 0.66, 0.5, 0.45],
            borderColor: 'rgb(0, 0, 255)',
            fill: false
        }]
    },
    options: {}
});

class GUI {
  constructor() {
    $("#modelNew").click(this.modelNew);
    $("#conceptsNext").click(this.conceptsNext);
    $("#conceptsLambda").change(this.conceptsLambdaChange);
  }
  
  modelNew() {
    $("#models").hide();
    $("#concepts").show();
  }
  
  conceptsNext() {
  }
  
  conceptsLambdaChange() {
    let invalid = $("#conceptsLambdaInvalid");
    if($("#conceptsLambda").val() == 0) {
      invalid.show();
    } else {
      invalid.hide();
    }
  }
}
