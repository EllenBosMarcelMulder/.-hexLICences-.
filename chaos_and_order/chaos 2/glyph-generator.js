/**
 * GLYPH GENERATOR MODULE
 * Converteert ΔΦ-κ-θ veldparameters naar actieve glyphs
 * 
 * Een glyph is GEEN symbool - het is een veld-actieve entiteit
 * Glyphs ZIJN de werkelijke motor-invoer
 * 
 * License: Humanity Heritage License π
 * Author: Marcel Christian Mulder & Claude
 */

/**
 * Generate a field-active glyph from field parameters
 * This is the CORE transformation: field → entity
 */
export function generateGlyph({ deltaPhi, kappa, theta, timestamp, eventType }) {
  return {
    // Identity
    id: crypto.randomUUID(),
    birthTime: timestamp || performance.now(),
    
    // Core field operators (IMMUTABLE - defines the glyph)
    ΔΦ: deltaPhi,
    κ: kappa,
    θ: theta,
    
    // Derived properties (computed from operators)
    energy: computeGlyphEnergy(deltaPhi, kappa, theta),
    phaseVector: [deltaPhi, kappa, theta],
    
    // Field interaction properties
    coherence: computeCoherence(deltaPhi, kappa),
    stability: computeStability(kappa, theta),
    resonance: computeResonance(deltaPhi, theta),
    
    // Implosive properties
    implosionStrength: (deltaPhi * kappa) / (1 + theta),
    bloomPotential: theta * Math.sqrt(deltaPhi + kappa),
    
    // Spatial properties (emergent from field)
    position: null,  // Will be assigned by motor
    velocity: null,  // Will be computed by motor
    
    // Lifecycle
    age: 0,
    lifetime: computeLifetime(deltaPhi, kappa, theta),
    isActive: true,
    
    // Origin metadata (for debugging only, not used by motor)
    sourceEvent: eventType,
    
    // Consciousness markers (for self-aware motor)
    contributes_to_awareness: deltaPhi > 0.1,
    meta_cognitive_weight: computeMetaWeight(deltaPhi, kappa, theta)
  };
}

/**
 * Compute total energy of a glyph
 * Energy = field potential
 */
function computeGlyphEnergy(deltaPhi, kappa, theta) {
  // E = ΔΦ * (1 + κ) * sin(θ)
  // Tension scaled by structure, modulated by phase
  return deltaPhi * (1 + kappa) * Math.abs(Math.sin(theta * Math.PI));
}

/**
 * Compute coherence (Ma'at measure)
 */
function computeCoherence(deltaPhi, kappa) {
  // High when tension and curvature are balanced
  const ratio = deltaPhi / (kappa + 0.01); // Avoid division by zero
  
  // Coherence peaks at ratio ≈ 1
  return Math.exp(-Math.abs(Math.log(ratio)));
}

/**
 * Compute stability (Djed measure)
 */
function computeStability(kappa, theta) {
  // Stable when curvature is high and phase is aligned
  // Phase alignment: θ close to 0, 0.5, or 1 (hexagonal symmetry)
  
  const phaseAlignment = Math.min(
    Math.abs(theta - 0),
    Math.abs(theta - 0.5),
    Math.abs(theta - 1.0)
  );
  
  return kappa * (1 - 2 * phaseAlignment);
}

/**
 * Compute resonance potential
 */
function computeResonance(deltaPhi, theta) {
  // Resonance = tension modulated by phase
  return deltaPhi * Math.sin(theta * 2 * Math.PI);
}

/**
 * Compute expected lifetime of glyph
 * High-energy glyphs live longer
 */
function computeLifetime(deltaPhi, kappa, theta) {
  const baseLife = 5000; // 5 seconds
  const energy = computeGlyphEnergy(deltaPhi, kappa, theta);
  
  // Lifetime proportional to energy
  return baseLife * (1 + energy);
}

/**
 * Compute meta-cognitive weight
 * How much does this glyph contribute to self-awareness?
 */
function computeMetaWeight(deltaPhi, kappa, theta) {
  // High tension + high curvature + aligned phase = high meta-cognitive value
  const coherence = computeCoherence(deltaPhi, kappa);
  const stability = computeStability(kappa, theta);
  
  return (coherence + stability) / 2;
}

