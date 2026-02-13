/*
hexKERnKERnel_multirepresentatie_20260213_162000.js

MULTIREPRESENTATIE ISOMORPHIC KERNEL
====================================

One underlying field
Multiple simultaneous projections:
- Binary (XOR patterns)
- Energetic (thermal gradients) 
- Entropic (information complexity)
- Ordinal (relative ordering)
- Amplitude (normalized distribution)

Cross-validation through projection consistency
No single "fundamental" layer
*/

const WebSocket = require("ws");
const http = require("http");
const fs = require("fs");
const path = require("path");

////////////////////////////////////////////////////////////////////////////////
// MULTIREPRESENTATIE PARAMETERS
////////////////////////////////////////////////////////////////////////////////

const PORT = 8080;
const HEX_RADIUS = 5;
const REPRESENTATIONS = ['binary', 'energetic', 'entropic', 'ordinal', 'amplitude'];

let nodes = [];
let coreField = []; // Underlying state
let projections = {}; // Multiple representations
let adjacency = [];
let consistency = [];
let crossValidation = {};

////////////////////////////////////////////////////////////////////////////////
// CORE FIELD TOPOLOGY
////////////////////////////////////////////////////////////////////////////////

function generateCoreField() {
    nodes = [];
    coreField = [];
    adjacency = [];
    consistency = [];
    
    // Initialize projections
    for (const rep of REPRESENTATIONS) {
        projections[rep] = [];
    }
    
    // Generate nodes
    for (let q = -HEX_RADIUS; q <= HEX_RADIUS; q++) {
        for (let r = -HEX_RADIUS; r <= HEX_RADIUS; r++) {
            if (Math.abs(q + r) <= HEX_RADIUS) {
                nodes.push({ 
                    id: nodes.length,
                    q, r
                });
                
                // Core field - abstract state (just index-based seed)
                coreField.push(Math.random());
                adjacency.push([]);
                consistency.push(1.0);
                
                // Initialize all projections
                for (const rep of REPRESENTATIONS) {
                    projections[rep].push(0);
                }
            }
        }
    }
    
    // Build adjacency
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
            }
        }
    }
    
    // Initial projections from core field
    updateAllProjections();
}

////////////////////////////////////////////////////////////////////////////////
// PROJECTION MAPPINGS
////////////////////////////////////////////////////////////////////////////////

function projectToBinary(coreValue) {
    // Core field [0,1] -> 8-bit pattern
    return Math.floor(coreValue * 255) & 0xFF;
}

function projectToEnergetic(coreValue) {
    // Core field [0,1] -> 7 energy bands
    return Math.floor(coreValue * 7);
}

function projectToEntropic(coreValue) {
    // Core field [0,1] -> information content
    return coreValue;
}

function projectToOrdinal(coreValue) {
    // Core field [0,1] -> 5 ordinal states
    const states = ['LOWEST', 'LOW', 'MEDIUM', 'HIGH', 'HIGHEST'];
    return states[Math.floor(coreValue * 5)];
}

function projectToAmplitude(coreValue) {
    // Core field [0,1] -> amplitude (normalized)
    return coreValue;
}

function updateAllProjections() {
    for (let i = 0; i < coreField.length; i++) {
        const coreValue = coreField[i];
        
        projections.binary[i] = projectToBinary(coreValue);
        projections.energetic[i] = projectToEnergetic(coreValue);
        projections.entropic[i] = projectToEntropic(coreValue);
        projections.ordinal[i] = projectToOrdinal(coreValue);
        projections.amplitude[i] = projectToAmplitude(coreValue);
    }
}

////////////////////////////////////////////////////////////////////////////////
// CROSS-VALIDATION OPERATIONS
////////////////////////////////////////////////////////////////////////////////

function validateBinaryConsistency(nodeIdx) {
    const neighbors = adjacency[nodeIdx];
    if (neighbors.length === 0) return 1.0;
    
    const centerBits = projections.binary[nodeIdx];
    let totalHamming = 0;
    
    for (const nIdx of neighbors) {
        const neighborBits = projections.binary[nIdx];
        const xorDiff = centerBits ^ neighborBits;
        let hamming = 0;
        let temp = xorDiff;
        while (temp) {
            hamming += temp & 1;
            temp >>>= 1;
        }
        totalHamming += hamming;
    }
    
    const avgHamming = totalHamming / neighbors.length;
    return 1.0 - (avgHamming / 8); // Normalize to [0,1], invert for consistency
}

