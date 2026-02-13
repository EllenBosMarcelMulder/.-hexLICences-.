/*
hexKERnKERnel_ordinal_20260213_150000.js

PURE ORDER-TOPOLOGY IMPLEMENTATION
==================================

No numerical values
No amplitudes
No ratios
No thresholds
No time evolution
No normalization

Only:
- Ordinal relationships (higher/lower/equal)
- Local consistency rules
- Constraint satisfaction
- Valid configuration space

Pure structural logic of compatibility
*/

const WebSocket = require("ws");
const http = require("http");
const fs = require("fs");
const path = require("path");

////////////////////////////////////////////////////////////////////////////////
// ORDINAL PARAMETERS
////////////////////////////////////////////////////////////////////////////////

const PORT = 8080;
const HEX_RADIUS = 6;
const ORDER_STATES = ['LOWEST', 'LOW', 'MEDIUM', 'HIGH', 'HIGHEST'];

let nodes = [];
let ordinalStates = [];
let adjacency = [];
let consistencyRules = [];
let violationCount = 0;
let configurationValid = false;

////////////////////////////////////////////////////////////////////////////////
// PURE ORDINAL TOPOLOGY
////////////////////////////////////////////////////////////////////////////////

function generateOrderGraph() {
    nodes = [];
    ordinalStates = [];
    adjacency = [];
    
    // Generate nodes with only identity
    for (let q = -HEX_RADIUS; q <= HEX_RADIUS; q++) {
        for (let r = -HEX_RADIUS; r <= HEX_RADIUS; r++) {
            if (Math.abs(q + r) <= HEX_RADIUS) {
                nodes.push({ 
                    id: nodes.length,
                    q, r
                });
                // Initial ordinal state - no numerical value
                ordinalStates.push(ORDER_STATES[2]); // Start with MEDIUM
                adjacency.push([]);
            }
        }
    }
    
    // Build adjacency without coordinates
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
    
    generateConsistencyRules();
}

////////////////////////////////////////////////////////////////////////////////
// PURE ORDINAL OPERATIONS
////////////////////////////////////////////////////////////////////////////////

function compareStates(state1, state2) {
    const idx1 = ORDER_STATES.indexOf(state1);
    const idx2 = ORDER_STATES.indexOf(state2);
    
    if (idx1 > idx2) return 'HIGHER';
    if (idx1 < idx2) return 'LOWER';
    return 'EQUAL';
}

function getNeighborPattern(nodeIdx) {
    const neighbors = adjacency[nodeIdx];
    const currentState = ordinalStates[nodeIdx];
    
    let higherNeighbors = 0;
    let lowerNeighbors = 0;
    let equalNeighbors = 0;
    
    for (const nIdx of neighbors) {
        const comparison = compareStates(currentState, ordinalStates[nIdx]);
        
        if (comparison === 'LOWER') higherNeighbors++;
        else if (comparison === 'HIGHER') lowerNeighbors++;
        else equalNeighbors++;
    }
    
    return {
        higher: higherNeighbors,
        lower: lowerNeighbors,
        equal: equalNeighbors,
        total: neighbors.length
    };
}

function generateConsistencyRules() {
    consistencyRules = [
        // Rule 1: No node can be highest if all neighbors are lower
        (nodeIdx) => {
            const pattern = getNeighborPattern(nodeIdx);
            const state = ordinalStates[nodeIdx];
            return !(state === 'HIGHEST' && pattern.lower === pattern.total);
        },
        
        // Rule 2: No node can be lowest if all neighbors are higher  
        (nodeIdx) => {
            const pattern = getNeighborPattern(nodeIdx);
            const state = ordinalStates[nodeIdx];
            return !(state === 'LOWEST' && pattern.higher === pattern.total);
        },
        
        // Rule 3: Medium nodes should have mixed neighbors
        (nodeIdx) => {
            const pattern = getNeighborPattern(nodeIdx);
            const state = ordinalStates[nodeIdx];
            if (state === 'MEDIUM') {
                return pattern.higher > 0 || pattern.lower > 0;
            }
            return true;
        },
        
        // Rule 4: Local gradient consistency
        (nodeIdx) => {
            const pattern = getNeighborPattern(nodeIdx);
            return pattern.higher + pattern.lower + pattern.equal === pattern.total;
        }
    ];
}

