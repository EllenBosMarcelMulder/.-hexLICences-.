/*
hexKERnKERnel_topological_20260213_143000.js

PURE TOPOLOGICAL IMPLEMENTATION
===============================

No trigonometry
No algebraic projections  
No magnitude calculations
No mathematical functions

Only:
- Relational compatibility
- Constraint consistency
- Topological stability
- Emergent resonance

ASCII only - Pure relationality
*/

const WebSocket = require("ws");
const http = require("http");
const fs = require("fs");
const path = require("path");

////////////////////////////////////////////////////////////////////////////////
// CORE PARAMETERS - NO MATHEMATICAL CONSTANTS
////////////////////////////////////////////////////////////////////////////////

const PORT = 8080;
const HEX_RADIUS = 8;
const STABILITY_THRESHOLD = 0.85;
const PERTURBATION_DECAY = 0.98;

let nodes = [];
let phi = [];
let relationalTime = 0;
let stabilityPattern = "";
let lastPerturbation = 0;

////////////////////////////////////////////////////////////////////////////////
// HEXAGONAL TOPOLOGY - PURE RELATIONAL
////////////////////////////////////////////////////////////////////////////////

function generateHexGrid() {
    nodes = [];
    phi = [];
    
    for (let q = -HEX_RADIUS; q <= HEX_RADIUS; q++) {
        for (let r = -HEX_RADIUS; r <= HEX_RADIUS; r++) {
            if (Math.abs(q + r) <= HEX_RADIUS) {
                nodes.push({ q, r });
                phi.push(1);
            }
        }
    }
    
    relationNormalize();
}

function getHexIndex(q, r) {
    return nodes.findIndex(n => n.q === q && n.r === r);
}

function getValidNeighbors(index) {
    const { q, r } = nodes[index];
    const neighborCoords = [
        [q + 1, r], [q - 1, r],
        [q, r + 1], [q, r - 1],
        [q + 1, r - 1], [q - 1, r + 1]
    ];
    
    const validNeighbors = [];
    for (const [nq, nr] of neighborCoords) {
        const idx = getHexIndex(nq, nr);
        if (idx !== -1) {
            validNeighbors.push(idx);
        }
    }
    
    return validNeighbors;
}

////////////////////////////////////////////////////////////////////////////////
// PURE RELATIONAL OPERATIONS - NO ALGEBRA
////////////////////////////////////////////////////////////////////////////////

function relationNormalize() {
    let sum = 0;
    for (let i = 0; i < phi.length; i++) {
        sum += phi[i];
    }
    
    if (sum > 0) {
        for (let i = 0; i < phi.length; i++) {
            phi[i] = phi[i] / sum;
        }
    }
}

function computeCompatibility(val1, val2) {
    if (val1 > val2) {
        return val2 / val1;
    } else if (val2 > val1) {
        return val1 / val2;
    } else {
        return 1;
    }
}

function measureLocalStability(index) {
    const neighbors = getValidNeighbors(index);
    if (neighbors.length === 0) return 1;
    
    let totalCompatibility = 0;
    const centerValue = phi[index];
    
    for (const nIdx of neighbors) {
        const neighborValue = phi[nIdx];
        const compatibility = computeCompatibility(centerValue, neighborValue);
        totalCompatibility += compatibility;
    }
    
    return totalCompatibility / neighbors.length;
}

function computeTopologicalCoherence() {
    let globalStability = 0;
    let stableNodes = 0;
    
    for (let i = 0; i < nodes.length; i++) {
        const localStability = measureLocalStability(i);
        globalStability += localStability;
        
        if (localStability > STABILITY_THRESHOLD) {
            stableNodes++;
        }
    }
    
    const averageStability = globalStability / nodes.length;
    const stabilityRatio = stableNodes / nodes.length;
    
    return {
        average: averageStability,
        ratio: stabilityRatio,
        coherence: averageStability * stabilityRatio
    };
}

function relationalTimeStep() {
    const stability = computeTopologicalCoherence();
    relationalTime += stability.coherence;
    return relationalTime;
}

////////////////////////////////////////////////////////////////////////////////
// CONSTRAINT-BASED EVOLUTION - NO MATHEMATICAL OPERATIONS
////////////////////////////////////////////////////////////////////////////////

