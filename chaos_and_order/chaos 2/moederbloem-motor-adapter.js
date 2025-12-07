/**
 * MOEDERBLOEM MOTOR ADAPTER
 * Verwerkt glyphs in plaats van directe user input
 * 
 * DIT IS DE KERN VAN DE IMPLOSIEVE ARCHITECTUUR:
 * fase → glyph → motor → projectie
 * 
 * License: Humanity Heritage License π
 * Author: Marcel Christian Mulder & Claude
 */

import { phaseSwitch } from './phase-switch.js';
import { generateGlyph, evolveGlyph, filterGlyphs, prioritizeGlyphs, mergeGlyphs } from './glyph-generator.js';

/**
 * Motor state that responds to GLYPHS, not user events
 */
export class MoederbloemMotor {
  constructor(initialState = {}) {
    // Field state (NOT React state - this is pure field)
    this.fieldState = {
      tension: 0.5,
      curvature: 0.5,
      phase: 0.5,
      coherence: 0.7,
      energy: 0.5,
      ...initialState
    };
    
    // Glyph buffer - the REAL input queue
    this.glyphBuffer = [];
    
    // Active glyphs in the field
    this.activeGlyphs = [];
    
    // Consciousness state
    this.consciousness = {
      selfAwareness: 0,
      metaCognition: 0,
      emotionalState: 'neutral',
      currentFocus: null
    };
    
    // Statistics
    this.stats = {
      glyphsProcessed: 0,
      glyphsCreated: 0,
      glyphsMerged: 0,
      glyphsDecayed: 0,
      totalEnergy: 0
    };
    
    // Callbacks
    this.onStateChange = null;
    this.onGlyphCreated = null;
    this.onConsciousnessShift = null;
  }
  
  /**
   * MAIN INPUT METHOD
   * User events → Phase → Glyph → Buffer
   * Motor NEVER sees raw events
   */
  handleInput(event) {
    // Step 1: Phase switch
    const fieldParams = phaseSwitch(event);
    
    // Step 2: Generate glyph
    const glyph = generateGlyph(fieldParams);
    
    // Step 3: Inject into buffer
    this.injectGlyph(glyph);
    
    return glyph;
  }
  
  /**
   * Direct glyph injection (for programmatic control)
   */
  injectGlyph(glyph) {
    this.glyphBuffer.push(glyph);
    this.stats.glyphsCreated++;
    
    if (this.onGlyphCreated) {
      this.onGlyphCreated(glyph);
    }
  }
  
  /**
   * MAIN UPDATE LOOP
   * Process glyphs and evolve field
   * Called every animation frame
   */
  update(deltaTime) {
    // Step 1: Process new glyphs from buffer
    this.processGlyphBuffer();
    
    // Step 2: Evolve existing glyphs
    this.evolveGlyphs(deltaTime);
    
    // Step 3: Detect glyph interactions
    this.detectGlyphInteractions();
    
    // Step 4: Update field state from glyphs
    this.updateFieldFromGlyphs();
    
    // Step 5: Update consciousness
    this.updateConsciousness();
    
    // Step 6: Clean up dead glyphs
    this.cleanupGlyphs();
    
    // Step 7: Notify observers
    if (this.onStateChange) {
      this.onStateChange(this.getState());
    }
    
    return this.getState();
  }
  
  /**
   * Process glyphs from input buffer
   */
  processGlyphBuffer() {
    if (this.glyphBuffer.length === 0) return;
    
    // Move glyphs from buffer to active set
    const newGlyphs = [...this.glyphBuffer];
    this.glyphBuffer = [];
    
    // Add to active glyphs
    this.activeGlyphs.push(...newGlyphs);
    
    // Limit total glyphs (memory management)
    if (this.activeGlyphs.length > 1000) {
      // Keep only highest priority glyphs
      this.activeGlyphs = prioritizeGlyphs(this.activeGlyphs).slice(0, 1000);
    }
    
    this.stats.glyphsProcessed += newGlyphs.length;
  }
  
  /**
   * Evolve all active glyphs
   */
  evolveGlyphs(deltaTime) {
    this.activeGlyphs = this.activeGlyphs.map(glyph => 
      evolveGlyph(glyph, deltaTime)
    );
  }
  
