/**
 * hexOS KERNEL v0.4 - AUTONOMOUS FIELD CYCLING
 * 18-sector field with memory + language + autonomous cycling
 * 
 * © Marcel Mulder (52%), Ellen Bos (24%), Paola dal Bianco (24%)
 * LICENTIES: https://github.com/EllenBosMarcelMulder section licences
 * 
 * AUTONOMOUS CYCLING RULES:
 * - Internal pulse triggers autonomous memory resonance
 * - Self-correcting thermodynamic loops
 * - Stability controls to prevent browser crashes
 * - Cycle only when memory active and system stable
 */

class hexOS_Kernel {
    constructor() {
        // LIVE FIELD STATE
        this.rho = new Float32Array(18).fill(1/18);
        this.phi = new Float32Array(18).fill(0).map((_, i) => i * Math.PI/9);
        this._evolution_count = 0;
        
        // MEMORY FIELD STATE
        this.memory = {
            active: false,
            rho: new Float32Array(18),
            phi: new Float32Array(18)
        };
        
        // LANGUAGE FIELD STATE
        this.language = {
            active: false,
            semantic_field: new Float32Array(18).fill(0),
            active_patterns: new Map(),
            pattern_memory: [],
            syntax_stress: 0,
            coherence_threshold: 0.3,
            recent_ascii: [],
            max_sequence_length: 16,
            spiral_text_active: false
        };
        
        // AUTONOMOUS CYCLING STATE (NEW)
        this.cycling = {
            active: false,
            pulse_interval: 1000,      // Milliseconds between pulses
            last_pulse: 0,             // Last pulse timestamp  
            pulse_intensity: 0.03,     // Resonance strength per pulse (reduced)
            stability_check: true,     // Enable stability monitoring
            max_stress_threshold: 0.7, // Emergency brake threshold (reduced)
            energy_floor: 0.01,        // Minimum energy to continue cycling
            pulse_count: 0             // Total pulses executed
        };
        
        // HEXAGONAL CORRECTION
        this.hexCorrection = new HexagonalCorrection();
        
        // OBSERVABLES
        this._stress = 0;
        this._integrity = 1;
        this._coherence = 0;
        this._stability = 1.0;  // NEW: System stability metric
        this._prev_rho = null;  // For change rate calculation
    }

    // CORE EVOLUTION with cycling integration
    evolve() {
        // 1. Stability check (prevent crashes)
        if (this.cycling.stability_check) {
            this.checkSystemStability();
        }

        // 2. Local diffusion
        const next_rho = new Float32Array(18);
        for (let i = 0; i < 18; i++) {
            const prev = this.rho[(i - 1 + 18) % 18];
            const curr = this.rho[i];
            const next = this.rho[(i + 1) % 18];
            
            const diffusion = (prev + next - 2 * curr) * 0.05;
            next_rho[i] = curr + diffusion;
        }
        this.rho.set(next_rho);

        // 3. Phase evolution  
        for (let i = 0; i < 18; i++) {
            this.phi[i] += 0.02 + this.rho[i] * 0.1;
        }

        // 4. Conservation
        this.normalize();

        // 5. Autonomous cycling (if active)
        if (this.cycling.active) {
            this.processCycle();
        }

        // 6. Memory interference (if memory active)
        if (this.memory.active) {
            this.calculateInterference();
        }

        // 7. Language pattern detection (if language active)
        if (this.language.active) {
            this.detectLanguagePatterns();
            this.updateSemanticField();
        }

        // 8. Update observables
        this.observe();
        
        this._evolution_count++;
    }

    // AUTONOMOUS CYCLING PROCESSOR
    processCycle() {
        if (!this.memory.active) {
            this.stopCycle();
            return;
        }

        const now = performance.now();
        const timeSinceLastPulse = now - this.cycling.last_pulse;
        
        // Check if it's time for next pulse
        if (timeSinceLastPulse >= this.cycling.pulse_interval) {
            this.executePulse(now);
        }

        // Adaptive pulse interval based on system state
        this.adaptPulseInterval();
    }

