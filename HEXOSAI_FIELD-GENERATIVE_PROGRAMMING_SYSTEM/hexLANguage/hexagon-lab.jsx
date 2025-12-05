import React, { useState, useMemo, useCallback } from 'react';

// ============================================
// HEXAGONAL SEMANTIC FIELD LABORATORY v1.0
// Based on Resonant Linguistic Pyramid & CXL Engine
// ============================================

// Mathematical Constants
const DIMENSION_LABELS = ['φ (phase)', 'κ (curvature)', 'ε (entropy)', 'ρ (direction)', 'θ (intensity)', 'σ (stability)'];
const CONCEPT_LABELS = ['connection', 'transition', 'clarity', 'flow', 'intensity', 'boundary', 'origin', 'reflection', 'stability', 'potential'];

// Predefined concept domains
const CONCEPT_DOMAINS = {
  Nature: ['flow', 'storm', 'mountain', 'light', 'darkness', 'earth', 'river', 'wind', 'stone', 'fire', 'water', 'sky'],
  Emotion: ['fear', 'joy', 'anger', 'calm', 'desire', 'sorrow', 'trust', 'confusion', 'hope', 'love'],
  Abstract: ['time', 'change', 'order', 'chaos', 'unity', 'boundary', 'growth', 'decay', 'cycle', 'void'],
  Identity: ['self', 'memory', 'intention', 'awareness', 'choice', 'expression', 'origin', 'destiny', 'will', 'spirit']
};

const GLYPHS = ['▲', '●', '◎', '■', '◆', '★', '◐', '◑', '▼', '◯', '⬡', '⬢', '✦', '⚡', '∞', '≋', '◈', '⊕'];

// ============================================
// CORE MATHEMATICAL FUNCTIONS
// ============================================