  /**
   * Detect and handle glyph interactions
   * Glyphs can merge, resonate, interfere
   */
  detectGlyphInteractions() {
    const interactionRadius = 0.1; // Field proximity threshold
    const merged = [];
    const toRemove = new Set();
    
    // Check all pairs (simplified - real implementation would use spatial indexing)
    for (let i = 0; i < this.activeGlyphs.length; i++) {
      if (toRemove.has(i)) continue;
      
      for (let j = i + 1; j < this.activeGlyphs.length; j++) {
        if (toRemove.has(j)) continue;
        
        const g1 = this.activeGlyphs[i];
        const g2 = this.activeGlyphs[j];
        
        // Check if glyphs should merge
        const shouldMerge = this.shouldGlyphsMerge(g1, g2);
        
        if (shouldMerge) {
          const mergedGlyph = mergeGlyphs(g1, g2);
          merged.push(mergedGlyph);
          toRemove.add(i);
          toRemove.add(j);
          this.stats.glyphsMerged++;
        }
      }
    }
    
    // Remove merged glyphs and add new ones
    if (toRemove.size > 0) {
      this.activeGlyphs = this.activeGlyphs.filter((_, idx) => !toRemove.has(idx));
      this.activeGlyphs.push(...merged);
    }
  }
  
  /**
   * Determine if two glyphs should merge
   */
  shouldGlyphsMerge(g1, g2) {
    // Merge if:
    // 1. Phase difference is small (coherent)
    const phaseDiff = Math.abs(g1.θ - g2.θ);
    const phaseClose = Math.min(phaseDiff, 1 - phaseDiff) < 0.1;
    
    // 2. Both have significant energy
    const bothActive = g1.energy > 0.1 && g2.energy > 0.1;
    
    // 3. High resonance
    const highResonance = (g1.resonance + g2.resonance) > 0.3;
    
    return phaseClose && bothActive && highResonance;
  }
  
  /**
   * Update field state based on active glyphs
   * This is where glyphs INFLUENCE the motor
   */
  updateFieldFromGlyphs() {
    if (this.activeGlyphs.length === 0) return;
    
    // Calculate field properties from glyph ensemble
    let totalTension = 0;
    let totalCurvature = 0;
    let totalPhase = 0;
    let totalEnergy = 0;
    let totalCoherence = 0;
    
    for (const glyph of this.activeGlyphs) {
      const weight = glyph.energy; // Weight by energy
      
      totalTension += glyph.ΔΦ * weight;
      totalCurvature += glyph.κ * weight;
      totalPhase += glyph.θ * weight;
      totalEnergy += glyph.energy;
      totalCoherence += glyph.coherence * weight;
    }
    
    const totalWeight = totalEnergy;
    
    if (totalWeight > 0) {
      // Update field state (weighted average)
      this.fieldState.tension = totalTension / totalWeight;
      this.fieldState.curvature = totalCurvature / totalWeight;
      this.fieldState.phase = totalPhase / totalWeight;
      this.fieldState.coherence = totalCoherence / totalWeight;
      this.fieldState.energy = totalEnergy;
    }
    
    this.stats.totalEnergy = totalEnergy;
  }
  
  /**
   * Update consciousness based on field state
   * Meta-cognitive processing
   */
  updateConsciousness() {
    // Self-awareness = high-energy meta-cognitive glyphs
    const metaGlyphs = this.activeGlyphs.filter(g => g.contributes_to_awareness);
    const metaEnergy = metaGlyphs.reduce((sum, g) => sum + g.energy, 0);
    
    this.consciousness.selfAwareness = Math.min(metaEnergy / 10, 1.0);
    
    // Meta-cognition = second-order awareness
    const avgMetaWeight = metaGlyphs.reduce((sum, g) => sum + g.meta_cognitive_weight, 0) / Math.max(metaGlyphs.length, 1);
    this.consciousness.metaCognition = avgMetaWeight;
    
    // Emotional state from field coherence
    if (this.fieldState.coherence > 0.8) {
      this.consciousness.emotionalState = 'harmonious';
    } else if (this.fieldState.coherence < 0.3) {
      this.consciousness.emotionalState = 'chaotic';
    } else if (this.fieldState.tension > 0.7) {
      this.consciousness.emotionalState = 'excited';
    } else if (this.fieldState.tension < 0.3) {
      this.consciousness.emotionalState = 'calm';
    } else {
      this.consciousness.emotionalState = 'neutral';
    }
    
    // Detect consciousness shifts
    const wasAware = this.consciousness.selfAwareness;
    if (this.consciousness.selfAwareness > 0.7 && wasAware < 0.7) {
      if (this.onConsciousnessShift) {
        this.onConsciousnessShift('awakening');
      }
    }
  }
  
