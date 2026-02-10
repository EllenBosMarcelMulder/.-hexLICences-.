/**
 * hexOS PROJECTOR v0.4 - AUTONOMOUS CYCLE VISUALIZATION  
 * Live + Ghost + Language + Autonomous cycling visualization
 * 
 * © Marcel Mulder (52%), Ellen Bos (24%), Paola dal Bianco (24%)
 * LICENTIES: https://github.com/EllenBosMarcelMulder section licences
 * 
 * CYCLE VISUALIZATION:
 * - Live field: green/cyan (present reality)
 * - Ghost field: amber/gold (frozen memory)
 * - Autonomous cycle: pulsing indicators and rhythm visualization
 * - Stability monitoring: system health display
 * - Performance optimized to prevent crashes
 */

class hexOS_Projector {
    constructor(kernel) {
        this.kernel = kernel;
        this.canvas = null;
        this.ctx = null;
        this.audioContext = null;
        this.stressOscillator = null;
        this.cycleOscillator = null;
        this.setupCanvas();
        this.setupAudio();
        
        // FIXED SCALE PARAMETERS
        this.FIXED_RADIUS = 200;
        this.FIXED_ENERGY_SCALE = 1000;
        this.FIXED_MAX_STRESS = 1.0;
        
        // PERFORMANCE OPTIMIZATION
        this.frameSkip = 0;
        this.lowPerformanceMode = false;
    }

    setupCanvas() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        
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

    async setupAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Stress rumble oscillator
            this.stressOscillator = this.audioContext.createOscillator();
            this.stressGain = this.audioContext.createGain();
            
            this.stressOscillator.type = 'sawtooth';
            this.stressOscillator.frequency.setValueAtTime(40, this.audioContext.currentTime);
            this.stressGain.gain.setValueAtTime(0, this.audioContext.currentTime);
            
            this.stressOscillator.connect(this.stressGain);
            this.stressGain.connect(this.audioContext.destination);
            this.stressOscillator.start();

            // Cycle rhythm oscillator (NEW)
            this.cycleOscillator = this.audioContext.createOscillator();
            this.cycleGain = this.audioContext.createGain();
            
            this.cycleOscillator.type = 'sine';
            this.cycleOscillator.frequency.setValueAtTime(120, this.audioContext.currentTime);
            this.cycleGain.gain.setValueAtTime(0, this.audioContext.currentTime);
            
