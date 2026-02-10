/**
 * hexOS PROJECTOR v0.1 - BIOS PURE
 * Field state → visual projection
 * 
 * © Marcel Mulder (52%), Ellen Bos (24%), Paola dal Bianco (24%)
 * LICENTIES: https://github.com/EllenBosMarcelMulder section licences
 * 
 * BIOS RULES (ENFORCED):
 * - NO data modification
 * - NO data normalization  
 * - NO data autoscaling
 * - VISUAL scaling allowed for display
 * - FIXED scales and axes
 * - If data goes off-screen → that IS the signal
 */

class hexOS_Projector {
    constructor(kernel) {
        this.kernel = kernel;
        this.canvas = null;
        this.ctx = null;
        this.setupCanvas();
        
        // FIXED SCALE PARAMETERS (never change)
        this.FIXED_RADIUS = 200;        // Base radius - never rescale
        this.FIXED_ENERGY_SCALE = 1000; // Energy to pixel scale - never rescale
        this.FIXED_MAX_STRESS = 1.0;    // Maximum stress for color scale
    }

    setupCanvas() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Full screen canvas
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100vw';
        this.canvas.style.height = '100vh';
        this.canvas.style.background = '#000';
        this.canvas.style.cursor = 'none';
        this.canvas.style.zIndex = '1';
        
        document.body.appendChild(this.canvas);
        document.body.style.margin = '0';
        document.body.style.padding = '0';
        document.body.style.overflow = 'hidden';
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    // CANONICAL PROJECTION (no data modification)
    project() {
        // GET EXACT STATE - no processing
        const state = this.kernel.getState();
        const rho = state.rho;      // EXACT data as-delivered
        const phi = state.phi;      // EXACT data as-delivered
        const stress = state.stress;        // EXACT data as-delivered
        const integrity = state.integrity;  // EXACT data as-delivered
        
        const w = this.canvas.width;
        const h = this.canvas.height;
        const cx = w / 2;
        const cy = h / 2;

        // Clear with fade (persistent traces)
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        this.ctx.fillRect(0, 0, w, h);

        // FIXED-SCALE PROJECTIONS (no autoscaling)
        this.projectBoundary(rho, phi, stress, cx, cy);
        this.projectEnergy(rho, phi, cx, cy);
        this.projectStress(stress, cx, cy, state.evolution_count);
        this.projectStatus(state, rho);
    }

