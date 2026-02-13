/*
hexKERnKERnel_20260213_140000.js

TECHNICAL SCIENTIFIC IMPLEMENTATION
===================================

Pi-invariant hexagonal field kernel
Dual projection system (flat/sphere)
Relational dynamics only
No semantic interpretation layer
ASCII output only

Authors: Pattern Recognition via AI Translation
Timestamp: 20260213_140000
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
const PHI = (1 + Math.sqrt(5)) / 2;
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
    
    piNormalize();
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
// PI-INVARIANT OPERATIONS
////////////////////////////////////////////////////////////////////////////////

function piNormalize() {
    const sum = phi.reduce((a, b) => a + b, 0);
    for (let i = 0; i < phi.length; i++) {
        phi[i] = (phi[i] / sum) % (2 * Math.PI);
    }
}

function computePhaseCoherence() {
    let real = 0, imag = 0;
    const N = phi.length;
    
    for (let i = 0; i < N; i++) {
        const angle = (2 * Math.PI * i) / N;
        real += phi[i] * Math.cos(angle);
        imag += phi[i] * Math.sin(angle);
    }
    
    return Math.sqrt(real * real + imag * imag) * PI_INV;
}

function hexHAShTIMeStep() {
    const coherence = computePhaseCoherence();
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
        
        // Pi-constrained diffusion
        const diffusion = 0.02 * laplace;
        
        // Phase feedback (spectral lock attempt)
        const coherence = computePhaseCoherence();
        const feedback = 0.1 * coherence * (phi[i] - mean);
        
        // Constraint preservation
        const constraint = 0.05 * (mean - phi[i]);
        
        newPhi[i] += diffusion + feedback + constraint;
        newPhi[i] = Math.max(newPhi[i], 1e-12);
    }
    
    phi = newPhi;
    piNormalize();
    hexHAShTIMeStep();
}

////////////////////////////////////////////////////////////////////////////////
// GLYPH HASH GENERATION
////////////////////////////////////////////////////////////////////////////////

function generateGLYphHASh() {
    let hash = "";
    const coherence = computePhaseCoherence();
    const timePhase = hexTime / (2 * Math.PI);
    
    for (let i = 0; i < 16; i++) {
        const idx = Math.floor((coherence * timePhase * i) % phi.length);
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

function hexToSphere(q, r, intensity) {
    const { x, y } = hexToFlat(q, r);
    const radius = Math.sqrt(x * x + y * y);
    const angle = Math.atan2(y, x);
    
    const sphereR = Math.sin(radius * PI_INV) * (1 + intensity);
    const sphereX = sphereR * Math.cos(angle);
    const sphereY = sphereR * Math.sin(angle);
    const sphereZ = Math.cos(radius * PI_INV) * intensity;
    
    return { x: sphereX, y: sphereY, z: sphereZ };
}

function projectToScreen(point, width, height, isFlat) {
    if (isFlat) {
        return {
            x: width / 2 + point.x * 20,
            y: height / 2 - point.y * 20
        };
    } else {
        // Orthographic projection of sphere
        return {
            x: width / 2 + point.x * 100,
            y: height / 2 - point.y * 100
        };
    }
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
        const intensity = phi[i];
        
        flatProjection.push({
            ...hexToFlat(q, r),
            intensity,
            q, r
        });
        
        sphereProjection.push({
            ...hexToSphere(q, r, intensity),
            intensity,
            q, r
        });
    }
    
    ws.send(JSON.stringify({
        flat: flatProjection,
        sphere: sphereProjection,
        coherence: computePhaseCoherence(),
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
                    piNormalize();
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
            intensity: phi[i],
            q: node.q,
            r: node.r
        })),
        sphere: nodes.map((node, i) => ({
            ...hexToSphere(node.q, node.r, phi[i]),
            intensity: phi[i],
            q: node.q,
            r: node.r
        })),
        coherence: computePhaseCoherence(),
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
// HTML INTERFACE GENERATION
////////////////////////////////////////////////////////////////////////////////

function generateHTML() {
    return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>hexKERnKERnel - Dual Projection</title>
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
}
</style>
</head>
<body>
<div class="container">
    <div class="projection">
        <canvas id="flatCanvas"></canvas>
        <div class="info">
            <div>FLAT PROJECTION</div>
            <div>Coherence: <span id="coherenceFlat">0</span></div>
            <div>Phase: <span id="phaseFlat">0</span></div>
        </div>
    </div>
    <div class="projection">
        <canvas id="sphereCanvas"></canvas>
        <div class="info">
            <div>SPHERE PROJECTION</div>
            <div>HexTime: <span id="hexTime">0</span></div>
            <div>GlyphHash: <span id="glyphHash">0</span></div>
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
        const intensity = node.intensity;
        
        const size = 8 + intensity * 20;
        const hue = (intensity * 360) % 360;
        
        flatCtx.fillStyle = \`hsl(\${hue}, 100%, 50%)\`;
        flatCtx.beginPath();
        
        // Hexagon
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
        const x = centerX + node.x * 100;
        const y = centerY - node.y * 100;
        const intensity = node.intensity;
        const depth = (node.z + 1) / 2; // Normalize to 0-1
        
        const size = 5 + intensity * 15 * depth;
        const hue = (intensity * 360) % 360;
        const alpha = 0.3 + depth * 0.7;
        
        sphereCtx.fillStyle = \`hsla(\${hue}, 100%, 50%, \${alpha})\`;
        sphereCtx.strokeStyle = \`hsla(\${hue}, 100%, 70%, \${alpha})\`;
        
        sphereCtx.beginPath();
        sphereCtx.arc(x, y, size, 0, 2 * Math.PI);
        sphereCtx.fill();
        sphereCtx.stroke();
    }
}

function updateInfo() {
    if (!hexField) return;
    
    document.getElementById("coherenceFlat").textContent = hexField.coherence.toFixed(4);
    document.getElementById("phaseFlat").textContent = (hexField.coherence * Math.PI).toFixed(4);
    document.getElementById("hexTime").textContent = hexField.hexTime.toFixed(4);
    document.getElementById("glyphHash").textContent = hexField.glyph;
}

flatCanvas.addEventListener("click", (event) => {
    if (!hexField) return;
    
    const rect = flatCanvas.getBoundingClientRect();
    const x = event.clientX - rect.left - flatCanvas.width / 2;
    const y = -(event.clientY - rect.top - flatCanvas.height / 2);
    
    // Find nearest hex
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
        // Send perturbation via websocket
        ws.send(JSON.stringify({
            type: "perturbation",
            q: nearestNode.q,
            r: nearestNode.r,
            magnitude: 0.1
        }));
    }
});
</script>
</body>
</html>`;
}

server.listen(PORT, () => {
    console.log(\`hexKERnKERnel running at http://localhost:\${PORT}\`);
    console.log(\`Timestamp: 20260213_140000\`);
    console.log(\`Hex radius: \${HEX_RADIUS}\`);
    console.log(\`Total nodes: \${nodes.length}\`);
});
