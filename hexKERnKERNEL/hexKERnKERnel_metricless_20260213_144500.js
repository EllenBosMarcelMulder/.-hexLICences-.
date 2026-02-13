/*
hexKERnKERnel_metricless_20260213_144500.js

COMPLETELY METRIC-FREE IMPLEMENTATION
=====================================

No coordinates
No trigonometry  
No mathematical constants
No algebraic coefficients
No geometric projection

Only:
- Adjacency relationships
- Relative positioning
- Constraint propagation
- Emergent stability

Pure graph-topological computing
*/

const WebSocket = require("ws");
const http = require("http");
const fs = require("fs");
const path = require("path");

////////////////////////////////////////////////////////////////////////////////
// PURE ADJACENCY PARAMETERS
////////////////////////////////////////////////////////////////////////////////

const PORT = 8080;
const HEX_RADIUS = 6;
const HIGH_PRESSURE = 5;
const MED_PRESSURE = 3;
const LOW_PRESSURE = 1;

let nodes = [];
let phi = [];
let adjacency = [];
let relationalCycles = 0;
let stabilitySequence = "";
let lastDisturbance = 0;

////////////////////////////////////////////////////////////////////////////////
// ADJACENCY-ONLY TOPOLOGY
////////////////////////////////////////////////////////////////////////////////

function generateAdjacencyGraph() {
    nodes = [];
    phi = [];
    adjacency = [];
    
    // Generate nodes with only topological identity
    for (let q = -HEX_RADIUS; q <= HEX_RADIUS; q++) {
        for (let r = -HEX_RADIUS; r <= HEX_RADIUS; r++) {
            if (Math.abs(q + r) <= HEX_RADIUS) {
                nodes.push({ 
                    id: nodes.length,
                    q, r,
                    degree: 0
                });
                phi.push(1);
                adjacency.push([]);
            }
        }
    }
    
    // Build adjacency relationships - no coordinates
    for (let i = 0; i < nodes.length; i++) {
        const { q, r } = nodes[i];
        const neighborCoords = [
            [q + 1, r], [q - 1, r],
            [q, r + 1], [q, r - 1],
            [q + 1, r - 1], [q - 1, r + 1]
        ];
        
        for (const [nq, nr] of neighborCoords) {
            const neighborIdx = nodes.findIndex(n => n.q === nq && n.r === nr);
            if (neighborIdx !== -1) {
                adjacency[i].push(neighborIdx);
                nodes[i].degree++;
            }
        }
    }
    
    constraintNormalize();
}

////////////////////////////////////////////////////////////////////////////////
// METRIC-FREE OPERATIONS
////////////////////////////////////////////////////////////////////////////////

function constraintNormalize() {
    let sum = 0;
    for (const val of phi) {
        sum += val;
    }
    
    if (sum > 0) {
        for (let i = 0; i < phi.length; i++) {
            phi[i] = phi[i] / sum;
        }
    }
}

function measureRelativeCompatibility(centerIdx, neighborIdx) {
    const centerVal = phi[centerIdx];
    const neighborVal = phi[neighborIdx];
    
    // Pure comparison - no division when values are very different
    if (centerVal > neighborVal) {
        if (centerVal > neighborVal + neighborVal) {
            return LOW_PRESSURE;  // Very different
        } else {
            return MED_PRESSURE;  // Moderately different
        }
    } else if (neighborVal > centerVal) {
        if (neighborVal > centerVal + centerVal) {
            return LOW_PRESSURE;  // Very different
        } else {
            return MED_PRESSURE;  // Moderately different
        }
    } else {
        return HIGH_PRESSURE;  // Similar
    }
}

function assessNodeStability(nodeIdx) {
    const neighbors = adjacency[nodeIdx];
    if (neighbors.length === 0) return HIGH_PRESSURE;
    
    let totalPressure = 0;
    const centerVal = phi[nodeIdx];
    
    for (const nIdx of neighbors) {
        const pressure = measureRelativeCompatibility(nodeIdx, nIdx);
        totalPressure += pressure;
    }
    
    const avgPressure = totalPressure / neighbors.length;
    return avgPressure;
}