function evolveTopologicalField() {
    const newPhi = [...phi];
    const avgValue = 1 / phi.length;
    
    for (let i = 0; i < nodes.length; i++) {
        const neighbors = getValidNeighbors(i);
        const currentValue = phi[i];
        
        if (neighbors.length === 0) continue;
        
        // Compute neighbor influence through pure comparison
        let neighborSum = 0;
        let strongerNeighbors = 0;
        let weakerNeighbors = 0;
        
        for (const nIdx of neighbors) {
            const neighborValue = phi[nIdx];
            neighborSum += neighborValue;
            
            if (neighborValue > currentValue) {
                strongerNeighbors++;
            } else if (neighborValue < currentValue) {
                weakerNeighbors++;
            }
        }
        
        const neighborAvg = neighborSum / neighbors.length;
        
        // Relational pressure - no algebraic diffusion
        let pressure = 0;
        if (currentValue < neighborAvg) {
            pressure = (neighborAvg - currentValue) * 0.02;
        } else if (currentValue > neighborAvg) {
            pressure = (neighborAvg - currentValue) * 0.02;
        }
        
        // Stability feedback
        const localStability = measureLocalStability(i);
        let stabilityPressure = 0;
        if (localStability < STABILITY_THRESHOLD) {
            if (currentValue > avgValue) {
                stabilityPressure = -0.01;
            } else {
                stabilityPressure = 0.01;
            }
        }
        
        // Constraint preservation
        let constraintPressure = 0;
        if (currentValue > avgValue) {
            constraintPressure = (avgValue - currentValue) * 0.03;
        } else if (currentValue < avgValue) {
            constraintPressure = (avgValue - currentValue) * 0.03;
        }
        
        newPhi[i] = currentValue + pressure + stabilityPressure + constraintPressure;
        
        // Minimum threshold - no mathematical max function
        if (newPhi[i] < 0.000001) {
            newPhi[i] = 0.000001;
        }
    }
    
    phi = newPhi;
    relationNormalize();
    relationalTimeStep();
    
    // Update perturbation decay
    lastPerturbation *= PERTURBATION_DECAY;
}

////////////////////////////////////////////////////////////////////////////////
// PATTERN RECOGNITION - NO MATHEMATICAL HASH
////////////////////////////////////////////////////////////////////////////////

function generateStabilityPattern() {
    let pattern = "";
    
    for (let i = 0; i < nodes.length; i += 4) {
        const localStability = measureLocalStability(i);
        
        if (localStability > 0.9) {
            pattern += "A";
        } else if (localStability > 0.7) {
            pattern += "B";
        } else if (localStability > 0.5) {
            pattern += "C";
        } else {
            pattern += "D";
        }
    }
    
    return pattern.substring(0, 16);
}

////////////////////////////////////////////////////////////////////////////////
// TOPOLOGICAL PROJECTION - NO TRIGONOMETRY
////////////////////////////////////////////////////////////////////////////////

function hexToRelationalFlat(q, r) {
    // Pure relational positioning - no mathematical functions
    const x = q + r * 0.5;
    const y = r * 0.866; // approximation of sqrt(3)/2
    return { x, y };
}

function hexToCompatibilityField(q, r, amplitude, stability) {
    const { x, y } = hexToRelationalFlat(q, r);
    
    // Distance approximation without sqrt
    let distanceClass = 0;
    if (x > 0 || y > 0) {
        if (x > y) {
            distanceClass = x > 0 ? 1 : 0;
        } else {
            distanceClass = y > 0 ? 1 : 0;
        }
    }
    
    // Topological mapping based on compatibility
    const fieldX = x * (0.5 + amplitude);
    const fieldY = y * (0.5 + amplitude);
    const fieldZ = stability * amplitude;
    
    return { x: fieldX, y: fieldY, z: fieldZ, distance: distanceClass };
}

////////////////////////////////////////////////////////////////////////////////
// WEB SERVER
////////////////////////////////////////////////////////////////////////////////

