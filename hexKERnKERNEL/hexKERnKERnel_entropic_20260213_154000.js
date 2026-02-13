/*
hexKERnKERnel_entropic_20260213_154000.js

PURE ENTROPIC INFORMATION IMPLEMENTATION
========================================

No energy levels
No physical substrate
No discrete states
No symbolic abstraction

Only:
- Information differentials
- Entropy gradients
- Pattern vs noise
- Shannon information flow

Pure informational computation
*/

const WebSocket = require("ws");
const http = require("http");
const fs = require("fs");
const path = require("path");

////////////////////////////////////////////////////////////////////////////////
// ENTROPIC PARAMETERS
////////////////////////////////////////////////////////////////////////////////

const PORT = 8080;
const HEX_RADIUS = 6;

let nodes = [];
let informationField = [];
let adjacency = [];
let entropyGradients = [];
let globalComplexity = 0;
let patternEmergence = false;

////////////////////////////////////////////////////////////////////////////////
// PURE INFORMATIONAL TOPOLOGY
////////////////////////////////////////////////////////////////////////////////

function generateInformationField() {
    nodes = [];
    informationField = [];
    adjacency = [];
    entropyGradients = [];
    
    // Generate nodes as information points
    for (let q = -HEX_RADIUS; q <= HEX_RADIUS; q++) {
        for (let r = -HEX_RADIUS; r <= HEX_RADIUS; r++) {
            if (Math.abs(q + r) <= HEX_RADIUS) {
                nodes.push({ 
                    id: nodes.length,
                    q, r
                });
                // Initial information state - random pattern
                informationField.push(Math.random());
                adjacency.push([]);
                entropyGradients.push(0);
            }
        }
    }
    
    // Build information connectivity
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
}

////////////////////////////////////////////////////////////////////////////////
// PURE INFORMATIONAL OPERATIONS
////////////////////////////////////////////////////////////////////////////////

function shannonEntropy(sequence) {
    // Calculate Shannon entropy of sequence
    const freq = {};
    for (const val of sequence) {
        const rounded = Math.floor(val * 10) / 10; // Discretize for counting
        freq[rounded] = (freq[rounded] || 0) + 1;
    }
    
    let entropy = 0;
    const total = sequence.length;
    
    for (const count of Object.values(freq)) {
        const p = count / total;
        if (p > 0) {
            entropy -= p * Math.log2(p);
        }
    }
    
    return entropy;
}

function measureLocalComplexity(nodeIdx) {
    const neighbors = adjacency[nodeIdx];
    const centerInfo = informationField[nodeIdx];
    
    if (neighbors.length === 0) return 0;
    
    // Gather local information neighborhood
    const localPattern = [centerInfo];
    for (const nIdx of neighbors) {
        localPattern.push(informationField[nIdx]);
    }
    
    // Measure Kolmogorov complexity approximation via compression ratio
    const entropy = shannonEntropy(localPattern);
    const maxEntropy = Math.log2(localPattern.length);
    
    // Complexity = deviation from maximum entropy (pure noise)
    return maxEntropy - entropy;
}

function assessInformationFlow() {
    let totalComplexity = 0;
    let patternNodes = 0;
    
    for (let i = 0; i < nodes.length; i++) {
        const complexity = measureLocalComplexity(i);
        entropyGradients[i] = complexity;
        totalComplexity += complexity;
        
        // Pattern detection: low entropy = high pattern
        if (complexity > 0.5) {
            patternNodes++;
        }
    }
    
    globalComplexity = totalComplexity / nodes.length;
    patternEmergence = patternNodes > nodes.length / 3;
    
    return {
        complexity: globalComplexity,
        emergence: patternEmergence,
        patternRatio: patternNodes / nodes.length,
        flow: patternEmergence ? 'ORDERING' : 'DISPERSING'
    };
}

////////////////////////////////////////////////////////////////////////////////
// ENTROPY EQUILIBRATION - PURE INFORMATION DYNAMICS
////////////////////////////////////////////////////////////////////////////////

