/**
 * hexOS KERNEL v0.1 - BIOS PURE
 * 18-sector field physics - canonical BIOS implementation
 * 
 * © Marcel Mulder (52%), Ellen Bos (24%), Paola dal Bianco (24%)
 * LICENTIES: https://github.com/EllenBosMarcelMulder section licences
 * 
 * BIOS RULES (ENFORCED):
 * - NO discrete time stepping
 * - NO normative integrity manipulation  
 * - NO policy decisions
 * - ONLY: ρ[18], φ[18], normalize(), evolve(), observe()
 */

class hexOS_Kernel {
    constructor() {
        // THE ONLY STATE
        this.rho = new Float32Array(18).fill(1/18);  // Normalized energy distribution
        this.phi = new Float32Array(18).fill(0).map((_, i) => i * Math.PI/9);  // Phase
        this._evolution_count = 0;  // Observation index, NOT time
        
        // DERIVED OBSERVABLES (never stored, always computed)
        this._stress = 0;
        this._integrity = 1;
        this._coherence = 0;
    }

    // CORE OPERATION: Field evolution (pure physics only)
    evolve() {
        // 1. Local diffusion
        const next_rho = new Float32Array(18);
        for (let i = 0; i < 18; i++) {
            const prev = this.rho[(i - 1 + 18) % 18];
            const curr = this.rho[i];
            const next = this.rho[(i + 1) % 18];
            
            // Discrete Laplacian
            const diffusion = (prev + next - 2 * curr) * 0.05;
            next_rho[i] = curr + diffusion;
        }
        this.rho.set(next_rho);

        // 2. Phase evolution  
        for (let i = 0; i < 18; i++) {
            this.phi[i] += 0.02 + this.rho[i] * 0.1;
        }

        // 3. Conservation (replaces memory management)
        this.normalize();

        // 4. Update observables
        this.observe();
        
        this._evolution_count++;  // Observation index increment only
    }

    // CONSERVATION LAW (replaces all resource management)
    normalize() {
        const sum = this.rho.reduce((a, b) => a + b, 0);
        if (sum > 1e-12) {
            for (let i = 0; i < 18; i++) {
                this.rho[i] /= sum;
            }
        } else {
            // System death recovery
            this.rho.fill(1/18);
        }
    }

    // OBSERVABLES (replace all system monitoring)
    observe() {
        // Energy deviation from equilibrium
        let energy = 0;
        for (let i = 0; i < 18; i++) {
            const dev = this.rho[i] - 1/18;
            energy += dev * dev;
        }
        
        // Spectral analysis for coherence
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
        
        this._stress = Math.sqrt(energy);
        this._coherence = coherence;
        this._integrity = Math.max(0, 1 - this._stress * 10);
    }

    // INPUT INJECTION (pure field perturbation)
    inject(vector, intensity = 0.1) {
        if (!vector || vector.length !== 18) return;
        
        // Inject energy while maintaining conservation
        for (let i = 0; i < 18; i++) {
            if (vector[i] > 0) {
                this.rho[i] += vector[i] * intensity;
            }
        }
        
        // Normalize preserves total energy = 1
        this.normalize();
        
        // NO INTEGRITY MANIPULATION - let observe() derive it from stress
    }

    // CANONICAL RESET (deterministic)
    reset(seed = 0) {
        this.rho.fill(1.0 / 18);
        for (let i = 0; i < 18; i++) {
            this.rho[i] += ((i + seed) % 18 - 18/2) * 0.0001;
        }
        this.normalize();
        this.time = 0;
        this._stress = 0;
        this._integrity = 1;
        this._coherence = 0;
    }

    // ASCII INPUT (keyboard integration)
    injectASCII(charCode) {
        const vector = new Float32Array(18).fill(0);
        
        // Map ASCII bits to sectors
        for (let i = 0; i < 8; i++) {
            if ((charCode >> i) & 1) {
                const sector = (charCode + i * 3) % 18;
                vector[sector] = 1.0;
            }
        }
        
        this.inject(vector, 0.05);
    }

    // SPATIAL INPUT (mouse/touch integration)  
    injectSpatial(x, y, width, height) {
        const vector = new Float32Array(18).fill(0);
        
        // Convert screen coordinates to field coordinates
        const centerX = width / 2;
        const centerY = height / 2;
        const dx = x - centerX;
        const dy = y - centerY;
        const angle = Math.atan2(dy, dx);
        const normalizedAngle = (angle + Math.PI) / (2 * Math.PI); // 0 to 1
        const sector = Math.floor(normalizedAngle * 18) % 18;
        
        vector[sector] = 1.0;
        this.inject(vector, 0.02);
    }

    // STATE ACCESS (read-only)
    getState() {
        return {
            rho: Array.from(this.rho),
            phi: Array.from(this.phi), 
            stress: this._stress,
            integrity: this._integrity,
            coherence: this._coherence,
            evolution_count: this._evolution_count  // Observation index, not time
        };
    }
}

// SINGLETON INSTANCE (the only OS instance needed)
window.hexOS = new hexOS_Kernel();