function checkLocalConsistency(nodeIdx) {
    for (const rule of consistencyRules) {
        if (!rule(nodeIdx)) {
            return false;
        }
    }
    return true;
}

function assessGlobalConsistency() {
    let violations = 0;
    
    for (let i = 0; i < nodes.length; i++) {
        if (!checkLocalConsistency(i)) {
            violations++;
        }
    }
    
    violationCount = violations;
    configurationValid = violations === 0;
    
    return {
        violations: violations,
        valid: configurationValid,
        consistency: violations === 0 ? 'VALID' : violations < 5 ? 'NEAR' : 'INVALID'
    };
}

////////////////////////////////////////////////////////////////////////////////
// CONSTRAINT SATISFACTION - NO EVOLUTION
////////////////////////////////////////////////////////////////////////////////

function resolveViolations() {
    const violations = [];
    
    // Find all violations
    for (let i = 0; i < nodes.length; i++) {
        if (!checkLocalConsistency(i)) {
            violations.push(i);
        }
    }
    
    if (violations.length === 0) return;
    
    // Resolve one violation per cycle
    const violationIdx = violations[0];
    const pattern = getNeighborPattern(violationIdx);
    const currentState = ordinalStates[violationIdx];
    
    // Determine new state based on neighbor pattern
    let newState = currentState;
    
    if (pattern.higher > pattern.lower) {
        // More higher neighbors - decrease state
        const currentIdx = ORDER_STATES.indexOf(currentState);
        if (currentIdx > 0) {
            newState = ORDER_STATES[currentIdx - 1];
        }
    } else if (pattern.lower > pattern.higher) {
        // More lower neighbors - increase state
        const currentIdx = ORDER_STATES.indexOf(currentState);
        if (currentIdx < ORDER_STATES.length - 1) {
            newState = ORDER_STATES[currentIdx + 1];
        }
    }
    
    ordinalStates[violationIdx] = newState;
}

////////////////////////////////////////////////////////////////////////////////
// ORDINAL PATTERN RECOGNITION
////////////////////////////////////////////////////////////////////////////////

function generateOrderPattern() {
    let pattern = "";
    
    for (let i = 0; i < nodes.length; i += 3) {
        const state = ordinalStates[i];
        pattern += state[0]; // First letter: L, M, H
    }
    
    return pattern.substring(0, 12);
}

function countStateDistribution() {
    const distribution = {};
    
    for (const state of ORDER_STATES) {
        distribution[state] = 0;
    }
    
    for (const state of ordinalStates) {
        distribution[state]++;
    }
    
    return distribution;
}

////////////////////////////////////////////////////////////////////////////////
// ORDINAL VISUALIZATION
////////////////////////////////////////////////////////////////////////////////

function generateOrderLayout() {
    const layout = [];
    
    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const state = ordinalStates[i];
        const pattern = getNeighborPattern(i);
        const consistent = checkLocalConsistency(i);
        
        // Ring positioning based on ordinal state
        const stateIdx = ORDER_STATES.indexOf(state);
        const ring = stateIdx;
        
        layout.push({
            id: i,
            state: state,
            stateIndex: stateIdx,
            ring: ring,
            pattern: pattern,
            consistent: consistent,
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

generateOrderGraph();

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
    const orderLayout = generateOrderLayout();
    const consistency = assessGlobalConsistency();
    const distribution = countStateDistribution();
    
    ws.send(JSON.stringify({
        layout: orderLayout,
        adjacency: adjacency,
        consistency: consistency,
        distribution: distribution,
        pattern: generateOrderPattern(),
        states: ORDER_STATES
    }));
    
    ws.on("message", (data) => {
        try {
            const msg = JSON.parse(data);
            if (msg.type === "perturbation") {
                if (msg.nodeId >= 0 && msg.nodeId < ordinalStates.length) {
                    // Change ordinal state instead of adding numerical value
                    const currentIdx = ORDER_STATES.indexOf(ordinalStates[msg.nodeId]);
                    let newIdx;
                    
                    if (msg.direction === 'up' && currentIdx < ORDER_STATES.length - 1) {
                        newIdx = currentIdx + 1;
                    } else if (msg.direction === 'down' && currentIdx > 0) {
                        newIdx = currentIdx - 1;
                    } else {
                        newIdx = (currentIdx + 2) % ORDER_STATES.length;
                    }
                    
                    ordinalStates[msg.nodeId] = ORDER_STATES[newIdx];
                }
            }
        } catch (e) {
            console.log("Invalid message:", e);
        }
    });
});

// Constraint satisfaction loop - not time evolution
setInterval(() => {
    resolveViolations();
    
    const payload = JSON.stringify({
        layout: generateOrderLayout(),
        adjacency: adjacency,
        consistency: assessGlobalConsistency(),
        distribution: countStateDistribution(),
        pattern: generateOrderPattern(),
        states: ORDER_STATES
    });
    
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(payload);
        }
    });
}, 100);