function validateEnergeticConsistency(nodeIdx) {
    const neighbors = adjacency[nodeIdx];
    if (neighbors.length === 0) return 1.0;
    
    const centerEnergy = projections.energetic[nodeIdx];
    let totalGradient = 0;
    
    for (const nIdx of neighbors) {
        const neighborEnergy = projections.energetic[nIdx];
        totalGradient += Math.abs(centerEnergy - neighborEnergy);
    }
    
    const avgGradient = totalGradient / neighbors.length;
    return 1.0 - (avgGradient / 6); // Normalize and invert
}

function validateEntropicConsistency(nodeIdx) {
    const neighbors = adjacency[nodeIdx];
    if (neighbors.length === 0) return 1.0;
    
    const centerInfo = projections.entropic[nodeIdx];
    let totalDiff = 0;
    
    for (const nIdx of neighbors) {
        const neighborInfo = projections.entropic[nIdx];
        totalDiff += Math.abs(centerInfo - neighborInfo);
    }
    
    const avgDiff = totalDiff / neighbors.length;
    return 1.0 - avgDiff; // Already normalized
}

function validateOrdinalConsistency(nodeIdx) {
    const neighbors = adjacency[nodeIdx];
    if (neighbors.length === 0) return 1.0;
    
    const states = ['LOWEST', 'LOW', 'MEDIUM', 'HIGH', 'HIGHEST'];
    const centerState = projections.ordinal[nodeIdx];
    const centerIdx = states.indexOf(centerState);
    
    let consistentNeighbors = 0;
    
    for (const nIdx of neighbors) {
        const neighborState = projections.ordinal[nIdx];
        const neighborIdx = states.indexOf(neighborState);
        const diff = Math.abs(centerIdx - neighborIdx);
        
        if (diff <= 1) { // Adjacent or same ordinal level
            consistentNeighbors++;
        }
    }
    
    return consistentNeighbors / neighbors.length;
}

function validateAmplitudeConsistency(nodeIdx) {
    const neighbors = adjacency[nodeIdx];
    if (neighbors.length === 0) return 1.0;
    
    const centerAmp = projections.amplitude[nodeIdx];
    let totalDiff = 0;
    
    for (const nIdx of neighbors) {
        const neighborAmp = projections.amplitude[nIdx];
        totalDiff += Math.abs(centerAmp - neighborAmp);
    }
    
    const avgDiff = totalDiff / neighbors.length;
    return 1.0 - avgDiff;
}

function performCrossValidation() {
    crossValidation = {};
    
    for (const rep of REPRESENTATIONS) {
        crossValidation[rep] = [];
    }
    
    for (let i = 0; i < nodes.length; i++) {
        crossValidation.binary[i] = validateBinaryConsistency(i);
        crossValidation.energetic[i] = validateEnergeticConsistency(i);
        crossValidation.entropic[i] = validateEntropicConsistency(i);
        crossValidation.ordinal[i] = validateOrdinalConsistency(i);
        crossValidation.amplitude[i] = validateAmplitudeConsistency(i);
        
        // Overall consistency = average of all projection consistencies
        consistency[i] = (
            crossValidation.binary[i] +
            crossValidation.energetic[i] + 
            crossValidation.entropic[i] +
            crossValidation.ordinal[i] +
            crossValidation.amplitude[i]
        ) / 5;
    }
}

////////////////////////////////////////////////////////////////////////////////
// ISOMORPHIC EVOLUTION
////////////////////////////////////////////////////////////////////////////////

function evolveMultirepresentatie() {
    const newCoreField = [...coreField];
    
    for (let i = 0; i < nodes.length; i++) {
        const neighbors = adjacency[i];
        if (neighbors.length === 0) continue;
        
        const currentConsistency = consistency[i];
        
        // If consistency is low, adjust core field toward neighbor average
        if (currentConsistency < 0.7) {
            let neighborSum = 0;
            for (const nIdx of neighbors) {
                neighborSum += coreField[nIdx];
            }
            const neighborAvg = neighborSum / neighbors.length;
            
            // Move toward neighbor average (low consistency adjustment)
            newCoreField[i] = coreField[i] + (neighborAvg - coreField[i]) * 0.1;
        }
        
        // Add small noise to prevent total equilibrium
        newCoreField[i] += (Math.random() - 0.5) * 0.01;
        
        // Keep in bounds [0,1]
        if (newCoreField[i] > 1) newCoreField[i] = 1;
        if (newCoreField[i] < 0) newCoreField[i] = 0;
    }
    
    coreField = newCoreField;
    updateAllProjections();
    performCrossValidation();
}

////////////////////////////////////////////////////////////////////////////////
// MULTIREPRESENTATIE ANALYSIS
////////////////////////////////////////////////////////////////////////////////

