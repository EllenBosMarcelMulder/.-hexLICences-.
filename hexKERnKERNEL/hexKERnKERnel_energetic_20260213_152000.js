/*
hexKERnKERnel_energetic_20260213_152000.js

PURE ENERGETIC FIELD IMPLEMENTATION
===================================

No symbols
No numbers  
No logic
No abstraction

Only:
- Energy intensity differences
- Spectral distribution
- Thermal gradients
- Color/infrared representation

Pure physical field configuration
*/

const WebSocket = require("ws");
const http = require("http");
const fs = require("fs");
const path = require("path");

////////////////////////////////////////////////////////////////////////////////
// ENERGETIC PARAMETERS
////////////////////////////////////////////////////////////////////////////////

const PORT = 8080;
const HEX_RADIUS = 6;
const THERMAL_BANDS = 7; // Energy levels as thermal bands

let nodes = [];
let energyField = [];
let adjacency = [];
let thermalGradients = [];
let spectrumState = 0;
let fieldTension = false;

////////////////////////////////////////////////////////////////////////////////
// PURE ENERGETIC TOPOLOGY
////////////////////////////////////////////////////////////////////////////////

function generateEnergyField() {
    nodes = [];
    energyField = [];
    adjacency = [];
    thermalGradients = [];
    
    // Generate nodes as energy points
    for (let q = -HEX_RADIUS; q <= HEX_RADIUS; q++) {
        for (let r = -HEX_RADIUS; r <= HEX_RADIUS; r++) {
            if (Math.abs(q + r) <= HEX_RADIUS) {
                nodes.push({ 
                    id: nodes.length,
                    q, r
                });
                // Initial thermal state - mid-range energy
                energyField.push(3); // Energy band 3 of 7
                adjacency.push([]);
                thermalGradients.push(0);
            }
        }
    }
    
    // Build energy connectivity
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
// PURE ENERGY OPERATIONS
////////////////////////////////////////////////////////////////////////////////

function measureThermalGradient(nodeIdx) {
    const neighbors = adjacency[nodeIdx];
    const centerEnergy = energyField[nodeIdx];
    
    if (neighbors.length === 0) return 0;
    
    let totalGradient = 0;
    
    for (const nIdx of neighbors) {
        const neighborEnergy = energyField[nIdx];
        const energyDiff = neighborEnergy - centerEnergy;
        totalGradient += energyDiff;
    }
    
    // Thermal gradient as energy flow direction
    return totalGradient;
}

function assessFieldTension() {
    let highGradients = 0;
    let totalNodes = nodes.length;
    
    for (let i = 0; i < nodes.length; i++) {
        const gradient = measureThermalGradient(i);
        thermalGradients[i] = gradient;
        
        // High tension when gradient exceeds threshold
        if (gradient > 2 || gradient < -2) {
            highGradients++;
        }
    }
    
    fieldTension = highGradients > totalNodes / 4;
    
    return {
        tension: fieldTension,
        gradientRatio: highGradients / totalNodes,
        energyFlow: fieldTension ? 'TURBULENT' : 'STABLE'
    };
}

function updateSpectrum() {
    // Spectrum cycles through energy configurations
    let totalEnergy = 0;
    for (const energy of energyField) {
        totalEnergy += energy;
    }
    
    spectrumState = totalEnergy % (THERMAL_BANDS * 50);
}

////////////////////////////////////////////////////////////////////////////////
// ENERGY EQUILIBRATION - PURE THERMODYNAMICS
////////////////////////////////////////////////////////////////////////////////

function equilibrateEnergyField() {
    const newEnergyField = [...energyField];
    
    for (let i = 0; i < nodes.length; i++) {
        const neighbors = adjacency[i];
        const currentEnergy = energyField[i];
        
        if (neighbors.length === 0) continue;
        
        // Energy flow based on thermal gradients
        let energyFlow = 0;
        
        for (const nIdx of neighbors) {
            const neighborEnergy = energyField[nIdx];
            
            // Energy flows from high to low (thermodynamic principle)
            if (neighborEnergy > currentEnergy) {
                energyFlow += 1; // Energy flows in
            } else if (neighborEnergy < currentEnergy) {
                energyFlow -= 1; // Energy flows out
            }
        }
        
        // Energy change based on flow
        let newEnergy = currentEnergy;
        
        if (energyFlow > 0) {
            // More energy flowing in than out
            if (currentEnergy < THERMAL_BANDS - 1) {
                newEnergy = currentEnergy + 1;
            }
        } else if (energyFlow < 0) {
            // More energy flowing out than in
            if (currentEnergy > 0) {
                newEnergy = currentEnergy - 1;
            }
        }
        
        newEnergyField[i] = newEnergy;
    }
    
    energyField = newEnergyField;
    updateSpectrum();
}

////////////////////////////////////////////////////////////////////////////////
// SPECTRAL REPRESENTATION
////////////////////////////////////////////////////////////////////////////////

function energyToSpectrum(energy) {
    // Convert energy band to spectral properties
    const bandRatio = energy / (THERMAL_BANDS - 1);
    
    // Map to electromagnetic spectrum
    if (energy === 0) {
        return { type: 'INFRARED', frequency: 'LOW', heat: 'COLD' };
    } else if (energy === 1) {
        return { type: 'RED', frequency: 'LOW', heat: 'WARM' };
    } else if (energy === 2) {
        return { type: 'ORANGE', frequency: 'MID_LOW', heat: 'MODERATE' };
    } else if (energy === 3) {
        return { type: 'YELLOW', frequency: 'MID', heat: 'NEUTRAL' };
    } else if (energy === 4) {
        return { type: 'GREEN', frequency: 'MID_HIGH', heat: 'ACTIVE' };
    } else if (energy === 5) {
        return { type: 'BLUE', frequency: 'HIGH', heat: 'INTENSE' };
    } else {
        return { type: 'VIOLET', frequency: 'VERY_HIGH', heat: 'EXTREME' };
    }
}

function generateSpectralPattern() {
    let pattern = "";
    
    for (let i = 0; i < nodes.length; i += 4) {
        const spectrum = energyToSpectrum(energyField[i]);
        pattern += spectrum.type[0]; // First letter
    }
    
    return pattern.substring(0, 10);
}

function countEnergyDistribution() {
    const distribution = {};
    
    for (let band = 0; band < THERMAL_BANDS; band++) {
        distribution[band] = 0;
    }
    
    for (const energy of energyField) {
        distribution[energy]++;
    }
    
    return distribution;
}

////////////////////////////////////////////////////////////////////////////////
// THERMAL VISUALIZATION
////////////////////////////////////////////////////////////////////////////////

function generateThermalLayout() {
    const layout = [];
    
    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const energy = energyField[i];
        const gradient = thermalGradients[i];
        const spectrum = energyToSpectrum(energy);
        
        layout.push({
            id: i,
            energy: energy,
            spectrum: spectrum,
            gradient: gradient,
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

generateEnergyField();

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
    const thermalLayout = generateThermalLayout();
    const fieldState = assessFieldTension();
    const distribution = countEnergyDistribution();
    
    ws.send(JSON.stringify({
        thermal: thermalLayout,
        adjacency: adjacency,
        fieldState: fieldState,
        distribution: distribution,
        spectrum: generateSpectralPattern(),
        spectrumState: spectrumState,
        bands: THERMAL_BANDS
    }));
    
    ws.on("message", (data) => {
        try {
            const msg = JSON.parse(data);
            if (msg.type === "energyInjection") {
                if (msg.nodeId >= 0 && msg.nodeId < energyField.length) {
                    // Inject or drain energy
                    if (msg.inject && energyField[msg.nodeId] < THERMAL_BANDS - 1) {
                        energyField[msg.nodeId]++;
                    } else if (!msg.inject && energyField[msg.nodeId] > 0) {
                        energyField[msg.nodeId]--;
                    }
                }
            }
        } catch (e) {
            console.log("Invalid message:", e);
        }
    });
});

// Thermodynamic equilibration loop
setInterval(() => {
    equilibrateEnergyField();
    
    const payload = JSON.stringify({
        thermal: generateThermalLayout(),
        adjacency: adjacency,
        fieldState: assessFieldTension(),
        distribution: countEnergyDistribution(),
        spectrum: generateSpectralPattern(),
        spectrumState: spectrumState,
        bands: THERMAL_BANDS
    });
    
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(payload);
        }
    });
}, 120);