    executePulse(timestamp) {
        // Safety checks
        if (this._stress > this.cycling.max_stress_threshold) {
            console.log('hexCYCLE: Emergency brake - high stress');
            this.stopCycle();
            return;
        }

        const totalEnergy = this.rho.reduce((sum, energy) => sum + energy, 0);
        if (totalEnergy < this.cycling.energy_floor) {
            console.log('hexCYCLE: Energy too low - stopping');
            this.stopCycle();
            return;
        }

        // Execute autonomous resonance
        this.autonomousResonance();
        
        // Energy injection to maintain cycle
        this.injectCycleEnergy();
        
        this.cycling.last_pulse = timestamp;
        this.cycling.pulse_count++;
        
        // Log pulse for debugging (less frequently)
        if (this.cycling.pulse_count % 10 === 0) {
            console.log(`hexCYCLE: Pulse ${this.cycling.pulse_count} | Stress: ${this._stress.toFixed(3)} | Stability: ${this._stability.toFixed(3)}`);
        }
    }

    autonomousResonance() {
        if (!this.memory.active) return;

        let totalDiff = 0;
        const resonanceStrength = this.cycling.pulse_intensity * this._stability;

        for (let i = 0; i < 18; i++) {
            // Energy interference (more gentle than manual resonance)
            const dE = this.memory.rho[i] - this.rho[i];
            this.rho[i] += dE * resonanceStrength;

            // Phase interference
            let dPhi = this.memory.phi[i] - this.phi[i];
            if (dPhi > Math.PI) dPhi -= Math.PI * 2;
            if (dPhi < -Math.PI) dPhi += Math.PI * 2;
            this.phi[i] += dPhi * resonanceStrength;

            totalDiff += Math.abs(dE) + Math.abs(dPhi);
        }

        // Controlled stress increase (reduced)
        this._stress = Math.min(0.8, this._stress + (totalDiff * 0.01));
        this._integrity *= (1.0 - (totalDiff * 0.005));
        
        this.normalize();
    }

    injectCycleEnergy() {
        // Small energy injection to maintain the cycle
        const energyBoost = 0.005 * this._stability; // Reduced from 0.01
        
        for (let i = 0; i < 18; i++) {
            if (this.rho[i] < 1/18) { // Boost low-energy sectors
                this.rho[i] += energyBoost;
            }
        }
        
        // Slight integrity boost to prevent decay
        this._integrity += 0.005 * this._stability; // Reduced from 0.01
        this._integrity = Math.min(1.0, this._integrity);
    }

    adaptPulseInterval() {
        // Faster pulses when stable, slower when stressed
        const baseInterval = 800; // Reduced from 1000ms
        const stressFactor = 1 + this._stress; // 1.0 to 2.0
        const stabilityFactor = Math.max(0.1, this._stability); // Prevent division by zero
        
        this.cycling.pulse_interval = baseInterval * stressFactor / stabilityFactor;
        this.cycling.pulse_interval = Math.max(300, Math.min(3000, this.cycling.pulse_interval)); // Tighter bounds
    }

    checkSystemStability() {
        // Multiple stability metrics
        const metrics = {
            stress: 1.0 - Math.min(1.0, this._stress * 2),
            integrity: this._integrity,
            energy_distribution: this.calculateEnergyStability(),
            phase_coherence: this.calculatePhaseCoherence(),
            change_rate: this.calculateChangeRate()
        };

        // Weighted average
        this._stability = (
            metrics.stress * 0.3 +
            metrics.integrity * 0.2 +
            metrics.energy_distribution * 0.2 +
            metrics.phase_coherence * 0.15 +
            metrics.change_rate * 0.15
        );

        // Emergency brake if stability too low
        if (this._stability < 0.2 && this.cycling.active) { // Increased threshold from 0.1
            console.log('hexCYCLE: Emergency stop - system unstable');
            this.stopCycle();
        }
    }

