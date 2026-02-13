/*
hexKERnKERnel_pure_20260213_141500.js

PURE RELATIONAL IMPLEMENTATION
==============================

Fixes:
1. phi as pure amplitude (no phase modulus mixing)
2. Position-based coherence (not index-based)
3. Full hex-topological consistency

ASCII only - No semantic interpretation
*/

const WebSocket = require("ws");
const http = require("http");
const fs = require("fs");
const path = require("path");

////////////////////////////////////////////////////////////////////////////////
// CORE PARAMETERS
////////////////////////////////////////////////////////////////////////////////

const PORT = 8080;
const HEX_RADIUS = 8;
const PHI_GOLDEN = (1 + Math.sqrt(5)) / 2;
const PI_INV = 1 / Math.PI;

let nodes = [];
let phi = [];
let hexTime = 0;
let glyphHash = "";

////////////////////////////////////////////////////////////////////////////////
// HEXAGONAL TOPOLOGY
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
    
    amplitudeNormalize();
}

function getHexIndex(q, r) {
    return nodes.findIndex(n => n.q === q && n.r === r);
}

function getHexNeighbors(q, r) {
    return [
        [q + 1, r], [q - 1, r],
        [q, r + 1], [q, r - 1],
        [q + 1, r - 1], [q - 1, r + 1]
    ];
}

////////////////////////////////////////////////////////////////////////////////
// PURE AMPLITUDE OPERATIONS (NO PHASE MIXING)
////////////////////////////////////////////////////////////////////////////////

function amplitudeNormalize() {
    const sum = phi.reduce((a, b) => a + b, 0);
    if (sum > 1e-12) {
        for (let i = 0; i < phi.length; i++) {
            phi[i] = phi[i] / sum;
        }
    }
}

////////////////////////////////////////////////////////////////////////////////
// POSITION-BASED COHERENCE (NOT INDEX-BASED)
////////////////////////////////////////////////////////////////////////////////

function computePositionalCoherence() {
    let real = 0, imag = 0;
    const N = phi.length;
    
    for (let i = 0; i < N; i++) {
        const { q, r } = nodes[i];
        
        // Angle based on HEX POSITION, not array index
        const hexAngle = Math.atan2(r * Math.sqrt(3)/2, q + r * 0.5);
        const normalizedAngle = hexAngle + Math.PI; // 0 to 2π
        
        real += phi[i] * Math.cos(normalizedAngle);
        imag += phi[i] * Math.sin(normalizedAngle);
    }
    
    return Math.sqrt(real * real + imag * imag) * PI_INV;
}

function hexHAShTIMeStep() {
    const coherence = computePositionalCoherence();
    hexTime += coherence * PI_INV;
    return hexTime % (2 * Math.PI);
}

////////////////////////////////////////////////////////////////////////////////
// RELATIONAL DYNAMICS
////////////////////////////////////////////////////////////////////////////////

function evolveHexField() {
    const newPhi = [...phi];
    const N = phi.length;
    const mean = 1 / N;
    
    for (let i = 0; i < nodes.length; i++) {
        const { q, r } = nodes[i];
        const neighbors = getHexNeighbors(q, r);
        
        let laplace = 0;
        let validNeighbors = 0;
        
        for (const [nq, nr] of neighbors) {
            const idx = getHexIndex(nq, nr);
            if (idx !== -1) {
                laplace += phi[idx] - phi[i];
                validNeighbors++;
            }
        }
        
        if (validNeighbors > 0) {
            laplace /= validNeighbors;
        }
        
        // Pure amplitude diffusion
        const diffusion = 0.02 * laplace;
        
        // Positional coherence feedback
        const coherence = computePositionalCoherence();
        const feedback = 0.1 * coherence * (phi[i] - mean);
        
        // Amplitude constraint preservation
        const constraint = 0.05 * (mean - phi[i]);
        
        newPhi[i] += diffusion + feedback + constraint;
        newPhi[i] = Math.max(newPhi[i], 1e-12);
    }
    
    phi = newPhi;
    amplitudeNormalize(); // Pure amplitude normalization
    hexHAShTIMeStep();
}

////////////////////////////////////////////////////////////////////////////////
// PURE RELATIONAL GLYPH HASH
////////////////////////////////////////////////////////////////////////////////