    projectBoundary(rho, phi, stress, cx, cy) {
        this.ctx.beginPath();
        // FIXED stress color mapping (no normalization)
        const stressNorm = Math.min(1.0, stress / this.FIXED_MAX_STRESS);
        this.ctx.strokeStyle = `rgba(${Math.floor(255 * stressNorm)}, ${Math.floor(255 * (1-stressNorm))}, 100, 0.8)`;
        this.ctx.lineWidth = 1 + stress * 3;

        // Draw 18-sector boundary - EXACT COORDINATES
        for (let i = 0; i < 18; i++) {
            const angle = phi[i];  // EXACT angle as-delivered
            // FIXED radius scaling (no auto-adjustment)
            const radius = this.FIXED_RADIUS + (rho[i] * this.FIXED_ENERGY_SCALE);
            const x = cx + Math.cos(angle) * radius;
            const y = cy + Math.sin(angle) * radius;
            
            if (i === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }
        
        this.ctx.closePath();
        this.ctx.stroke();
    }

    projectEnergy(rho, phi, cx, cy) {
        const equilibrium = 1/18;  // FIXED equilibrium reference
        
        // Draw energy concentrations - EXACT VALUES
        for (let i = 0; i < 18; i++) {
            const angle = phi[i];           // EXACT as-delivered
            const energy = rho[i];          // EXACT as-delivered
            
            // FIXED threshold (no dynamic adjustment)
            if (energy > equilibrium * 2) {
                const radius = this.FIXED_RADIUS + (energy * this.FIXED_ENERGY_SCALE);
                const x = cx + Math.cos(angle) * radius;
                const y = cy + Math.sin(angle) * radius;
                
                // FIXED size calculation (no smoothing)
                const size = 3 + energy * 50;
                const opacity = Math.min(1, energy * 10);
                
                this.ctx.fillStyle = `rgba(255, 255, 0, ${opacity})`;
                this.ctx.fillRect(x - size/2, y - size/2, size, size);
            }
        }
    }

    projectStress(stress, cx, cy, evolution_count) {
        // FIXED stress threshold (no dynamic adjustment)
        if (stress > 0.1) {
            this.ctx.beginPath();
            this.ctx.strokeStyle = `rgba(255, 0, 0, ${Math.min(1.0, stress)})`;
            this.ctx.lineWidth = 1;
            
            const segments = 36;
            
            for (let i = 0; i < segments; i++) {
                const angle = (i / segments) * 2 * Math.PI;
                // FIXED distortion calculation (no normalization)
                const distortion = Math.sin(angle * 3 + evolution_count * 0.1) * stress * 20;
                const radius = this.FIXED_RADIUS * 1.5 + distortion;
                const x = cx + Math.cos(angle) * radius;
                const y = cy + Math.sin(angle) * radius;
                
                if (i === 0) {
                    this.ctx.moveTo(x, y);
                } else {
                    this.ctx.lineTo(x, y);
                }
            }
            
            this.ctx.closePath();
            this.ctx.stroke();
        }
    }

    projectStatus(state, rho) {
        // EXACT VALUES - no formatting/rounding
        this.ctx.font = '12px monospace';
        this.ctx.fillStyle = `rgba(0, 255, 0, 0.7)`;
        this.ctx.textAlign = 'left';
        
        // Display EXACT computed values
        const info = [
            `STRESS: ${state.stress}`,                    // EXACT value
            `INTEGRITY: ${state.integrity}`,              // EXACT value  
            `COHERENCE: ${state.coherence}`,              // EXACT value
            `EVOLUTION: ${state.evolution_count}`,        // Observation index
            `SUM: ${rho.reduce((a,b) => a+b, 0)}`        // Conservation check
        ];
        
        for (let i = 0; i < info.length; i++) {
            this.ctx.fillText(info[i], 20, 30 + i * 15);
        }

        // Energy distribution - EXACT VALUES
        this.ctx.textAlign = 'right';
        const maxEnergy = Math.max(...rho);     // EXACT maximum
        const maxSector = rho.indexOf(maxEnergy);
        this.ctx.fillText(`MAX: S${maxSector} (${maxEnergy})`, this.canvas.width - 20, 30);
        
        // Minimum energy - EXACT VALUE
        const minEnergy = Math.min(...rho);     // EXACT minimum
        const minSector = rho.indexOf(minEnergy);
        this.ctx.fillText(`MIN: S${minSector} (${minEnergy})`, this.canvas.width - 20, 50);
    }

    // CANONICAL WARNING: Display when data goes off-screen
    projectOverflow(state) {
        const maxRadius = this.FIXED_RADIUS + Math.max(...state.rho) * this.FIXED_ENERGY_SCALE;
        const screenRadius = Math.min(this.canvas.width, this.canvas.height) / 2;
        
        if (maxRadius > screenRadius) {
            this.ctx.font = '16px monospace';
            this.ctx.fillStyle = 'rgba(255, 255, 0, 0.9)';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('WARNING: FIELD OVERFLOW', this.canvas.width/2, 50);
            this.ctx.fillText('(This is the signal, not an error)', this.canvas.width/2, 70);
        }
    }
}

// CANONICAL PROJECTION FUNCTION (pure rendering)
function project_canonical(kernel_state) {
    // EXACT state extraction - no processing
    return {
        boundary_coords: kernel_state.rho.map((energy, i) => ({
            x: Math.cos(kernel_state.phi[i]) * (200 + energy * 1000),
            y: Math.sin(kernel_state.phi[i]) * (200 + energy * 1000),
            energy: energy,           // EXACT value
            sector: i                 // EXACT sector
        })),
        stress_level: kernel_state.stress,     // EXACT value
        integrity_level: kernel_state.integrity, // EXACT value
        time_step: kernel_state.time           // EXACT value
    };
}

// INITIALIZE PROJECTOR (connects to global kernel)
window.hexOS_projector = new hexOS_Projector(window.hexOS);