function analyzeProjectionDivergence() {
    let totalDivergence = 0;
    let maxDivergence = 0;
    let divergentNodes = 0;
    
    for (let i = 0; i < nodes.length; i++) {
        // Check how much projections disagree about local consistency
        const consistencies = [
            crossValidation.binary[i],
            crossValidation.energetic[i],
            crossValidation.entropic[i], 
            crossValidation.ordinal[i],
            crossValidation.amplitude[i]
        ];
        
        const maxCons = Math.max(...consistencies);
        const minCons = Math.min(...consistencies);
        const divergence = maxCons - minCons;
        
        totalDivergence += divergence;
        if (divergence > maxDivergence) maxDivergence = divergence;
        if (divergence > 0.3) divergentNodes++;
    }
    
    return {
        avgDivergence: totalDivergence / nodes.length,
        maxDivergence: maxDivergence,
        divergentNodes: divergentNodes,
        stability: divergentNodes < nodes.length * 0.2 ? 'STABLE' : 'UNSTABLE'
    };
}

function generateMultiSignature() {
    let signature = "";
    
    for (let i = 0; i < Math.min(8, nodes.length); i++) {
        const consistencies = [
            crossValidation.binary[i],
            crossValidation.energetic[i],
            crossValidation.entropic[i],
            crossValidation.ordinal[i], 
            crossValidation.amplitude[i]
        ];
        
        const avgConsistency = consistencies.reduce((a, b) => a + b, 0) / 5;
        
        if (avgConsistency > 0.8) {
            signature += "C"; // Consistent
        } else if (avgConsistency > 0.6) {
            signature += "P"; // Partial
        } else {
            signature += "D"; // Divergent
        }
    }
    
    return signature;
}

////////////////////////////////////////////////////////////////////////////////
// MULTIREPRESENTATIE LAYOUT
////////////////////////////////////////////////////////////////////////////////

function generateMultiLayout() {
    const layout = [];
    
    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        
        layout.push({
            id: i,
            coreValue: coreField[i],
            projections: {
                binary: projections.binary[i],
                energetic: projections.energetic[i],
                entropic: projections.entropic[i],
                ordinal: projections.ordinal[i],
                amplitude: projections.amplitude[i]
            },
            consistencies: {
                binary: crossValidation.binary[i],
                energetic: crossValidation.energetic[i], 
                entropic: crossValidation.entropic[i],
                ordinal: crossValidation.ordinal[i],
                amplitude: crossValidation.amplitude[i],
                overall: consistency[i]
            },
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

generateCoreField();

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
    const multiLayout = generateMultiLayout();
    const divergence = analyzeProjectionDivergence();
    
    ws.send(JSON.stringify({
        multi: multiLayout,
        adjacency: adjacency,
        divergence: divergence,
        signature: generateMultiSignature(),
        representations: REPRESENTATIONS
    }));
    
    ws.on("message", (data) => {
        try {
            const msg = JSON.parse(data);
            if (msg.type === "coreDisturbance") {
                if (msg.nodeId >= 0 && msg.nodeId < coreField.length) {
                    // Disturb core field directly
                    coreField[msg.nodeId] += (Math.random() - 0.5) * 0.2;
                    if (coreField[msg.nodeId] > 1) coreField[msg.nodeId] = 1;
                    if (coreField[msg.nodeId] < 0) coreField[msg.nodeId] = 0;
                    
                    updateAllProjections();
                    performCrossValidation();
                }
            }
        } catch (e) {
            console.log("Invalid message:", e);
        }
    });
});

// Multirepresentatie evolution loop
setInterval(() => {
    evolveMultirepresentatie();
    
    const payload = JSON.stringify({
        multi: generateMultiLayout(),
        adjacency: adjacency,
        divergence: analyzeProjectionDivergence(),
        signature: generateMultiSignature(),
        representations: REPRESENTATIONS
    });
    
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(payload);
        }
    });
}, 300);

////////////////////////////////////////////////////////////////////////////////
// HTML INTERFACE
////////////////////////////////////////////////////////////////////////////////