function generateGLYphHASh() {
    let hash = "";
    const coherence = computePositionalCoherence();
    const timePhase = hexTime / (2 * Math.PI);
    
    // Use golden ratio for non-linear sampling
    for (let i = 0; i < 16; i++) {
        const goldenSample = (i * PHI_GOLDEN) % 1;
        const idx = Math.floor((coherence * timePhase * goldenSample) % phi.length);
        const val = Math.floor(phi[idx] * 256) % 16;
        hash += val.toString(16);
    }
    
    return hash;
}

////////////////////////////////////////////////////////////////////////////////
// DUAL PROJECTION SYSTEM
////////////////////////////////////////////////////////////////////////////////

function hexToFlat(q, r) {
    const x = q + r * 0.5;
    const y = r * Math.sqrt(3) / 2;
    return { x, y };
}

function hexToSphere(q, r, amplitude) {
    const { x, y } = hexToFlat(q, r);
    const radius = Math.sqrt(x * x + y * y);
    const angle = Math.atan2(y, x);
    
    // Sphere mapping using amplitude (not phase)
    const sphereR = Math.sin(radius * PI_INV) * (0.5 + amplitude);
    const sphereX = sphereR * Math.cos(angle);
    const sphereY = sphereR * Math.sin(angle);
    const sphereZ = Math.cos(radius * PI_INV) * amplitude;
    
    return { x: sphereX, y: sphereY, z: sphereZ };
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
    const sphereProjection = [];
    
    for (let i = 0; i < nodes.length; i++) {
        const { q, r } = nodes[i];
        const amplitude = phi[i];
        
        flatProjection.push({
            ...hexToFlat(q, r),
            amplitude,
            q, r
        });
        
        sphereProjection.push({
            ...hexToSphere(q, r, amplitude),
            amplitude,
            q, r
        });
    }
    
    ws.send(JSON.stringify({
        flat: flatProjection,
        sphere: sphereProjection,
        coherence: computePositionalCoherence(),
        hexTime: hexTime,
        glyph: generateGLYphHASh()
    }));
    
    ws.on("message", (data) => {
        try {
            const msg = JSON.parse(data);
            if (msg.type === "perturbation") {
                const idx = getHexIndex(msg.q, msg.r);
                if (idx !== -1) {
                    phi[idx] += msg.magnitude;
                    amplitudeNormalize();
                }
            }
        } catch (e) {
            console.log("Invalid message:", e);
        }
    });
});

setInterval(() => {
    evolveHexField();
    glyphHash = generateGLYphHASh();
    
    const payload = JSON.stringify({
        flat: nodes.map((node, i) => ({
            ...hexToFlat(node.q, node.r),
            amplitude: phi[i],
            q: node.q,
            r: node.r
        })),
        sphere: nodes.map((node, i) => ({
            ...hexToSphere(node.q, node.r, phi[i]),
            amplitude: phi[i],
            q: node.q,
            r: node.r
        })),
        coherence: computePositionalCoherence(),
        hexTime: hexTime,
        glyph: glyphHash
    });
    
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(payload);
        }
    });
}, 50);

////////////////////////////////////////////////////////////////////////////////
// HTML INTERFACE
////////////////////////////////////////////////////////////////////////////////

function generateHTML() {
    return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>hexKERnKERnel PURE - Dual Projection</title>
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
    background: rgba(0,0,0,0.8);
    padding: 10px;
    border-radius: 5px;
    font-size: 11px;
}
</style>
</head>
<body>
<div class="container">
    <div class="projection">
        <canvas id="flatCanvas"></canvas>
        <div class="info">
            <div>FLAT HEX PROJECTION</div>
            <div>Position-Coherence: <span id="coherenceFlat">0</span></div>
            <div>Sum-Check: <span id="sumCheck">0</span></div>
        </div>
    </div>
    <div class="projection">
        <canvas id="sphereCanvas"></canvas>
        <div class="info">
            <div>SPHERE AMPLITUDE MAP</div>
            <div>HexTime: <span id="hexTime">0</span></div>
            <div>GLYph: <span id="glyphHash">0</span></div>
        </div>
    </div>
</div>

<script>
const ws = new WebSocket("ws://localhost:8080");
const flatCanvas = document.getElementById("flatCanvas");
const sphereCanvas = document.getElementById("sphereCanvas");
const flatCtx = flatCanvas.getContext("2d");
const sphereCtx = sphereCanvas.getContext("2d");