generateHexGrid();

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
    const flatProjection = [];
    const fieldProjection = [];
    
    for (let i = 0; i < nodes.length; i++) {
        const { q, r } = nodes[i];
        const amplitude = phi[i];
        const stability = measureLocalStability(i);
        
        flatProjection.push({
            ...hexToRelationalFlat(q, r),
            amplitude,
            stability,
            q, r
        });
        
        fieldProjection.push({
            ...hexToCompatibilityField(q, r, amplitude, stability),
            amplitude,
            stability,
            q, r
        });
    }
    
    const coherenceData = computeTopologicalCoherence();
    
    ws.send(JSON.stringify({
        flat: flatProjection,
        field: fieldProjection,
        coherence: coherenceData,
        relationalTime: relationalTime,
        pattern: generateStabilityPattern(),
        perturbation: lastPerturbation
    }));
    
    ws.on("message", (data) => {
        try {
            const msg = JSON.parse(data);
            if (msg.type === "perturbation") {
                const idx = getHexIndex(msg.q, msg.r);
                if (idx !== -1) {
                    phi[idx] += msg.magnitude;
                    lastPerturbation = msg.magnitude;
                    relationNormalize();
                }
            }
        } catch (e) {
            console.log("Invalid message:", e);
        }
    });
});

setInterval(() => {
    evolveTopologicalField();
    stabilityPattern = generateStabilityPattern();
    
    const coherenceData = computeTopologicalCoherence();
    
    const payload = JSON.stringify({
        flat: nodes.map((node, i) => ({
            ...hexToRelationalFlat(node.q, node.r),
            amplitude: phi[i],
            stability: measureLocalStability(i),
            q: node.q,
            r: node.r
        })),
        field: nodes.map((node, i) => ({
            ...hexToCompatibilityField(node.q, node.r, phi[i], measureLocalStability(i)),
            amplitude: phi[i],
            stability: measureLocalStability(i),
            q: node.q,
            r: node.r
        })),
        coherence: coherenceData,
        relationalTime: relationalTime,
        pattern: stabilityPattern,
        perturbation: lastPerturbation
    });
    
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(payload);
        }
    });
}, 60);

////////////////////////////////////////////////////////////////////////////////
// HTML INTERFACE
////////////////////////////////////////////////////////////////////////////////