    calculateEnergyStability() {
        // How well distributed is the energy?
        const mean = 1/18;
        let variance = 0;
        
        for (let i = 0; i < 18; i++) {
            variance += Math.pow(this.rho[i] - mean, 2);
        }
        
        variance /= 18;
        return Math.max(0, 1 - variance * 30); // Reduced scaling from 50
    }

    calculatePhaseCoherence() {
        // How coherent are the phases?
        let coherence = 0;
        
        for (let i = 0; i < 18; i++) {
            const expected = i * Math.PI / 9;
            const actual = this.phi[i] % (2 * Math.PI);
            let diff = Math.abs(expected - actual);
            if (diff > Math.PI) diff = 2 * Math.PI - diff; // Use smaller angle
            coherence += Math.cos(diff); // 1 for perfect alignment, -1 for opposite
        }
        
        return Math.max(0, (coherence + 18) / 36); // Normalize to 0-1
    }

    calculateChangeRate() {
        // How fast is the system changing?
        if (!this._prev_rho) {
            this._prev_rho = new Float32Array(this.rho);
            return 1.0;
        }
        
        let totalChange = 0;
        for (let i = 0; i < 18; i++) {
            totalChange += Math.abs(this.rho[i] - this._prev_rho[i]);
        }
        
        this._prev_rho.set(this.rho);
        
        // Stable if change is moderate (not too fast, not too slow)
        const optimalChangeRate = 0.005; // Reduced from 0.01
        const changeRate = totalChange;
        
        return Math.exp(-Math.pow(changeRate - optimalChangeRate, 2) * 200); // Tighter distribution
    }

    // CYCLE CONTROLS
    startCycle() {
        if (!this.memory.active) {
            console.log('hexCYCLE: Cannot start - no memory active');
            return false;
        }
        
        if (this._stress > this.cycling.max_stress_threshold) {
            console.log('hexCYCLE: Cannot start - system too stressed');
            return false;
        }

        this.cycling.active = true;
        this.cycling.last_pulse = performance.now();
        this.cycling.pulse_count = 0;
        console.log('hexCYCLE: Started autonomous cycling');
        return true;
    }

    stopCycle() {
        if (this.cycling.active) {
            this.cycling.active = false;
            console.log(`hexCYCLE: Stopped after ${this.cycling.pulse_count} pulses`);
        }
    }

    toggleCycle() {
        if (this.cycling.active) {
            this.stopCycle();
        } else {
            this.startCycle();
        }
    }

    // MEMORY OPERATIONS (from v0.2-v0.3)
    snapshot() {
        this.memory.rho.set(this.rho);
        this.memory.phi.set(this.phi);
        this.memory.active = true;
        this._integrity = 0.5;
        console.log('Memory snapshot captured');
    }

    clearMemory() {
        this.memory.active = false;
        this.stopCycle();
        console.log('Memory cleared');
    }

    resonate() {
        if (!this.memory.active) return;

        let totalDiff = 0;
        for (let i = 0; i < 18; i++) {
            const dE = this.memory.rho[i] - this.rho[i];
            this.rho[i] += dE * 0.05;

            let dPhi = this.memory.phi[i] - this.phi[i];
            if (dPhi > Math.PI) dPhi -= Math.PI * 2;
            if (dPhi < -Math.PI) dPhi += Math.PI * 2;
            this.phi[i] += dPhi * 0.05;

            totalDiff += Math.abs(dE) + Math.abs(dPhi);
        }

        this._stress = Math.min(1.0, this._stress + (totalDiff * 0.1));
        this._integrity *= (1.0 - (totalDiff * 0.02));
        this.normalize();
    }

    calculateInterference() {
        let interferenceLevel = 0;
        for (let i = 0; i < 18; i++) {
            const energyDiff = Math.abs(this.rho[i] - this.memory.rho[i]);
            const phaseDiff = Math.abs(this.phi[i] - this.memory.phi[i]);
            interferenceLevel += energyDiff + phaseDiff;
        }
        this._stress += interferenceLevel * 0.005; // Reduced from 0.01
    }

