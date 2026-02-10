/**
 * hexOS TRANSDUCER v0.4 - AUTONOMOUS CYCLE CONTROLS
 * Input → field injection + memory + language + autonomous cycling
 * 
 * © Marcel Mulder (52%), Ellen Bos (24%), Paola dal Bianco (24%)
 * LICENTIES: https://github.com/EllenBosMarcelMulder section licences
 * 
 * AUTONOMOUS CYCLE CONTROLS:
 * - Y: Toggle autonomous cycle (start/stop self-resonance)
 * - L: Toggle language mode
 * - S: Snapshot (memory)
 * - R: Manual resonate
 * - C: Clear memory
 */

class hexOS_Transducer {
    constructor(kernel) {
        this.kernel = kernel;
        this.activeResonance = false;
        this.setupInputCapture();
    }

    setupInputCapture() {
        // KEYBOARD: Cycle + language + memory controls + ASCII field injection
        document.addEventListener('keydown', (e) => {
            if (e.repeat) {
                // Hold R: Continuous manual resonance
                if (e.key.toLowerCase() === 'r') {
                    this.kernel.resonate();
                }
                return;
            }

            const k = e.key.toLowerCase();

            // CYCLE CONTROL (highest priority)
            if (k === 'y') { 
                this.kernel.toggleCycle(); 
                e.preventDefault();
                return; 
            }

            // LANGUAGE COMMANDS
            if (k === 'l') { 
                this.kernel.toggleLanguageMode(); 
                e.preventDefault();
                return; 
            }

            // MEMORY COMMANDS
            if (k === 's') { 
                this.kernel.snapshot(); 
                e.preventDefault();
                return; 
            }
            if (k === 'c') { 
                this.kernel.clearMemory(); 
                e.preventDefault();
                return; 
            }
            if (k === 'r') { 
                this.kernel.resonate(); 
                e.preventDefault();
                return; 
            }

            // ASCII INJECTION (hexagonal corrected)
            this.kernel.injectASCII(e.key.charCodeAt(0));
            e.preventDefault();
        });

        document.addEventListener('keyup', (e) => {
            // Stop continuous manual resonance
            if (e.key.toLowerCase() === 'r') {
                this.activeResonance = false;
            }
        });

        // MOUSE: position → spatial injection
        document.addEventListener('mousemove', (e) => {
            this.kernel.injectSpatial(
                e.clientX, 
                e.clientY, 
                window.innerWidth, 
                window.innerHeight
            );
        });

        // CLICK: impulse injection
        document.addEventListener('click', (e) => {
            const vector = new Float32Array(18).fill(0);
            const sector = ((e.clientX + e.clientY) * 7) % 18;
            vector[sector] = 1.0;
            this.kernel.inject(vector, 0.2);
            e.preventDefault();
        });

        // TOUCH: same as mouse for mobile
        document.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                const touch = e.touches[0];
                this.kernel.injectSpatial(
                    touch.clientX,
                    touch.clientY,
                    window.innerWidth,
                    window.innerHeight
                );
            }
            e.preventDefault();
        }, { passive: false });

        // TOUCH START: impulse
        document.addEventListener('touchstart', (e) => {
            const vector = new Float32Array(18).fill(0);
            const touch = e.touches[0];
            const sector = ((touch.clientX + touch.clientY) * 7) % 18;
            vector[sector] = 1.0;
            this.kernel.inject(vector, 0.3);
            e.preventDefault();
        }, { passive: false });

        // RESIZE: system reorganization
        window.addEventListener('resize', () => {
            const vector = new Float32Array(18).fill(0.1);
            this.kernel.inject(vector, 0.1);
        });

        // FOCUS/BLUR: system attention
        window.addEventListener('focus', () => {
            const vector = new Float32Array(18).fill(0.01);
            this.kernel.inject(vector, 0.05);
        });

        window.addEventListener('blur', () => {
            const vector = new Float32Array(18).fill(0.02);
            this.kernel.inject(vector, 0.03);
        });
    }

    // NETWORK INPUT
    injectNetwork(data) {
        if (typeof data === 'string') {
            for (let i = 0; i < data.length; i++) {
                this.kernel.injectASCII(data.charCodeAt(i));
                // Small delay to allow pattern detection
                setTimeout(() => {}, i * 10);
            }
        } else if (data instanceof ArrayBuffer) {
            const bytes = new Uint8Array(data);
            const vector = new Float32Array(18).fill(0);
            
            for (let i = 0; i < bytes.length && i < 18; i++) {
                vector[i] = bytes[i] / 255.0;
            }
            
            this.kernel.inject(vector, 0.1);
        }
    }

    // CAMERA INPUT (reduced for performance)
    async initCamera() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { width: 160, height: 120, frameRate: 10 } // Reduced resolution and framerate
            });
            
            const video = document.createElement('video');
            video.srcObject = stream;
            video.play();
            
            const canvas = document.createElement('canvas');
            canvas.width = 6;
            canvas.height = 3;
            const ctx = canvas.getContext('2d');
            
            let frameSkip = 0;
            const processFrame = () => {
                frameSkip++;
                if (frameSkip % 3 === 0) { // Process every 3rd frame
                    ctx.drawImage(video, 0, 0, 6, 3);
                    const imageData = ctx.getImageData(0, 0, 6, 3);
                    const pixels = imageData.data;
                    
                    const vector = new Float32Array(18).fill(0);
                    for (let i = 0; i < 18; i++) {
                        const r = pixels[i * 4];
                        const g = pixels[i * 4 + 1]; 
                        const b = pixels[i * 4 + 2];
                        const luminance = (r + g + b) / (3 * 255);
                        vector[i] = luminance;
                    }
                    
                    this.kernel.inject(vector, 0.01); // Reduced intensity
                }
                
                requestAnimationFrame(processFrame);
            };
            
            video.addEventListener('loadedmetadata', () => {
                requestAnimationFrame(processFrame);
            });
            
        } catch (e) {
            console.log('Camera not available');
        }
    }

    // MICROPHONE INPUT (reduced for performance)
    async initMicrophone() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const audioContext = new AudioContext();
            const source = audioContext.createMediaStreamSource(stream);
            const analyzer = audioContext.createAnalyser();
            
            analyzer.fftSize = 32;  // Reduced from 64
            source.connect(analyzer);
            
            const freqData = new Uint8Array(16);
            
            let frameSkip = 0;
            const processAudio = () => {
                frameSkip++;
                if (frameSkip % 2 === 0) { // Process every 2nd frame
                    analyzer.getByteFrequencyData(freqData);
                    
                    const vector = new Float32Array(18).fill(0);
                    for (let i = 0; i < 16; i++) {
                        vector[i] = freqData[i] / 255.0;
                    }
                    
                    this.kernel.inject(vector, 0.005); // Reduced intensity
                }
                
                requestAnimationFrame(processAudio);
            };
            
            requestAnimationFrame(processAudio);
            
        } catch (e) {
            console.log('Microphone not available');
        }
    }

    // CYCLE PATTERN INJECTION
    injectCyclePattern(pattern) {
        const vector = new Float32Array(18).fill(0);
        
        for (let i = 0; i < pattern.length && i < 18; i++) {
            vector[i] = pattern[i];
        }
        
        this.kernel.inject(vector, 0.1);
    }

    // TEXT STREAMING INPUT
    streamText(text, intervalMs = 150) {
        for (let i = 0; i < text.length; i++) {
            setTimeout(() => {
                this.kernel.injectASCII(text.charCodeAt(i));
            }, i * intervalMs);
        }
    }
}

// CANONICAL TRANSDUCTION FUNCTION
function transduce(kernel) {
    const state = kernel.getState();
    return {
        rho: state.rho.slice(),
        phi: state.phi.slice(),  
        stress: state.stress,
        integrity: state.integrity,
        coherence: state.coherence,
        stability: state.stability,
        evolution_count: state.evolution_count,
        memory: state.memory,
        language: state.language,
        cycling: state.cycling
    };
}

// INITIALIZE TRANSDUCER
window.hexOS_transducer = new hexOS_Transducer(window.hexOS);
