function logEvent(tag, msg) {
  const log = document.getElementById("eventLog");
  const entry = document.createElement("div");
  entry.textContent = `[${new Date().toISOString()}] ${tag}: ${msg}`;
  log.prepend(entry);
}

function injectAdversary() {
  const candidates = Backbone.nodes.filter(n => n.modalities.includes("ADV"));
  if (!candidates.length) return logEvent("ADV", "No adversary surfaces");

  const node = candidates[Math.floor(Math.random() * candidates.length)];
  const event = ["RF_JAM","OPT_SPOOF","KIN_SHOCK","GAS_SPIKE"][Math.floor(Math.random()*4)];

  logEvent("ADV", `${node.id} ${event}`);
}
