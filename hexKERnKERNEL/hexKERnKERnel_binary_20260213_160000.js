/*
hexKERnKERnel_binary_20260213_160000.js

PURE BINARY INFORMATION IMPLEMENTATION
======================================

No numbers
No mathematics
No floating point
No constants
No abstractions

Only:
- Binary states (0|1)
- XOR operations
- Bit patterns
- Hamming distances

Absolute informational fundament
*/

const WebSocket = require("ws");
const http = require("http");
const fs = require("fs");
const path = require("path");

////////////////////////////////////////////////////////////////////////////////
// BINARY PARAMETERS
////////////////////////////////////////////////////////////////////////////////

const PORT = 8080;
const HEX_RADIUS = 6;
const PATTERN_BITS = 8; // 8-bit information per node

let nodes = [];
let bitField = [];
let adjacency = [];
let hammingGradients = [];
let globalPattern = 0;
let bitEmergence = false;

////////////////////////////////////////////////////////////////////////////////
// PURE BINARY TOPOLOGY
////////////////////////////////////////////////////////////////////////////////

function generateBitField() {
    nodes = [];
    bitField = [];
    adjacency = [];
    hammingGradients = [];
    
    // Generate nodes as bit points
    for (let q = -HEX_RADIUS; q <= HEX_RADIUS; q++) {
        for (let r = -HEX_RADIUS; r <= HEX_RADIUS; r++) {
            if (Math.abs(q + r) <= HEX_RADIUS) {
                nodes.push({ 
                    id: nodes.length,
                    q, r
                });
                // Initial bit state - pseudo-random pattern
                bitField.push(generatePseudoRandomBits(nodes.length));
                adjacency.push([]);
                hammingGradients.push(0);
            }
        }
    }
    
    // Build binary connectivity
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
// PURE BINARY OPERATIONS
////////////////////////////////////////////////////////////////////////////////

function generatePseudoRandomBits(seed) {
    // Linear congruential generator for deterministic bit patterns
    let x = seed | 1; // Ensure odd
    x ^= x << 13;
    x ^= x >> 17;
    x ^= x << 5;
    return (x >>> 0) & ((1 << PATTERN_BITS) - 1);
}

function popcount(n) {
    // Count set bits (population count)
    let count = 0;
    while (n) {
        count += n & 1;
        n >>>= 1;
    }
    return count;
}

function hammingDistance(a, b) {
    // Hamming distance = popcount of XOR
    return popcount(a ^ b);
}

function measureLocalComplexity(nodeIdx) {
    const neighbors = adjacency[nodeIdx];
    const centerBits = bitField[nodeIdx];
    
    if (neighbors.length === 0) return 0;
    
    // Measure Hamming distances to all neighbors
    let totalDistance = 0;
    
    for (const nIdx of neighbors) {
        const neighborBits = bitField[nIdx];
        totalDistance += hammingDistance(centerBits, neighborBits);
    }
    
    // Average Hamming distance = local complexity
    return totalDistance >>> 3; // Divide by 8 via bit shift
}

function assessBitPattern() {
    let totalComplexity = 0;
    let patternNodes = 0;
    
    for (let i = 0; i < nodes.length; i++) {
        const complexity = measureLocalComplexity(i);
        hammingGradients[i] = complexity;
        totalComplexity += complexity;
        
        // Pattern detection: low Hamming distance = high pattern
        if (complexity < 3) { // Less than 3 average bit differences
            patternNodes++;
        }
    }
    
    globalPattern = totalComplexity >>> 6; // Bit shift division
    bitEmergence = (patternNodes << 2) > nodes.length; // *4 comparison via shift
    
    return {
        pattern: globalPattern,
        emergence: bitEmergence,
        patternRatio: patternNodes << 8, // Scale up for visualization
        flow: bitEmergence ? 1 : 0 // ORDERING : DISPERSING
    };
}

////////////////////////////////////////////////////////////////////////////////
// BIT EQUILIBRATION - PURE BINARY DYNAMICS
////////////////////////////////////////////////////////////////////////////////

function equilibrateBitField() {
    const newBitField = [...bitField];
    
    for (let i = 0; i < nodes.length; i++) {
        const neighbors = adjacency[i];
        const currentBits = bitField[i];
        
        if (neighbors.length === 0) continue;
        
        // XOR-based information flow
        let xorAccumulator = 0;
        let majorityAccumulator = 0;
        
        for (const nIdx of neighbors) {
            const neighborBits = bitField[nIdx];
            xorAccumulator ^= neighborBits;
            majorityAccumulator += popcount(neighborBits);
        }
        
        // Bit flow rule: XOR with accumulated neighbor patterns
        let newBits = currentBits ^ (xorAccumulator & 0x0F); // XOR with lower 4 bits
        
        // Add bit noise via LFSR (Linear Feedback Shift Register)
        const noise = generatePseudoRandomBits(i + globalPattern);
        newBits ^= noise & 1; // XOR with single noise bit
        
        // Ensure valid bit range
        newBitField[i] = newBits & ((1 << PATTERN_BITS) - 1);
    }
    
    bitField = newBitField;
}

////////////////////////////////////////////////////////////////////////////////
// BINARY PATTERN RECOGNITION
////////////////////////////////////////////////////////////////////////////////

function extractBitSignature() {
    let signature = 0;
    
    for (let i = 0; i < 8 && i < nodes.length; i++) {
        const complexity = hammingGradients[i];
        
        // Map complexity to signature bit
        if (complexity < 2) {
            signature |= (1 << i); // Set bit for pattern
        }
        // Leave bit unset for noise
    }
    
    return signature;
}

function measureBitDistribution() {
    const distribution = [0, 0, 0, 0, 0, 0, 0, 0]; // 8 popcount bins
    
    for (const bits of bitField) {
        const popCount = popcount(bits);
        if (popCount < distribution.length) {
            distribution[popCount]++;
        }
    }
    
    return distribution;
}

////////////////////////////////////////////////////////////////////////////////
// BINARY VISUALIZATION
////////////////////////////////////////////////////////////////////////////////

function generateBinaryLayout() {
    const layout = [];
    
    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const bits = bitField[i];
        const complexity = hammingGradients[i];
        const popCount = popcount(bits);
        
        layout.push({
            id: i,
            bits: bits,
            complexity: complexity,
            popcount: popCount,
            pattern: complexity < 3 ? 1 : 0, // PATTERN : NOISE
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

generateBitField();

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
    const binaryLayout = generateBinaryLayout();
    const bitState = assessBitPattern();
    const distribution = measureBitDistribution();
    
    ws.send(JSON.stringify({
        binary: binaryLayout,
        adjacency: adjacency,
        bitState: bitState,
        distribution: distribution,
        signature: extractBitSignature(),
        pattern: globalPattern
    }));
    
    ws.on("message", (data) => {
        try {
            const msg = JSON.parse(data);
            if (msg.type === "bitInjection") {
                if (msg.nodeId >= 0 && msg.nodeId < bitField.length) {
                    if (msg.flip) {
                        // Flip random bit
                        const bitPos = generatePseudoRandomBits(msg.nodeId) & 7; // 0-7
                        bitField[msg.nodeId] ^= (1 << bitPos);
                    } else {
                        // Set all bits to pattern or noise
                        bitField[msg.nodeId] = msg.pattern ? 0xFF : generatePseudoRandomBits(msg.nodeId);
                    }
                }
            }
        } catch (e) {
            console.log("Invalid message:", e);
        }
    });
});

// Binary equilibration loop
setInterval(() => {
    equilibrateBitField();
    
    const payload = JSON.stringify({
        binary: generateBinaryLayout(),
        adjacency: adjacency,
        bitState: assessBitPattern(),
        distribution: measureBitDistribution(),
        signature: extractBitSignature(),
        pattern: globalPattern
    });
    
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(payload);
        }
    });
}, 200);