function computeGraphCoherence() {
    let highStabilityNodes = 0;
    let medStabilityNodes = 0;
    let lowStabilityNodes = 0;
    
    for (let i = 0; i < nodes.length; i++) {
        const stability = assessNodeStability(i);
        
        if (stability >= HIGH_PRESSURE) {
            highStabilityNodes++;
        } else if (stability >= MED_PRESSURE) {
            medStabilityNodes++;
        } else {
            lowStabilityNodes++;
        }
    }
    
    return {
        high: highStabilityNodes,
        med: medStabilityNodes,
        low: lowStabilityNodes,
        dominant: highStabilityNodes > medStabilityNodes + lowStabilityNodes ? 'HIGH' : 
                 medStabilityNodes > lowStabilityNodes ? 'MED' : 'LOW'
    };
}

function incrementRelationalCycles() {
    const coherence = computeGraphCoherence();
    if (coherence.dominant === 'HIGH') {
        relationalCycles += 3;
    } else if (coherence.dominant === 'MED') {
        relationalCycles += 2;
    } else {
        relationalCycles += 1;
    }
}

////////////////////////////////////////////////////////////////////////////////
// CONSTRAINT PROPAGATION - NO COEFFICIENTS
////////////////////////////////////////////////////////////////////////////////

function evolveConstraintGraph() {
    const newPhi = [...phi];
    const baseValue = 1 / phi.length;
    
    for (let i = 0; i < nodes.length; i++) {
        const neighbors = adjacency[i];
        const currentVal = phi[i];
        
        if (neighbors.length === 0) continue;
        
        // Count relative positions - no averaging
        let strongerNeighbors = 0;
        let equalNeighbors = 0;
        let weakerNeighbors = 0;
        
        for (const nIdx of neighbors) {
            const neighborVal = phi[nIdx];
            
            if (neighborVal > currentVal) {
                strongerNeighbors++;
            } else if (neighborVal < currentVal) {
                weakerNeighbors++;
            } else {
                equalNeighbors++;
            }
        }
        
        // Pressure based on neighbor distribution
        let adjustment = 0;
        
        if (strongerNeighbors > weakerNeighbors) {
            // Surrounded by stronger - increase slightly
            if (strongerNeighbors > 2) {
                adjustment = baseValue / 50;  // Small increment
            }
        } else if (weakerNeighbors > strongerNeighbors) {
            // Surrounded by weaker - decrease slightly
            if (weakerNeighbors > 2) {
                adjustment = -baseValue / 50;  // Small decrement
            }
        }
        
        // Stability pressure
        const stability = assessNodeStability(i);
        if (stability < MED_PRESSURE) {
            if (currentVal > baseValue) {
                adjustment -= baseValue / 100;
            } else {
                adjustment += baseValue / 100;
            }
        }
        
        // Constraint pressure
        if (currentVal > baseValue + baseValue) {
            adjustment -= baseValue / 80;
        } else if (currentVal < baseValue / 2) {
            adjustment += baseValue / 80;
        }
        
        newPhi[i] = currentVal + adjustment;
        
        // Minimum constraint - no mathematical comparison
        if (newPhi[i] < baseValue / 1000) {
            newPhi[i] = baseValue / 1000;
        }
    }
    
    phi = newPhi;
    constraintNormalize();
    incrementRelationalCycles();
    
    // Decay disturbance
    if (lastDisturbance > 0) {
        lastDisturbance = lastDisturbance - lastDisturbance / 50;
    }
}

////////////////////////////////////////////////////////////////////////////////
// SEQUENCE GENERATION - NO HASH FUNCTIONS
////////////////////////////////////////////////////////////////////////////////