function equilibrateInformationField() {
    const newInformationField = [...informationField];
    
    for (let i = 0; i < nodes.length; i++) {
        const neighbors = adjacency[i];
        const currentInfo = informationField[i];
        
        if (neighbors.length === 0) continue;
        
        // Information flow based on entropy gradients
        let totalNeighborInfo = 0;
        let entropyDifference = 0;
        
        for (const nIdx of neighbors) {
            const neighborInfo = informationField[nIdx];
            totalNeighborInfo += neighborInfo;
            
            // Entropy flows to equilibrium
            entropyDifference += Math.abs(neighborInfo - currentInfo);
        }
        
        const avgNeighborInfo = totalNeighborInfo / neighbors.length;
        const localEntropyGradient = entropyDifference / neighbors.length;
        
        // Information diffusion based on local complexity
        let infoFlow = 0;
        
        if (localEntropyGradient > 0.1) {
            // High gradient - information flows toward equilibrium
            infoFlow = (avgNeighborInfo - currentInfo) * 0.1;
        }
        
        // Add noise to prevent total equilibrium
        const noise = (Math.random() - 0.5) * 0.02;
        
        newInformationField[i] = currentInfo + infoFlow + noise;
        
        // Bounds: information is normalized [0,1]
        if (newInformationField[i] > 1) newInformationField[i] = 1;
        if (newInformationField[i] < 0) newInformationField[i] = 0;
    }
    
    informationField = newInformationField;
}

////////////////////////////////////////////////////////////////////////////////
// PATTERN RECOGNITION FROM ENTROPY
////////////////////////////////////////////////////////////////////////////////

function extractPatternSignature() {
    let signature = "";
    
    for (let i = 0; i < nodes.length; i += 5) {
        const complexity = entropyGradients[i];
        
        // Map complexity to information symbols
        if (complexity > 2.0) {
            signature += "H"; // High pattern
        } else if (complexity > 1.0) {
            signature += "M"; // Medium pattern  
        } else if (complexity > 0.5) {
            signature += "L"; // Low pattern
        } else {
            signature += "N"; // Noise
        }
    }
    
    return signature.substring(0, 8);
}

function measureInformationDistribution() {
    const bins = [0, 0, 0, 0, 0]; // 5 entropy bins
    
    for (const info of informationField) {
        const bin = Math.floor(info * 5);
        if (bin >= 0 && bin < 5) {
            bins[bin]++;
        }
    }
    
    return bins;
}

////////////////////////////////////////////////////////////////////////////////
// INFORMATIONAL VISUALIZATION
////////////////////////////////////////////////////////////////////////////////

function generateInformationalLayout() {
    const layout = [];
    
    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const info = informationField[i];
        const complexity = entropyGradients[i];
        const entropy = shannonEntropy([info]); // Single point entropy approximation
        
        layout.push({
            id: i,
            information: info,
            complexity: complexity,
            entropy: entropy,
            pattern: complexity > 1.0 ? 'PATTERN' : 'NOISE',
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

generateInformationField();

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
    const infoLayout = generateInformationalLayout();
    const flowState = assessInformationFlow();
    const distribution = measureInformationDistribution();
    
    ws.send(JSON.stringify({
        information: infoLayout,
        adjacency: adjacency,
        flowState: flowState,
        distribution: distribution,
        signature: extractPatternSignature(),
        complexity: globalComplexity
    }));
    
    ws.on("message", (data) => {
        try {
            const msg = JSON.parse(data);
            if (msg.type === "informationInjection") {
                if (msg.nodeId >= 0 && msg.nodeId < informationField.length) {
                    if (msg.pattern) {
                        // Inject ordered pattern
                        informationField[msg.nodeId] = 0.8 + Math.random() * 0.2;
                    } else {
                        // Inject noise
                        informationField[msg.nodeId] = Math.random();
                    }
                }
            }
        } catch (e) {
            console.log("Invalid message:", e);
        }
    });
});

// Information equilibration loop
setInterval(() => {
    equilibrateInformationField();
    
    const payload = JSON.stringify({
        information: generateInformationalLayout(),
        adjacency: adjacency,
        flowState: assessInformationFlow(),
        distribution: measureInformationDistribution(),
        signature: extractPatternSignature(),
        complexity: globalComplexity
    });
    
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(payload);
        }
    });
}, 150);

