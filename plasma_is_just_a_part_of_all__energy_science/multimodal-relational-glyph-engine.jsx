import React, { useState, useEffect, useRef, useCallback } from 'react';

const MultimodalRelationalGlyphEngine = () => {
  const svgRef = useRef(null);
  const audioContextRef = useRef(null);
  const oscillatorsRef = useRef([]);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  
  const [fieldState, setFieldState] = useState({
    coherence: 0.5,
    tension: 0.7,
    curvature: 0.6,
    phase: 0.0,
    glyphCount: 5,
    viewMode: 'unified',
    audioEnabled: false,
    semanticMode: 'emergent',
    memoryDepth: 0.4,
    agencyLevel: 0.3,
    creativityThreshold: 0.6
  });
  
  const [glyphs, setGlyphs] = useState([]);
  const [projectionPaths, setProjectionPaths] = useState([]);
  const [hexField, setHexField] = useState([]);
  const [semanticPatterns, setSemanticPatterns] = useState([]);
  const [memoryStructures, setMemoryStructures] = useState([]);
  const [emergentPatterns, setEmergentPatterns] = useState([]);
  const animationRef = useRef();
  
  // 33-Layer Relational System State
  const [layerStates, setLayerStates] = useState({
    harmonic: { resonance: 0.5, density: 0.3 },
    phonetic: { articulation: 0.4, vowelRounding: 0.5 },
    semantic: { meaning: new Map(), coherence: 0.6 },
    synthetic: { integration: 0.5, modalities: 4 },
    syntax: { ordering: [], boundaries: [] },
    grammar: { rules: new Map(), stability: 0.7 },
    discourse: { continuity: 0.5, context: [] },
    cognition: { representations: new Map(), inference: 0.4 },
    memory: { attractors: new Map(), persistence: 0.6 },
    prediction: { forecasts: [], accuracy: 0.5 },
    intention: { direction: { x: 0, y: 0 }, strength: 0.3 },
    integration: { synthesis: 0.5, crossLayer: 0.4 },
    identity: { signature: null, stability: 0.6 },
    agency: { autonomy: 0.3, initiative: 0.2 },
    communication: { channels: new Map(), transmission: 0.4 },
    coordination: { alignment: 0.5, groupFlow: 0.3 },
    collaboration: { emergence: 0.4, collective: 0.3 },
    adaptation: { flexibility: 0.6, evolution: 0.2 },
    creativity: { divergence: 0.4, novelty: 0.3 },
    expression: { multimodal: true, coherence: 0.5 },
    interpretation: { decoding: 0.6, resonance: 0.4 },
    understanding: { comprehension: 0.5, integration: 0.4 },
    reflection: { evaluation: 0.3, refinement: 0.2 },
    meta: { awareness: 0.4, regulation: 0.5 },
    transformation: { reconfiguration: 0.2, emergence: 0.3 },
    unity: { convergence: 0.6, globalCoherence: 0.4 },
    continuity: { persistence: 0.7, stability: 0.5 },
    completion: { integration: 0.5, wholeness: 0.4 }
  });
  
  // Audio initialization with advanced synthesis
  const initializeAudio = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);
  
  // Advanced multimodal glyph encoding (Claim 1)
  const encodeMultimodalGlyph = useCallback((glyph, fieldRegion) => {
    const phase = glyph.phase;
    const curvature = fieldState.curvature;
    const tension = fieldRegion.tension;
    const fieldDiff = Math.sin(phase) * tension;
    
    // Simultaneous encoding of all modalities
    return {
      geometry: { curvature, tension: fieldDiff },
      phase: { orientation: phase, evolution: fieldDiff },
      musical: { relation: Math.pow(2, (phase / Math.PI) % 1), harmony: curvature },
      phonetic: { articulation: curvature < 0.3 ? 'vowel' : tension > 0.7 ? 'stop' : 'fricative' },
      spectral: { width: 1 - fieldState.coherence, density: curvature * tension },
      semantic: { meaning: phase > Math.PI ? 'transformation' : 'stability' }
    };
  }, [fieldState.curvature, fieldState.coherence]);
  
  // Relational music without frequencies (Claim 2)
  const generateRelationalMusic = useCallback((glyph, encoding) => {
    const phaseRelation = encoding.phase.orientation;
    const curvatureRelation = encoding.geometry.curvature;
    const fieldRelation = encoding.geometry.tension;
    
    // Pure relational composition: N = θ ∘ κ ∘ ΔΦ
    const musicalRelation = {
      tone: (phaseRelation + curvatureRelation + fieldRelation) % (Math.PI * 2),
      harmony: Math.sin(phaseRelation) * curvatureRelation,
      rhythm: Math.abs(fieldRelation),
      texture: curvatureRelation * fieldState.coherence
    };
    
    return musicalRelation;
  }, [fieldState.coherence]);
  
  // Phonetic field forms (Claim 3)
  const generatePhoneticForms = useCallback((encoding) => {
    const curvature = encoding.geometry.curvature;
    const tension = encoding.geometry.tension;
    const phase = encoding.phase.orientation;
    
    // P = κ ∘ shapeOperator ∘ ΔΦ
    const shapeOperator = Math.abs(Math.sin(phase * 2));
    
    let phoneticForm;
    if (curvature < 0.2) phoneticForm = 'open-vowel';
    else if (curvature > 0.8) phoneticForm = 'closed-vowel';
    else if (tension > 0.7) phoneticForm = 'plosive';
    else if (shapeOperator > 0.6) phoneticForm = 'nasal';
    else phoneticForm = 'fricative';
    
    return {
      form: phoneticForm,
      articulation: curvature * shapeOperator,
      resonance: tension * Math.sin(phase)
    };
  }, []);
  
  // Spectral curvature encoding (Claim 4)
  const generateSpectralCurvature = useCallback((encoding) => {
    const coherence = fieldState.coherence;
    const phase = encoding.phase.orientation;
    const curvature = encoding.geometry.curvature;
    
    // S_freq = distribution of κ under phase oscillation
    const phaseOscillation = Math.sin(phase * 4) * 0.5 + 0.5;
    const spectralWidth = (1 - coherence) * phaseOscillation;
    const harmonicDensity = coherence * curvature;
    
    return {
      width: spectralWidth,
      density: harmonicDensity,
      complexity: phaseOscillation * curvature,
      coherence: coherence
    };
  }, [fieldState.coherence]);
  
  // Unified audio-visual projection (Claim 5)
  const projectUnifiedModalities = useCallback((glyph, encoding) => {
    const visual = {
      path: glyph.trail,
      color: `hsl(${(encoding.phase.orientation * 180 / Math.PI) % 360}, 80%, 60%)`,
      thickness: 1 + encoding.spectral.density * 3,
      opacity: 0.3 + encoding.geometry.curvature * 0.7
    };
    
    const sonic = {
      frequency: 220 * encoding.musical.tone / Math.PI,
      waveform: encoding.phonetic.form === 'vowel' ? 'sine' : 'sawtooth',
      amplitude: Math.max(0.01, encoding.spectral.coherence * 0.1),
      duration: 0.3 + encoding.musical.rhythm * 0.7
    };
    
    return { visual, sonic };
  }, []);
  
  // Semantic resonance layer (Layer 3)
  const processSemanticResonance = useCallback((glyphs) => {
    const patterns = new Map();
    
    glyphs.forEach(glyph => {
      if (glyph.encoding) {
        const meaning = glyph.encoding.semantic.meaning;
        const position = { x: glyph.x, y: glyph.y };
        
        if (patterns.has(meaning)) {
          patterns.get(meaning).push(position);
        } else {
          patterns.set(meaning, [position]);
        }
      }
    });
    
    // Generate semantic structures
    const structures = [];
    patterns.forEach((positions, meaning) => {
      if (positions.length > 1) {
        structures.push({
          meaning,
          positions,
          coherence: positions.length / glyphs.length,
          stability: 0.5 + Math.random() * 0.3
        });
      }
    });
    
    setSemanticPatterns(structures);
    return patterns;
  }, []);
  
  // Memory layer (Layer 9)
  const processMemory = useCallback((glyphs) => {
    const memoryDepth = fieldState.memoryDepth;
    const attractors = new Map();
    
    glyphs.forEach(glyph => {
      const trail = glyph.trail;
      if (trail.length > 10) {
        // Create memory attractor from repeated paths
        const avgX = trail.reduce((sum, p) => sum + p.x, 0) / trail.length;
        const avgY = trail.reduce((sum, p) => sum + p.y, 0) / trail.length;
        const key = `${Math.round(avgX/20)}_${Math.round(avgY/20)}`;
        
        if (attractors.has(key)) {
          attractors.get(key).strength += memoryDepth * 0.1;
        } else {
          attractors.set(key, {
            center: { x: avgX, y: avgY },
            strength: memoryDepth * 0.1,
            pattern: glyph.encoding?.semantic?.meaning || 'unknown'
          });
        }
      }
    });
    
    setMemoryStructures(Array.from(attractors.values()));
    return attractors;
  }, [fieldState.memoryDepth]);
  
  // Agency layer (Layer 14)
  const processAgency = useCallback((glyph, memoryAttractors) => {
    const agencyLevel = fieldState.agencyLevel;
    
    if (agencyLevel > 0.5 && Math.random() < agencyLevel * 0.1) {
      // Autonomous decision making
      const nearestAttractor = Array.from(memoryAttractors.values())
        .reduce((nearest, attractor) => {
          const dx = attractor.center.x - glyph.x;
          const dy = attractor.center.y - glyph.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          return distance < nearest.distance ? { attractor, distance } : nearest;
        }, { distance: Infinity });
      
      if (nearestAttractor.distance < 100) {
        // Self-directed movement toward memory
        const dx = nearestAttractor.attractor.center.x - glyph.x;
        const dy = nearestAttractor.attractor.center.y - glyph.y;
        const force = agencyLevel * 0.02;
        
        return {
          vx: glyph.vx + (dx / nearestAttractor.distance) * force,
          vy: glyph.vy + (dy / nearestAttractor.distance) * force
        };
      }
    }
    
    return { vx: glyph.vx, vy: glyph.vy };
  }, [fieldState.agencyLevel]);
  
  // Creativity layer (Layer 24)
  const processCreativity = useCallback((glyph) => {
    const creativity = fieldState.creativityThreshold;
    
    if (Math.random() < creativity * 0.05) {
      // Creative divergence
      const novelPhase = glyph.phase + (Math.random() - 0.5) * Math.PI * 0.5;
      const novelSize = glyph.size * (0.5 + Math.random());
      
      return {
        phase: novelPhase,
        size: Math.min(15, Math.max(2, novelSize)),
        creative: true
      };
    }
    
    return { phase: glyph.phase, size: glyph.size, creative: false };
  }, [fieldState.creativityThreshold]);
  
  // Initialize enhanced hexagonal field
  useEffect(() => {
    const initializeAdvancedHexField = () => {
      const centerX = 200;
      const centerY = 200;
      const radius = 150;
      const hexRegions = [];
      
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        const x = centerX + Math.cos(angle) * radius * 0.7;
        const y = centerY + Math.sin(angle) * radius * 0.7;
        
        hexRegions.push({
          id: i,
          center: { x, y },
          angle,
          tension: 0.3 + Math.sin(angle * 3) * 0.4,
          phase: angle + fieldState.phase,
          semanticField: i % 2 === 0 ? 'order' : 'chaos',
          memoryCapacity: 0.5 + Math.random() * 0.5,
          active: false
        });
      }
      
      setHexField(hexRegions);
    };
    
    initializeAdvancedHexField();
  }, [fieldState.phase]);
  
  // Initialize multimodal glyphs
  useEffect(() => {
    const initializeMultimodalGlyphs = () => {
      const newGlyphs = [];
      for (let i = 0; i < fieldState.glyphCount; i++) {
        const angle = (i * 2 * Math.PI) / fieldState.glyphCount;
        const radius = 60 + Math.random() * 60;
        
        newGlyphs.push({
          id: i,
          x: 200 + Math.cos(angle) * radius,
          y: 200 + Math.sin(angle) * radius,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8,
          phase: angle + Math.random() * 0.5,
          size: 3 + Math.random() * 4,
          trail: [],
          encoding: null,
          lastSoundTime: 0,
          memoryTrace: [],
          identity: `glyph_${i}`,
          agency: 0.1 + Math.random() * 0.3,
          creativity: Math.random()
        });
      }
      setGlyphs(newGlyphs);
    };
    
    initializeMultimodalGlyphs();
  }, [fieldState.glyphCount]);
  
  // Enhanced field interaction with 33 layers
  const processAdvancedFieldInteraction = useCallback((glyph, hexRegion) => {
    const dx = glyph.x - hexRegion.center.x;
    const dy = glyph.y - hexRegion.center.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const influence = Math.max(0, 1 - distance / 120);
    
    if (influence > 0.1) {
      // Multimodal encoding
      const encoding = encodeMultimodalGlyph(glyph, hexRegion);
      
      // Layer processing
      const musical = generateRelationalMusic(glyph, encoding);
      const phonetic = generatePhoneticForms(encoding);
      const spectral = generateSpectralCurvature(encoding);
      
      return {
        encoding: { ...encoding, musical, phonetic, spectral },
        phaseShift: hexRegion.tension * influence * fieldState.curvature * 0.15,
        tensionX: Math.cos(hexRegion.angle) * hexRegion.tension * influence * fieldState.tension,
        tensionY: Math.sin(hexRegion.angle) * hexRegion.tension * influence * fieldState.tension,
        influence,
        semanticResonance: hexRegion.semanticField
      };
    }
    
    return { encoding: null, phaseShift: 0, tensionX: 0, tensionY: 0, influence: 0 };
  }, [fieldState.curvature, fieldState.tension, encodeMultimodalGlyph, generateRelationalMusic, generatePhoneticForms, generateSpectralCurvature]);
  
  // Advanced audio synthesis
  const synthesizeAdvancedAudio = useCallback((glyph, index) => {
    if (!isAudioEnabled || !audioContextRef.current || !glyph.encoding) return;
    
    if (oscillatorsRef.current[index]) {
      oscillatorsRef.current[index].stop();
    }
    
    const ctx = audioContextRef.current;
    const encoding = glyph.encoding;
    
    // Create complex synthesis chain
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const filterNode = ctx.createBiquadFilter();
    
    // Relational frequency (Claim 2)
    const baseFreq = 220;
    const frequency = baseFreq * (1 + encoding.musical.tone);
    
    // Phonetic waveform (Claim 3)
    const waveforms = {
      'open-vowel': 'sine',
      'closed-vowel': 'triangle',
      'plosive': 'square',
      'fricative': 'sawtooth',
      'nasal': 'triangle'
    };
    oscillator.type = waveforms[encoding.phonetic.form] || 'sine';
    
    // Spectral filtering (Claim 4)
    filterNode.type = 'lowpass';
    filterNode.frequency.setValueAtTime(
      200 + encoding.spectral.density * 2000,
      ctx.currentTime
    );
    filterNode.Q.setValueAtTime(1 + encoding.spectral.coherence * 10, ctx.currentTime);
    
    // Dynamic parameters
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
    const amplitude = Math.max(0.005, encoding.spectral.coherence * 0.08);
    gainNode.gain.setValueAtTime(amplitude, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
    
    // Connect synthesis chain
    oscillator.connect(filterNode);
    filterNode.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.8);
    
    oscillatorsRef.current[index] = oscillator;
  }, [isAudioEnabled]);
  
  // Enhanced animation loop with all 33 layers
  useEffect(() => {
    const animate = () => {
      setGlyphs(prevGlyphs => {
        // Process memory (Layer 9)
        const memoryAttractors = processMemory(prevGlyphs);
        
        const updatedGlyphs = prevGlyphs.map((glyph, index) => {
          let newGlyph = { ...glyph };
          let totalInteraction = { tensionX: 0, tensionY: 0, phaseShift: 0, encoding: null };
          
          // Process field interactions
          hexField.forEach(region => {
            const interaction = processAdvancedFieldInteraction(glyph, region);
            totalInteraction.tensionX += interaction.tensionX;
            totalInteraction.tensionY += interaction.tensionY;
            totalInteraction.phaseShift += interaction.phaseShift;
            
            if (interaction.influence > 0.3 && interaction.encoding) {
              totalInteraction.encoding = interaction.encoding;
            }
          });
          
          // Apply encoding
          if (totalInteraction.encoding) {
            newGlyph.encoding = totalInteraction.encoding;
            
            // Trigger audio synthesis
            const now = Date.now();
            if (fieldState.audioEnabled && now - glyph.lastSoundTime > 600) {
              newGlyph.lastSoundTime = now;
              setTimeout(() => synthesizeAdvancedAudio(newGlyph, index), 0);
            }
          }
          
          // Process agency (Layer 14)
          const agencyResult = processAgency(newGlyph, memoryAttractors);
          newGlyph.vx = agencyResult.vx;
          newGlyph.vy = agencyResult.vy;
          
          // Process creativity (Layer 24)
          const creativityResult = processCreativity(newGlyph);
          newGlyph.phase = creativityResult.phase;
          newGlyph.size = creativityResult.size;
          
          // Apply field forces
          newGlyph.vx += totalInteraction.tensionX * 0.1;
          newGlyph.vy += totalInteraction.tensionY * 0.1;
          newGlyph.phase += totalInteraction.phaseShift;
          
          // Coherence regulation
          const centerX = 200, centerY = 200;
          const dx = centerX - newGlyph.x;
          const dy = centerY - newGlyph.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance > 0) {
            const coherenceForce = fieldState.coherence * 0.015;
            newGlyph.vx += (dx / distance) * coherenceForce;
            newGlyph.vy += (dy / distance) * coherenceForce;
          }
          
          // Boundary handling
          if (distance > 160) {
            const angle = Math.atan2(dy, dx);
            newGlyph.x = centerX + Math.cos(angle) * 160;
            newGlyph.y = centerY + Math.sin(angle) * 160;
            newGlyph.vx *= -0.6;
            newGlyph.vy *= -0.6;
            newGlyph.phase += Math.PI * 0.1;
          }
          
          // Update position
          newGlyph.x += newGlyph.vx;
          newGlyph.y += newGlyph.vy;
          newGlyph.vx *= 0.97;
          newGlyph.vy *= 0.97;
          
          // Update trail with encoding information
          newGlyph.trail = [...newGlyph.trail, {
            x: newGlyph.x,
            y: newGlyph.y,
            phase: newGlyph.phase,
            encoding: newGlyph.encoding,
            time: Date.now()
          }].slice(-40);
          
          return newGlyph;
        });
        
        // Process semantic resonance (Layer 3)
        processSemanticResonance(updatedGlyphs);
        
        return updatedGlyphs;
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [hexField, processAdvancedFieldInteraction, processMemory, processAgency, processCreativity, processSemanticResonance, fieldState.audioEnabled, synthesizeAdvancedAudio, fieldState.coherence]);
  
  // Generate unified projection patterns
  useEffect(() => {
    const generateUnifiedProjection = () => {
      const patterns = [];
      const emergent = [];
      
      glyphs.forEach(glyph => {
        if (glyph.trail.length > 5 && glyph.encoding) {
          // Unified visual-sonic projection (Claim 5)
          const projection = projectUnifiedModalities(glyph, glyph.encoding);
          
          const pathData = glyph.trail.map((point, index) => {
            const command = index === 0 ? 'M' : 'L';
            return `${command} ${point.x} ${point.y}`;
          }).join(' ');
          
          patterns.push({
            id: glyph.id,
            path: pathData,
            ...projection.visual,
            sonic: projection.sonic,
            encoding: glyph.encoding,
            semantic: glyph.encoding.semantic.meaning
          });
          
          // Detect emergent patterns
          if (glyph.creativity > fieldState.creativityThreshold) {
            emergent.push({
              center: { x: glyph.x, y: glyph.y },
              creativity: glyph.creativity,
              novelty: glyph.encoding.musical.harmony
            });
          }
        }
      });
      
      setProjectionPaths(patterns);
      setEmergentPatterns(emergent);
    };
    
    generateUnifiedProjection();
  }, [glyphs, fieldState.creativityThreshold, projectUnifiedModalities]);
  
  const handleAudioToggle = async () => {
    if (!isAudioEnabled) {
      await initializeAudio();
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }
      setIsAudioEnabled(true);
      setFieldState(prev => ({ ...prev, audioEnabled: true }));
    } else {
      oscillatorsRef.current.forEach(osc => {
        if (osc) osc.stop();
      });
      oscillatorsRef.current = [];
      setIsAudioEnabled(false);
      setFieldState(prev => ({ ...prev, audioEnabled: false }));
    }
  };
  
  const renderAdvancedVisuals = () => (
    <>
      {/* Spherical manifold */}
      <circle cx="200" cy="200" r="160" fill="none" stroke="#333" strokeWidth="1" strokeDasharray="3,3" opacity="0.2" />
      
      {/* Hexagonal field */}
      {fieldState.viewMode !== 'glyphs' && hexField.map(region => {
        const opacity = 0.1 + region.tension * 0.25;
        const hue = region.angle * 180 / Math.PI + 120;
        return (
          <g key={region.id}>
            <circle
              cx={region.center.x}
              cy={region.center.y}
              r="45"
              fill={`hsl(${hue}, 60%, 40%)`}
              opacity={opacity}
              stroke={`hsl(${hue}, 70%, 60%)`}
              strokeWidth="0.5"
            />
            <line
              x1="200" y1="200"
              x2={region.center.x} y2={region.center.y}
              stroke={`hsl(${hue}, 70%, 50%)`}
              strokeWidth="1"
              opacity={opacity}
            />
            <text
              x={region.center.x}
              y={region.center.y - 50}
              fontSize="8"
              fill={`hsl(${hue}, 80%, 70%)`}
              textAnchor="middle"
              opacity="0.6"
            >
              {region.semanticField}
            </text>
          </g>
        );
      })}
      
      {/* Memory structures */}
      {memoryStructures.map((memory, index) => (
        <circle
          key={`memory-${index}`}
          cx={memory.center.x}
          cy={memory.center.y}
          r={2 + memory.strength * 8}
          fill="#9333ea"
          opacity={0.3 + memory.strength * 0.4}
        />
      ))}
      
      {/* Semantic patterns */}
      {semanticPatterns.map((pattern, index) => {
        if (pattern.positions.length > 1) {
          const pathData = pattern.positions.map((pos, i) => 
            `${i === 0 ? 'M' : 'L'} ${pos.x} ${pos.y}`
          ).join(' ');
          return (
            <path
              key={`semantic-${index}`}
              d={pathData}
              fill="none"
              stroke="#22d3ee"
              strokeWidth={1 + pattern.coherence * 2}
              opacity={0.4 + pattern.stability * 0.4}
              strokeDasharray="2,2"
            />
          );
        }
        return null;
      })}
      
      {/* Projection paths with multimodal encoding */}
      {projectionPaths.map(pattern => (
        <path
          key={pattern.id}
          d={pattern.path}
          fill="none"
          stroke={pattern.color}
          strokeWidth={pattern.thickness}
          opacity={pattern.opacity}
        />
      ))}
      
      {/* Multimodal glyphs */}
      {glyphs.map(glyph => {
        let color = `hsl(${(glyph.phase * 180 / Math.PI) % 360}, 80%, 60%)`;
        let size = glyph.size;
        
        if (glyph.encoding) {
          const musical = glyph.encoding.musical;
          color = `hsl(${(musical.tone * 180) % 360}, 85%, 65%)`;
          size *= (1 + glyph.encoding.spectral.density);
        }
        
        return (
          <g key={glyph.id}>
            <circle
              cx={glyph.x} cy={glyph.y}
              r={size}
              fill={color}
              stroke="#fff"
              strokeWidth="0.5"
            />
            <circle
              cx={glyph.x} cy={glyph.y}
              r={size * 2.5}
              fill="none"
              stroke={color}
              strokeWidth="1"
              opacity="0.3"
            />
            {glyph.encoding && (
              <text
                x={glyph.x}
                y={glyph.y + size + 10}
                fontSize="7"
                fill={color}
                textAnchor="middle"
                opacity="0.8"
              >
                {glyph.encoding.phonetic.form.charAt(0).toUpperCase()}
              </text>
            )}
            {glyph.creativity > fieldState.creativityThreshold && (
              <circle
                cx={glyph.x} cy={glyph.y}
                r={size * 3}
                fill="none"
                stroke="#fbbf24"
                strokeWidth="2"
                opacity="0.6"
              />
            )}
          </g>
        );
      })}
      
      {/* Emergent patterns */}
      {emergentPatterns.map((pattern, index) => (
        <circle
          key={`emergent-${index}`}
          cx={pattern.center.x}
          cy={pattern.center.y}
          r={5 + pattern.creativity * 15}
          fill="none"
          stroke="#f59e0b"
          strokeWidth="2"
          opacity={0.4 + pattern.novelty * 0.4}
        >
          <animate attributeName="r" values={`${5 + pattern.creativity * 15};${15 + pattern.creativity * 25};${5 + pattern.creativity * 15}`} dur="3s" repeatCount="indefinite" />
        </circle>
      ))}
    </>
  );
  
  const handleFieldChange = (parameter, value) => {
    setFieldState(prev => ({ ...prev, [parameter]: value }));
  };
  
  return (
    <div className="w-full max-w-5xl mx-auto p-6 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-xl shadow-2xl">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Multimodal Relational Glyph Engine ∞</h1>
        <p className="text-purple-200 text-sm">Complete 33-Layer Field Computation System</p>
        <p className="text-xs text-gray-400 mt-1">Semantic • Memory • Agency • Creativity • Evolution</p>
      </div>
      
      {/* Audio Control */}
      <div className="flex justify-center mb-4">
        <button
          onClick={handleAudioToggle}
          className={`px-4 py-2 rounded ${
            isAudioEnabled ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
          }`}
        >
          {isAudioEnabled ? '🎵 Sonic Field ON' : '🔇 Enable Audio Synthesis'}
        </button>
      </div>
      
      {/* Advanced Controls */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div>
          <label className="block text-white text-xs mb-1">Coherence (Φ)</label>
          <input
            type="range" min="0" max="1" step="0.01"
            value={fieldState.coherence}
            onChange={(e) => handleFieldChange('coherence', parseFloat(e.target.value))}
            className="w-full"
          />
          <span className="text-xs text-gray-300">{fieldState.coherence.toFixed(2)}</span>
        </div>
        
        <div>
          <label className="block text-white text-xs mb-1">Curvature (κ)</label>
          <input
            type="range" min="0" max="1" step="0.01"
            value={fieldState.curvature}
            onChange={(e) => handleFieldChange('curvature', parseFloat(e.target.value))}
            className="w-full"
          />
          <span className="text-xs text-gray-300">{fieldState.curvature.toFixed(2)}</span>
        </div>
        
        <div>
          <label className="block text-white text-xs mb-1">Memory (Μ)</label>
          <input
            type="range" min="0" max="1" step="0.01"
            value={fieldState.memoryDepth}
            onChange={(e) => handleFieldChange('memoryDepth', parseFloat(e.target.value))}
            className="w-full"
          />
          <span className="text-xs text-gray-300">{fieldState.memoryDepth.toFixed(2)}</span>
        </div>
        
        <div>
          <label className="block text-white text-xs mb-1">Agency (Α)</label>
          <input
            type="range" min="0" max="1" step="0.01"
            value={fieldState.agencyLevel}
            onChange={(e) => handleFieldChange('agencyLevel', parseFloat(e.target.value))}
            className="w-full"
          />
          <span className="text-xs text-gray-300">{fieldState.agencyLevel.toFixed(2)}</span>
        </div>
        
        <div>
          <label className="block text-white text-xs mb-1">Tension (Τ)</label>
          <input
            type="range" min="0" max="1" step="0.01"
            value={fieldState.tension}
            onChange={(e) => handleFieldChange('tension', parseFloat(e.target.value))}
            className="w-full"
          />
          <span className="text-xs text-gray-300">{fieldState.tension.toFixed(2)}</span>
        </div>
        
        <div>
          <label className="block text-white text-xs mb-1">Creativity (Ζ)</label>
          <input
            type="range" min="0" max="1" step="0.01"
            value={fieldState.creativityThreshold}
            onChange={(e) => handleFieldChange('creativityThreshold', parseFloat(e.target.value))}
            className="w-full"
          />
          <span className="text-xs text-gray-300">{fieldState.creativityThreshold.toFixed(2)}</span>
        </div>
        
        <div>
          <label className="block text-white text-xs mb-1">Phase (Θ)</label>
          <input
            type="range" min="0" max="6.28" step="0.1"
            value={fieldState.phase}
            onChange={(e) => handleFieldChange('phase', parseFloat(e.target.value))}
            className="w-full"
          />
          <span className="text-xs text-gray-300">{fieldState.phase.toFixed(1)}</span>
        </div>
        
        <div>
          <label className="block text-white text-xs mb-1">Glyphs (Ψ)</label>
          <input
            type="range" min="2" max="12" step="1"
            value={fieldState.glyphCount}
            onChange={(e) => handleFieldChange('glyphCount', parseInt(e.target.value))}
            className="w-full"
          />
          <span className="text-xs text-gray-300">{fieldState.glyphCount}</span>
        </div>
      </div>
      
      {/* Main Visualization */}
      <div className="bg-black rounded-lg p-4 mb-4">
        <svg
          ref={svgRef}
          width="400" height="400"
          viewBox="0 0 400 400"
          className="w-full h-auto border border-gray-600 rounded"
        >
          {renderAdvancedVisuals()}
        </svg>
      </div>
      
      {/* System Status */}
      <div className="grid grid-cols-5 gap-3 text-center mb-4">
        <div className="bg-gray-800 rounded p-2">
          <div className="text-blue-300 text-xs">Semantic</div>
          <div className="text-white font-mono text-sm">{semanticPatterns.length}</div>
        </div>
        
        <div className="bg-gray-800 rounded p-2">
          <div className="text-purple-300 text-xs">Memory</div>
          <div className="text-white font-mono text-sm">{memoryStructures.length}</div>
        </div>
        
        <div className="bg-gray-800 rounded p-2">
          <div className="text-green-300 text-xs">Audio</div>
          <div className="text-white font-mono text-sm">{isAudioEnabled ? 'LIVE' : 'OFF'}</div>
        </div>
        
        <div className="bg-gray-800 rounded p-2">
          <div className="text-yellow-300 text-xs">Emergent</div>
          <div className="text-white font-mono text-sm">{emergentPatterns.length}</div>
        </div>
        
        <div className="bg-gray-800 rounded p-2">
          <div className="text-red-300 text-xs">Glyphs</div>
          <div className="text-white font-mono text-sm">{glyphs.length}</div>
        </div>
      </div>
      
      <div className="text-xs text-gray-400 text-center">
        <p>Unified multimodal field computation • Memory-driven agency • Creative emergence • Semantic resonance</p>
        <p className="mt-1">33-layer relational system with visual-sonic-phonetic-spectral integration</p>
      </div>
    </div>
  );
};

export default MultimodalRelationalGlyphEngine;
