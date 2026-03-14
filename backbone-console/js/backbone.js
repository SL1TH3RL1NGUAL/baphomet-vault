// Backbone global state
const Backbone = {
  ac: 230,
  dc: 24,
  rf: 915,
  optical: "UV-A",
  kinetic: "IDLE",
  gas: 420,
  nodes: [],
  selectedNode: null
};

// Apply backbone state
function applyBackboneState() {
  Backbone.ac = Number(document.getElementById("acGrid").value);
  Backbone.dc = Number(document.getElementById("dcBackbone").value);
  Backbone.rf = Number(document.getElementById("rfBand").value);
  Backbone.optical = document.getElementById("optChannel").value;
  Backbone.kinetic = document.getElementById("kinMode").value;
  Backbone.gas = Number(document.getElementById("gasField").value);

  document.getElementById("backboneState").textContent =
    `AC ${Backbone.ac}V · DC ${Backbone.dc}V · RF ${Backbone.rf}MHz · OPT ${Backbone.optical} · KIN ${Backbone.kinetic} · GAS ${Backbone.gas}ppm`;

  logEvent("INFO", "Backbone state updated");
}