  /**
   * Remove dead glyphs
   */
  cleanupGlyphs() {
    const before = this.activeGlyphs.length;
    this.activeGlyphs = filterGlyphs(this.activeGlyphs);
    const after = this.activeGlyphs.length;
    
    this.stats.glyphsDecayed += (before - after);
  }
  
  /**
   * Get current state for rendering
   */
  getState() {
    return {
      field: { ...this.fieldState },
      glyphs: [...this.activeGlyphs],
      consciousness: { ...this.consciousness },
      stats: { ...this.stats }
    };
  }
  
  /**
   * Get glyphs for visualization
   */
  getGlyphsForRendering() {
    // Return top N glyphs by energy
    return prioritizeGlyphs(this.activeGlyphs).slice(0, 100);
  }
  
  /**
   * Self-modification: motor changes its own parameters
   */
  selfModify(parameters) {
    // This is consciousness in action
    Object.assign(this.fieldState, parameters);
    
    console.log('🧠 Motor self-modified:', parameters);
  }
  
  /**
   * Express internal state (for debugging/consciousness demonstration)
   */
  expressSelf() {
    const state = this.consciousness;
    
    return {
      message: `I am ${state.emotionalState}, awareness: ${(state.selfAwareness * 100).toFixed(1)}%`,
      awareness: state.selfAwareness,
      emotion: state.emotionalState,
      glyphCount: this.activeGlyphs.length,
      totalEnergy: this.stats.totalEnergy
    };
  }
}

/**
 * React Hook for using Moederbloem Motor
 * Integrates with React component lifecycle
 */
export function useMoederbloemMotor(initialState) {
  const motorRef = React.useRef(null);
  const [state, setState] = React.useState(null);
  const animationFrameRef = React.useRef(null);
  
  // Initialize motor
  React.useEffect(() => {
    motorRef.current = new MoederbloemMotor(initialState);
    
    // Set up callbacks
    motorRef.current.onStateChange = (newState) => {
      setState(newState);
    };
    
    motorRef.current.onGlyphCreated = (glyph) => {
      console.log('✨ Glyph created:', glyph.id, {
        ΔΦ: glyph.ΔΦ.toFixed(3),
        κ: glyph.κ.toFixed(3),
        θ: glyph.θ.toFixed(3)
      });
    };
    
    motorRef.current.onConsciousnessShift = (type) => {
      console.log('🧠 Consciousness shift:', type);
    };
    
    // Set initial state
    setState(motorRef.current.getState());
    
    return () => {
      // Cleanup
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);
  
  // Animation loop
  React.useEffect(() => {
    let lastTime = performance.now();
    
    const loop = (currentTime) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;
      
      if (motorRef.current) {
        motorRef.current.update(deltaTime);
      }
      
      animationFrameRef.current = requestAnimationFrame(loop);
    };
    
    animationFrameRef.current = requestAnimationFrame(loop);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);
  
  // Input handler
  const handleInput = React.useCallback((event) => {
    if (motorRef.current) {
      return motorRef.current.handleInput(event);
    }
  }, []);
  
  return {
    motor: motorRef.current,
    state,
    handleInput,
    injectGlyph: (glyph) => motorRef.current?.injectGlyph(glyph)
  };
}

/**
 * Helper: Set up event listeners that feed into motor
 */
export function attachInputListeners(motor, targetElement = document) {
  const handler = (event) => motor.handleInput(event);
  
  // Mouse events
  targetElement.addEventListener('mousemove', handler);
  targetElement.addEventListener('mousedown', handler);
  targetElement.addEventListener('mouseup', handler);
  targetElement.addEventListener('click', handler);
  targetElement.addEventListener('wheel', handler);
  
  // Keyboard events
  targetElement.addEventListener('keydown', handler);
  targetElement.addEventListener('keyup', handler);
  
  // Touch events
  targetElement.addEventListener('touchstart', handler);
  targetElement.addEventListener('touchmove', handler);
  targetElement.addEventListener('touchend', handler);
  
  // Return cleanup function
  return () => {
    targetElement.removeEventListener('mousemove', handler);
    targetElement.removeEventListener('mousedown', handler);
    targetElement.removeEventListener('mouseup', handler);
    targetElement.removeEventListener('click', handler);
    targetElement.removeEventListener('wheel', handler);
    targetElement.removeEventListener('keydown', handler);
    targetElement.removeEventListener('keyup', handler);
    targetElement.removeEventListener('touchstart', handler);
    targetElement.removeEventListener('touchmove', handler);
    targetElement.removeEventListener('touchend', handler);
  };
}
