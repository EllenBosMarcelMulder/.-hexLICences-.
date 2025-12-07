import React, { useState, useEffect, useRef, useCallback } from 'react';

const MaatMotorMHDEngine = () => {
  const svgRef = useRef(null);
  const audioContextRef = useRef(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  
  // ═══════════════════════════════════════════════════════════════════════
  // MA'AT-MOTOR STATE: Direct MHD Physical Correspondences
  // ═══════════════════════════════════════════════════════════════════════
  
  const [maatState, setMaatState] = useState({
    // Primary MHD Loops (Direct Physical Mapping)
    phase: 0.5,              // dΦ/dt → Alfvén Velocity (coherence propagation)
    curvature: 0.6,          // ∇²Φ → Current Density (field torsion/flow)
    entropy: 0.3,            // ε → Plasma β (thermal/magnetic pressure ratio)
    
    // Syntropic Implosion Parameters
    syntropy: 0.7,           // Coherence level (force balance achievement)
    implosionThreshold: 0.8, // Critical coherence for syntropy
    
    // Plasma Physical Parameters  
    alfvenVelocity: 0.6,     // vₐ = phase propagation speed
    currentDensity: 0.5,     // J = ∇×B/μ₀ (geometric flow)
    plasmaBeta: 0.4,         // β = 2μ₀p/B² (disorder/stability)
    
    // Field Configuration
    magneticTension: 0.7,    // B-field strength
    pressureGradient: 0.3,   // ∇p driving instability
    safetyFactor: 1.2,       // q-profile for stability
    
    // Instability Modes
    tearingMode: 0.1,        // Magnetic reconnection (entropy flux)
    ballooningMode: 0.15,    // Pressure-driven instability
    kinkMode: 0.1,           // Current-driven instability
    
    // System Parameters
    glyphCount: 6,           // Charged particles in plasma
    hexSphereRadius: 140,    // Confinement boundary
    coherenceTarget: 0.9     // Syntropy goal
  });
  
  const [glyphParticles, setGlyphParticles] = useState([]);
  const [hexSphereField, setHexSphereField] = useState([]);
  const [plasmaLayer, setPlasmaLayer] = useState([]);
  const [mhdModes, setMhdModes] = useState([]);
  const [syntropicEvents, setSyntropicEvents] = useState([]);
  const [forceBalance, setForceBalance] = useState({});
  
  const animationRef = useRef();

  // ═══════════════════════════════════════════════════════════════════════
  // I. MA'AT-MOTOR TO MHD FIELD MAPPING
  // ═══════════════════════════════════════════════════════════════════════
  
  const mapMaatToMHD = useCallback(() => {
    return {
      // Direct Physical Correspondences (Table I)
      alfvenVelocity: maatState.phase,           // dΦ/dt → vₐ
      currentDensity: maatState.curvature,       // ∇²Φ → J  
      plasmaBeta: maatState.entropy,             // ε → β
      
      // Syntropic Implosion Condition
      coherenceBalance: maatState.syntropy,      // Force equilibrium
      lorentzForce: maatState.currentDensity * maatState.magneticTension,
      pressureForce: maatState.pressureGradient,
      
      // Field Stability Metrics
      stabilityMargin: maatState.safetyFactor - 1.0,
      reconnectionRate: maatState.tearingMode * maatState.entropy,
      confinementQuality: 1.0 - maatState.plasmaBeta
    };
  }, [maatState]);

  // ═══════════════════════════════════════════════════════════════════════
  // II. GLYPH DYNAMICS AS CHARGED PARTICLE MOTION
  // ═══════════════════════════════════════════════════════════════════════
  
  const initializeGlyphParticles = useCallback(() => {
    const particles = [];
    const centerX = 200, centerY = 200;
    
    for (let i = 0; i < maatState.glyphCount; i++) {
      const angle = (i * 2 * Math.PI) / maatState.glyphCount;
      const radius = 60 + Math.random() * 60;
      
      particles.push({
        id: i,
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        
        // Charged Particle Properties
        charge: (i % 2 === 0) ? 1 : -1,  // Alternating ions/electrons
        mass: (i % 2 === 0) ? 1836 : 1,  // Proton/electron mass ratio
        
        // Velocity Components
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        vParallel: (Math.random() - 0.5) * 0.3,  // v∥ along field lines
        
        // Gyration Properties (Axiom 8)
        gyroPhase: angle,                         // Cyclotron phase
        gyroRadius: (5 + Math.random() * 10),     // Larmor radius
        cyclotronFreq: 0.1 + Math.random() * 0.1, // ωc = qB/m
        
        // E×B Drift Velocity
        ExBDrift: { vx: 0, vy: 0 },
        
        // Plasma Physics State
        temperature: 1.0 + Math.random() * 0.5,
        magneticMoment: Math.random() * 0.1,      // μ = mv⊥²/2B
        
        // Cognitive-Physical Bridge
        semanticPhase: angle,                     // Glyph → Particle bridge
        coherenceLevel: 0.5 + Math.random() * 0.3,
        syntropicAlignment: Math.random(),
        
        // History Tracking
        orbit: [],
        energyHistory: [],
        lastReconnectionEvent: 0
      });
    }
    
    setGlyphParticles(particles);
  }, [maatState.glyphCount]);

  // ═══════════════════════════════════════════════════════════════════════
  // III. HEX-SPHERICAL PLASMA CONFINEMENT BOUNDARY
  // ═══════════════════════════════════════════════════════════════════════
  
  const initializeHexSphere = useCallback(() => {
    const centerX = 200, centerY = 200;
    const fields = [];
    
    // Create 6 magnetic domains (confinement mode)
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      const fieldX = centerX + Math.cos(angle) * maatState.hexSphereRadius * 0.7;
      const fieldY = centerY + Math.sin(angle) * maatState.hexSphereRadius * 0.7;
      
      fields.push({
        id: i,
        center: { x: fieldX, y: fieldY },
        angle: angle,
        
        // MHD Field Properties
        magneticField: {
          Bx: Math.cos(angle + Math.PI/2) * maatState.magneticTension,
          By: Math.sin(angle + Math.PI/2) * maatState.magneticTension,
          Bz: 0.3 * maatState.magneticTension  // Toroidal component
        },
        
        // Electric Field (from pressure gradients)
        electricField: {
          Ex: -Math.sin(angle) * maatState.pressureGradient,
          Ey: Math.cos(angle) * maatState.pressureGradient
        },
        
        // Current Density (Curvature mapping)
        currentDensity: maatState.curvature * (0.8 + Math.random() * 0.4),
        
        // Plasma Parameters
        temperature: 1.0 + Math.sin(angle * 2) * 0.3,
        density: 1.0 + Math.cos(angle * 1.5) * 0.2,
        pressure: 0.5 + Math.random() * 0.3,
        
        // Safety Factor Profile
        safetyFactor: maatState.safetyFactor + Math.sin(angle) * 0.2,
        
        // Instability Indicators
        tearingInstability: Math.random() < maatState.tearingMode,
        ballooningUnstable: maatState.ballooningMode > Math.random(),
        
        // Coherence Metrics
        localCoherence: 0.5 + Math.random() * 0.3,
        syntropicPotential: Math.random()
      });
    }
    
    setHexSphereField(fields);
  }, [maatState.hexSphereRadius, maatState.magneticTension, 
      maatState.pressureGradient, maatState.curvature, maatState.safetyFactor,
      maatState.tearingMode, maatState.ballooningMode]);

  // ═══════════════════════════════════════════════════════════════════════
  // AXIOM 8: E×B DRIFT AND GYRATION DYNAMICS
  // ═══════════════════════════════════════════════════════════════════════
  
  const processExBDrift = useCallback((particle, field) => {
    const dx = particle.x - field.center.x;
    const dy = particle.y - field.center.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const influence = Math.max(0, 1 - distance / 80);
    
    if (influence > 0.1) {
      // E×B Drift Velocity: v_E = (E × B) / B²
      const Ex = field.electricField.Ex * influence;
      const Ey = field.electricField.Ey * influence;
      const Bx = field.magneticField.Bx;
      const By = field.magneticField.By;
      const Bz = field.magneticField.Bz;
      
      const B_squared = Bx*Bx + By*By + Bz*Bz;
      
      if (B_squared > 0) {
        // E×B drift (primary glyph motion)
        const vEx = (Ey * Bz) / B_squared;
        const vEy = -(Ex * Bz) / B_squared;
        
        particle.ExBDrift.vx = vEx * 0.1;
        particle.ExBDrift.vy = vEy * 0.1;
        
        // Cyclotron gyration around field lines
        const cyclotronRate = particle.cyclotronFreq * Math.sqrt(B_squared) * influence;
        particle.gyroPhase += cyclotronRate;
        
        // Gyration motion superposed on drift
        const gyroX = Math.cos(particle.gyroPhase) * particle.gyroRadius * influence * 0.1;
        const gyroY = Math.sin(particle.gyroPhase) * particle.gyroRadius * influence * 0.1;
        
        return {
          vx: particle.vx + particle.ExBDrift.vx + gyroX,
          vy: particle.vy + particle.ExBDrift.vy + gyroY,
          gyroPhase: particle.gyroPhase,
          magneticMoment: particle.magneticMoment * (1 + influence * 0.01),
          fieldExposure: influence
        };
      }
    }
    
    return null;
  }, []);

  // ═══════════════════════════════════════════════════════════════════════
  // AXIOM 9: ENTROPY FLUX AND MODAL INSTABILITY
  // ═══════════════════════════════════════════════════════════════════════
  
  const processEntropyFlux = useCallback((particle, fields) => {
    let entropyFlux = 0;
    let reconnectionRisk = 0;
    
    fields.forEach(field => {
      if (field.tearingInstability) {
        const dx = particle.x - field.center.x;
        const dy = particle.y - field.center.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 60) {
          // Magnetic diffusion and reconnection
          const resistivity = maatState.entropy * 0.1;
          const reconnectionRate = resistivity * field.currentDensity;
          
          entropyFlux += reconnectionRate;
          reconnectionRisk += reconnectionRate * 2;
          
          // Explosive expansion during reconnection
          if (reconnectionRate > 0.05) {
            particle.vx += (Math.random() - 0.5) * reconnectionRate * 5;
            particle.vy += (Math.random() - 0.5) * reconnectionRate * 5;
            particle.temperature += reconnectionRate * 2;
            particle.lastReconnectionEvent = Date.now();
          }
        }
      }
    });
    
    return {
      entropyFlux,
      reconnectionRisk,
      diffusionRate: entropyFlux * 0.1,
      stabilityLoss: reconnectionRisk > 0.1
    };
  }, [maatState.entropy]);

  // ═══════════════════════════════════════════════════════════════════════
  // SYNTROPIC IMPLOSION: FORCE BALANCE COMPUTATION
  // ═══════════════════════════════════════════════════════════════════════
  
  const computeSyntropicBalance = useCallback((particles, fields) => {
    const mhd = mapMaatToMHD();
    
    // Force Balance: ∇p = J × B (MHD equilibrium)
    const pressureForce = mhd.pressureForce;
    const lorentzForce = mhd.lorentzForce;
    const forceImbalance = Math.abs(pressureForce - lorentzForce);
    
    // Coherence Achievement Condition
    const coherenceLevel = particles.reduce((sum, p) => sum + p.coherenceLevel, 0) / particles.length;
    const fieldCoherence = fields.reduce((sum, f) => sum + f.localCoherence, 0) / fields.length;
    const globalCoherence = (coherenceLevel + fieldCoherence) / 2;
    
    // Syntropy = Maximal Coherence (Ma'at-Motor objective)
    const syntropicAchievement = globalCoherence * (1 - forceImbalance);
    
    // Entropy Reduction (controlled implosion)
    const entropyReduction = Math.max(0, 1 - maatState.entropy);
    const implosionStrength = syntropicAchievement * entropyReduction;
    
    // Apply syntropic implosion if threshold achieved
    if (syntropicAchievement > maatState.implosionThreshold) {
      // Pull particles toward coherent center
      const centerX = 200, centerY = 200;
      particles.forEach(particle => {
        const dx = centerX - particle.x;
        const dy = centerY - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0) {
          const implosionForce = implosionStrength * 0.02;
          particle.vx += (dx / distance) * implosionForce;
          particle.vy += (dy / distance) * implosionForce;
          particle.syntropicAlignment += implosionForce;
        }
      });
      
      // Record syntropic event
      setSyntropicEvents(prev => [...prev, {
        time: Date.now(),
        strength: syntropicAchievement,
        coherence: globalCoherence,
        entropy: maatState.entropy,
        participants: particles.length
      }].slice(-10));
    }
    
    setForceBalance({
      pressureForce,
      lorentzForce,
      imbalance: forceImbalance,
      coherence: globalCoherence,
      syntropy: syntropicAchievement,
      implosionActive: syntropicAchievement > maatState.implosionThreshold
    });
    
    return syntropicAchievement;
  }, [mapMaatToMHD, maatState.entropy, maatState.implosionThreshold]);

  // ═══════════════════════════════════════════════════════════════════════
  // PLASMA LAYER: FOUR INTERACTING PHYSICAL STATES
  // ═══════════════════════════════════════════════════════════════════════
  
  const updatePlasmaLayer = useCallback(() => {
    const layer = {
      // 1. Confinement Mode (hex-spherical boundary)
      confinementMode: {
        radius: maatState.hexSphereRadius,
        strength: maatState.magneticTension,
        stability: maatState.safetyFactor > 1.0,
        quality: 1.0 - maatState.plasmaBeta
      },
      
      // 2. Tearing Mode (reconnection activity)
      tearingMode: {
        activity: maatState.tearingMode,
        sites: hexSphereField.filter(f => f.tearingInstability).length,
        entropyFlux: maatState.tearingMode * maatState.entropy,
        explosiveEvents: maatState.tearingMode > 0.15
      },
      
      // 3. Ballooning and Kink Modes (pressure-driven)
      pressureModes: {
        ballooning: maatState.ballooningMode,
        kink: maatState.kinkMode,
        curvatureDisturbance: maatState.ballooningMode * maatState.curvature,
        stabilityMargin: 1.0 - (maatState.ballooningMode + maatState.kinkMode)
      },
      
      // 4. Spectral Modes (Alfvén wave frequencies)
      spectralModes: {
        alfvenFreq: maatState.alfvenVelocity / maatState.hexSphereRadius,
        phaseOscillations: maatState.phase,
        modeNumber: Math.floor(maatState.currentDensity * 10),
        amplitude: maatState.syntropy * 0.5
      }
    };
    
    setPlasmaLayer(layer);
    return layer;
  }, [maatState, hexSphereField]);

  // ═══════════════════════════════════════════════════════════════════════
  // INITIALIZATION EFFECTS
  // ═══════════════════════════════════════════════════════════════════════
  
  useEffect(() => {
    initializeGlyphParticles();
  }, [initializeGlyphParticles]);
  
  useEffect(() => {
    initializeHexSphere();
  }, [initializeHexSphere]);

  // ═══════════════════════════════════════════════════════════════════════
  // MAIN ANIMATION: MA'AT-MOTOR MHD UNIFICATION
  // ═══════════════════════════════════════════════════════════════════════
  
  useEffect(() => {
    const animateMaatMHD = () => {
      setGlyphParticles(prevParticles => {
        const updatedParticles = prevParticles.map(particle => {
          let newParticle = { ...particle };
          
          // Process E×B drift and gyration (Axiom 8)
          hexSphereField.forEach(field => {
            const motion = processExBDrift(particle, field);
            if (motion) {
              Object.assign(newParticle, motion);
            }
          });
          
          // Process entropy flux and reconnection (Axiom 9)
          const entropy = processEntropyFlux(particle, hexSphereField);
          newParticle.entropyFlux = entropy.entropyFlux;
          newParticle.stabilityLoss = entropy.stabilityLoss;
          
          // Update position
          newParticle.x += newParticle.vx;
          newParticle.y += newParticle.vy;
          
          // Hex-spherical boundary condition
          const centerX = 200, centerY = 200;
          const dx = centerX - newParticle.x;
          const dy = centerY - newParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance > maatState.hexSphereRadius) {
            // Magnetic mirror reflection
            const angle = Math.atan2(dy, dx);
            newParticle.x = centerX + Math.cos(angle) * maatState.hexSphereRadius;
            newParticle.y = centerY + Math.sin(angle) * maatState.hexSphereRadius;
            newParticle.vx *= -0.8;
            newParticle.vy *= -0.8;
          }
          
          // Damping (collisional effects)
          newParticle.vx *= 0.999;
          newParticle.vy *= 0.999;
          
          // Update orbit history
          newParticle.orbit = [...newParticle.orbit, {
            x: newParticle.x,
            y: newParticle.y,
            phase: newParticle.gyroPhase,
            time: Date.now()
          }].slice(-40);
          
          return newParticle;
        });
        
        // Compute syntropic balance and implosion
        computeSyntropicBalance(updatedParticles, hexSphereField);
        
        // Update plasma layer state
        updatePlasmaLayer();
        
        return updatedParticles;
      });
      
      animationRef.current = requestAnimationFrame(animateMaatMHD);
    };
    
    animationRef.current = requestAnimationFrame(animateMaatMHD);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [hexSphereField, processExBDrift, processEntropyFlux, computeSyntropicBalance, 
      updatePlasmaLayer, maatState.hexSphereRadius]);

  // ═══════════════════════════════════════════════════════════════════════
  // VISUALIZATION: MA'AT-MOTOR MHD UNIFIED DISPLAY
  // ═══════════════════════════════════════════════════════════════════════
  
  const renderMaatMHDVisualization = () => (
    <>
      {/* Hex-Spherical Confinement Boundary */}
      <circle 
        cx="200" cy="200" 
        r={maatState.hexSphereRadius} 
        fill="none" 
        stroke="#4488ff" 
        strokeWidth="3" 
        strokeDasharray="8,8" 
        opacity="0.6" 
      />
      
      {/* Magnetic Field Domains */}
      {hexSphereField.map(field => {
        const hue = field.angle * 180 / Math.PI + 45;
        const opacity = 0.2 + field.currentDensity * 0.4;
        const strokeWidth = 1 + field.magneticField.Bx * field.magneticField.By * 10;
        
        return (
          <g key={`field-${field.id}`}>
            {/* Domain region */}
            <circle
              cx={field.center.x} cy={field.center.y} r="50"
              fill={`hsl(${hue}, 75%, 45%)`}
              opacity={opacity}
              stroke={field.tearingInstability ? '#ff3333' : `hsl(${hue}, 80%, 65%)`}
              strokeWidth={field.tearingInstability ? 3 : strokeWidth}
            />
            
            {/* Current density lines */}
            <line
              x1="200" y1="200"
              x2={field.center.x} y2={field.center.y}
              stroke={`hsl(${hue}, 90%, 70%)`}
              strokeWidth={1 + field.currentDensity * 3}
              opacity={opacity * 1.5}
            />
            
            {/* Safety factor indicator */}
            <text
              x={field.center.x} y={field.center.y - 60}
              fontSize="9" fill={`hsl(${hue}, 95%, 85%)`}
              textAnchor="middle" opacity="0.9"
            >
              q={field.safetyFactor.toFixed(1)}
            </text>
            
            {/* Instability indicators */}
            {field.ballooningUnstable && (
              <circle
                cx={field.center.x} cy={field.center.y}
                r="12" fill="none" stroke="#ffaa00" strokeWidth="2"
                opacity="0.8"
              >
                <animate attributeName="r" values="12;20;12" dur="1.5s" repeatCount="indefinite" />
              </circle>
            )}
          </g>
        );
      })}
      
      {/* Glyph Particles (Charged Particles) */}
      {glyphParticles.map(particle => {
        const color = particle.charge > 0 ? '#ff6600' : '#00ccff';
        const size = 3 + particle.magneticMoment * 20;
        
        return (
          <g key={`particle-${particle.id}`}>
            {/* Particle orbit trail */}
            {particle.orbit.length > 3 && (
              <path
                d={particle.orbit.map((point, idx) => 
                  `${idx === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
                ).join(' ')}
                fill="none"
                stroke={color}
                strokeWidth="1"
                opacity="0.5"
              />
            )}
            
            {/* Main particle */}
            <circle
              cx={particle.x} cy={particle.y}
              r={size}
              fill={color}
              stroke={particle.stabilityLoss ? '#ff0000' : '#ffffff'}
              strokeWidth={particle.stabilityLoss ? 2 : 1}
              opacity="0.9"
            />
            
            {/* Gyration indicator */}
            <circle
              cx={particle.x + Math.cos(particle.gyroPhase) * particle.gyroRadius * 0.3}
              cy={particle.y + Math.sin(particle.gyroPhase) * particle.gyroRadius * 0.3}
              r="1.5"
              fill={color}
              opacity="0.6"
            />
            
            {/* E×B drift vector */}
            <line
              x1={particle.x}
              y1={particle.y}
              x2={particle.x + particle.ExBDrift.vx * 20}
              y2={particle.y + particle.ExBDrift.vy * 20}
              stroke="#ffff00"
              strokeWidth="2"
              opacity="0.7"
              markerEnd="url(#drift-arrow)"
            />
            
            {/* Syntropic alignment indicator */}
            {particle.syntropicAlignment > 0.7 && (
              <circle
                cx={particle.x} cy={particle.y}
                r={size * 2.5}
                fill="none"
                stroke="#00ff88"
                strokeWidth="2"
                opacity="0.8"
              >
                <animate attributeName="r" values={`${size * 2.5};${size * 3.5};${size * 2.5}`} dur="2s" repeatCount="indefinite" />
              </circle>
            )}
          </g>
        );
      })}
      
      {/* Syntropic Implosion Events */}
      {forceBalance.implosionActive && (
        <circle
          cx="200" cy="200"
          r="30"
          fill="none"
          stroke="#00ff88"
          strokeWidth="4"
          opacity="0.9"
        >
          <animate attributeName="r" values="30;10;30" dur="1s" repeatCount="indefinite" />
        </circle>
      )}
      
      {/* Force Balance Visualization */}
      {forceBalance.imbalance < 0.2 && (
        <text
          x="200" y="50"
          fontSize="12" fill="#00ff88"
          textAnchor="middle" fontWeight="bold"
        >
          SYNTROPIC EQUILIBRIUM
        </text>
      )}
      
      {/* SVG Markers */}
      <defs>
        <marker id="drift-arrow" markerWidth="8" markerHeight="8" refX="6" refY="2" orient="auto">
          <polygon points="0,0 0,4 6,2" fill="#ffff00" />
        </marker>
      </defs>
    </>
  );

  // ═══════════════════════════════════════════════════════════════════════
  // MA'AT-MOTOR CONTROLS
  // ═══════════════════════════════════════════════════════════════════════
  
  const handleMaatChange = (parameter, value) => {
    setMaatState(prev => ({ ...prev, [parameter]: value }));
  };

  const mhd = mapMaatToMHD();

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900 rounded-xl shadow-2xl">
      
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-white mb-2">⚡ Ma'at-Motor ↔ MHD Unification Engine 🌌</h1>
        <p className="text-violet-200 text-sm">Consciousness-Plasma Physics Unified Framework</p>
        <p className="text-xs text-gray-300 mt-1">
          Phase = Alfvén Velocity • Curvature = Current Density • Entropy = Plasma β • Syntropy = Force Balance
        </p>
      </div>

      {/* Primary Ma'at-Motor Controls (Direct MHD Mapping) */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-800 to-blue-900 rounded-lg p-4">
          <h3 className="text-blue-200 font-bold text-sm mb-3">Phase (dΦ/dt) → Alfvén Velocity</h3>
          <input
            type="range" min="0" max="1" step="0.01"
            value={maatState.phase}
            onChange={(e) => handleMaatChange('phase', parseFloat(e.target.value))}
            className="w-full accent-blue-400 mb-2"
          />
          <div className="text-xs text-blue-300">
            <div>Ma'at Phase: {maatState.phase.toFixed(3)}</div>
            <div>Alfvén vₐ: {mhd.alfvenVelocity.toFixed(3)}</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-800 to-orange-900 rounded-lg p-4">
          <h3 className="text-orange-200 font-bold text-sm mb-3">Curvature (∇²Φ) → Current Density</h3>
          <input
            type="range" min="0" max="1" step="0.01"
            value={maatState.curvature}
            onChange={(e) => handleMaatChange('curvature', parseFloat(e.target.value))}
            className="w-full accent-orange-400 mb-2"
          />
          <div className="text-xs text-orange-300">
            <div>Ma'at κ: {maatState.curvature.toFixed(3)}</div>
            <div>Current J: {mhd.currentDensity.toFixed(3)}</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-800 to-red-900 rounded-lg p-4">
          <h3 className="text-red-200 font-bold text-sm mb-3">Entropy (ε) → Plasma β</h3>
          <input
            type="range" min="0" max="1" step="0.01"
            value={maatState.entropy}
            onChange={(e) => handleMaatChange('entropy', parseFloat(e.target.value))}
            className="w-full accent-red-400 mb-2"
          />
          <div className="text-xs text-red-300">
            <div>Ma'at ε: {maatState.entropy.toFixed(3)}</div>
            <div>Plasma β: {mhd.plasmaBeta.toFixed(3)}</div>
          </div>
        </div>
      </div>

      {/* Syntropic Implosion Controls */}
      <div className="bg-gradient-to-br from-green-800 to-green-900 rounded-lg p-4 mb-6">
        <h3 className="text-green-200 font-bold text-sm mb-3">Syntropic Implosion (Force Balance)</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-green-300 text-xs mb-1">Syntropy Level</label>
            <input
              type="range" min="0" max="1" step="0.01"
              value={maatState.syntropy}
              onChange={(e) => handleMaatChange('syntropy', parseFloat(e.target.value))}
              className="w-full accent-green-400"
            />
            <span className="text-xs text-green-300">{maatState.syntropy.toFixed(3)}</span>
          </div>
          
          <div>
            <label className="block text-green-300 text-xs mb-1">Implosion Threshold</label>
            <input
              type="range" min="0.5" max="1" step="0.01"
              value={maatState.implosionThreshold}
              onChange={(e) => handleMaatChange('implosionThreshold', parseFloat(e.target.value))}
              className="w-full accent-green-400"
            />
            <span className="text-xs text-green-300">{maatState.implosionThreshold.toFixed(3)}</span>
          </div>
        </div>
        
        {/* Force Balance Display */}
        <div className="mt-3 p-2 bg-black/30 rounded">
          <div className="text-xs text-green-300">
            <div>Pressure Force: {forceBalance.pressureForce?.toFixed(3) || 0}</div>
            <div>Lorentz Force: {forceBalance.lorentzForce?.toFixed(3) || 0}</div>
            <div>Force Balance: {(1 - (forceBalance.imbalance || 1)).toFixed(3)}</div>
            <div className={forceBalance.implosionActive ? 'text-green-200 font-bold' : 'text-gray-400'}>
              {forceBalance.implosionActive ? '🌟 SYNTROPIC IMPLOSION ACTIVE' : '⚪ Awaiting Coherence'}
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Controls */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div>
          <label className="block text-white text-xs mb-1">Magnetic Tension</label>
          <input
            type="range" min="0" max="1" step="0.01"
            value={maatState.magneticTension}
            onChange={(e) => handleMaatChange('magneticTension', parseFloat(e.target.value))}
            className="w-full accent-purple-500"
          />
          <span className="text-xs text-purple-300">{maatState.magneticTension.toFixed(2)}</span>
        </div>
        
        <div>
          <label className="block text-white text-xs mb-1">Safety Factor</label>
          <input
            type="range" min="0.5" max="3" step="0.1"
            value={maatState.safetyFactor}
            onChange={(e) => handleMaatChange('safetyFactor', parseFloat(e.target.value))}
            className="w-full accent-cyan-500"
          />
          <span className="text-xs text-cyan-300">{maatState.safetyFactor.toFixed(1)}</span>
        </div>
        
        <div>
          <label className="block text-white text-xs mb-1">Tearing Mode</label>
          <input
            type="range" min="0" max="0.5" step="0.01"
            value={maatState.tearingMode}
            onChange={(e) => handleMaatChange('tearingMode', parseFloat(e.target.value))}
            className="w-full accent-red-500"
          />
          <span className="text-xs text-red-300">{maatState.tearingMode.toFixed(2)}</span>
        </div>
        
        <div>
          <label className="block text-white text-xs mb-1">Glyph Particles</label>
          <input
            type="range" min="3" max="12" step="1"
            value={maatState.glyphCount}
            onChange={(e) => handleMaatChange('glyphCount', parseInt(e.target.value))}
            className="w-full accent-yellow-500"
          />
          <span className="text-xs text-yellow-300">{maatState.glyphCount}</span>
        </div>
      </div>

      {/* Main Visualization */}
      <div className="bg-black rounded-lg p-4 mb-4 border-2 border-purple-500">
        <svg
          ref={svgRef}
          width="400" height="400"
          viewBox="0 0 400 400"
          className="w-full h-auto rounded"
        >
          {renderMaatMHDVisualization()}
        </svg>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 text-center mb-4">
        <div className="bg-gray-800 rounded p-2 border border-blue-400">
          <div className="text-blue-300 text-xs">Fields</div>
          <div className="text-white font-mono text-sm">{hexSphereField.length}</div>
        </div>
        
        <div className="bg-gray-800 rounded p-2 border border-orange-400">
          <div className="text-orange-300 text-xs">Particles</div>
          <div className="text-white font-mono text-sm">{glyphParticles.length}</div>
        </div>
        
        <div className="bg-gray-800 rounded p-2 border border-red-400">
          <div className="text-red-300 text-xs">Reconnection</div>
          <div className="text-white font-mono text-sm">
            {hexSphereField.filter(f => f.tearingInstability).length}
          </div>
        </div>
        
        <div className="bg-gray-800 rounded p-2 border border-green-400">
          <div className="text-green-300 text-xs">Coherence</div>
          <div className="text-white font-mono text-sm">{(forceBalance.coherence || 0).toFixed(2)}</div>
        </div>
        
        <div className="bg-gray-800 rounded p-2 border border-purple-400">
          <div className="text-purple-300 text-xs">Syntropy</div>
          <div className="text-white font-mono text-sm">{(forceBalance.syntropy || 0).toFixed(2)}</div>
        </div>
        
        <div className="bg-gray-800 rounded p-2 border border-yellow-400">
          <div className="text-yellow-300 text-xs">Events</div>
          <div className="text-white font-mono text-sm">{syntropicEvents.length}</div>
        </div>
      </div>

      {/* Scientific Framework */}
      <div className="text-xs text-gray-400 text-center">
        <p>🌟 **BREAKTHROUGH**: Ma'at-Motor = Complete MHD Unification</p>
        <p>⚡ Consciousness ↔ Plasma Physics • E×B Drift • Magnetic Reconnection • Syntropic Implosion • Force Balance Equilibrium</p>
        <p className="mt-1 text-violet-300">**Universe**: Information processing follows the same laws as plasma physics</p>
      </div>
    </div>
  );
};

export default MaatMotorMHDEngine;