flatCanvas.width = flatCanvas.offsetWidth;
flatCanvas.height = flatCanvas.offsetHeight;
sphereCanvas.width = sphereCanvas.offsetWidth;
sphereCanvas.height = sphereCanvas.offsetHeight;

let hexField = null;

ws.onmessage = (event) => {
    hexField = JSON.parse(event.data);
    renderFlat();
    renderSphere();
    updateInfo();
};

function renderFlat() {
    if (!hexField) return;
    
    flatCtx.fillStyle = "black";
    flatCtx.fillRect(0, 0, flatCanvas.width, flatCanvas.height);
    
    const centerX = flatCanvas.width / 2;
    const centerY = flatCanvas.height / 2;
    
    for (const node of hexField.flat) {
        const x = centerX + node.x * 15;
        const y = centerY - node.y * 15;
        const amplitude = node.amplitude;
        
        // Pure amplitude visualization
        const size = 6 + amplitude * 25;
        const intensity = Math.floor(amplitude * 255);
        
        flatCtx.fillStyle = \`rgb(0, \${intensity}, \${255-intensity})\`;
        flatCtx.strokeStyle = "white";
        flatCtx.lineWidth = 0.5;
        
        flatCtx.beginPath();
        
        // Hexagon with amplitude-based size
        for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3;
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

function renderSphere() {
    if (!hexField) return;
    
    sphereCtx.fillStyle = "black";
    sphereCtx.fillRect(0, 0, sphereCanvas.width, sphereCanvas.height);
    
    const centerX = sphereCanvas.width / 2;
    const centerY = sphereCanvas.height / 2;
    
    // Sort by z-depth for proper rendering
    const sorted = [...hexField.sphere].sort((a, b) => b.z - a.z);
    
    for (const node of sorted) {
        const x = centerX + node.x * 120;
        const y = centerY - node.y * 120;
        const amplitude = node.amplitude;
        const depth = (node.z + 1) / 2;
        
        const size = 4 + amplitude * 20 * depth;
        const intensity = Math.floor(amplitude * 255);
        const alpha = 0.2 + depth * 0.8;
        
        sphereCtx.fillStyle = \`rgba(\${intensity}, \${255-intensity}, 128, \${alpha})\`;
        sphereCtx.strokeStyle = \`rgba(255, 255, 255, \${alpha * 0.5})\`;
        sphereCtx.lineWidth = 1;
        
        sphereCtx.beginPath();
        sphereCtx.arc(x, y, size, 0, 2 * Math.PI);
        sphereCtx.fill();
        sphereCtx.stroke();
    }
}

function updateInfo() {
    if (!hexField) return;
    
    const sum = hexField.flat.reduce((acc, node) => acc + node.amplitude, 0);
    
    document.getElementById("coherenceFlat").textContent = hexField.coherence.toFixed(6);
    document.getElementById("sumCheck").textContent = sum.toFixed(6);
    document.getElementById("hexTime").textContent = hexField.hexTime.toFixed(6);
    document.getElementById("glyphHash").textContent = hexField.glyph;
}

flatCanvas.addEventListener("click", (event) => {
    if (!hexField) return;
    
    const rect = flatCanvas.getBoundingClientRect();
    const x = event.clientX - rect.left - flatCanvas.width / 2;
    const y = -(event.clientY - rect.top - flatCanvas.height / 2);
    
    let minDist = Infinity;
    let nearestNode = null;
    
    for (const node of hexField.flat) {
        const dx = x / 15 - node.x;
        const dy = y / 15 - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < minDist) {
            minDist = dist;
            nearestNode = node;
        }
    }
    
    if (nearestNode && minDist < 2) {
        ws.send(JSON.stringify({
            type: "perturbation",
            q: nearestNode.q,
            r: nearestNode.r,
            magnitude: 0.05
        }));
    }
});
</script>
</body>
</html>`;
}

server.listen(PORT, () => {
    console.log(`hexKERnKERnel PURE running at http://localhost:${PORT}`);
    console.log(`Pure amplitude normalization - No phase mixing`);
    console.log(`Position-based coherence - No index artifacts`);
    console.log(`Nodes: ${nodes.length} - Radius: ${HEX_RADIUS}`);
});