    // LANGUAGE OPERATIONS (simplified from v0.3 for stability)
    toggleLanguageMode() {
        this.language.active = !this.language.active;
        console.log(`Language mode: ${this.language.active ? 'ACTIVE' : 'INACTIVE'}`);
    }

    detectLanguagePatterns() {
        // Simplified pattern detection to reduce CPU load
        if (this.language.recent_ascii.length < 3) return;

        const sequence = this.language.recent_ascii
            .slice(-6) // Reduced from 8
            .map(entry => entry.char)
            .join('');

        // Only detect words for performance
        const wordPattern = this.detectWordPattern(sequence);
        if (wordPattern) {
            this.registerLanguagePattern(wordPattern);
        }
    }

    detectWordPattern(sequence) {
        const wordMatch = sequence.match(/[a-zA-Z]{3,}/);
        if (wordMatch) {
            return {
                type: 'word',
                sequence: wordMatch[0],
                coherence: Math.min(1.0, wordMatch[0].length / 8),
                hue: (wordMatch[0].charCodeAt(0) * 137) % 360,
                discovered_at: this._evolution_count
            };
        }
        return null;
    }

    registerLanguagePattern(pattern) {
        const patternId = `${pattern.type}_${this._evolution_count}`;
        this.language.active_patterns.set(patternId, pattern);

        if (this.language.active_patterns.size > 5) { // Reduced from 10
            const oldestKey = this.language.active_patterns.keys().next().value;
            this.language.active_patterns.delete(oldestKey);
        }

        this.amplifySemanticPattern(pattern);
    }

    amplifySemanticPattern(pattern) {
        const sequence = pattern.sequence;
        for (let i = 0; i < Math.min(sequence.length, 6); i++) { // Limited to 6 characters
            const charCode = sequence.charCodeAt(i);
            const sector = charCode % 18;
            
            this.language.semantic_field[sector] += pattern.coherence * 0.05; // Reduced from 0.1
            this.language.semantic_field[sector] = Math.min(1.0, this.language.semantic_field[sector]);
        }
    }

    updateSemanticField() {
        for (let i = 0; i < 18; i++) {
            this.language.semantic_field[i] *= 0.999; // Faster decay
        }
    }

    // STANDARD OPERATIONS
    normalize() {
        const sum = this.rho.reduce((a, b) => a + b, 0);
        if (sum > 1e-12) {
            for (let i = 0; i < 18; i++) {
                this.rho[i] /= sum;
            }
        } else {
            this.rho.fill(1/18);
        }
    }

    observe() {
        let energy = 0;
        for (let i = 0; i < 18; i++) {
            const dev = this.rho[i] - 1/18;
            energy += dev * dev;
        }
        
        let coherence = 0;
        for (let k = 1; k < 9; k++) {
            let real = 0, imag = 0;
            for (let i = 0; i < 18; i++) {
                const angle = k * i * Math.PI / 9;
                real += this.rho[i] * Math.cos(angle);
                imag += this.rho[i] * Math.sin(angle);
            }
            coherence += Math.sqrt(real*real + imag*imag);
        }
        
        const fieldStress = Math.sqrt(energy);
        this._coherence = coherence;
        this._stress = Math.max(fieldStress, this._stress);
        this._integrity = Math.max(0, 1 - this._stress * 10);
        this._stress *= 0.99; // Slightly faster stress decay
    }

    inject(vector, intensity = 0.1) {
        if (!vector || vector.length !== 18) return;
        
        for (let i = 0; i < 18; i++) {
            if (vector[i] > 0) {
                this.rho[i] += vector[i] * intensity;
            }
        }
        this.normalize();
    }