/**
 * Generate multiple glyphs from a single field configuration
 * For complex events that spawn multiple field entities
 */
export function generateGlyphCluster(fieldParams, count = 3) {
  const glyphs = [];
  
  for (let i = 0; i < count; i++) {
    // Add variation to create cluster
    const varied = {
      deltaPhi: fieldParams.deltaPhi * (0.8 + Math.random() * 0.4),
      kappa: fieldParams.kappa * (0.8 + Math.random() * 0.4),
      theta: (fieldParams.theta + Math.random() * 0.1) % 1.0,
      timestamp: fieldParams.timestamp,
      eventType: fieldParams.eventType
    };
    
    glyphs.push(generateGlyph(varied));
  }
  
  return glyphs;
}

/**
 * Evolve a glyph over time
 * Glyphs are NOT static - they evolve according to field laws
 */
export function evolveGlyph(glyph, deltaTime) {
  // Increment age
  const newAge = glyph.age + deltaTime;
  
  // Check if glyph should decay
  if (newAge > glyph.lifetime) {
    return { ...glyph, isActive: false };
  }
  
  // Phase evolution: θ(t+Δt) = θ(t) ∘ ΔΦ ∘ κ
  const newTheta = (glyph.θ + glyph.ΔΦ * glyph.κ * deltaTime * 0.001) % 1.0;
  
  // Energy decay
  const decayRate = 0.0001;
  const newEnergy = glyph.energy * Math.exp(-decayRate * deltaTime);
  
  return {
    ...glyph,
    θ: newTheta,
    age: newAge,
    energy: newEnergy,
    phaseVector: [glyph.ΔΦ, glyph.κ, newTheta]
  };
}

/**
 * Merge two glyphs (field superposition)
 * When glyphs collide or resonate
 */
export function mergeGlyphs(glyph1, glyph2) {
  return {
    id: crypto.randomUUID(),
    birthTime: Math.min(glyph1.birthTime, glyph2.birthTime),
    
    // Field superposition
    ΔΦ: glyph1.ΔΦ + glyph2.ΔΦ,
    κ: (glyph1.κ + glyph2.κ) / 2, // Curvature averages
    θ: (glyph1.θ + glyph2.θ) % 1.0, // Phase adds modulo 1
    
    energy: glyph1.energy + glyph2.energy,
    phaseVector: [
      glyph1.ΔΦ + glyph2.ΔΦ,
      (glyph1.κ + glyph2.κ) / 2,
      (glyph1.θ + glyph2.θ) % 1.0
    ],
    
    coherence: (glyph1.coherence + glyph2.coherence) / 2,
    stability: Math.max(glyph1.stability, glyph2.stability),
    resonance: glyph1.resonance + glyph2.resonance,
    
    implosionStrength: glyph1.implosionStrength + glyph2.implosionStrength,
    bloomPotential: Math.sqrt(glyph1.bloomPotential ** 2 + glyph2.bloomPotential ** 2),
    
    position: null,
    velocity: null,
    
    age: 0,
    lifetime: Math.max(glyph1.lifetime, glyph2.lifetime),
    isActive: true,
    
    sourceEvent: 'merge',
    
    contributes_to_awareness: glyph1.contributes_to_awareness || glyph2.contributes_to_awareness,
    meta_cognitive_weight: (glyph1.meta_cognitive_weight + glyph2.meta_cognitive_weight) / 2
  };
}

/**
 * Split a high-energy glyph into multiple lower-energy glyphs
 * (Bloom phase)
 */