////////////////////////////////////////////////////////////////////////////////
// HTML INTERFACE
////////////////////////////////////////////////////////////////////////////////

function generateHTML() {
    return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>hexKERnKERnel BINARY - Pure Bit Information</title>
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
    border: 1px solid lime;
}
.metric {
    margin: 2px 0;
}
.binary {
    color: lime;
    font-weight: bold;
    font-family: 'Courier New', monospace;
}
.pattern {
    color: cyan;
}
.noise {
    color: red;
}
</style>
</head>
<body>
<div class="container">
    <div class="view">
        <canvas id="bitCanvas"></canvas>
        <div class="info">
            <div class="metric">BINARY FIELD</div>
            <div class="metric">Flow: <span id="bitFlow" class="binary">-</span></div>
            <div class="metric">Emergence: <span id="bitEmergence" class="pattern">-</span></div>
            <div class="metric">Pattern: <span id="bitPattern" class="binary">0</span></div>
            <div class="metric">Signature: <span id="bitSignature" class="binary">00000000</span></div>
        </div>
    </div>
    <div class="view">
        <canvas id="hammingCanvas"></canvas>
        <div class="info">
            <div class="metric">HAMMING DISTRIBUTION</div>
            <div class="metric">Click: flip random bit</div>
            <div class="metric">Shift+Click: inject pattern/noise</div>
            <div class="metric">0-7: popcount bins</div>
            <div class="metric">Pattern = low Hamming distance</div>
            <div class="metric">Noise = high Hamming distance</div>
        </div>
    </div>