////////////////////////////////////////////////////////////////////////////////
// HTML INTERFACE
////////////////////////////////////////////////////////////////////////////////

function generateHTML() {
    return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>hexKERnKERnel ORDINAL - Pure Order Topology</title>
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
    border: 1px solid white;
}
.metric {
    margin: 2px 0;
}
.value {
    color: lime;
    font-weight: bold;
}
.invalid {
    color: red;
}
.valid {
    color: green;
}
</style>
</head>
<body>
<div class="container">
    <div class="view">
        <canvas id="orderCanvas"></canvas>
        <div class="info">
            <div class="metric">ORDINAL GRAPH</div>
            <div class="metric">Status: <span id="status" class="value">-</span></div>
            <div class="metric">Violations: <span id="violations" class="value">0</span></div>
            <div class="metric">Pattern: <span id="pattern" class="value">---</span></div>
            <div class="metric">LOWEST: <span id="lowest" class="value">0</span></div>
            <div class="metric">LOW: <span id="low" class="value">0</span></div>
            <div class="metric">MEDIUM: <span id="medium" class="value">0</span></div>
            <div class="metric">HIGH: <span id="high" class="value">0</span></div>
            <div class="metric">HIGHEST: <span id="highest" class="value">0</span></div>
        </div>
    </div>
    <div class="view">
        <canvas id="constraintCanvas"></canvas>
        <div class="info">
            <div class="metric">CONSTRAINT SATISFACTION</div>
            <div class="metric">Click node: change order</div>
            <div class="metric">Green: consistent</div>
            <div class="metric">Red: violation</div>
            <div class="metric">Yellow: resolving</div>
        </div>
    </div>
</div>

<script>
const ws = new WebSocket("ws://localhost:8080");
const orderCanvas = document.getElementById("orderCanvas");
const constraintCanvas = document.getElementById("constraintCanvas");
const orderCtx = orderCanvas.getContext("2d");
const constraintCtx = constraintCanvas.getContext("2d");

orderCanvas.width = orderCanvas.offsetWidth;
orderCanvas.height = orderCanvas.offsetHeight;
constraintCanvas.width = constraintCanvas.offsetWidth;
constraintCanvas.height = constraintCanvas.offsetHeight;

let orderData = null;

ws.onmessage = (event) => {
    orderData = JSON.parse(event.data);
    renderOrderGraph();
    renderConstraintGraph();
    updateMetrics();
};

function renderOrderGraph() {
    if (!orderData) return;
    
    orderCtx.fillStyle = "black";
    orderCtx.fillRect(0, 0, orderCanvas.width, orderCanvas.height);
    
    const centerX = orderCanvas.width / 2;
    const centerY = orderCanvas.height / 2;
    
    // Draw nodes by ordinal state rings
    for (const node of orderData.layout) {
        const ringRadius = (node.ring + 1) * 60;
        const angleStep = 360 / Math.max(1, orderData.layout.filter(n => n.ring === node.ring).length);
        const nodeIndex = orderData.layout.filter(n => n.ring === node.ring).indexOf(node);
        const angle = nodeIndex * angleStep;
        
        let x, y;
        if (node.ring === 0) {
            x = centerX;
            y = centerY;
        } else {
            // Approximate positioning
            const rad = angle * 0.0174533; // degrees to radians approximation
            x = centerX + ringRadius * Math.cos(rad);
            y = centerY + ringRadius * Math.sin(rad);
        }
        
        // Size and color based on ordinal state
        const size = 8 + node.stateIndex * 4;
        
        let color;
        switch(node.state) {
            case 'LOWEST': color = "rgb(64, 0, 128)"; break;
            case 'LOW': color = "rgb(0, 64, 255)"; break;
            case 'MEDIUM': color = "rgb(128, 128, 128)"; break;
            case 'HIGH': color = "rgb(255, 128, 0)"; break;
            case 'HIGHEST': color = "rgb(255, 0, 0)"; break;
        }
        
        orderCtx.fillStyle = color;
        orderCtx.strokeStyle = node.consistent ? "white" : "red";
        orderCtx.lineWidth = node.consistent ? 1 : 3;
        
        orderCtx.beginPath();
        orderCtx.arc(x, y, size, 0, 6.28);
        orderCtx.fill();
        orderCtx.stroke();
        
        // Store for click detection
        node.screenX = x;
        node.screenY = y;
        node.screenSize = size;
    }
    
    // Draw adjacency connections
    orderCtx.strokeStyle = "rgba(255, 255, 255, 0.2)";
    orderCtx.lineWidth = 1;
    
    for (const node of orderData.layout) {
        for (const neighborId of node.neighbors) {
            const neighbor = orderData.layout[neighborId];
            if (neighbor && neighbor.screenX) {
                orderCtx.beginPath();
                orderCtx.moveTo(node.screenX, node.screenY);
                orderCtx.lineTo(neighbor.screenX, neighbor.screenY);
                orderCtx.stroke();
            }
        }
    }
}

