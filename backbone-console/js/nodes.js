function createNode(id, type, modalities) {
  return {
    id,
    type,
    modalities,
    power: { ac: false, dc: true },
    routing: { rf: true, optical: true, kinetic: true, gas: true },
    quarantine: false,
    lastSeen: new Date().toISOString()
  };
}

// Seed nodes
Backbone.nodes = [
  createNode("NODE-PCB-01", "PCB", ["AC","DC","RF","OPT","KIN","ADV"]),
  createNode("NODE-UAV-01", "UAV", ["DC","RF","OPT","UV","KIN","GAS","ADV"]),
  createNode("NODE-SAT-01", "SAT", ["DC","RF","OPT","ADV"]),
  createNode("NODE-GREEN-01", "GREENHOUSE", ["AC","DC","GAS","KIN"])
];

function renderNodes() {
  const list = document.getElementById("nodeList");
  list.innerHTML = "";

  Backbone.nodes.forEach(node => {
    const div = document.createElement("div");
    div.textContent = `${node.id} · ${node.type}`;
    div.onclick = () => selectNode(node.id);
    list.appendChild(div);
  });
}

function selectNode(id) {
  Backbone.selectedNode = Backbone.nodes.find(n => n.id === id);
  document.getElementById("nodeDetail").textContent = `Selected: ${id}`;
}

function commandNode(type, payload) {
  const node = Backbone.selectedNode;
  if (!node) return logEvent("ERR", "No node selected");

  logEvent("CMD", `${node.id} ${type} ${JSON.stringify(payload)}`);
}