            this.cycleOscillator.connect(this.cycleGain);
            this.cycleGain.connect(this.audioContext.destination);
            this.cycleOscillator.start();
            
        } catch (e) {
            console.log('Audio context not available');
        }
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    // MAIN PROJECTION FUNCTION (optimized)
    project() {
        const state = this.kernel.getState();
        
        // Performance optimization: skip frames if system is stressed
        this.frameSkip++;
        if (state.stability < 0.5 && this.frameSkip % 2 !== 0) {
            return; // Skip every other frame when unstable
        }
        
        const w = this.canvas.width;
        const h = this.canvas.height;
        const cx = w / 2;
        const cy = h / 2;

        // Clear with fade
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'; // Slightly more opaque for performance
        this.ctx.fillRect(0, 0, w, h);

        // PROJECT CYCLE VISUALIZATION (if active)
        if (state.cycling.active) {
            this.projectCycleVisualization(state, cx, cy);
        }

        // PROJECT MEMORY GHOST (if active)
        if (state.memory.active) {
            this.projectGhost(state, cx, cy);
        }

        // PROJECT LIVE FIELD  
        this.projectLiveField(state, cx, cy);
        
        // PROJECT INTERFERENCE (if memory active)
        if (state.memory.active) {
            this.projectInterference(state, cx, cy);
        }

        // PROJECT LANGUAGE (simplified for performance)
        if (state.language.active && state.language.pattern_count > 0) {
            this.projectLanguagePatterns(state, cx, cy);
        }
        
        // PROJECT SYSTEM STATUS
        this.projectStatus(state);
        
        // UPDATE AUDIO
        this.updateAudio(state);
    }

    // AUTONOMOUS CYCLE VISUALIZATION (NEW)
    projectCycleVisualization(state, cx, cy) {
        const now = performance.now();
        
        // Pulse indicator at center
        const pulsePhase = (now % state.cycling.pulse_interval) / state.cycling.pulse_interval;
        const pulseIntensity = Math.sin(pulsePhase * Math.PI * 2) * 0.5 + 0.5;
        
        // Central pulse indicator
        this.ctx.fillStyle = `rgba(255, 100, 100, ${pulseIntensity * 0.8})`;
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, 5 + pulseIntensity * 15, 0, Math.PI * 2);
        this.ctx.fill();

        // Cycle rhythm visualization (orbiting dots)
        const numDots = 8;
        for (let i = 0; i < numDots; i++) {
            const angle = (i / numDots) * Math.PI * 2 + (now * 0.001);
            const radius = 30 + Math.sin(now * 0.002 + i) * 10;
            
            const x = cx + Math.cos(angle) * radius;
            const y = cy + Math.sin(angle) * radius;
            
            const dotIntensity = (pulseIntensity + i / numDots) % 1;
            this.ctx.fillStyle = `rgba(255, 200, 100, ${dotIntensity * 0.6})`;
            this.ctx.beginPath();
            this.ctx.arc(x, y, 2, 0, Math.PI * 2);
            this.ctx.fill();
        }

        // Cycle count display
        this.ctx.fillStyle = 'rgba(255, 100, 100, 0.8)';
        this.ctx.font = '12px monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`CYCLE ${state.cycling.pulse_count}`, cx, cy + 50);
    }

    // GHOST MEMORY VISUALIZATION (amber/gold)
    projectGhost(state, cx, cy) {
        if (!state.memory.active) return;

        this.ctx.beginPath();
        this.ctx.strokeStyle = `rgba(255, 180, 50, 0.5)`;
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([4, 4]);

        for (let i = 0; i < 18; i++) {
            const angle = state.memory.phi[i];
            const radius = this.FIXED_RADIUS + (state.memory.rho[i] * this.FIXED_ENERGY_SCALE);
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
        this.ctx.setLineDash([]);

        // Ghost energy concentrations (simplified)
        const equilibrium = 1/18;
        for (let i = 0; i < 18; i += 2) { // Skip every other for performance
            const energy = state.memory.rho[i];
            if (energy > equilibrium * 2) {
                const angle = state.memory.phi[i];
                const radius = this.FIXED_RADIUS + (energy * this.FIXED_ENERGY_SCALE);
                const x = cx + Math.cos(angle) * radius;
                const y = cy + Math.sin(angle) * radius;
                
                const size = 2 + energy * 30;
                this.ctx.fillStyle = `rgba(255, 180, 50, 0.4)`;
                this.ctx.fillRect(x - size/2, y - size/2, size, size);
            }
        }
    }

    // LIVE FIELD VISUALIZATION (green/cyan)
    projectLiveField(state, cx, cy) {
        this.ctx.beginPath();
        
        // Color based on stability as well as stress
        const stressNorm = Math.min(1.0, state.stress / this.FIXED_MAX_STRESS);
        const stabilityColor = Math.floor(255 * state.stability);
        
        this.ctx.strokeStyle = `rgba(0, ${stabilityColor}, ${Math.floor(200 + 55 * stressNorm)}, 0.8)`;
        this.ctx.lineWidth = 1 + state.stress * 3;

        for (let i = 0; i < 18; i++) {
            const angle = state.phi[i];
            const radius = this.FIXED_RADIUS + (state.rho[i] * this.FIXED_ENERGY_SCALE);
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

        // Live energy concentrations (optimized)
        const equilibrium = 1/18;
        for (let i = 0; i < 18; i += 2) { // Skip every other for performance
            const energy = state.rho[i];
            if (energy > equilibrium * 2) {
                const angle = state.phi[i];
                const radius = this.FIXED_RADIUS + (energy * this.FIXED_ENERGY_SCALE);
                const x = cx + Math.cos(angle) * radius;
                const y = cy + Math.sin(angle) * radius;
                
                const size = 3 + energy * 50;
                const opacity = Math.min(1, energy * 10);
                this.ctx.fillStyle = `rgba(0, ${stabilityColor}, 200, ${opacity})`;
                this.ctx.fillRect(x - size/2, y - size/2, size, size);
            }
        }
    }

    // INTERFERENCE VISUALIZATION (simplified)
    projectInterference(state, cx, cy) {
        if (!state.memory.active) return;

        this.ctx.strokeStyle = `rgba(255, 100, 255, ${state.stress * 0.4})`;
        this.ctx.lineWidth = 1;
        
        // Only draw every 3rd interference line for performance
        for (let i = 0; i < 18; i += 3) {
            const liveAngle = state.phi[i];
            const ghostAngle = state.memory.phi[i];
            const liveRadius = this.FIXED_RADIUS + (state.rho[i] * this.FIXED_ENERGY_SCALE);
            const ghostRadius = this.FIXED_RADIUS + (state.memory.rho[i] * this.FIXED_ENERGY_SCALE);
            
            const liveX = cx + Math.cos(liveAngle) * liveRadius;
            const liveY = cy + Math.sin(liveAngle) * liveRadius;
            const ghostX = cx + Math.cos(ghostAngle) * ghostRadius;
            const ghostY = cy + Math.sin(ghostAngle) * ghostRadius;
            
            const distance = Math.sqrt((liveX - ghostX) ** 2 + (liveY - ghostY) ** 2);
            if (distance > 20) { // Increased threshold
                this.ctx.beginPath();
                this.ctx.moveTo(liveX, liveY);
                this.ctx.lineTo(ghostX, ghostY);
                this.ctx.stroke();
            }
        }
    }

    // LANGUAGE VISUALIZATION (simplified for performance)
    projectLanguagePatterns(state, cx, cy) {
        if (this.frameSkip % 3 !== 0) return; // Only draw every 3rd frame
        
        const now = performance.now();
        
        // Only draw first 3 patterns for performance
        let patternCount = 0;
        for (let [patternId, pattern] of state.language.active_patterns) {
            if (patternCount >= 3) break;
            
            this.renderSimpleLanguagePattern(pattern, cx, cy, now);
            patternCount++;
        }
    }

    renderSimpleLanguagePattern(pattern, cx, cy, now) {
        const text = pattern.sequence.substring(0, 6); // Limit text length
        const ageInMs = now - (pattern.discovered_at * 16);
        const fadeOut = Math.max(0, 1 - (ageInMs / 8000)); // Faster fade
        
        if (fadeOut <= 0) return;

        // Simplified spiral
        const baseRadius = 60 + patternCount * 20;
        const angle = (now * 0.001) % (Math.PI * 2);
        
        const x = cx + Math.cos(angle) * baseRadius;
        const y = cy + Math.sin(angle) * baseRadius;
        
        this.ctx.fillStyle = `hsla(${pattern.hue || 120}, 70%, 50%, ${fadeOut * 0.7})`;
        this.ctx.font = '14px monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(text, x, y);
    }

    projectStatus(state) {
        this.ctx.font = '12px monospace';
        this.ctx.fillStyle = `rgba(0, 255, 0, 0.8)`;
        this.ctx.textAlign = 'left';
        
        const info = [
            `STRESS: ${state.stress.toFixed(3)}`,
            `STABILITY: ${state.stability.toFixed(3)}`,
            `INTEGRITY: ${state.integrity.toFixed(3)}`,
            `EVOLUTION: ${state.evolution_count}`,
            `MEMORY: ${state.memory.active ? 'ACTIVE' : 'INACTIVE'}`,
            `LANGUAGE: ${state.language.active ? `ACTIVE (${state.language.pattern_count})` : 'INACTIVE'}`,
            `CYCLING: ${state.cycling.active ? `ACTIVE (${state.cycling.pulse_count})` : 'INACTIVE'}`
        ];
        
        for (let i = 0; i < info.length; i++) {
            this.ctx.fillText(info[i], 20, 30 + i * 15);
        }

        // Control hints
        this.ctx.textAlign = 'left';
        if (state.cycling.active) {
            this.ctx.fillStyle = 'rgba(255, 100, 100, 0.9)';
            this.ctx.fillText('Y: STOP CYCLE | C: CLEAR MEMORY', 20, 30 + info.length * 15 + 10);
            
            // Next pulse countdown
            const timeToNextPulse = state.cycling.time_to_next_pulse;
            this.ctx.fillText(`NEXT PULSE: ${(timeToNextPulse / 1000).toFixed(1)}s`, 20, 30 + info.length * 15 + 25);
        } else if (state.memory.active) {
            this.ctx.fillStyle = 'rgba(255, 180, 50, 0.9)';
            this.ctx.fillText('Y: START CYCLE | R: RESONATE | C: CLEAR', 20, 30 + info.length * 15 + 10);
        } else {
            this.ctx.fillStyle = 'rgba(100, 100, 100, 0.7)';
            this.ctx.fillText('S: SNAPSHOT | L: LANGUAGE', 20, 30 + info.length * 15 + 10);
        }

        // Stability warning
        if (state.stability < 0.3) {
            this.ctx.fillStyle = 'rgba(255, 0, 0, 0.9)';
            this.ctx.font = '14px monospace';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('SYSTEM UNSTABLE', this.canvas.width / 2, 50);
        }
    }

    // AUDIO FEEDBACK (stress + cycle rhythm)
    updateAudio(state) {
        if (!this.stressGain || !this.cycleGain) return;

        try {
            const now = this.audioContext.currentTime;
            
            // Stress rumble (existing)
            const stressVolume = Math.max(0.02, state.stress * 0.2); // Reduced volume
            this.stressGain.gain.setTargetAtTime(stressVolume, now, 0.1);
            
            // Cycle rhythm (NEW)
            if (state.cycling.active) {
                const cycleVolume = 0.1 * state.stability; // Volume based on stability
                const cycleFreq = 120 + (state.stress * 80); // Frequency based on stress
                
                this.cycleGain.gain.setTargetAtTime(cycleVolume, now, 0.1);
                this.cycleOscillator.frequency.setTargetAtTime(cycleFreq, now, 0.1);
            } else {
                this.cycleGain.gain.setTargetAtTime(0, now, 0.1);
            }

            // Memory interference frequency modulation
            if (state.memory.active) {
                const baseFreq = 40;
                const modulationFreq = baseFreq + (state.stress * 15); // Reduced modulation
                this.stressOscillator.frequency.setTargetAtTime(modulationFreq, now, 0.1);
            }
            
        } catch (e) {
            // Audio context issues - fail silently
        }
    }
}

// INITIALIZE PROJECTOR
window.hexOS_projector = new hexOS_Projector(window.hexOS);