</div>

<script>
const ws = new WebSocket("ws://localhost:8080");
const bitCanvas = document.getElementById("bitCanvas");
const hammingCanvas = document.getElementById("hammingCanvas");
const bitCtx = bitCanvas.getContext("2d");
const hammingCtx = hammingCanvas.getContext("2d");

bitCanvas.width = bitCanvas.offsetWidth;
bitCanvas.height = bitCanvas.offsetHeight;
hammingCanvas.width = hammingCanvas.offsetWidth;
hammingCanvas.height = hammingCanvas.offsetHeight;

let bitData = null;

ws.onmessage = (event) => {
    bitData = JSON.parse(event.data);
    renderBitField();
    renderHammingField();
    updateMetrics();
};

function getBitColor(bits, popcount) {
    // Map bits to grayscale based on popcount
    const intensity = (popcount / 8) * 255;
    return \`rgb(\${intensity}, \${intensity}, \${intensity})\`;
}

function renderBitField() {
    if (!bitData) return;
    
    bitCtx.fillStyle = "black";
    bitCtx.fillRect(0, 0, bitCanvas.width, bitCanvas.height);
    
    const centerX = bitCanvas.width / 2;
    const centerY = bitCanvas.height / 2;
    
    // Binary field visualization
    for (const node of bitData.binary) {
        const hexX = node.q + node.r * 0.5;
        const hexY = node.r * 0.866;
        
        const x = centerX + hexX * 30;
        const y = centerY - hexY * 30;
        
        // Size based on complexity (Hamming distance)
        const size = 4 + (8 - node.complexity);
        
        // Color based on bit popcount
        const baseColor = getBitColor(node.bits, node.popcount);
        
        bitCtx.fillStyle = baseColor;
        bitCtx.strokeStyle = node.pattern ? "cyan" : "red";
        bitCtx.lineWidth = node.pattern ? 2 : 1;
        
        bitCtx.beginPath();
        
        // Binary representation - different shapes for pattern vs noise
        if (node.pattern) {
            // Square for patterns (low Hamming distance)
            bitCtx.fillRect(x - size/2, y - size/2, size, size);
            bitCtx.strokeRect(x - size/2, y - size/2, size, size);
        } else {
            // Circle for noise (high Hamming distance)
            bitCtx.arc(x, y, size, 0, 2 * Math.PI);
            bitCtx.fill();
            bitCtx.stroke();
        }
        
        // Bit pattern visualization - small dots for each bit
        for (let bit = 0; bit < 8; bit++) {
            if ((node.bits >> bit) & 1) {
                const angle = (bit / 8) * 2 * Math.PI;
                const dotX = x + (size + 8) * Math.cos(angle);
                const dotY = y + (size + 8) * Math.sin(angle);
                
                bitCtx.fillStyle = "lime";
                bitCtx.beginPath();
                bitCtx.arc(dotX, dotY, 1, 0, 2 * Math.PI);
                bitCtx.fill();
            }
        }
        
        // Store for interaction
        node.screenX = x;
        node.screenY = y;
        node.screenSize = size;
    }
    
    // Draw binary connections - thickness based on XOR difference
    for (const node of bitData.binary) {
        for (const neighborId of node.neighbors) {
            const neighbor = bitData.binary[neighborId];
            if (neighbor && neighbor.screenX) {
                // XOR difference visualization
                const xorDiff = node.bits ^ neighbor.bits;
                const hammingDist = xorDiff.toString(2).split('1').length - 1; // Count 1s
                
                bitCtx.strokeStyle = \`rgba(255, 255, 255, \${0.1 + hammingDist * 0.05})\`;
                bitCtx.lineWidth = 1 + hammingDist * 0.5;
                
                bitCtx.beginPath();
                bitCtx.moveTo(node.screenX, node.screenY);
                bitCtx.lineTo(neighbor.screenX, neighbor.screenY);
                bitCtx.stroke();
            }
        }
    }
}

function renderHammingField() {
    if (!bitData) return;
    
    hammingCtx.fillStyle = "black";
    hammingCtx.fillRect(0, 0, hammingCanvas.width, hammingCanvas.height);
    
    // Hamming distance distribution histogram
    const binWidth = hammingCanvas.width / bitData.distribution.length;
    const totalNodes = bitData.binary.length;
    
    for (let i = 0; i < bitData.distribution.length; i++) {
        const count = bitData.distribution[i];
        const height = (count / totalNodes) * hammingCanvas.height * 0.8;
        
        const x = i * binWidth;
        const y = hammingCanvas.height - height;
        
        // Color based on popcount level
        const intensity = (i / 7) * 255;
        const color = \`rgb(\${intensity}, \${255 - intensity}, 128)\`;
        
        hammingCtx.fillStyle = color;
        hammingCtx.fillRect(x, y, binWidth - 2, height);
        
        // Bin label
        hammingCtx.fillStyle = "white";
        hammingCtx.font = "12px monospace";
        hammingCtx.textAlign = "center";
        hammingCtx.fillText(i.toString(), x + binWidth/2, hammingCanvas.height - 5);
        hammingCtx.fillText(count.toString(), x + binWidth/2, y - 5);
    }
    
    // Binary signature visualization
    const signatureBits = bitData.signature.toString(2).padStart(8, '0');
    hammingCtx.fillStyle = "lime";
    hammingCtx.font = "20px monospace";
    hammingCtx.textAlign = "center";
    hammingCtx.fillText(signatureBits, hammingCanvas.width/2, 40);
    
    // Global pattern indicator
    const patternBar = (bitData.pattern / 16) * hammingCanvas.width;
    hammingCtx.fillStyle = "rgba(0, 255, 255, 0.3)";
    hammingCtx.fillRect(0, hammingCanvas.height - 30, patternBar, 30);
}

function updateMetrics() {
    if (!bitData) return;
    
    document.getElementById("bitFlow").textContent = bitData.bitState.flow ? "ORDERING" : "DISPERSING";
    document.getElementById("bitEmergence").textContent = bitData.bitState.emergence ? "YES" : "NO";
    document.getElementById("bitPattern").textContent = bitData.pattern.toString();
    
    const signatureBits = bitData.signature.toString(2).padStart(8, '0');
    document.getElementById("bitSignature").textContent = signatureBits;
}

bitCanvas.addEventListener("click", (event) => {
    if (!bitData) return;
    
    const rect = bitCanvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    for (const node of bitData.binary) {
        if (node.screenX && node.screenY) {
            const dx = x - node.screenX;
            const dy = y - node.screenY;
            const dist = dx * dx + dy * dy;
            
            if (dist < node.screenSize * node.screenSize) {
                ws.send(JSON.stringify({
                    type: "bitInjection",
                    nodeId: node.id,
                    flip: !event.shiftKey,
                    pattern: event.shiftKey && !event.ctrlKey
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
    console.log(`hexKERnKERnel BINARY running at http://localhost:${PORT}`);
    console.log(`Pure binary information - Hamming distances`);
    console.log(`XOR operations - No numerical abstraction`);
    console.log(`Bits: ${PATTERN_BITS} - Pattern vs Noise`);
});