// Seeded random number generator for reproducible results
function seededRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Generate 6D semantic vector from concept string
function generateSemanticVector(concept) {
  let hash = 0;
  for (let i = 0; i < concept.length; i++) {
    const char = concept.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  hash = Math.abs(hash);
  
  return Array(6).fill(0).map((_, i) => {
    const seed = hash + i * 1000;
    return seededRandom(seed);
  });
}

// Generate glyph stabilization vector
function generateGlyphVector(glyph) {
  const base = (glyph.charCodeAt(0) % 97) / 26;
  return [
    base,
    Math.sqrt(Math.abs(base)),
    1 - base,
    (base * 0.33) % 1,
    (1 - base * 0.5) % 1,
    (base * 0.77) % 1
  ];
}

// CrossLink Operator: CXL(A, B, G) = (A * B) + G - (A - B)
function crossLink(A, B, G) {
  return A.map((a, i) => (a * B[i]) + G[i] - (a - B[i]));
}

// Mirror Operator: contrast and deviation analysis
function mirror(V) {
  const mean = V.reduce((a, b) => a + b, 0) / V.length;
  const direct = V.map(v => Math.abs(1 - v));
  const deep = V.map(v => Math.abs(v - mean));
  return direct.map((d, i) => (d + deep[i]) / 2);
}

// Emergent scalar computation
function computeEmergent(V) {
  const mean = V.reduce((a, b) => a + b, 0) / V.length;
  return Math.tanh(mean);
}

// Map emergent value to conceptual label
function interpretEmergent(value) {
  const idx = Math.floor((Math.abs(value) * 100) % CONCEPT_LABELS.length);
  return CONCEPT_LABELS[idx];
}

// Compute resonance strength between two vectors
function computeResonance(A, B) {
  const dot = A.reduce((sum, a, i) => sum + a * B[i], 0);
  const magA = Math.sqrt(A.reduce((sum, a) => sum + a * a, 0));
  const magB = Math.sqrt(B.reduce((sum, b) => sum + b * b, 0));
  return dot / (magA * magB) || 0;
}

// Compute field coherence (overall stability metric)
function computeCoherence(vectors) {
  if (vectors.length < 2) return 1;
  let totalResonance = 0;
  let count = 0;
  for (let i = 0; i < vectors.length; i++) {
    for (let j = i + 1; j < vectors.length; j++) {
      totalResonance += Math.abs(computeResonance(vectors[i], vectors[j]));
      count++;
    }
  }
  return count > 0 ? totalResonance / count : 0;
}

// ============================================
// VISUALIZATION COMPONENTS
// ============================================

// Hexagon SVG with nodes and connections
function HexagonVisualization({ nodes, edges, selectedNode, onNodeClick }) {
  const size = 280;
  const cx = size / 2;
  const cy = size / 2;
  const radius = 100;
  
  // Calculate hexagon vertex positions
  const getNodePosition = (index) => {
    const angle = (Math.PI / 3) * index - Math.PI / 2;
    return {
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle)
    };
  };
  
  const nodePositions = Array(6).fill(0).map((_, i) => getNodePosition(i));
  const nodeLabels = ['A', 'B', 'C', 'D', 'E', 'F'];
  const nodeDescriptions = ['Input 1', 'Input 2', 'Glyph', 'CrossLink', 'Mirror', 'Emergent'];
  
  // Calculate edge intensity based on resonance
  const getEdgeColor = (strength) => {
    const h = 200 + strength * 60;
    const s = 70 + strength * 30;
    const l = 40 + strength * 20;
    return `hsl(${h}, ${s}%, ${l}%)`;
  };
  
  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full">
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <linearGradient id="edgeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.6"/>
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.6"/>
        </linearGradient>
      </defs>
      
      {/* Background hexagon */}
      <polygon
        points={nodePositions.map(p => `${p.x},${p.y}`).join(' ')}
        fill="none"
        stroke="#334155"
        strokeWidth="1"
        opacity="0.5"
      />
      
      {/* Edge connections */}
      {edges.map((edge, i) => {
        const from = nodePositions[edge.from];
        const to = nodePositions[edge.to];
        return (
          <line
            key={i}
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            stroke={getEdgeColor(edge.strength)}
            strokeWidth={1 + edge.strength * 3}
            opacity={0.4 + edge.strength * 0.4}
          />
        );
      })}
      
      {/* Nodes */}
      {nodePositions.map((pos, i) => {
        const isSelected = selectedNode === i;
        const hasData = nodes[i] && nodes[i].vector;
        const emergentValue = nodes[i]?.emergentValue || 0;
        
        return (
          <g key={i} onClick={() => onNodeClick(i)} style={{ cursor: 'pointer' }}>
            {/* Node outer ring */}
            <circle
              cx={pos.x}
              cy={pos.y}
              r={isSelected ? 28 : 24}
              fill={hasData ? `hsl(${200 + emergentValue * 60}, 70%, 20%)` : '#1e293b'}
              stroke={isSelected ? '#f59e0b' : hasData ? '#3b82f6' : '#475569'}
              strokeWidth={isSelected ? 3 : 2}
              filter={hasData ? 'url(#glow)' : ''}
            />
            
            {/* Node label */}
            <text
              x={pos.x}
              y={pos.y - 4}
              textAnchor="middle"
              fill={hasData ? '#93c5fd' : '#94a3b8'}
              fontSize="14"
              fontWeight="bold"
            >
              {nodeLabels[i]}
            </text>
            
            {/* Node description */}
            <text
              x={pos.x}
              y={pos.y + 10}
              textAnchor="middle"
              fill="#64748b"
              fontSize="8"
            >
              {nodeDescriptions[i]}
            </text>
          </g>
        );
      })}
      
      {/* Center coherence indicator */}
      <circle
        cx={cx}
        cy={cy}
        r={20}
        fill="#0f172a"
        stroke="#475569"
        strokeWidth="1"
      />
      <text
        x={cx}
        y={cy + 4}
        textAnchor="middle"
        fill="#94a3b8"
        fontSize="10"
      >
        Field
      </text>
    </svg>
  );
}