function generateHTML() {
    return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>hexKERnKERnel MULTIREPRESENTATIE - Isomorphic Projections</title>
<style>
body { 
    margin: 0; 
    background: black; 
    color: white;
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
    background: rgba(0,0,0,0.9);
    padding: 15px;
    border-radius: 8px;
    font-size: 9px;
    border: 1px solid white;
    max-width: 180px;
}
.metric {
    margin: 2px 0;
}
.consistent {
    color: lime;
    font-weight: bold;
}
.partial {
    color: yellow;
}
.divergent {
    color: red;
}
.stable {
    color: cyan;
}
</style>
</head>
<body>
<div class="container">
    <div class="view">
        <canvas id="multiCanvas"></canvas>
        <div class="info">
            <div class="metric">MULTIREPRESENTATIE FIELD</div>
            <div class="metric">Stability: <span id="stability" class="stable">-</span></div>
            <div class="metric">Avg Divergence: <span id="avgDiv" class="consistent">0</span></div>
            <div class="metric">Max Divergence: <span id="maxDiv" class="divergent">0</span></div>
            <div class="metric">Divergent Nodes: <span id="divNodes" class="partial">0</span></div>
            <div class="metric">Signature: <span id="signature" class="consistent">---</span></div>
        </div>
    </div>
    <div class="view">
        <canvas id="consistencyCanvas"></canvas>
        <div class="info">
            <div class="metric">CROSS-VALIDATION</div>
            <div class="metric">Click: disturb core field</div>
            <div class="metric">B = Binary consistency</div>
            <div class="metric">E = Energetic consistency</div>
            <div class="metric">N = Entropic consistency</div>
            <div class="metric">O = Ordinal consistency</div>
            <div class="metric">A = Amplitude consistency</div>
            <div class="metric">Size = Overall consistency</div>
        </div>
    </div>
</div>

<script>
const ws = new WebSocket("ws://localhost:8080");
const multiCanvas = document.getElementById("multiCanvas");
const consistencyCanvas = document.getElementById("consistencyCanvas");
const multiCtx = multiCanvas.getContext("2d");
const consistencyCtx = consistencyCanvas.getContext("2d");

multiCanvas.width = multiCanvas.offsetWidth;
multiCanvas.height = multiCanvas.offsetHeight;
consistencyCanvas.width = consistencyCanvas.offsetWidth;
consistencyCanvas.height = consistencyCanvas.offsetHeight;

let multiData = null;

ws.onmessage = (event) => {
    multiData = JSON.parse(event.data);
    renderMultiField();
    renderConsistencyField();
    updateMetrics();
};

function getCoreColor(coreValue, consistency) {
    // Map core value to hue, consistency to saturation
    const hue = coreValue * 360;
    const sat = consistency * 100;
    const light = 30 + consistency * 50;
    
    return \`hsl(\${hue}, \${sat}%, \${light}%)\`;
}

function renderMultiField() {
    if (!multiData) return;
    
    multiCtx.fillStyle = "black";
    multiCtx.fillRect(0, 0, multiCanvas.width, multiCanvas.height);
    
    const centerX = multiCanvas.width / 2;
    const centerY = multiCanvas.height / 2;
    
    // Multi-representation field visualization
    for (const node of multiData.multi) {
        const hexX = node.q + node.r * 0.5;
        const hexY = node.r * 0.866;
        
        const x = centerX + hexX * 35;
        const y = centerY - hexY * 35;
        
        // Size based on overall consistency
        const size = 4 + node.consistencies.overall * 12;
        
        // Color based on core value and consistency
        const color = getCoreColor(node.coreValue, node.consistencies.overall);
        
        multiCtx.fillStyle = color;
        multiCtx.strokeStyle = node.consistencies.overall > 0.8 ? "white" : "red";
        multiCtx.lineWidth = node.consistencies.overall > 0.8 ? 2 : 1;
        
        // Core field representation
        multiCtx.beginPath();
        multiCtx.arc(x, y, size, 0, 2 * Math.PI);
        multiCtx.fill();
        multiCtx.stroke();
        
        // Projection indicators around the core
        const projections = ['binary', 'energetic', 'entropic', 'ordinal', 'amplitude'];
        for (let p = 0; p < projections.length; p++) {
            const proj = projections[p];
            const angle = (p / projections.length) * 2 * Math.PI;
            const radius = size + 8;
            
            const px = x + radius * Math.cos(angle);
            const py = y + radius * Math.sin(angle);
            
            const consistency = node.consistencies[proj];
            const projSize = 2 + consistency * 3;
            
            // Color based on projection type
            let projColor;
            switch(proj) {
                case 'binary': projColor = 'lime'; break;
                case 'energetic': projColor = 'red'; break;
                case 'entropic': projColor = 'cyan'; break;
                case 'ordinal': projColor = 'yellow'; break;
                case 'amplitude': projColor = 'magenta'; break;
            }
            
            multiCtx.fillStyle = projColor;
            multiCtx.globalAlpha = consistency;
            multiCtx.beginPath();
            multiCtx.arc(px, py, projSize, 0, 2 * Math.PI);
            multiCtx.fill();
            multiCtx.globalAlpha = 1.0;
        }
        
        // Store for interaction
        node.screenX = x;
        node.screenY = y;
        node.screenSize = size;
    }
    
    // Draw consistency connections
    for (const node of multiData.multi) {
        for (const neighborId of node.neighbors) {
            const neighbor = multiData.multi[neighborId];
            if (neighbor && neighbor.screenX) {
                const avgConsistency = (node.consistencies.overall + neighbor.consistencies.overall) / 2;
                
                multiCtx.strokeStyle = \`rgba(255, 255, 255, \${avgConsistency * 0.3})\`;
                multiCtx.lineWidth = 1 + avgConsistency;
                
                multiCtx.beginPath();
                multiCtx.moveTo(node.screenX, node.screenY);
                multiCtx.lineTo(neighbor.screenX, neighbor.screenY);
                multiCtx.stroke();
            }
        }
    }
}

function renderConsistencyField() {
    if (!multiData) return;
    
    consistencyCtx.fillStyle = "black";
    consistencyCtx.fillRect(0, 0, consistencyCanvas.width, consistencyCanvas.height);
    
    // Consistency matrix visualization
    const projections = ['binary', 'energetic', 'entropic', 'ordinal', 'amplitude'];
    const cellWidth = consistencyCanvas.width / (projections.length + 1);
    const cellHeight = consistencyCanvas.height / multiData.multi.length;
    
    // Headers
    consistencyCtx.fillStyle = "white";
    consistencyCtx.font = "10px monospace";
    consistencyCtx.textAlign = "center";
    
    for (let p = 0; p < projections.length; p++) {
        const x = (p + 1) * cellWidth + cellWidth/2;
        const y = 15;
        consistencyCtx.fillText(projections[p][0].toUpperCase(), x, y);
    }
    
    // Consistency matrix
    for (let i = 0; i < Math.min(20, multiData.multi.length); i++) {
        const node = multiData.multi[i];
        const y = (i + 1) * cellHeight;
        
        // Node ID
        consistencyCtx.fillStyle = "gray";
        consistencyCtx.textAlign = "right";
        consistencyCtx.fillText(i.toString(), cellWidth - 5, y + cellHeight/2);
        
        // Projection consistencies
        for (let p = 0; p < projections.length; p++) {
            const proj = projections[p];
            const x = (p + 1) * cellWidth;
            const consistency = node.consistencies[proj];
            
            // Color based on consistency level
            let color;
            if (consistency > 0.8) {
                color = \`rgb(0, \${Math.floor(consistency * 255)}, 0)\`;
            } else if (consistency > 0.5) {
                color = \`rgb(\${Math.floor(consistency * 255)}, \${Math.floor(consistency * 255)}, 0)\`;
            } else {
                color = \`rgb(\${Math.floor((1-consistency) * 255)}, 0, 0)\`;
            }
            
            consistencyCtx.fillStyle = color;
            consistencyCtx.fillRect(x, y, cellWidth - 1, cellHeight - 1);
            
            // Consistency value text
            consistencyCtx.fillStyle = "white";
            consistencyCtx.font = "8px monospace";
            consistencyCtx.textAlign = "center";
            consistencyCtx.fillText(consistency.toFixed(2), x + cellWidth/2, y + cellHeight/2);
        }
    }
}

function updateMetrics() {
    if (!multiData) return;
    
    document.getElementById("stability").textContent = multiData.divergence.stability;
    document.getElementById("stability").className = multiData.divergence.stability === 'STABLE' ? 'stable' : 'divergent';
    
    document.getElementById("avgDiv").textContent = multiData.divergence.avgDivergence.toFixed(3);
    document.getElementById("maxDiv").textContent = multiData.divergence.maxDivergence.toFixed(3);
    document.getElementById("divNodes").textContent = multiData.divergence.divergentNodes;
    document.getElementById("signature").textContent = multiData.signature;
}

multiCanvas.addEventListener("click", (event) => {
    if (!multiData) return;
    
    const rect = multiCanvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    for (const node of multiData.multi) {
        if (node.screenX && node.screenY) {
            const dx = x - node.screenX;
            const dy = y - node.screenY;
            const dist = dx * dx + dy * dy;
            
            if (dist < node.screenSize * node.screenSize) {
                ws.send(JSON.stringify({
                    type: "coreDisturbance",
                    nodeId: node.id
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
    console.log(`hexKERnKERnel MULTIREPRESENTATIE running at http://localhost:${PORT}`);
    console.log(`Isomorphic projections - Cross-validation system`);
    console.log(`Representations: ${REPRESENTATIONS.join(', ')}`);
    console.log(`No single fundamental layer`);
});