////////////////////////////////////////////////////////////////////////////////
// HTML INTERFACE
////////////////////////////////////////////////////////////////////////////////

function generateHTML() {
    return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>hexKERnKERnel ENTROPIC - Pure Information Field</title>
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
    font-size: 10px;
    border: 1px solid cyan;
}
.metric {
    margin: 2px 0;
}
.pattern {
    color: cyan;
    font-weight: bold;
}
.noise {
    color: magenta;
}
.complexity {
    color: yellow;
}
</style>
</head>
<body>
<div class="container">
    <div class="view">
        <canvas id="infoCanvas"></canvas>
        <div class="info">
            <div class="metric">INFORMATION FIELD</div>
            <div class="metric">Flow: <span id="infoFlow" class="pattern">-</span></div>
            <div class="metric">Emergence: <span id="emergence" class="complexity">-</span></div>
            <div class="metric">Complexity: <span id="complexity" class="complexity">0</span></div>
            <div class="metric">Signature: <span id="signature" class="pattern">---</span></div>
        </div>
    </div>
    <div class="view">
        <canvas id="entropyCanvas"></canvas>
        <div class="info">
            <div class="metric">ENTROPY DISTRIBUTION</div>
            <div class="metric">Click: inject pattern</div>
            <div class="metric">Shift+Click: inject noise</div>
            <div class="metric">H = High pattern</div>
            <div class="metric">M = Medium pattern</div>
            <div class="metric">L = Low pattern</div>
            <div class="metric">N = Pure noise</div>
        </div>
    </div>
</div>

<script>
const ws = new WebSocket("ws://localhost:8080");
const infoCanvas = document.getElementById("infoCanvas");
const entropyCanvas = document.getElementById("entropyCanvas");
const infoCtx = infoCanvas.getContext("2d");
const entropyCtx = entropyCanvas.getContext("2d");

infoCanvas.width = infoCanvas.offsetWidth;
infoCanvas.height = infoCanvas.offsetHeight;
entropyCanvas.width = entropyCanvas.offsetWidth;
entropyCanvas.height = entropyCanvas.offsetHeight;

let infoData = null;

ws.onmessage = (event) => {
    infoData = JSON.parse(event.data);
    renderInformationField();
    renderEntropyField();
    updateMetrics();
};