    injectASCII(charCode) {
        // Simplified ASCII injection for performance
        this.language.recent_ascii.push({
            char: String.fromCharCode(charCode),
            code: charCode,
            timestamp: performance.now(),
            field_state: Array.from(this.rho)
        });

        if (this.language.recent_ascii.length > 8) { // Reduced from 16
            this.language.recent_ascii.shift();
        }

        const correctedVector = this.hexCorrection.correctASCIIToHex(charCode);
        this.inject(correctedVector, 0.05);
    }

    injectSpatial(x, y, width, height) {
        const vector = new Float32Array(18).fill(0);
        
        const centerX = width / 2;
        const centerY = height / 2;
        const dx = x - centerX;
        const dy = y - centerY;
        const angle = Math.atan2(dy, dx);
        const normalizedAngle = (angle + Math.PI) / (2 * Math.PI);
        const sector = Math.floor(normalizedAngle * 18) % 18;
        
        vector[sector] = 1.0;
        this.inject(vector, 0.02);
    }

    reset(seed = 0) {
        this.rho.fill(1.0 / 18);
        for (let i = 0; i < 18; i++) {
            this.rho[i] += ((i + seed) % 18 - 18/2) * 0.0001;
        }
        this.normalize();
        this._evolution_count = 0;
        this._stress = 0;
        this._integrity = 1;
        this._coherence = 0;
        this._stability = 1.0;
        this._prev_rho = null;
        
        this.memory.active = false;
        this.stopCycle();
        this.language.active = false;
        this.language.active_patterns.clear();
        this.language.recent_ascii = [];
        this.language.semantic_field.fill(0);
        this.language.syntax_stress = 0;
    }

    getState() {
        return {
            rho: Array.from(this.rho),
            phi: Array.from(this.phi), 
            stress: this._stress,
            integrity: this._integrity,
            coherence: this._coherence,
            stability: this._stability,
            evolution_count: this._evolution_count,
            memory: {
                active: this.memory.active,
                rho: this.memory.active ? Array.from(this.memory.rho) : null,
                phi: this.memory.active ? Array.from(this.memory.phi) : null
            },
            language: {
                active: this.language.active,
                semantic_field: Array.from(this.language.semantic_field),
                active_patterns: Array.from(this.language.active_patterns.entries()),
                pattern_count: this.language.active_patterns.size
            },
            cycling: {
                active: this.cycling.active,
                pulse_interval: this.cycling.pulse_interval,
                pulse_count: this.cycling.pulse_count,
                time_to_next_pulse: this.cycling.active ? 
                    Math.max(0, this.cycling.pulse_interval - (performance.now() - this.cycling.last_pulse)) : 0
            }
        };
    }
}

// HEXAGONAL CORRECTION CLASS (unchanged from v0.3)
class HexagonalCorrection {
    constructor() {
        this.HEX_SCALE = Math.sqrt(3) / 2;
    }

    correctASCIIToHex(charCode) {
        const rectCoord = this.asciiToRectCoord(charCode);
        const hexCoord = this.rectToHexCoord(rectCoord);
        return this.hexCoordToFieldVector(hexCoord);
    }

    asciiToRectCoord(charCode) {
        return {
            x: (charCode % 16) - 8,
            y: Math.floor(charCode / 16) - 4
        };
    }

    rectToHexCoord(rectCoord) {
        const {x, y} = rectCoord;
        const hexX = x - (y * 0.5);
        const hexY = y * this.HEX_SCALE;
        return {x: hexX, y: hexY};
    }

    hexCoordToFieldVector(hexCoord) {
        const vector = new Float32Array(18).fill(0);
        const angle = Math.atan2(hexCoord.y, hexCoord.x);
        const normalizedAngle = (angle + Math.PI) / (2 * Math.PI);
        const centerSector = Math.floor(normalizedAngle * 18) % 18;
        
        vector[centerSector] = 0.6;
        vector[(centerSector + 1) % 18] = 0.2;
        vector[(centerSector - 1 + 18) % 18] = 0.2;
        
        return vector;
    }
}

// SINGLETON INSTANCE
window.hexOS = new hexOS_Kernel();