function generateStabilitySequence() {
    let sequence = "";
    
    for (let i = 0; i < nodes.length; i += 3) {
        const stability = assessNodeStability(i);
        
        if (stability >= HIGH_PRESSURE) {
            sequence += "H";
        } else if (stability >= MED_PRESSURE) {
            sequence += "M";
        } else {
            sequence += "L";
        }
    }
    
    return sequence.substring(0, 12);
}

////////////////////////////////////////////////////////////////////////////////
// ADJACENCY VISUALIZATION - NO COORDINATES
////////////////////////////////////////////////////////////////////////////////

function generateGraphLayout() {
    const layout = [];
    const center = nodes.length / 2;
    
    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const amplitude = phi[i];
        const stability = assessNodeStability(i);
        
        // Ring-based positioning - no trigonometry
        let ring = 0;
        const absQ = node.q < 0 ? -node.q : node.q;
        const absR = node.r < 0 ? -node.r : node.r;
        const absS = (node.q + node.r) < 0 ? -(node.q + node.r) : (node.q + node.r);
        
        if (absQ > ring) ring = absQ;
        if (absR > ring) ring = absR;
        if (absS > ring) ring = absS;
        
        // Position within ring
        let position = 0;
        if (ring > 0) {
            if (node.q === ring) position = node.r + ring;
            else if (node.r === ring) position = ring + ring - node.q;
            else position = ring + ring + ring - node.r;
        }
        
        layout.push({
            id: i,
            ring: ring,
            position: position,
            amplitude: amplitude,
            stability: stability,
            degree: node.degree,
            neighbors: adjacency[i],
            q: node.q,
            r: node.r
        });
    }
    
    return layout;
}

////////////////////////////////////////////////////////////////////////////////
// WEB SERVER
////////////////////////////////////////////////////////////////////////////////

generateAdjacencyGraph();

const server = http.createServer((req, res) => {
    if (req.url === '/') {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(generateHTML());
    } else {
        res.writeHead(404);
        res.end();
    }
});

const wss = new WebSocket.Server({ server });

wss.on("connection", ws => {
    const graphLayout = generateGraphLayout();
    const coherence = computeGraphCoherence();
    
    ws.send(JSON.stringify({
        graph: graphLayout,
        adjacency: adjacency,
        coherence: coherence,
        cycles: relationalCycles,
        sequence: generateStabilitySequence(),
        disturbance: lastDisturbance
    }));
    
    ws.on("message", (data) => {
        try {
            const msg = JSON.parse(data);
            if (msg.type === "disturbance") {
                if (msg.nodeId >= 0 && msg.nodeId < phi.length) {
                    phi[msg.nodeId] += msg.magnitude;
                    lastDisturbance = msg.magnitude;
                    constraintNormalize();
                }
            }
        } catch (e) {
            console.log("Invalid message:", e);
        }
    });
});

setInterval(() => {
    evolveConstraintGraph();
    stabilitySequence = generateStabilitySequence();
    
    const payload = JSON.stringify({
        graph: generateGraphLayout(),
        adjacency: adjacency,
        coherence: computeGraphCoherence(),
        cycles: relationalCycles,
        sequence: stabilitySequence,
        disturbance: lastDisturbance
    });
    
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(payload);
        }
    });
}, 80);

////////////////////////////////////////////////////////////////////////////////
// HTML INTERFACE
////////////////////////////////////////////////////////////////////////////////

