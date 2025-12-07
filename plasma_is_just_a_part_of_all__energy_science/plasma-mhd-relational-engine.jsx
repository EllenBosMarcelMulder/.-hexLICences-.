import React, { useState, useEffect, useRef, useCallback } from 'react';

const PlasmaMHDRelationalEngine = () => {
  const svgRef = useRef(null);
  const audioContextRef = useRef(null);
  const oscillatorsRef = useRef([]);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  
  const [plasmaState, setPlasmaState] = useState({
    // Core MHD Parameters (Relational)
    magneticTension: 0.6,      // β → magnetic field strength
    plasmaPressure: 0.4,       // plasma β parameter
    alfvenVelocity: 0.7,       // MHD wave speed
    resistivity: 0.2,          // magnetic diffusion
    
    // Plasma Configuration
    confinementMode: 'tokamak', // tokamak, stellarator, pinch, astrophysical
    plasmaBeta: 0.3,           // pressure/magnetic pressure ratio
    safetyFactor: 0.5,         // q-profile for stability
    
    // Field Geometry
    toroidalField: 0.8,        // Bt component
    poloidalField: 0.4,        // Bp component
    currentDensity: 0.6,       // J parallel to B
    
    // Wave-Particle Physics
    cyclotronFreq: 0.5,        // ωc relational
    plasmaFreq: 0.7,           // ωp relational
    driftVelocity: 0.3,        // ExB drift
    
    // Stability & Transport
    tearingMode: 0.1,          // magnetic reconnection
    ballooning: 0.2,           // pressure-driven instability
    kinkMode: 0.15,            // current-driven instability
    
    // Advanced Features
    particleCount: 8,          // PIC particle count
    spectralResolution: 0.6,   // diagnostic resolution
    coherenceLength: 0.5,      // spatial correlation
    energyConfinement: 0.7     // τE parameter
  });
  
  const [plasmaParticles, setPlasmaParticles] = useState([]);
  const [magneticDomains, setMagneticDomains] = useState([]);
  const [mhdModes, setMhdModes] = useState([]);
  const [plasmaProjections, setPlasmaProjections] = useState([]);
  const [diagnosticImages, setDiagnosticImages] = useState([]);
  const [spectralModes, setSpectralModes] = useState([]);
  const [reconnectionSites, setReconnectionSites] = useState([]);
  
  const animationRef = useRef();

  // ═══════════════════════════════════════════════════════════════════════
  // 1. MAGNETOHYDRODYNAMIC FIELD INITIALIZATION
  // ═══════════════════════════════════════════════════════════════════════
  
  const initializeMagneticDomains = useCallback(() => {
    const centerX = 200, centerY = 200, radius = 140;
    const domains = [];
    
    // Create 6 magnetic domains with MHD properties
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      const domainX = centerX + Math.cos(angle) * radius * 0.7;
      const domainY = centerY + Math.sin(angle) * radius * 0.7;
      
      domains.push({
        id: i,
        center: { x: domainX, y: domainY },
        angle: angle,
        
        // MHD Properties (Parallel 1: Magnetic Stress Networks)
        magneticTension: 0.3 + Math.sin(angle * 2) * 0.4,
        fieldLineForce: Math.cos(angle * 3) * 0.5 + 0.5,
        reconnectionSite: Math.random() < plasmaState.tearingMode,
        
        // Domain Structure (Parallel 2)
        energyMinimum: 0.2 + Math.random() * 0.3,
        confinementQuality: 0.4 + Math.sin(angle) * 0.3,
        
        // Plasma Parameters
        plasmaBeta: plasmaState.plasmaBeta + (Math.random() - 0.5) * 0.2,
        currentDensity: plasmaState.currentDensity * (0.8 + Math.random() * 0.4),
        temperature: 1.0 + Math.sin(angle * 1.5) * 0.3,
        
        // MHD Wave Properties
        alfvenSpeed: plasmaState.alfvenVelocity * Math.sqrt(domains.length - i),
        soundSpeed: 0.3 + Math.random() * 0.2,
        
        // Stability Metrics
        stabilityMargin: 1.0 - plasmaState.ballooning - plasmaState.kinkMode,
        active: true
      });
    }
    
    setMagneticDomains(domains);
  }, [plasmaState.tearingMode, plasmaState.plasmaBeta, plasmaState.currentDensity, 
      plasmaState.alfvenVelocity, plasmaState.ballooning, plasmaState.kinkMode]);

  // ═══════════════════════════════════════════════════════════════════════
  // 2. PLASMA PARTICLE INITIALIZATION (PIC Analogy)
  // ═══════════════════════════════════════════════════════════════════════
  
  const initializePlasmaParticles = useCallback(() => {
    const particles = [];
    const centerX = 200, centerY = 200;
    
    for (let i = 0; i < plasmaState.particleCount; i++) {
      const angle = (i * 2 * Math.PI) / plasmaState.particleCount;
      const radius = 60 + Math.random() * 80;
      
      particles.push({
        id: i,
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        
        // Wave-Particle Motion (Parallel 3)
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        cyclotronPhase: angle + Math.random() * 0.5,
        
        // Particle Properties
        species: i % 3 === 0 ? 'electron' : i % 3 === 1 ? 'ion' : 'neutral',
        charge: i % 3 === 0 ? -1 : i % 3 === 1 ? 1 : 0,
        mass: i % 3 === 0 ? 1 : i % 3 === 1 ? 1836 : 1838, // me, mp, mn ratios
        temperature: 1.0 + Math.random() * 0.5,
        
        // Plasma Physics State
        gyroRadius: Math.random() * 15 + 5,
        parallelVelocity: (Math.random() - 0.5) * 0.3,
        magneticMoment: Math.random() * 0.1,
        
        // PIC Simulation Properties
        weight: 1.0,
        trail: [],
        lastCollisionTime: 0,
        
        // Advanced Physics
        landauResonance: false,
        trapped: false,
        driftOrbit: { vE: 0, vGrad: 0, vCurv: 0 },
        
        // Memory & History (for PIC-like behavior)
        fieldHistory: [],
        energyHistory: [],
        orbitType: 'passing' // passing, trapped, lost
      });
    }
    
    setPlasmaParticles(particles);
  }, [plasmaState.particleCount]);

  // ═══════════════════════════════════════════════════════════════════════
  // 3. MHD WAVE-PARTICLE INTERACTION ENGINE
  // ═══════════════════════════════════════════════════════════════════════
  
  const processWaveParticleInteraction = useCallback((particle, domain) => {
    const dx = particle.x - domain.center.x;
    const dy = particle.y - domain.center.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const influence = Math.max(0, 1 - distance / 100);
    
    if (influence > 0.1) {
      // Cyclotron Motion (Parallel 3)
      const cyclotronFreq = plasmaState.cyclotronFreq * domain.magneticTension;
      const cyclotronRadius = particle.gyroRadius * (1 - domain.magneticTension);
      
      // Cyclotron-like Phase Rotation
      const phaseAdvance = cyclotronFreq * influence * 0.1;
      const newCyclotronPhase = particle.cyclotronPhase + phaseAdvance;
      
      // Drift Velocities
      const ExBDrift = {
        x: Math.sin(domain.angle) * plasmaState.driftVelocity * influence,
        y: -Math.cos(domain.angle) * plasmaState.driftVelocity * influence
      };
      
      // Gradient Drift
      const gradientDrift = {
        x: Math.sin(newCyclotronPhase) * 0.02 * influence,
        y: Math.cos(newCyclotronPhase) * 0.02 * influence
      };
      
      // Resonant Trapping Check
      const resonanceCondition = Math.abs(
        cyclotronFreq - domain.alfvenSpeed * Math.cos(particle.cyclotronPhase)
      );
      const isTrapped = resonanceCondition < 0.1 && influence > 0.7;
      
      return {
        cyclotronPhase: newCyclotronPhase,
        vx: particle.vx + ExBDrift.x + gradientDrift.x,
        vy: particle.vy + ExBDrift.y + gradientDrift.y,
        gyroRadius: cyclotronRadius,
        trapped: isTrapped,
        fieldStrength: domain.magneticTension * influence,
        parallelVelocity: particle.parallelVelocity * (1 + influence * 0.05)
      };
    }
    
    return null;
  }, [plasmaState.cyclotronFreq, plasmaState.driftVelocity]);

  // ═══════════════════════════════════════════════════════════════════════
  // 4. PLASMA PINCH CONVERGENCE (Parallel 4)
  // ═══════════════════════════════════════════════════════════════════════
  
  const processPlasmaPinch = useCallback((particles) => {
    const centerX = 200, centerY = 200;
    const pinchStrength = plasmaState.currentDensity * plasmaState.magneticTension;
    
    particles.forEach(particle => {
      const dx = centerX - particle.x;
      const dy = centerY - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance > 0 && pinchStrength > 0.3) {
        // Magnetic Pinch Force (J × B)
        const pinchForce = pinchStrength * Math.exp(-distance / 50) * 0.02;
        const compressionRatio = 1 + pinchForce;
        
        // Field-Induced Focusing
        particle.vx += (dx / distance) * pinchForce;
        particle.vy += (dy / distance) * pinchForce;
        
        // Plasma Column Narrowing
        particle.gyroRadius *= (1 - pinchForce * 0.1);
        
        // Localized Compression Effects
        if (distance < 30) {
          particle.temperature += pinchForce * 0.5; // Compression heating
          particle.trapped = true;
        }
      }
    });
  }, [plasmaState.currentDensity, plasmaState.magneticTension]);

  // ═══════════════════════════════════════════════════════════════════════
  // 5. MULTI-SHELL PLASMA EQUILIBRIUM (Parallel 5)
  // ═══════════════════════════════════════════════════════════════════════
  
  const processMultiShellEquilibrium = useCallback(() => {
    // Three nested plasma shells with different physics
    const shells = [
      { 
        radius: 50, 
        plasmaBeta: plasmaState.plasmaBeta * 1.2,
        currentDensity: plasmaState.currentDensity * 0.8,
        confinement: 'core'
      },
      { 
        radius: 100, 
        plasmaBeta: plasmaState.plasmaBeta,
        currentDensity: plasmaState.currentDensity,
        confinement: 'gradient'
      },
      { 
        radius: 150, 
        plasmaBeta: plasmaState.plasmaBeta * 0.7,
        currentDensity: plasmaState.currentDensity * 1.3,
        confinement: 'edge'
      }
    ];
    
    return shells;
  }, [plasmaState.plasmaBeta, plasmaState.currentDensity]);

  // ═══════════════════════════════════════════════════════════════════════
  // 6. MAGNETIC RECONNECTION DYNAMICS
  // ═══════════════════════════════════════════════════════════════════════
  
  const processReconnection = useCallback((domains) => {
    const sites = [];
    
    domains.forEach((domain, i) => {
      if (domain.reconnectionSite && domain.magneticTension > 0.5) {
        const nextDomain = domains[(i + 1) % domains.length];
        const reconnectionRate = plasmaState.resistivity * 
          Math.abs(domain.magneticTension - nextDomain.magneticTension);
        
        if (reconnectionRate > 0.05) {
          sites.push({
            x: (domain.center.x + nextDomain.center.x) / 2,
            y: (domain.center.y + nextDomain.center.y) / 2,
            rate: reconnectionRate,
            energyRelease: reconnectionRate * 10,
            type: reconnectionRate > 0.15 ? 'explosive' : 'steady'
          });
        }
      }
    });
    
    setReconnectionSites(sites);
    return sites;
  }, [plasmaState.resistivity]);

  // ═══════════════════════════════════════════════════════════════════════
  // 7. PLASMA DIAGNOSTIC IMAGING (Parallel 6)
  // ═══════════════════════════════════════════════════════════════════════
  
  const generateDiagnosticImages = useCallback((particles, domains) => {
    const images = [];
    
    // Magnetic Flux Surface Mapping
    domains.forEach(domain => {
      const fluxSurface = {
        type: 'flux_surface',
        center: domain.center,
        psi: domain.magneticTension, // flux function
        q: domain.confinementQuality, // safety factor
        shear: Math.random() * 0.3
      };
      images.push(fluxSurface);
    });
    
    // Plasma Emission Reconstruction
    particles.forEach(particle => {
      if (particle.species === 'ion' && particle.temperature > 1.2) {
        const emission = {
          type: 'emission',
          x: particle.x,
          y: particle.y,
          intensity: particle.temperature * particle.charge,
          wavelength: 656.3 + particle.temperature * 10, // Hα line
          doppler: particle.parallelVelocity * 0.1
        };
        images.push(emission);
      }
    });
    
    setDiagnosticImages(images);
  }, []);

  // ═══════════════════════════════════════════════════════════════════════
  // 8. PLASMA STABILITY & RESONANCE (Parallel 8)
  // ═══════════════════════════════════════════════════════════════════════
  
  const processPlasmaStability = useCallback((particles, domains) => {
    let globalStability = 1.0;
    
    // Line-Tension Stabilization
    domains.forEach(domain => {
      const lineTension = domain.magneticTension * domain.fieldLineForce;
      domain.stabilityMargin *= (1 + lineTension * 0.1);
      globalStability *= domain.stabilityMargin;
    });
    
    // Resonant Mode Locking
    particles.forEach(particle => {
      const resonanceStrength = Math.abs(
        plasmaState.cyclotronFreq - particle.cyclotronPhase / (2 * Math.PI)
      );
      if (resonanceStrength < 0.1) {
        particle.trapped = true;
        particle.landauResonance = true;
      }
    });
    
    // Phase Mixing & Landau Damping
    const coherenceLength = particles.reduce((sum, p) => 
      sum + Math.cos(p.cyclotronPhase), 0) / particles.length;
    
    if (Math.abs(coherenceLength) > 0.8) {
      // Strong coherence - apply Landau damping
      particles.forEach(particle => {
        particle.vx *= 0.99;
        particle.vy *= 0.99;
        particle.parallelVelocity *= 0.98;
      });
    }
    
    return {
      globalStability,
      coherenceLength,
      dampingRate: 1 - Math.abs(coherenceLength)
    };
  }, [plasmaState.cyclotronFreq]);

  // ═══════════════════════════════════════════════════════════════════════
  // 9. SPECTRAL MHD MODES (Parallel 9)
  // ═══════════════════════════════════════════════════════════════════════
  
  const generateSpectralModes = useCallback((particles, stability) => {
    const modes = [];
    
    // Alfvén Wave Spectrum
    for (let n = 1; n <= 6; n++) {
      const frequency = n * plasmaState.alfvenVelocity * plasmaState.safetyFactor;
      const amplitude = Math.exp(-n * 0.3) * stability.globalStability;
      const damping = stability.dampingRate;
      
      modes.push({
        type: 'alfven',
        mode_number: n,
        frequency: frequency,
        amplitude: amplitude,
        damping: damping,
        growth_rate: amplitude > 0.3 ? 0.01 : -0.02
      });
    }
    
    // Magnetosonic Waves
    modes.push({
      type: 'magnetosonic',
      mode_number: 0,
      frequency: plasmaState.plasmaFreq,
      amplitude: plasmaState.plasmaBeta * 0.5,
      phase_velocity: Math.sqrt(plasmaState.alfvenVelocity ** 2 + (0.3) ** 2)
    });
    
    setSpectralModes(modes);
    return modes;
  }, [plasmaState.alfvenVelocity, plasmaState.safetyFactor, 
      plasmaState.plasmaFreq, plasmaState.plasmaBeta]);

  // ═══════════════════════════════════════════════════════════════════════
  // 10. TURBULENCE PATTERN RECOGNITION (Parallel 10)
  // ═══════════════════════════════════════════════════════════════════════
  
  const analyzeTurbulencePatterns = useCallback((particles) => {
    const patterns = new Map();
    
    // Spatial Clustering Analysis
    particles.forEach(particle => {
      const region = `${Math.floor(particle.x / 40)}_${Math.floor(particle.y / 40)}`;
      
      if (patterns.has(region)) {
        const cluster = patterns.get(region);
        cluster.count++;
        cluster.avgEnergy += particle.temperature;
        cluster.coherence += Math.cos(particle.cyclotronPhase);
      } else {
        patterns.set(region, {
          count: 1,
          avgEnergy: particle.temperature,
          coherence: Math.cos(particle.cyclotronPhase),
          persistence: 0
        });
      }
    });
    
    // Coherent Structure Detection
    const coherentStructures = [];
    patterns.forEach((cluster, region) => {
      cluster.avgEnergy /= cluster.count;
      cluster.coherence /= cluster.count;
      cluster.persistence += 1;
      
      if (cluster.count > 2 && Math.abs(cluster.coherence) > 0.5) {
        const coords = region.split('_').map(Number);
        coherentStructures.push({
          center: { x: coords[0] * 40 + 20, y: coords[1] * 40 + 20 },
          strength: cluster.coherence,
          energy: cluster.avgEnergy,
          persistence: cluster.persistence
        });
      }
    });
    
    return coherentStructures;
  }, []);

  // ═══════════════════════════════════════════════════════════════════════
  // INITIALIZATION EFFECTS
  // ═══════════════════════════════════════════════════════════════════════
  
  useEffect(() => {
    initializeMagneticDomains();
  }, [initializeMagneticDomains]);
  
  useEffect(() => {
    initializePlasmaParticles();
  }, [initializePlasmaParticles]);

  // ═══════════════════════════════════════════════════════════════════════
  // MAIN ANIMATION LOOP - PLASMA PHYSICS SIMULATION
  // ═══════════════════════════════════════════════════════════════════════
  
  useEffect(() => {
    const animatePhysics = () => {
      setPlasmaParticles(prevParticles => {
        const updatedParticles = prevParticles.map(particle => {
          let newParticle = { ...particle };
          
          // Process wave-particle interactions with each domain
          magneticDomains.forEach(domain => {
            const interaction = processWaveParticleInteraction(particle, domain);
            if (interaction) {
              Object.assign(newParticle, interaction);
            }
          });
          
          // Update position
          newParticle.x += newParticle.vx;
          newParticle.y += newParticle.vy;
          
          // Magnetic confinement (toroidal geometry)
          const centerX = 200, centerY = 200;
          const dx = centerX - newParticle.x;
          const dy = centerY - newParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance > 150) {
            // Reflection at plasma boundary
            const angle = Math.atan2(dy, dx);
            newParticle.x = centerX + Math.cos(angle) * 150;
            newParticle.y = centerY + Math.sin(angle) * 150;
            newParticle.vx *= -0.7;
            newParticle.vy *= -0.7;
            newParticle.orbitType = 'lost';
          }
          
          // Velocity damping (collisions)
          newParticle.vx *= 0.998;
          newParticle.vy *= 0.998;
          
          // Update trail for PIC-like visualization
          newParticle.trail = [...newParticle.trail, {
            x: newParticle.x,
            y: newParticle.y,
            phase: newParticle.cyclotronPhase,
            field: newParticle.fieldStrength || 0,
            time: Date.now()
          }].slice(-30);
          
          return newParticle;
        });
        
        // Process plasma pinch effects
        processPlasmaPinch(updatedParticles);
        
        // Generate diagnostic data
        generateDiagnosticImages(updatedParticles, magneticDomains);
        
        // Analyze stability
        const stability = processPlasmaStability(updatedParticles, magneticDomains);
        
        // Generate spectral modes
        generateSpectralModes(updatedParticles, stability);
        
        // Process reconnection
        processReconnection(magneticDomains);
        
        // Analyze turbulence patterns
        const turbulence = analyzeTurbulencePatterns(updatedParticles);
        
        return updatedParticles;
      });
      
      animationRef.current = requestAnimationFrame(animatePhysics);
    };
    
    animationRef.current = requestAnimationFrame(animatePhysics);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [magneticDomains, processWaveParticleInteraction, processPlasmaPinch,
      generateDiagnosticImages, processPlasmaStability, generateSpectralModes,
      processReconnection, analyzeTurbulencePatterns]);

  // ═══════════════════════════════════════════════════════════════════════
  // PLASMA VISUALIZATION RENDERER
  // ═══════════════════════════════════════════════════════════════════════
  
  const renderPlasmaVisualization = () => (
    <>
      {/* Vacuum vessel boundary */}
      <circle cx="200" cy="200" r="150" fill="none" stroke="#444" strokeWidth="2" strokeDasharray="5,5" opacity="0.4" />
      
      {/* Multi-shell plasma equilibrium (Parallel 5) */}
      {processMultiShellEquilibrium().map((shell, idx) => (
        <circle
          key={`shell-${idx}`}
          cx="200" cy="200" r={shell.radius}
          fill="none"
          stroke={`hsl(${60 + idx * 120}, 70%, 50%)`}
          strokeWidth="1"
          opacity={0.3 + shell.plasmaBeta * 0.4}
        />
      ))}
      
      {/* Magnetic domains with MHD properties */}
      {magneticDomains.map(domain => {
        const hue = domain.angle * 180 / Math.PI + 60;
        const opacity = 0.15 + domain.magneticTension * 0.4;
        return (
          <g key={`domain-${domain.id}`}>
            {/* Domain region */}
            <circle
              cx={domain.center.x} cy={domain.center.y} r="45"
              fill={`hsl(${hue}, 70%, 40%)`}
              opacity={opacity}
              stroke={`hsl(${hue}, 80%, 60%)`}
              strokeWidth="1"
            />
            
            {/* Magnetic field lines */}
            <line
              x1="200" y1="200"
              x2={domain.center.x} y2={domain.center.y}
              stroke={`hsl(${hue}, 80%, 55%)`}
              strokeWidth={1 + domain.magneticTension * 2}
              opacity={opacity * 1.5}
              markerEnd="url(#field-arrow)"
            />
            
            {/* Domain labels */}
            <text
              x={domain.center.x} y={domain.center.y - 55}
              fontSize="8" fill={`hsl(${hue}, 90%, 80%)`}
              textAnchor="middle" opacity="0.8"
            >
              β={domain.plasmaBeta.toFixed(2)}
            </text>
            
            {/* Reconnection sites */}
            {domain.reconnectionSite && (
              <circle
                cx={domain.center.x} cy={domain.center.y}
                r="8" fill="#ff4444" opacity="0.8"
                stroke="#ff0000" strokeWidth="2"
              >
                <animate attributeName="r" values="8;15;8" dur="2s" repeatCount="indefinite" />
              </circle>
            )}
          </g>
        );
      })}
      
      {/* Plasma particles with species identification */}
      {plasmaParticles.map(particle => {
        const color = particle.species === 'electron' ? '#00ffff' : 
                     particle.species === 'ion' ? '#ff6600' : '#888888';
        const size = particle.gyroRadius * 0.3;
        
        return (
          <g key={`particle-${particle.id}`}>
            {/* Particle trail (orbit) */}
            {particle.trail.length > 2 && (
              <path
                d={particle.trail.map((point, idx) => 
                  `${idx === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
                ).join(' ')}
                fill="none"
                stroke={color}
                strokeWidth="0.5"
                opacity="0.6"
              />
            )}
            
            {/* Main particle */}
            <circle
              cx={particle.x} cy={particle.y}
              r={size}
              fill={color}
              stroke={particle.trapped ? '#ffff00' : color}
              strokeWidth={particle.trapped ? 2 : 1}
              opacity={0.8}
            />
            
            {/* Cyclotron motion indicator */}
            <circle
              cx={particle.x + Math.cos(particle.cyclotronPhase) * size * 2}
              cy={particle.y + Math.sin(particle.cyclotronPhase) * size * 2}
              r="1"
              fill={color}
              opacity="0.5"
            />
            
            {/* Resonance indicator */}
            {particle.landauResonance && (
              <circle
                cx={particle.x} cy={particle.y}
                r={size * 3}
                fill="none" stroke="#ffff00" strokeWidth="1.5" opacity="0.6"
              >
                <animate attributeName="r" values={`${size * 3};${size * 4};${size * 3}`} dur="1.5s" repeatCount="indefinite" />
              </circle>
            )}
          </g>
        );
      })}
      
      {/* Reconnection sites visualization */}
      {reconnectionSites.map((site, idx) => (
        <g key={`reconnection-${idx}`}>
          <circle
            cx={site.x} cy={site.y} r={5 + site.rate * 20}
            fill="none" stroke="#ff3333" strokeWidth="3" opacity="0.7"
          />
          <text
            x={site.x} y={site.y + 25}
            fontSize="6" fill="#ff6666" textAnchor="middle"
          >
            {site.type}
          </text>
        </g>
      ))}
      
      {/* Diagnostic imaging overlay */}
      {diagnosticImages.map((image, idx) => {
        if (image.type === 'emission') {
          return (
            <circle
              key={`emission-${idx}`}
              cx={image.x} cy={image.y}
              r="3"
              fill="#ff8800"
              opacity={image.intensity * 0.1}
            />
          );
        } else if (image.type === 'flux_surface') {
          return (
            <circle
              key={`flux-${idx}`}
              cx={image.center.x} cy={image.center.y}
              r={20 + image.psi * 15}
              fill="none"
              stroke="#66ff66"
              strokeWidth="0.5"
              opacity="0.4"
              strokeDasharray="2,2"
            />
          );
        }
        return null;
      })}
      
      {/* SVG markers */}
      <defs>
        <marker id="field-arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
          <polygon points="0,0 0,6 9,3" fill="#66aaff" />
        </marker>
      </defs>
    </>
  );

  // ═══════════════════════════════════════════════════════════════════════
  // PLASMA PARAMETER CONTROLS
  // ═══════════════════════════════════════════════════════════════════════
  
  const handlePlasmaChange = (parameter, value) => {
    setPlasmaState(prev => ({ ...prev, [parameter]: value }));
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 rounded-xl shadow-2xl">
      
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">🌌 Plasma MHD Relational Engine ⚡</h1>
        <p className="text-blue-200 text-sm">Magnetohydrodynamics Through Relational Field Computation</p>
        <p className="text-xs text-gray-300 mt-1">
          Wave-Particle • Magnetic Domains • Plasma Pinch • Multi-Shell Equilibrium • Diagnostic Imaging
        </p>
      </div>

      {/* Plasma Controls */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div>
          <label className="block text-white text-xs mb-1">Magnetic Tension (B⊥)</label>
          <input
            type="range" min="0" max="1" step="0.01"
            value={plasmaState.magneticTension}
            onChange={(e) => handlePlasmaChange('magneticTension', parseFloat(e.target.value))}
            className="w-full accent-blue-500"
          />
          <span className="text-xs text-blue-300">{plasmaState.magneticTension.toFixed(2)}</span>
        </div>
        
        <div>
          <label className="block text-white text-xs mb-1">Plasma β</label>
          <input
            type="range" min="0" max="1" step="0.01"
            value={plasmaState.plasmaBeta}
            onChange={(e) => handlePlasmaChange('plasmaBeta', parseFloat(e.target.value))}
            className="w-full accent-orange-500"
          />
          <span className="text-xs text-orange-300">{plasmaState.plasmaBeta.toFixed(2)}</span>
        </div>
        
        <div>
          <label className="block text-white text-xs mb-1">Alfvén Velocity (vₐ)</label>
          <input
            type="range" min="0" max="1" step="0.01"
            value={plasmaState.alfvenVelocity}
            onChange={(e) => handlePlasmaChange('alfvenVelocity', parseFloat(e.target.value))}
            className="w-full accent-green-500"
          />
          <span className="text-xs text-green-300">{plasmaState.alfvenVelocity.toFixed(2)}</span>
        </div>
        
        <div>
          <label className="block text-white text-xs mb-1">Current Density (J∥)</label>
          <input
            type="range" min="0" max="1" step="0.01"
            value={plasmaState.currentDensity}
            onChange={(e) => handlePlasmaChange('currentDensity', parseFloat(e.target.value))}
            className="w-full accent-yellow-500"
          />
          <span className="text-xs text-yellow-300">{plasmaState.currentDensity.toFixed(2)}</span>
        </div>
        
        <div>
          <label className="block text-white text-xs mb-1">Cyclotron Freq (ωc)</label>
          <input
            type="range" min="0" max="1" step="0.01"
            value={plasmaState.cyclotronFreq}
            onChange={(e) => handlePlasmaChange('cyclotronFreq', parseFloat(e.target.value))}
            className="w-full accent-purple-500"
          />
          <span className="text-xs text-purple-300">{plasmaState.cyclotronFreq.toFixed(2)}</span>
        </div>
        
        <div>
          <label className="block text-white text-xs mb-1">Tearing Mode</label>
          <input
            type="range" min="0" max="0.5" step="0.01"
            value={plasmaState.tearingMode}
            onChange={(e) => handlePlasmaChange('tearingMode', parseFloat(e.target.value))}
            className="w-full accent-red-500"
          />
          <span className="text-xs text-red-300">{plasmaState.tearingMode.toFixed(2)}</span>
        </div>
        
        <div>
          <label className="block text-white text-xs mb-1">Safety Factor (q)</label>
          <input
            type="range" min="0.1" max="2" step="0.01"
            value={plasmaState.safetyFactor}
            onChange={(e) => handlePlasmaChange('safetyFactor', parseFloat(e.target.value))}
            className="w-full accent-cyan-500"
          />
          <span className="text-xs text-cyan-300">{plasmaState.safetyFactor.toFixed(2)}</span>
        </div>
        
        <div>
          <label className="block text-white text-xs mb-1">Particle Count</label>
          <input
            type="range" min="4" max="16" step="1"
            value={plasmaState.particleCount}
            onChange={(e) => handlePlasmaChange('particleCount', parseInt(e.target.value))}
            className="w-full accent-pink-500"
          />
          <span className="text-xs text-pink-300">{plasmaState.particleCount}</span>
        </div>
      </div>

      {/* Main Plasma Visualization */}
      <div className="bg-black rounded-lg p-4 mb-4 border border-blue-500">
        <svg
          ref={svgRef}
          width="400" height="400"
          viewBox="0 0 400 400"
          className="w-full h-auto rounded"
        >
          {renderPlasmaVisualization()}
        </svg>
      </div>

      {/* Plasma Physics Status */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 text-center mb-4">
        <div className="bg-gray-800 rounded p-2 border border-blue-400">
          <div className="text-blue-300 text-xs">Domains</div>
          <div className="text-white font-mono text-sm">{magneticDomains.length}</div>
        </div>
        
        <div className="bg-gray-800 rounded p-2 border border-orange-400">
          <div className="text-orange-300 text-xs">Particles</div>
          <div className="text-white font-mono text-sm">{plasmaParticles.length}</div>
        </div>
        
        <div className="bg-gray-800 rounded p-2 border border-red-400">
          <div className="text-red-300 text-xs">Reconnection</div>
          <div className="text-white font-mono text-sm">{reconnectionSites.length}</div>
        </div>
        
        <div className="bg-gray-800 rounded p-2 border border-green-400">
          <div className="text-green-300 text-xs">Spectral</div>
          <div className="text-white font-mono text-sm">{spectralModes.length}</div>
        </div>
        
        <div className="bg-gray-800 rounded p-2 border border-purple-400">
          <div className="text-purple-300 text-xs">Trapped</div>
          <div className="text-white font-mono text-sm">
            {plasmaParticles.filter(p => p.trapped).length}
          </div>
        </div>
        
        <div className="bg-gray-800 rounded p-2 border border-yellow-400">
          <div className="text-yellow-300 text-xs">Diagnostics</div>
          <div className="text-white font-mono text-sm">{diagnosticImages.length}</div>
        </div>
      </div>

      {/* MHD Physics Information */}
      <div className="text-xs text-gray-400 text-center">
        <p>🌌 Relational Plasma Physics: Wave-particle resonance • Magnetic reconnection • Multi-shell equilibrium • Diagnostic imaging</p>
        <p className="mt-1">⚡ MHD Parallels: Cyclotron orbits • Alfvén waves • Plasma pinch • Field-line tension • Landau damping</p>
      </div>
    </div>
  );
};

export default PlasmaMHDRelationalEngine;