function renderConstraintGraph() {
    if (!orderData) return;
    
    constraintCtx.fillStyle = "black";
    constraintCtx.fillRect(0, 0, constraintCanvas.width, constraintCanvas.height);
    
    const centerX = constraintCanvas.width / 2;
    const centerY = constraintCanvas.height / 2;
    
    // Simple grid layout
    const cols = Math.ceil(Math.sqrt(orderData.layout.length));
    
    for (let i = 0; i < orderData.layout.length; i++) {
        const node = orderData.layout[i];
        
        const col = i % cols;
        const row = Math.floor(i / cols);
        
        const x = centerX + (col - cols/2) * 35;
        const y = centerY + (row - cols/2) * 35;
        
        // Size based on neighbor pattern
        const size = 6 + node.pattern.total * 2;
        
        // Color based on consistency
        let color;
        if (node.consistent) {
            color = "rgb(0, 255, 0)"; // Green - consistent
        } else {
            color = "rgb(255, 0, 0)"; // Red - violation
        }
        
        constraintCtx.fillStyle = color;
        constraintCtx.strokeStyle = "white";
        constraintCtx.lineWidth = 1;
        
        constraintCtx.beginPath();
        constraintCtx.arc(x, y, size, 0, 6.28);
        constraintCtx.fill();
        constraintCtx.stroke();
        
        // Text label
        constraintCtx.fillStyle = "white";
        constraintCtx.font = "8px monospace";
        constraintCtx.textAlign = "center";
        constraintCtx.fillText(node.state[0], x, y + 3);
    }
}

function updateMetrics() {
    if (!orderData) return;
    
    const status = orderData.consistency.consistency;
    document.getElementById("status").textContent = status;
    document.getElementById("status").className = status === 'VALID' ? 'value valid' : 'value invalid';
    
    document.getElementById("violations").textContent = orderData.consistency.violations;
    document.getElementById("pattern").textContent = orderData.pattern;
    
    document.getElementById("lowest").textContent = orderData.distribution.LOWEST;
    document.getElementById("low").textContent = orderData.distribution.LOW;
    document.getElementById("medium").textContent = orderData.distribution.MEDIUM;
    document.getElementById("high").textContent = orderData.distribution.HIGH;
    document.getElementById("highest").textContent = orderData.distribution.HIGHEST;
}

orderCanvas.addEventListener("click", (event) => {
    if (!orderData) return;
    
    const rect = orderCanvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    for (const node of orderData.layout) {
        if (node.screenX && node.screenY) {
            const dx = x - node.screenX;
            const dy = y - node.screenY;
            const dist = dx * dx + dy * dy;
            
            if (dist < node.screenSize * node.screenSize) {
                ws.send(JSON.stringify({
                    type: "perturbation",
                    nodeId: node.id,
                    direction: event.shiftKey ? 'down' : 'up'
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
    console.log(`hexKERnKERnel ORDINAL running at http://localhost:${PORT}`);
    console.log(`Pure order topology - No numerical values`);
    console.log(`Constraint satisfaction - No evolution`);
    console.log(`States: ${ORDER_STATES.join(', ')}`);
});