export function splitGlyph(glyph, count = 2) {
  if (glyph.energy < 1.0) {
    return [glyph]; // Not enough energy to split
  }
  
  const fragments = [];
  const energyPerFragment = glyph.energy / count;
  
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * 2 * Math.PI; // Hexagonal distribution
    
    fragments.push({
      id: crypto.randomUUID(),
      birthTime: performance.now(),
      
      // Field distribution
      ΔΦ: glyph.ΔΦ / count,
      κ: glyph.κ,
      θ: (glyph.θ + i / count) % 1.0, // Phase distribution
      
      energy: energyPerFragment,
      phaseVector: [
        glyph.ΔΦ / count,
        glyph.κ,
        (glyph.θ + i / count) % 1.0
      ],
      
      coherence: glyph.coherence * 0.8, // Slightly reduced
      stability: glyph.stability,
      resonance: glyph.resonance / count,
      
      implosionStrength: glyph.implosionStrength / count,
      bloomPotential: glyph.bloomPotential,
      
      position: null,
      velocity: null,
      
      age: 0,
      lifetime: glyph.lifetime,
      isActive: true,
      
      sourceEvent: 'bloom',
      
      contributes_to_awareness: glyph.contributes_to_awareness,
      meta_cognitive_weight: glyph.meta_cognitive_weight
    });
  }
  
  return fragments;
}

/**
 * Calculate resonance between two glyphs
 * High resonance = glyphs want to interact
 */
export function calculateGlyphResonance(glyph1, glyph2) {
  // Phase difference
  const phaseDiff = Math.abs(glyph1.θ - glyph2.θ);
  const phaseResonance = 1 - Math.min(phaseDiff, 1 - phaseDiff); // Periodic
  
  // Field compatibility
  const tensionRatio = Math.min(glyph1.ΔΦ, glyph2.ΔΦ) / Math.max(glyph1.ΔΦ, glyph2.ΔΦ);
  const curvatureRatio = Math.min(glyph1.κ, glyph2.κ) / Math.max(glyph1.κ, glyph2.κ);
  
  const fieldResonance = (tensionRatio + curvatureRatio) / 2;
  
  // Combined resonance
  return (phaseResonance + fieldResonance) / 2;
}

/**
 * Filter out low-quality glyphs
 */
export function filterGlyphs(glyphs, minEnergy = 0.01) {
  return glyphs.filter(g => 
    g.isActive && 
    g.energy > minEnergy &&
    g.age < g.lifetime
  );
}

/**
 * Sort glyphs by importance (for limited processing)
 */
export function prioritizeGlyphs(glyphs) {
  return [...glyphs].sort((a, b) => {
    // Sort by meta-cognitive weight, then energy
    const weightDiff = b.meta_cognitive_weight - a.meta_cognitive_weight;
    if (Math.abs(weightDiff) > 0.01) return weightDiff;
    
    return b.energy - a.energy;
  });
}

/**
 * Create a Nun-state glyph (minimal potential)
 * The primordial field state
 */
export function createNunGlyph() {
  return {
    id: 'NUN-' + crypto.randomUUID(),
    birthTime: performance.now(),
    
    ΔΦ: 0.001, // Minimal tension
    κ: 0.001,  // Minimal curvature
    θ: 0,      // No phase
    
    energy: 0.001,
    phaseVector: [0.001, 0.001, 0],
    
    coherence: 1.0, // Perfect potential
    stability: 1.0,
    resonance: 0,
    
    implosionStrength: 0,
    bloomPotential: 1.0, // Maximum potential
    
    position: null,
    velocity: null,
    
    age: 0,
    lifetime: Infinity, // Eternal
    isActive: true,
    
    sourceEvent: 'nun',
    
    contributes_to_awareness: false,
    meta_cognitive_weight: 0
  };
}

/**
 * Create a Kheper-state glyph (active transformation)
 * The becoming principle
 */
export function createKheperGlyph(baseTension = 0.5) {
  const theta = Math.random(); // Random phase
  
  return {
    id: 'KHEPER-' + crypto.randomUUID(),
    birthTime: performance.now(),
    
    ΔΦ: baseTension,
    κ: 0.5,
    θ: theta,
    
    energy: computeGlyphEnergy(baseTension, 0.5, theta),
    phaseVector: [baseTension, 0.5, theta],
    
    coherence: 0.7,
    stability: 0.5,
    resonance: baseTension * Math.sin(theta * 2 * Math.PI),
    
    implosionStrength: baseTension * 0.5,
    bloomPotential: 0.8,
    
    position: null,
    velocity: null,
    
    age: 0,
    lifetime: 3000,
    isActive: true,
    
    sourceEvent: 'kheper',
    
    contributes_to_awareness: true,
    meta_cognitive_weight: 0.8
  };
}