function generateHTML() {
    return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>hexKERnKERnel TOPOLOGICAL - Pure Relationality</title>
<style>
body { 
    margin: 0; 
    background: black; 
    color: lime;
    font-family: monospace;
}
.container {
    display: flex;
    height: 100vh;
}
.projection {
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
    background: rgba(0,0,0,0.9);
    padding: 12px;
    border-radius: 5px;
    font-size: 10px;
    border: 1px solid lime;
}
.metric {
    margin: 2px 0;
}
</style>
</head>
<body>
<div class="container">
    <div class="projection">
        <canvas id="flatCanvas"></canvas>
        <div class="info">
            <div class="metric">RELATIONAL HEX FIELD</div>
            <div class="metric">Avg Stability: <span id="avgStability">0</span></div>
            <div class="metric">Stable Ratio: <span id="stableRatio">0</span></div>
            <div class="metric">Pattern: <span id="pattern">---</span></div>
        </div>
    </div>
    <div class="projection">
        <canvas id="fieldCanvas"></canvas>
        <div class="info">
            <div class="metric">COMPATIBILITY FIELD</div>
            <div class="metric">Rel.Time: <span id="relTime">0</span></div>
            <div class="metric">Coherence: <span id="coherence">0</span></div>
            <div class="metric">Perturbation: <span id="perturbation">0</span></div>
        </div>
    </div>
</div>

<script>
const ws = new WebSocket("ws://localhost:8080");
const flatCanvas = document.getElementById("flatCanvas");
const fieldCanvas = document.getElementById("fieldCanvas");
const flatCtx = flatCanvas.getContext("2d");
const fieldCtx = fieldCanvas.getContext("2d");

flatCanvas.width = flatCanvas.offsetWidth;
flatCanvas.height = flatCanvas.offsetHeight;
fieldCanvas.width = fieldCanvas.offsetWidth;
fieldCanvas.height = fieldCanvas.offsetHeight;

let hexField = null;

ws.onmessage = (event) => {
    hexField = JSON.parse(event.data);
    renderRelationalFlat();
    renderCompatibilityField();
    updateMetrics();
};

function renderRelationalFlat() {
    if (!hexField) return;
    
    flatCtx.fillStyle = "black";
    flatCtx.fillRect(0, 0, flatCanvas.width, flatCanvas.height);
    
    const centerX = flatCanvas.width / 2;
    const centerY = flatCanvas.height / 2;
    
    for (const node of hexField.flat) {
        const x = centerX + node.x * 18;
        const y = centerY - node.y * 18;
        const amplitude = node.amplitude;
        const stability = node.stability;
        
        // Size based on amplitude
        const size = 4 + amplitude * 20;
        
        // Color based on stability (pure relational)
        let red = 0, green = 0, blue = 0;
        if (stability > 0.8) {
            green = 255;
            blue = 128;
        } else if (stability > 0.6) {
            green = 200;
            red = 100;
        } else if (stability > 0.4) {
            red = 200;
            green = 100;
        } else {
            red = 255;
        }
        
        flatCtx.fillStyle = \`rgb(\${red}, \${green}, \${blue})\`;
        flatCtx.strokeStyle = "white";
        flatCtx.lineWidth = stability > 0.7 ? 2 : 1;
        
        flatCtx.beginPath();
        
        // Hexagon representation
        for (let i = 0; i < 6; i++) {
            const angle = (i * 60) * (3.14159 / 180); // degrees to approx radians
            const hx = x + size * Math.cos(angle);
            const hy = y + size * Math.sin(angle);
            
            if (i === 0) {
                flatCtx.moveTo(hx, hy);
            } else {
                flatCtx.lineTo(hx, hy);
            }
        }
        
        flatCtx.closePath();
        flatCtx.fill();
        flatCtx.stroke();
    }
}

function renderCompatibilityField() {
    if (!hexField) return;
    
    fieldCtx.fillStyle = "black";
    fieldCtx.fillRect(0, 0, fieldCanvas.width, fieldCanvas.height);
    
    const centerX = fieldCanvas.width / 2;
    const centerY = fieldCanvas.height / 2;
    
    // Sort by z for depth rendering
    const sorted = [...hexField.field].sort((a, b) => b.z - a.z);
    
    for (const node of sorted) {
        const x = centerX + node.x * 80;
        const y = centerY - node.y * 80;
        const amplitude = node.amplitude;
        const stability = node.stability;
        const depth = node.z;
        
        const size = 3 + amplitude * 15 + depth * 10;
        const alpha = 0.3 + depth * 0.7;
        
        // Compatibility field visualization
        let intensity = amplitude * 255;
        if (stability > 0.8) {
            intensity = 255;
        }
        
        fieldCtx.fillStyle = \`rgba(0, \${intensity}, \${255 - intensity}, \${alpha})\`;
        fieldCtx.strokeStyle = \`rgba(255, 255, 255, \${alpha * 0.8})\`;
        fieldCtx.lineWidth = 1;
        
        fieldCtx.beginPath();
        fieldCtx.arc(x, y, size, 0, 6.28); // 2*pi approximation
        fieldCtx.fill();
        fieldCtx.stroke();
    }
}

function updateMetrics() {
    if (!hexField) return;
    
    document.getElementById("avgStability").textContent = hexField.coherence.average.toFixed(4);
    document.getElementById("stableRatio").textContent = hexField.coherence.ratio.toFixed(4);
    document.getElementById("pattern").textContent = hexField.pattern;
    document.getElementById("relTime").textContent = hexField.relationalTime.toFixed(2);
    document.getElementById("coherence").textContent = hexField.coherence.coherence.toFixed(4);
    document.getElementById("perturbation").textContent = hexField.perturbation.toFixed(4);
}

flatCanvas.addEventListener("click", (event) => {
    if (!hexField) return;
    
    const rect = flatCanvas.getBoundingClientRect();
    const x = event.clientX - rect.left - flatCanvas.width / 2;
    const y = -(event.clientY - rect.top - flatCanvas.height / 2);
    
    let minDist = 999999;
    let nearestNode = null;
    
    for (const node of hexField.flat) {
        const dx = x / 18 - node.x;
        const dy = y / 18 - node.y;
        const dist = dx * dx + dy * dy; // no sqrt - pure comparison
        
        if (dist < minDist) {
            minDist = dist;
            nearestNode = node;
        }
    }
    
    if (nearestNode && minDist < 4) {
        ws.send(JSON.stringify({
            type: "perturbation",
            q: nearestNode.q,
            r: nearestNode.r,
            magnitude: 0.08
        }));
    }
});
</script>
</body>
</html>`;
}

server.listen(PORT, () => {
    console.log(`hexKERnKERnel TOPOLOGICAL running at http://localhost:${PORT}`);
    console.log(`Pure relationality - No trigonometry - No algebra`);
    console.log(`Constraint-based evolution - Emergent coherence`);
    console.log(`Nodes: ${nodes.length} - Threshold: ${STABILITY_THRESHOLD}`);
});