////////////////////////////////////////////////////////////////////////////////
// HTML INTERFACE
////////////////////////////////////////////////////////////////////////////////

function generateHTML() {
    return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>hexKERnKERnel ENERGETIC - Pure Energy Field</title>
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
    border: 1px solid orange;
}
.metric {
    margin: 2px 0;
}
.energy {
    color: orange;
    font-weight: bold;
}
.thermal {
    color: red;
}
</style>
</head>
<body>
<div class="container">
    <div class="view">
        <canvas id="energyCanvas"></canvas>
        <div class="info">
            <div class="metric">ENERGY FIELD</div>
            <div class="metric">Flow: <span id="energyFlow" class="energy">-</span></div>
            <div class="metric">Tension: <span id="tension" class="thermal">-</span></div>
            <div class="metric">Spectrum: <span id="spectralPattern" class="energy">---</span></div>
            <div class="metric">State: <span id="spectrumState" class="energy">0</span></div>
        </div>
    </div>
    <div class="view">
        <canvas id="thermalCanvas"></canvas>
        <div class="info">
            <div class="metric">THERMAL DISTRIBUTION</div>
            <div class="metric">Click: inject energy</div>
            <div class="metric">Shift+Click: drain energy</div>
            <div class="metric">INFRARED: <span id="band0" class="thermal">0</span></div>
            <div class="metric">RED: <span id="band1" class="thermal">0</span></div>
            <div class="metric">ORANGE: <span id="band2" class="energy">0</span></div>
            <div class="metric">YELLOW: <span id="band3" class="energy">0</span></div>
            <div class="metric">GREEN: <span id="band4" class="energy">0</span></div>
            <div class="metric">BLUE: <span id="band5" class="energy">0</span></div>
            <div class="metric">VIOLET: <span id="band6" class="energy">0</span></div>
        </div>
    </div>