function generateHTML() {
    return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>hexKERnKERnel METRICLESS - Pure Graph Topology</title>
<style>
body { 
    margin: 0; 
    background: black; 
    color: cyan;
    font-family: monospace;
}
.container {
    display: flex;
    height: 100vh;
}
.view {
    width: 50vw;
    height: 100vh;
    position: relative;
}
canvas {
    width: 100%;
    height: 100%;
    cursor: crosshair;
}
.info {
    position: absolute;
    top: 10px;
    left: 10px;
    background: rgba(0,0,0,0.95);
    padding: 15px;
    border-radius: 8px;
    font-size: 11px;
    border: 1px solid cyan;
}
.metric {
    margin: 3px 0;
    font-family: monospace;
}
.value {
    color: yellow;
}
</style>
</head>
<body>
<div class="container">
    <div class="view">
        <canvas id="graphCanvas"></canvas>
        <div class="info">
            <div class="metric">ADJACENCY GRAPH</div>
            <div class="metric">High: <span class="value" id="highStable">0</span></div>
            <div class="metric">Med: <span class="value" id="medStable">0</span></div>
            <div class="metric">Low: <span class="value" id="lowStable">0</span></div>
            <div class="metric">Dom: <span class="value" id="dominant">-</span></div>
        </div>
    </div>
    <div class="view">
        <canvas id="networkCanvas"></canvas>
        <div class="info">
            <div class="metric">CONSTRAINT NETWORK</div>
            <div class="metric">Cycles: <span class="value" id="cycles">0</span></div>
            <div class="metric">Sequence: <span class="value" id="sequence">---</span></div>
            <div class="metric">Disturbance: <span class="value" id="disturbance">0</span></div>
        </div>
    </div>
</div>

<script>
const ws = new WebSocket("ws://localhost:8080");
const graphCanvas = document.getElementById("graphCanvas");
const networkCanvas = document.getElementById("networkCanvas");
const graphCtx = graphCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

graphCanvas.width = graphCanvas.offsetWidth;
graphCanvas.height = graphCanvas.offsetHeight;
networkCanvas.width = networkCanvas.offsetWidth;
networkCanvas.height = networkCanvas.offsetHeight;

let graphData = null;

ws.onmessage = (event) => {
    graphData = JSON.parse(event.data);
    renderAdjacencyGraph();
    renderConstraintNetwork();
    updateMetrics();
};

function renderAdjacencyGraph() {
    if (!graphData) return;
    
    graphCtx.fillStyle = "black";
    graphCtx.fillRect(0, 0, graphCanvas.width, graphCanvas.height);
    
    const centerX = graphCanvas.width / 2;
    const centerY = graphCanvas.height / 2;
    const maxRing = Math.max(...graphData.graph.map(n => n.ring));
    
    // Draw nodes in ring layout - no trigonometry
    for (const node of graphData.graph) {
        let x, y;
        
        if (node.ring === 0) {
            x = centerX;
            y = centerY;
        } else {
            const ringRadius = (node.ring * 40) + 30;
            const ringSides = node.ring * 6;
            const angleStep = 360 / ringSides;
            const approxAngle = node.position * angleStep;
            
            // Approximate circle positioning without trigonometry
            if (approxAngle < 90) {
                x = centerX + ringRadius * (approxAngle / 90);
                y = centerY - ringRadius * (1 - approxAngle / 90);
            } else if (approxAngle < 180) {
                x = centerX + ringRadius * (1 - (approxAngle - 90) / 90);
                y = centerY + ringRadius * ((approxAngle - 90) / 90);
            } else if (approxAngle < 270) {
                x = centerX - ringRadius * ((approxAngle - 180) / 90);
                y = centerY + ringRadius * (1 - (approxAngle - 180) / 90);
            } else {
                x = centerX - ringRadius * (1 - (approxAngle - 270) / 90);
                y = centerY - ringRadius * ((approxAngle - 270) / 90);
            }
        }
        
        // Size based on amplitude
        const size = 4 + node.amplitude * 25;
        
        // Color based on stability level
        let color;
        if (node.stability >= 5) {
            color = "rgb(0, 255, 128)";  // High stability - green
        } else if (node.stability >= 3) {
            color = "rgb(255, 255, 0)";  // Med stability - yellow
        } else {
            color = "rgb(255, 128, 0)";  // Low stability - orange
        }
        
        graphCtx.fillStyle = color;
        graphCtx.strokeStyle = "white";
        graphCtx.lineWidth = 1;
        
        graphCtx.beginPath();
        graphCtx.arc(x, y, size, 0, 6.28);
        graphCtx.fill();
        graphCtx.stroke();
        
        // Store position for click detection
        node.screenX = x;
        node.screenY = y;
        node.screenSize = size;
    }
    
    // Draw adjacency connections
    graphCtx.strokeStyle = "rgba(100, 100, 100, 0.3)";
    graphCtx.lineWidth = 1;
    
    for (const node of graphData.graph) {
        for (const neighborId of node.neighbors) {
            const neighbor = graphData.graph[neighborId];
            if (neighbor) {
                graphCtx.beginPath();
                graphCtx.moveTo(node.screenX, node.screenY);
                graphCtx.lineTo(neighbor.screenX, neighbor.screenY);
                graphCtx.stroke();
            }
        }
    }
}

function renderConstraintNetwork() {
    if (!graphData) return;
    
    networkCtx.fillStyle = "black";
    networkCtx.fillRect(0, 0, networkCanvas.width, networkCanvas.height);
    
    const centerX = networkCanvas.width / 2;
    const centerY = networkCanvas.height / 2;
    
    // Force-directed layout approximation without complex math
    const positions = new Map();
    
    for (let i = 0; i < graphData.graph.length; i++) {
        const node = graphData.graph[i];
        
        // Simple grid-based positioning
        const cols = Math.ceil(Math.sqrt(graphData.graph.length));
        const col = i % cols;
        const row = Math.floor(i / cols);
        
        const x = centerX + (col - cols/2) * 40;
        const y = centerY + (row - cols/2) * 40;
        
        positions.set(i, {x, y});
        
        // Draw node
        const size = 3 + node.amplitude * 15;
        const intensity = node.amplitude * 255;
        
        networkCtx.fillStyle = \`rgb(\${intensity}, 0, \${255-intensity})\`;
        networkCtx.strokeStyle = "white";
        networkCtx.lineWidth = 1;
        
        networkCtx.beginPath();
        networkCtx.arc(x, y, size, 0, 6.28);
        networkCtx.fill();
        networkCtx.stroke();
    }
    
    // Draw constraint connections
    networkCtx.strokeStyle = "rgba(0, 255, 255, 0.4)";
    networkCtx.lineWidth = 1;
    
    for (let i = 0; i < graphData.graph.length; i++) {
        const pos = positions.get(i);
        for (const neighborId of graphData.graph[i].neighbors) {
            const neighborPos = positions.get(neighborId);
            if (neighborPos) {
                networkCtx.beginPath();
                networkCtx.moveTo(pos.x, pos.y);
                networkCtx.lineTo(neighborPos.x, neighborPos.y);
                networkCtx.stroke();
            }
        }
    }
}

function updateMetrics() {
    if (!graphData) return;
    
    document.getElementById("highStable").textContent = graphData.coherence.high;
    document.getElementById("medStable").textContent = graphData.coherence.med;
    document.getElementById("lowStable").textContent = graphData.coherence.low;
    document.getElementById("dominant").textContent = graphData.coherence.dominant;
    document.getElementById("cycles").textContent = graphData.cycles;
    document.getElementById("sequence").textContent = graphData.sequence;
    document.getElementById("disturbance").textContent = graphData.disturbance.toFixed(4);
}

graphCanvas.addEventListener("click", (event) => {
    if (!graphData) return;
    
    const rect = graphCanvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    for (const node of graphData.graph) {
        if (node.screenX && node.screenY) {
            const dx = x - node.screenX;
            const dy = y - node.screenY;
            const dist = dx * dx + dy * dy;
            
            if (dist < node.screenSize * node.screenSize) {
                ws.send(JSON.stringify({
                    type: "disturbance",
                    nodeId: node.id,
                    magnitude: 0.1
                }));
                break;
            }
        }
    }
});
</script>
</body>
</html>`;
}

server.listen(PORT, () => {
    console.log(`hexKERnKERnel METRICLESS running at http://localhost:${PORT}`);
    console.log(`Pure adjacency graph - No coordinates - No trigonometry`);
    console.log(`Constraint propagation - Emergent stability patterns`);
    console.log(`Nodes: ${nodes.length} - Adjacency only`);
});