function getInformationColor(info, complexity) {
    // Map information value and complexity to color
    const hue = info * 360; // Information -> hue
    const sat = Math.min(complexity * 50, 100); // Complexity -> saturation
    const light = 30 + (1 - complexity) * 40; // Inverted complexity -> lightness
    
    return \`hsl(\${hue}, \${sat}%, \${light}%)\`;
}

function renderInformationField() {
    if (!infoData) return;
    
    infoCtx.fillStyle = "black";
    infoCtx.fillRect(0, 0, infoCanvas.width, infoCanvas.height);
    
    const centerX = infoCanvas.width / 2;
    const centerY = infoCanvas.height / 2;
    
    // Information field visualization
    for (const node of infoData.information) {
        const hexX = node.q + node.r * 0.5;
        const hexY = node.r * 0.866;
        
        const x = centerX + hexX * 28;
        const y = centerY - hexY * 28;
        
        // Size based on complexity (pattern strength)
        const size = 4 + node.complexity * 8;
        
        // Color based on information content and complexity
        const color = getInformationColor(node.information, node.complexity);
        
        infoCtx.fillStyle = color;
        infoCtx.strokeStyle = node.pattern === 'PATTERN' ? "white" : "gray";
        infoCtx.lineWidth = node.pattern === 'PATTERN' ? 2 : 1;
        
        infoCtx.beginPath();
        
        // Information representation - circle with complexity variations
        if (node.pattern === 'PATTERN') {
            // Hexagonal for patterns
            for (let i = 0; i < 6; i++) {
                const angle = (i * Math.PI) / 3;
                const hx = x + size * Math.cos(angle);
                const hy = y + size * Math.sin(angle);
                
                if (i === 0) {
                    infoCtx.moveTo(hx, hy);
                } else {
                    infoCtx.lineTo(hx, hy);
                }
            }
            infoCtx.closePath();
        } else {
            // Circular for noise
            infoCtx.arc(x, y, size, 0, 2 * Math.PI);
        }
        
        infoCtx.fill();
        infoCtx.stroke();
        
        // Entropy gradient indicator
        if (node.complexity > 1.5) {
            infoCtx.strokeStyle = "cyan";
            infoCtx.lineWidth = 3;
            infoCtx.beginPath();
            infoCtx.arc(x, y, size + 6, 0, 2 * Math.PI);
            infoCtx.stroke();
        }
        
        // Store for interaction
        node.screenX = x;
        node.screenY = y;
        node.screenSize = size;
    }
    
    // Draw information flow connections
    infoCtx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    infoCtx.lineWidth = 1;
    
    for (const node of infoData.information) {
        for (const neighborId of node.neighbors) {
            const neighbor = infoData.information[neighborId];
            if (neighbor && neighbor.screenX) {
                // Connection thickness based on information difference
                const infoDiff = Math.abs(node.information - neighbor.information);
                infoCtx.lineWidth = 1 + infoDiff * 2;
                
                infoCtx.beginPath();
                infoCtx.moveTo(node.screenX, node.screenY);
                infoCtx.lineTo(neighbor.screenX, neighbor.screenY);
                infoCtx.stroke();
            }
        }
    }
}

function renderEntropyField() {
    if (!infoData) return;
    
    entropyCtx.fillStyle = "black";
    entropyCtx.fillRect(0, 0, entropyCanvas.width, entropyCanvas.height);
    
    // Entropy distribution histogram
    const binWidth = entropyCanvas.width / infoData.distribution.length;
    const totalNodes = infoData.information.length;
    
    for (let i = 0; i < infoData.distribution.length; i++) {
        const count = infoData.distribution[i];
        const height = (count / totalNodes) * entropyCanvas.height * 0.8;
        
        const x = i * binWidth;
        const y = entropyCanvas.height - height;
        
        // Color based on entropy level
        const hue = i * 60; // Different hues for different entropy levels
        const color = \`hsl(\${hue}, 70%, 50%)\`;
        
        entropyCtx.fillStyle = color;
        entropyCtx.fillRect(x, y, binWidth - 2, height);
        
        // Bin label
        entropyCtx.fillStyle = "white";
        entropyCtx.font = "12px monospace";
        entropyCtx.textAlign = "center";
        entropyCtx.fillText((i * 0.2).toFixed(1), x + binWidth/2, entropyCanvas.height - 5);
        entropyCtx.fillText(count.toString(), x + binWidth/2, y - 5);
    }
    
    // Global complexity indicator
    const complexityBar = infoData.complexity / 3 * entropyCanvas.width;
    entropyCtx.fillStyle = "rgba(255, 255, 0, 0.5)";
    entropyCtx.fillRect(0, entropyCanvas.height - 20, complexityBar, 20);
    
    // Pattern signature overlay
    entropyCtx.fillStyle = "white";
    entropyCtx.font = "16px monospace";
    entropyCtx.textAlign = "center";
    entropyCtx.fillText(infoData.signature, entropyCanvas.width/2, 30);
}

function updateMetrics() {
    if (!infoData) return;
    
    document.getElementById("infoFlow").textContent = infoData.flowState.flow;
    document.getElementById("emergence").textContent = infoData.flowState.emergence ? 'YES' : 'NO';
    document.getElementById("complexity").textContent = infoData.complexity.toFixed(3);
    document.getElementById("signature").textContent = infoData.signature;
}

infoCanvas.addEventListener("click", (event) => {
    if (!infoData) return;
    
    const rect = infoCanvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    for (const node of infoData.information) {
        if (node.screenX && node.screenY) {
            const dx = x - node.screenX;
            const dy = y - node.screenY;
            const dist = dx * dx + dy * dy;
            
            if (dist < node.screenSize * node.screenSize) {
                ws.send(JSON.stringify({
                    type: "informationInjection",
                    nodeId: node.id,
                    pattern: !event.shiftKey
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
    console.log(`hexKERnKERnel ENTROPIC running at http://localhost:${PORT}`);
    console.log(`Pure information field - Entropy differentials`);
    console.log(`Pattern vs noise - Shannon information flow`);
    console.log(`No physical substrate - Only information dynamics`);
});