</div>

<script>
const ws = new WebSocket("ws://localhost:8080");
const energyCanvas = document.getElementById("energyCanvas");
const thermalCanvas = document.getElementById("thermalCanvas");
const energyCtx = energyCanvas.getContext("2d");
const thermalCtx = thermalCanvas.getContext("2d");

energyCanvas.width = energyCanvas.offsetWidth;
energyCanvas.height = energyCanvas.offsetHeight;
thermalCanvas.width = thermalCanvas.offsetWidth;
thermalCanvas.height = thermalCanvas.offsetHeight;

let fieldData = null;

ws.onmessage = (event) => {
    fieldData = JSON.parse(event.data);
    renderEnergyField();
    renderThermalField();
    updateMetrics();
};

function getSpectrumColor(spectrum) {
    switch(spectrum.type) {
        case 'INFRARED': return 'rgb(80, 0, 0)';
        case 'RED': return 'rgb(255, 0, 0)';
        case 'ORANGE': return 'rgb(255, 128, 0)';
        case 'YELLOW': return 'rgb(255, 255, 0)';
        case 'GREEN': return 'rgb(0, 255, 0)';
        case 'BLUE': return 'rgb(0, 128, 255)';
        case 'VIOLET': return 'rgb(128, 0, 255)';
        default: return 'rgb(128, 128, 128)';
    }
}

function renderEnergyField() {
    if (!fieldData) return;
    
    energyCtx.fillStyle = "black";
    energyCtx.fillRect(0, 0, energyCanvas.width, energyCanvas.height);
    
    const centerX = energyCanvas.width / 2;
    const centerY = energyCanvas.height / 2;
    
    // Hex grid positioning
    for (const node of fieldData.thermal) {
        const hexX = node.q + node.r * 0.5;
        const hexY = node.r * 0.866;
        
        const x = centerX + hexX * 25;
        const y = centerY - hexY * 25;
        
        // Size based on energy level
        const size = 6 + node.energy * 3;
        
        // Color based on spectrum
        const color = getSpectrumColor(node.spectrum);
        
        energyCtx.fillStyle = color;
        energyCtx.strokeStyle = "white";
        energyCtx.lineWidth = Math.abs(node.gradient) > 2 ? 3 : 1;
        
        energyCtx.beginPath();
        
        // Hexagonal energy cell
        for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3;
            const hx = x + size * Math.cos(angle);
            const hy = y + size * Math.sin(angle);
            
            if (i === 0) {
                energyCtx.moveTo(hx, hy);
            } else {
                energyCtx.lineTo(hx, hy);
            }
        }
        
        energyCtx.closePath();
        energyCtx.fill();
        energyCtx.stroke();
        
        // Energy gradient visualization
        if (Math.abs(node.gradient) > 1) {
            energyCtx.strokeStyle = node.gradient > 0 ? "cyan" : "magenta";
            energyCtx.lineWidth = 2;
            energyCtx.beginPath();
            energyCtx.arc(x, y, size + 5, 0, 2 * Math.PI);
            energyCtx.stroke();
        }
        
        // Store for interaction
        node.screenX = x;
        node.screenY = y;
        node.screenSize = size;
    }
    
    // Draw energy flow connections
    energyCtx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    energyCtx.lineWidth = 1;
    
    for (const node of fieldData.thermal) {
        for (const neighborId of node.neighbors) {
            const neighbor = fieldData.thermal[neighborId];
            if (neighbor && neighbor.screenX) {
                energyCtx.beginPath();
                energyCtx.moveTo(node.screenX, node.screenY);
                energyCtx.lineTo(neighbor.screenX, neighbor.screenY);
                energyCtx.stroke();
            }
        }
    }
}