// Vector display component
function VectorDisplay({ vector, label, compact = false }) {
  if (!vector) return <div className="text-slate-500 text-sm">No data</div>;
  
  if (compact) {
    return (
      <div className="text-xs font-mono text-slate-400">
        [{vector.map(v => v.toFixed(2)).join(', ')}]
      </div>
    );
  }
  
  return (
    <div className="space-y-1">
      {label && <div className="text-sm font-medium text-slate-300 mb-2">{label}</div>}
      <div className="grid grid-cols-2 gap-1">
        {vector.map((v, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-xs text-slate-500 w-16">{DIMENSION_LABELS[i].split(' ')[0]}</span>
            <div className="flex-1 bg-slate-700 rounded-full h-2">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                style={{ width: `${Math.abs(v) * 100}%` }}
              />
            </div>
            <span className="text-xs font-mono text-slate-400 w-10">{v.toFixed(3)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Results table component
function ResultsTable({ results, onSelectResult }) {
  if (!results || results.length === 0) {
    return <div className="text-slate-500 text-center py-8">Run a simulation to see results</div>;
  }
  
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-700">
            <th className="text-left py-2 px-2 text-slate-400">Concept A</th>
            <th className="text-left py-2 px-2 text-slate-400">Concept B</th>
            <th className="text-left py-2 px-2 text-slate-400">Glyph</th>
            <th className="text-left py-2 px-2 text-slate-400">Emergent</th>
            <th className="text-left py-2 px-2 text-slate-400">Label</th>
            <th className="text-left py-2 px-2 text-slate-400">Resonance</th>
          </tr>
        </thead>
        <tbody>
          {results.slice(0, 50).map((r, i) => (
            <tr
              key={i}
              className="border-b border-slate-800 hover:bg-slate-800 cursor-pointer"
              onClick={() => onSelectResult(r)}
            >
              <td className="py-2 px-2 text-slate-300">{r.conceptA}</td>
              <td className="py-2 px-2 text-slate-300">{r.conceptB}</td>
              <td className="py-2 px-2 text-xl">{r.glyph}</td>
              <td className="py-2 px-2 font-mono text-blue-400">{r.emergentValue.toFixed(4)}</td>
              <td className="py-2 px-2 text-purple-400">{r.emergentLabel}</td>
              <td className="py-2 px-2">
                <div className="w-16 bg-slate-700 rounded-full h-2">
                  <div
                    className="h-full rounded-full bg-green-500"
                    style={{ width: `${r.resonance * 100}%` }}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {results.length > 50 && (
        <div className="text-slate-500 text-center py-2 text-sm">
          Showing 50 of {results.length} results
        </div>
      )}
    </div>
  );
}

// Statistics panel
function StatisticsPanel({ results }) {
  if (!results || results.length === 0) return null;
  
  const emergentValues = results.map(r => r.emergentValue);
  const resonanceValues = results.map(r => r.resonance);
  
  const stats = {
    count: results.length,
    avgEmergent: emergentValues.reduce((a, b) => a + b, 0) / emergentValues.length,
    maxEmergent: Math.max(...emergentValues),
    minEmergent: Math.min(...emergentValues),
    avgResonance: resonanceValues.reduce((a, b) => a + b, 0) / resonanceValues.length,
    labelDistribution: results.reduce((acc, r) => {
      acc[r.emergentLabel] = (acc[r.emergentLabel] || 0) + 1;
      return acc;
    }, {})
  };
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-slate-800 rounded-lg p-3">
        <div className="text-slate-500 text-xs">Simulations</div>
        <div className="text-2xl font-bold text-white">{stats.count}</div>
      </div>
      <div className="bg-slate-800 rounded-lg p-3">
        <div className="text-slate-500 text-xs">Avg Emergent</div>
        <div className="text-2xl font-bold text-blue-400">{stats.avgEmergent.toFixed(4)}</div>
      </div>
      <div className="bg-slate-800 rounded-lg p-3">
        <div className="text-slate-500 text-xs">Avg Resonance</div>
        <div className="text-2xl font-bold text-green-400">{(stats.avgResonance * 100).toFixed(1)}%</div>
      </div>
      <div className="bg-slate-800 rounded-lg p-3">
        <div className="text-slate-500 text-xs">Top Label</div>
        <div className="text-lg font-bold text-purple-400">
          {Object.entries(stats.labelDistribution).sort((a, b) => b[1] - a[1])[0]?.[0] || '-'}
        </div>
      </div>
    </div>
  );
}

// ============================================
// MAIN APPLICATION COMPONENT
// ============================================

export default function HexagonalSemanticLab() {
  // State
  const [conceptA, setConceptA] = useState('flow');
  const [conceptB, setConceptB] = useState('time');
  const [selectedGlyph, setSelectedGlyph] = useState('◎');
  const [selectedNode, setSelectedNode] = useState(null);
  const [simulationResults, setSimulationResults] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const [batchMode, setBatchMode] = useState(false);
  const [selectedDomainA, setSelectedDomainA] = useState('Nature');
  const [selectedDomainB, setSelectedDomainB] = useState('Abstract');
  const [activeTab, setActiveTab] = useState('single');
  
  // Compute current hexagon state
  const hexagonState = useMemo(() => {
    const vecA = generateSemanticVector(conceptA);
    const vecB = generateSemanticVector(conceptB);
    const vecG = generateGlyphVector(selectedGlyph);
    const vecCrossLink = crossLink(vecA, vecB, vecG);
    const vecMirror = mirror(vecCrossLink);
    const emergentValue = computeEmergent(vecMirror);
    const emergentLabel = interpretEmergent(emergentValue);
    
    const nodes = [
      { label: 'A', description: 'Concept Input 1', vector: vecA, concept: conceptA },
      { label: 'B', description: 'Concept Input 2', vector: vecB, concept: conceptB },
      { label: 'C', description: 'Glyph Stabilizer', vector: vecG, concept: selectedGlyph },
      { label: 'D', description: 'CrossLink Result', vector: vecCrossLink, emergentValue },
      { label: 'E', description: 'Mirror Output', vector: vecMirror, emergentValue },
      { label: 'F', description: 'Emergent', vector: vecMirror, emergentValue, emergentLabel }
    ];
    
    // Compute edges with resonance strength
    const edges = [
      { from: 0, to: 1, strength: computeResonance(vecA, vecB) },
      { from: 1, to: 2, strength: computeResonance(vecB, vecG) },
      { from: 2, to: 3, strength: computeResonance(vecG, vecCrossLink) },
      { from: 3, to: 4, strength: computeResonance(vecCrossLink, vecMirror) },
      { from: 4, to: 5, strength: Math.abs(emergentValue) },
      { from: 5, to: 0, strength: computeResonance(vecMirror, vecA) },
      // Cross connections
      { from: 0, to: 3, strength: computeResonance(vecA, vecCrossLink) * 0.5 },
      { from: 1, to: 3, strength: computeResonance(vecB, vecCrossLink) * 0.5 },
      { from: 2, to: 4, strength: computeResonance(vecG, vecMirror) * 0.5 }
    ];
    
    const coherence = computeCoherence([vecA, vecB, vecG, vecCrossLink, vecMirror]);
    
    return { nodes, edges, emergentValue, emergentLabel, coherence };
  }, [conceptA, conceptB, selectedGlyph]);
  
  // Run batch simulation
  const runBatchSimulation = useCallback(() => {
    const domainAConcepts = CONCEPT_DOMAINS[selectedDomainA];
    const domainBConcepts = CONCEPT_DOMAINS[selectedDomainB];
    const results = [];
    
    for (const cA of domainAConcepts) {
      for (const cB of domainBConcepts) {
        const vecA = generateSemanticVector(cA);
        const vecB = generateSemanticVector(cB);
        const vecG = generateGlyphVector(selectedGlyph);
        const vecCrossLink = crossLink(vecA, vecB, vecG);
        const vecMirror = mirror(vecCrossLink);
        const emergentValue = computeEmergent(vecMirror);
        const emergentLabel = interpretEmergent(emergentValue);
        const resonance = Math.abs(computeResonance(vecA, vecB));
        
        results.push({
          conceptA: cA,
          conceptB: cB,
          glyph: selectedGlyph,
          domainA: selectedDomainA,
          domainB: selectedDomainB,
          vecA,
          vecB,
          vecG,
          vecCrossLink,
          vecMirror,
          emergentValue,
          emergentLabel,
          resonance
        });
      }
    }
    
    setSimulationResults(results);
  }, [selectedDomainA, selectedDomainB, selectedGlyph]);
  
  // Run single simulation
  const runSingleSimulation = useCallback(() => {
    const vecA = generateSemanticVector(conceptA);
    const vecB = generateSemanticVector(conceptB);
    const vecG = generateGlyphVector(selectedGlyph);
    const vecCrossLink = crossLink(vecA, vecB, vecG);
    const vecMirror = mirror(vecCrossLink);
    const emergentValue = computeEmergent(vecMirror);
    const emergentLabel = interpretEmergent(emergentValue);
    const resonance = Math.abs(computeResonance(vecA, vecB));
    
    const result = {
      conceptA,
      conceptB,
      glyph: selectedGlyph,
      domainA: 'Custom',
      domainB: 'Custom',
      vecA,
      vecB,
      vecG,
      vecCrossLink,
      vecMirror,
      emergentValue,
      emergentLabel,
      resonance
    };
    
    setSimulationResults(prev => [result, ...prev]);
    setSelectedResult(result);
  }, [conceptA, conceptB, selectedGlyph]);
  
  // Export results
  const exportResults = useCallback(() => {
    const exportData = {
      metadata: {
        version: '1.0',
        timestamp: new Date().toISOString(),
        simulationCount: simulationResults.length
      },
      parameters: {
        dimensions: DIMENSION_LABELS,
        conceptLabels: CONCEPT_LABELS,
        glyphUsed: selectedGlyph
      },
      results: simulationResults.map(r => ({
        inputs: { conceptA: r.conceptA, conceptB: r.conceptB, glyph: r.glyph },
        vectors: {
          A: r.vecA,
          B: r.vecB,
          G: r.vecG,
          crossLink: r.vecCrossLink,
          mirror: r.vecMirror
        },
        outputs: {
          emergentValue: r.emergentValue,
          emergentLabel: r.emergentLabel,
          resonance: r.resonance
        }
      }))
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hexagon-field-export-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [simulationResults, selectedGlyph]);
  
  // Clear results
  const clearResults = () => {
    setSimulationResults([]);
    setSelectedResult(null);
  };
  
  return (
    <div className="min-h-screen bg-slate-900 text-white p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Hexagonal Semantic Field Laboratory
          </h1>
          <p className="text-slate-400 mt-2">
            CrossLinked Semantic Engine • Resonant Field Dynamics • v1.0
          </p>
        </div>
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Hexagon Visualization */}
          <div className="bg-slate-800 rounded-xl p-4">
            <h2 className="text-lg font-semibold mb-4 text-slate-300">Field Hexagon</h2>
            <div className="aspect-square">
              <HexagonVisualization
                nodes={hexagonState.nodes}
                edges={hexagonState.edges}
                selectedNode={selectedNode}
                onNodeClick={setSelectedNode}
              />
            </div>
            
            {/* Field Metrics */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="bg-slate-700 rounded-lg p-3">
                <div className="text-xs text-slate-500">Coherence</div>
                <div className="text-xl font-bold text-green-400">
                  {(hexagonState.coherence * 100).toFixed(1)}%
                </div>
              </div>
              <div className="bg-slate-700 rounded-lg p-3">
                <div className="text-xs text-slate-500">Emergent</div>
                <div className="text-xl font-bold text-purple-400">
                  {hexagonState.emergentLabel}
                </div>
              </div>
            </div>
            
            {/* Selected Node Details */}
            {selectedNode !== null && hexagonState.nodes[selectedNode] && (
              <div className="mt-4 bg-slate-700 rounded-lg p-3">
                <div className="text-sm font-medium text-slate-300 mb-2">
                  Node {hexagonState.nodes[selectedNode].label}: {hexagonState.nodes[selectedNode].description}
                </div>
                {hexagonState.nodes[selectedNode].concept && (
                  <div className="text-xs text-slate-500 mb-2">
                    Value: {hexagonState.nodes[selectedNode].concept}
                  </div>
                )}
                <VectorDisplay vector={hexagonState.nodes[selectedNode].vector} />
              </div>
            )}
          </div>
          
          {/* Center Panel - Controls */}
          <div className="bg-slate-800 rounded-xl p-4">
            <div className="flex gap-2 mb-4">
              <button
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'single' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
                onClick={() => setActiveTab('single')}
              >
                Single Mode
              </button>
              <button
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'batch' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
                onClick={() => setActiveTab('batch')}
              >
                Batch Mode
              </button>
            </div>
            
            {activeTab === 'single' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Concept A</label>
                  <input
                    type="text"
                    value={conceptA}
                    onChange={(e) => setConceptA(e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                    placeholder="Enter concept..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Concept B</label>
                  <input
                    type="text"
                    value={conceptB}
                    onChange={(e) => setConceptB(e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                    placeholder="Enter concept..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Glyph Stabilizer</label>
                  <div className="grid grid-cols-6 gap-2">
                    {GLYPHS.map(g => (
                      <button
                        key={g}
                        onClick={() => setSelectedGlyph(g)}
                        className={`p-2 text-xl rounded-lg transition-colors ${
                          selectedGlyph === g
                            ? 'bg-purple-600 text-white'
                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
                
                <button
                  onClick={runSingleSimulation}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-medium hover:from-blue-500 hover:to-purple-500 transition-colors"
                >
                  Run Simulation
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Domain A</label>
                  <select
                    value={selectedDomainA}
                    onChange={(e) => setSelectedDomainA(e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    {Object.keys(CONCEPT_DOMAINS).map(d => (
                      <option key={d} value={d}>{d} ({CONCEPT_DOMAINS[d].length} concepts)</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Domain B</label>
                  <select
                    value={selectedDomainB}
                    onChange={(e) => setSelectedDomainB(e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    {Object.keys(CONCEPT_DOMAINS).map(d => (
                      <option key={d} value={d}>{d} ({CONCEPT_DOMAINS[d].length} concepts)</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Glyph Stabilizer</label>
                  <div className="grid grid-cols-6 gap-2">
                    {GLYPHS.slice(0, 12).map(g => (
                      <button
                        key={g}
                        onClick={() => setSelectedGlyph(g)}
                        className={`p-2 text-xl rounded-lg transition-colors ${
                          selectedGlyph === g
                            ? 'bg-purple-600 text-white'
                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="text-sm text-slate-500">
                  Will generate {CONCEPT_DOMAINS[selectedDomainA].length * CONCEPT_DOMAINS[selectedDomainB].length} simulations
                </div>
                
                <button
                  onClick={runBatchSimulation}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-medium hover:from-blue-500 hover:to-purple-500 transition-colors"
                >
                  Run Batch Simulation
                </button>
              </div>
            )}
            
            {/* Current Computation Display */}
            <div className="mt-6 bg-slate-700 rounded-lg p-4">
              <h3 className="text-sm font-medium text-slate-300 mb-3">Current Computation</h3>
              <div className="space-y-2 text-xs font-mono">
                <div className="text-slate-400">
                  <span className="text-blue-400">A</span> = semantic_vec("{conceptA}")
                </div>
                <div className="text-slate-400">
                  <span className="text-green-400">B</span> = semantic_vec("{conceptB}")
                </div>
                <div className="text-slate-400">
                  <span className="text-purple-400">G</span> = glyph_vec("{selectedGlyph}")
                </div>
                <div className="text-slate-400">
                  <span className="text-yellow-400">D</span> = crosslink(A, B, G)
                </div>
                <div className="text-slate-400">
                  <span className="text-pink-400">E</span> = mirror(D)
                </div>
                <div className="text-slate-400">
                  <span className="text-orange-400">F</span> = emergent(E) → <span className="text-white">{hexagonState.emergentLabel}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Panel - Results */}
          <div className="bg-slate-800 rounded-xl p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-slate-300">Results</h2>
              <div className="flex gap-2">
                <button
                  onClick={exportResults}
                  disabled={simulationResults.length === 0}
                  className="px-3 py-1 text-sm bg-slate-700 rounded-lg hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Export
                </button>
                <button
                  onClick={clearResults}
                  disabled={simulationResults.length === 0}
                  className="px-3 py-1 text-sm bg-red-900 rounded-lg hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Clear
                </button>
              </div>
            </div>
            
            {/* Statistics */}
            <StatisticsPanel results={simulationResults} />
            
            {/* Results Table */}
            <div className="mt-4 max-h-96 overflow-y-auto">
              <ResultsTable
                results={simulationResults}
                onSelectResult={setSelectedResult}
              />
            </div>
            
            {/* Selected Result Detail */}
            {selectedResult && (
              <div className="mt-4 bg-slate-700 rounded-lg p-4">
                <h3 className="text-sm font-medium text-slate-300 mb-3">
                  Selected: {selectedResult.conceptA} × {selectedResult.conceptB}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-slate-500 mb-1">CrossLink Vector</div>
                    <VectorDisplay vector={selectedResult.vecCrossLink} compact />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Mirror Vector</div>
                    <VectorDisplay vector={selectedResult.vecMirror} compact />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Bottom Section - Extended Analysis */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Vector Comparison */}
          <div className="bg-slate-800 rounded-xl p-4">
            <h2 className="text-lg font-semibold text-slate-300 mb-4">Vector Analysis</h2>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-slate-400 mb-2">Concept A: {conceptA}</div>
                <VectorDisplay vector={hexagonState.nodes[0].vector} />
              </div>
              <div>
                <div className="text-sm text-slate-400 mb-2">Concept B: {conceptB}</div>
                <VectorDisplay vector={hexagonState.nodes[1].vector} />
              </div>
              <div>
                <div className="text-sm text-slate-400 mb-2">CrossLinked Result</div>
                <VectorDisplay vector={hexagonState.nodes[3].vector} />
              </div>
            </div>
          </div>
          
          {/* Mathematical Operations */}
          <div className="bg-slate-800 rounded-xl p-4">
            <h2 className="text-lg font-semibold text-slate-300 mb-4">Operation Details</h2>
            <div className="space-y-4 text-sm">
              <div className="bg-slate-700 rounded-lg p-3">
                <div className="text-purple-400 font-medium mb-1">CrossLink Formula</div>
                <div className="text-slate-400 font-mono text-xs">
                  CXL(A, B, G) = (A × B) + G - (A - B)
                </div>
                <div className="text-slate-500 text-xs mt-1">
                  Combines phase multiplication with glyph stabilization and differential correction
                </div>
              </div>
              
              <div className="bg-slate-700 rounded-lg p-3">
                <div className="text-pink-400 font-medium mb-1">Mirror Formula</div>
                <div className="text-slate-400 font-mono text-xs">
                  M(V) = (|1 - V| + |V - μ|) / 2
                </div>
                <div className="text-slate-500 text-xs mt-1">
                  Averages complement deviation with mean deviation for contrast analysis
                </div>
              </div>
              
              <div className="bg-slate-700 rounded-lg p-3">
                <div className="text-orange-400 font-medium mb-1">Emergent Formula</div>
                <div className="text-slate-400 font-mono text-xs">
                  E(V) = tanh(μ(V))
                </div>
                <div className="text-slate-500 text-xs mt-1">
                  Hyperbolic tangent of mean produces bounded emergent scalar in [-1, 1]
                </div>
              </div>
              
              <div className="bg-slate-700 rounded-lg p-3">
                <div className="text-green-400 font-medium mb-1">Resonance Formula</div>
                <div className="text-slate-400 font-mono text-xs">
                  R(A, B) = (A · B) / (|A| × |B|)
                </div>
                <div className="text-slate-500 text-xs mt-1">
                  Cosine similarity measures alignment between semantic vectors
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-6 text-center text-slate-500 text-sm">
          <p>Hexagonal Semantic Field Laboratory • Based on Resonant Linguistic Pyramid Theory</p>
          <p className="text-xs mt-1">CrossLinked Semantic Engine (CXL) • Field-Theoretic Computation</p>
        </div>
      </div>
    </div>
  );
}
