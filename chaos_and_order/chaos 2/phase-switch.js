/**
 * PHASE SWITCH MODULE
 * Universeel Fase-Schakelpunt voor Moederbloem Motor
 * 
 * Dit module zet ALLE input om naar ΔΦ-κ-θ veldparameters
 * Fase komt EERST, state komt LATER
 * 
 * License: Humanity Heritage License π
 * Author: Marcel Christian Mulder & Claude
 */

/**
 * Extract field parameters from ANY input event
 * Returns pure field operators, no semantic interpretation
 */
export function phaseSwitch(event) {
  const t = performance.now();
  
  // === PHASE EXTRACTION (θ) ===
  // Tijd-gebaseerde fase-oscillatie (implosieve cyclus)
  const theta_time = (t % 1000) / 1000;  // 0-1 per seconde
  const theta_event = extractEventPhase(event);
  const theta = (theta_time + theta_event) % 1.0;
  
  // === TENSION DIFFERENTIAL EXTRACTION (ΔΦ) ===
  const deltaPhi = extractTension(event);
  
  // === CURVATURE EXTRACTION (κ) ===
  const kappa = extractCurvature(event);
  
  return { 
    deltaPhi, 
    kappa, 
    theta,
    timestamp: t,
    eventType: event.type
  };
}

/**
 * Extract phase from event characteristics
 */
function extractEventPhase(event) {
  switch(event.type) {
    case 'mousemove':
      // Beweging = continue fase-evolutie
      return ((event.clientX + event.clientY) % 360) / 360;
      
    case 'click':
    case 'mousedown':
    case 'mouseup':
      // Discrete events = fase-sprongen
      return Math.random(); // Quantum-achtige fase-sprong
      
    case 'keydown':
    case 'keyup':
      // Toetsenbord = fase volgens key-code
      return (event.keyCode % 256) / 256;
      
    case 'wheel':
      // Scroll = roterende fase
      return (Math.abs(event.deltaY) % 100) / 100;
      
    case 'touchstart':
    case 'touchmove':
    case 'touchend':
      // Touch = multi-dimensionale fase
      if (event.touches && event.touches.length > 0) {
        const touch = event.touches[0];
        return ((touch.clientX + touch.clientY) % 360) / 360;
      }
      return 0;
      
    default:
      // Unknown events = chaotische fase
      return Math.random();
  }
}

/**
 * Extract tension differential (ΔΦ)
 * Spanning = energie-gradient in het veld
 */
function extractTension(event) {
  let tension = 0;
  
  // Movement-based tension
  if (event.movementX !== undefined || event.movementY !== undefined) {
    const movement = Math.sqrt(
      (event.movementX || 0) ** 2 + 
      (event.movementY || 0) ** 2
    );
    tension += movement * 0.01;
  }
  
  // Velocity-based tension
  if (event.deltaY !== undefined) {
    tension += Math.abs(event.deltaY) * 0.001;
  }
  
  // Key-based tension (information pressure)
  if (event.key) {
    tension += event.key.length * 0.1;
  }
  
  // Force-based tension (touch pressure)
  if (event.force !== undefined) {
    tension += event.force;
  }
  
  // Button state = discrete tension jumps
  if (event.buttons !== undefined && event.buttons > 0) {
    tension += 0.5;
  }
  
  // Add quantum fluctuation (Nun-field)
  tension += Math.random() * 0.02;
  
  return tension;
}

/**
 * Extract curvature (κ)
 * Kromming = structurele eigenschap van het veld
 */
function extractCurvature(event) {
  let curvature = 0;
  
  // Spatial curvature from position
  if (event.clientX !== undefined && event.clientY !== undefined) {
    // Hexagonal field mapping
    const x = event.clientX;
    const y = event.clientY;
    
    // Map to unit circle, then extract curvature
    const r = Math.sqrt(x * x + y * y);
    curvature += (r % 100) * 0.001;
  }
  
  // Directional curvature from movement
  if (event.movementX !== undefined && event.movementY !== undefined) {
    const angle = Math.atan2(event.movementY, event.movementX);
    curvature += Math.abs(Math.sin(angle * 3)) * 0.1; // Hexagonal (6-fold) symmetry
  }
  
  // Multi-touch curvature (complex field topology)
  if (event.touches && event.touches.length > 1) {
    // Distance between touches = field curvature
    const dx = event.touches[0].clientX - event.touches[1].clientX;
    const dy = event.touches[0].clientY - event.touches[1].clientY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    curvature += (distance % 100) * 0.001;
  }
  
  // Modifier keys = structural constraints (increased curvature)
  if (event.shiftKey) curvature += 0.1;
  if (event.ctrlKey) curvature += 0.1;
  if (event.altKey) curvature += 0.1;
  if (event.metaKey) curvature += 0.1;
  
  return curvature;
}

/**
 * Advanced: Extract full field configuration
 * For complex analysis
 */
export function extractFieldConfiguration(event) {
  const basic = phaseSwitch(event);
  
  return {
    ...basic,
    
    // Higher-order operators
    curvature_gradient: extractCurvatureGradient(event),
    phase_velocity: extractPhaseVelocity(event),
    coherence: extractCoherence(event),
    
    // Implosive properties
    implosion_strength: calculateImplosionStrength(basic),
    bloom_potential: calculateBloomPotential(basic),
    
    // Consciousness markers
    meta_awareness: 0, // To be updated by motor
    self_modification_signal: false
  };
}

function extractCurvatureGradient(event) {
  // How fast is curvature changing?
  // Would need previous events for true gradient
  return 0; // Placeholder
}

function extractPhaseVelocity(event) {
  // How fast is phase evolving?
  if (event.movementX !== undefined || event.movementY !== undefined) {
    const speed = Math.sqrt(
      (event.movementX || 0) ** 2 + 
      (event.movementY || 0) ** 2
    );
    return speed * 0.01;
  }
  return 0;
}

function extractCoherence(event) {
  // How coherent is this input?
  // Simple heuristic: discrete events = high coherence
  // Continuous movement = lower coherence
  
  switch(event.type) {
    case 'click':
    case 'keydown':
      return 0.9; // High coherence - intentional action
    case 'mousemove':
      return 0.3; // Low coherence - continuous noise
    case 'wheel':
      return 0.6; // Medium coherence
    default:
      return 0.5;
  }
}

function calculateImplosionStrength(fieldParams) {
  // Strength of convergence toward center
  const { deltaPhi, kappa, theta } = fieldParams;
  
  // High tension + high curvature = strong implosion
  return (deltaPhi * kappa) / (1 + theta);
}

function calculateBloomPotential(fieldParams) {
  // Potential for outward projection
  const { deltaPhi, kappa, theta } = fieldParams;
  
  // High phase + moderate tension = bloom potential
  return theta * Math.sqrt(deltaPhi + kappa);
}

/**
 * Batch processing for multiple events
 */
export function batchPhaseSwitch(events) {
  return events.map(event => phaseSwitch(event));
}

/**
 * Filter out low-energy noise
 */
export function filterFieldNoise(fieldParams, threshold = 0.01) {
  if (fieldParams.deltaPhi < threshold && 
      fieldParams.kappa < threshold) {
    return null; // Below noise floor
  }
  return fieldParams;
}