function renderThermalField() {
    if (!fieldData) return;
    
    thermalCtx.fillStyle = "black";
    thermalCtx.fillRect(0, 0, thermalCanvas.width, thermalCanvas.height);
    
    const centerX = thermalCanvas.width / 2;
    const centerY = thermalCanvas.height / 2;
    
    // Thermal distribution visualization
    const bandWidth = thermalCanvas.width / fieldData.bands;
    
    for (let band = 0; band < fieldData.bands; band++) {
        const count = fieldData.distribution[band];
        const height = (count / fieldData.thermal.length) * thermalCanvas.height;
        
        const x = band * bandWidth;
        const y = thermalCanvas.height - height;
        
        // Thermal band color
        const spectrum = { type: ['INFRARED', 'RED', 'ORANGE', 'YELLOW', 'GREEN', 'BLUE', 'VIOLET'][band] };
        const color = getSpectrumColor(spectrum);
        
        thermalCtx.fillStyle = color;
        thermalCtx.fillRect(x, y, bandWidth - 2, height);
        
        // Band label
        thermalCtx.fillStyle = "white";
        thermalCtx.font = "10px monospace";
        thermalCtx.textAlign = "center";
        thermalCtx.fillText(spectrum.type[0], x + bandWidth/2, thermalCanvas.height - 5);
        thermalCtx.fillText(count.toString(), x + bandWidth/2, y - 5);
    }
    
    // Spectrum state indicator
    const stateX = (fieldData.spectrumState % thermalCanvas.width);
    thermalCtx.strokeStyle = "white";
    thermalCtx.lineWidth = 2;
    thermalCtx.beginPath();
    thermalCtx.moveTo(stateX, 0);
    thermalCtx.lineTo(stateX, thermalCanvas.height);
    thermalCtx.stroke();
}

function updateMetrics() {
    if (!fieldData) return;
    
    document.getElementById("energyFlow").textContent = fieldData.fieldState.energyFlow;
    document.getElementById("tension").textContent = fieldData.fieldState.tension ? 'HIGH' : 'LOW';
    document.getElementById("spectralPattern").textContent = fieldData.spectrum;
    document.getElementById("spectrumState").textContent = fieldData.spectrumState;
    
    for (let band = 0; band < fieldData.bands; band++) {
        const element = document.getElementById(\`band\${band}\`);
        if (element) {
            element.textContent = fieldData.distribution[band];
        }
    }
}

energyCanvas.addEventListener("click", (event) => {
    if (!fieldData) return;
    
    const rect = energyCanvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    for (const node of fieldData.thermal) {
        if (node.screenX && node.screenY) {
            const dx = x - node.screenX;
            const dy = y - node.screenY;
            const dist = dx * dx + dy * dy;
            
            if (dist < node.screenSize * node.screenSize) {
                ws.send(JSON.stringify({
                    type: "energyInjection",
                    nodeId: node.id,
                    inject: !event.shiftKey
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
    console.log(`hexKERnKERnel ENERGETIC running at http://localhost:${PORT}`);
    console.log(`Pure energy field - Spectral representation`);
    console.log(`Thermodynamic equilibration - No abstraction`);
    console.log(`Energy bands: ${THERMAL_BANDS} - Spectrum: INFRARED to VIOLET`);
});
