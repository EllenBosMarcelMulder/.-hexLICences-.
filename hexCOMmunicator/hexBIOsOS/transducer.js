/**
 * hexOS TRANSDUCER v0.1 - CANONICAL
 * Unified input → field injection
 * 
 * © Marcel Mulder (52%), Ellen Bos (24%), Paola dal Bianco (24%)
 * LICENTIES: https://github.com/EllenBosMarcelMulder section licences
 * 
 * CANONICAL RULES (ENFORCED):
 * - NO normalization
 * - NO smoothing  
 * - NO thresholds
 * - NO memory/caching
 * - NO corrections
 * - ONLY: input → vector → kernel.inject()
 */

class hexOS_Transducer {
    constructor(kernel) {
        this.kernel = kernel;
        this.setupInputCapture();
    }

    setupInputCapture() {
        // KEYBOARD: ASCII → field injection (PURE MAPPING)
        document.addEventListener('keydown', (e) => {
            if (e.repeat) return;  // No key repeat
            this.kernel.injectASCII(e.key.charCodeAt(0));
            e.preventDefault();
        });

        // MOUSE: position → spatial injection (PURE MAPPING)
        document.addEventListener('mousemove', (e) => {
            this.kernel.injectSpatial(
                e.clientX, 
                e.clientY, 
                window.innerWidth, 
                window.innerHeight
            );
        });

        // CLICK: impulse injection (DETERMINISTIC)
        document.addEventListener('click', (e) => {
            const vector = new Float32Array(18).fill(0);
            // Deterministic sector selection based on coordinates
            const sector = ((e.clientX + e.clientY) * 7) % 18;  // Deterministic, no random
            vector[sector] = 1.0;
            this.kernel.inject(vector, 0.2);
            e.preventDefault();
        });

        // TOUCH: same as mouse for mobile (PURE MAPPING)
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

        // TOUCH START: impulse (DETERMINISTIC)
        document.addEventListener('touchstart', (e) => {
            const vector = new Float32Array(18).fill(0);
            const touch = e.touches[0];
            const sector = ((touch.clientX + touch.clientY) * 7) % 18;  // Deterministic
            vector[sector] = 1.0;
            this.kernel.inject(vector, 0.3);
            e.preventDefault();
        }, { passive: false });

        // RESIZE: system reorganization (DETERMINISTIC)
        window.addEventListener('resize', () => {
            const vector = new Float32Array(18).fill(0.1);  // Uniform disturbance
            this.kernel.inject(vector, 0.1);
        });

        // FOCUS/BLUR: NO DIRECT KERNEL MANIPULATION
        window.addEventListener('focus', () => {
            // Focus creates beneficial field condition - inject positive energy
            const vector = new Float32Array(18).fill(0.01);
            this.kernel.inject(vector, 0.05);
        });

        window.addEventListener('blur', () => {
            // Blur creates field entropy - inject uniform disturbance
            const vector = new Float32Array(18).fill(0.02);
            this.kernel.inject(vector, 0.03);
        });
    }

    // NETWORK INPUT (CANONICAL MAPPING ONLY)
    injectNetwork(data) {
        if (typeof data === 'string') {
            // String data → ASCII sequence (NO PROCESSING)
            for (let i = 0; i < data.length; i++) {
                this.kernel.injectASCII(data.charCodeAt(i));
            }
        } else if (data instanceof ArrayBuffer) {
            // Binary data → direct injection (NO INTERPRETATION)
            const bytes = new Uint8Array(data);
            const vector = new Float32Array(18).fill(0);
            
            for (let i = 0; i < bytes.length && i < 18; i++) {
                vector[i] = bytes[i] / 255.0;  // Linear mapping only
            }
            
            this.kernel.inject(vector, 0.1);
        }
    }

    // CAMERA INPUT (PURE LUMINANCE MAPPING)
    async initCamera() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { width: 320, height: 240, frameRate: 15 } 
            });
            
            const video = document.createElement('video');
            video.srcObject = stream;
            video.play();
            
            const canvas = document.createElement('canvas');
            canvas.width = 6;
            canvas.height = 3;
            const ctx = canvas.getContext('2d');
            
            const processFrame = () => {
                ctx.drawImage(video, 0, 0, 6, 3);
                const imageData = ctx.getImageData(0, 0, 6, 3);
                const pixels = imageData.data;
                
                const vector = new Float32Array(18).fill(0);
                for (let i = 0; i < 18; i++) {
                    const r = pixels[i * 4];
                    const g = pixels[i * 4 + 1]; 
                    const b = pixels[i * 4 + 2];
                    // LINEAR MAPPING ONLY - no thresholding
                    const luminance = (r + g + b) / (3 * 255);
                    vector[i] = luminance;
                }
                
                // ALWAYS inject - no thresholding, no conditionals
                this.kernel.inject(vector, 0.02);
                
                requestAnimationFrame(processFrame);
            };
            
            video.addEventListener('loadedmetadata', () => {
                requestAnimationFrame(processFrame);
            });
            
        } catch (e) {
            console.log('Camera not available');
        }
    }

    // MICROPHONE INPUT (PURE FREQUENCY MAPPING)
    async initMicrophone() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const audioContext = new AudioContext();
            const source = audioContext.createMediaStreamSource(stream);
            const analyzer = audioContext.createAnalyser();
            
            analyzer.fftSize = 64;  // 32 frequency bins
            source.connect(analyzer);
            
            const freqData = new Uint8Array(32);
            
            const processAudio = () => {
                analyzer.getByteFrequencyData(freqData);
                
                const vector = new Float32Array(18).fill(0);
                for (let i = 0; i < 18; i++) {
                    // LINEAR MAPPING ONLY - no thresholding
                    vector[i] = freqData[i] / 255.0;
                }
                
                // ALWAYS inject - no conditionals
                this.kernel.inject(vector, 0.01);
                
                requestAnimationFrame(processAudio);
            };
            
            requestAnimationFrame(processAudio);
            
        } catch (e) {
            console.log('Microphone not available');
        }
    }
}

// CANONICAL TRANSDUCTION FUNCTION (pure mapping)
function transduce(kernel) {
    const state = kernel.getState();
    return {
        // EXACT DATA - no processing
        rho: state.rho.slice(),           // exact copy
        phi: state.phi.slice(),           // exact copy  
        stress: state.stress,             // exact value
        integrity: state.integrity,       // exact value
        coherence: state.coherence,       // exact value
        time: state.time                  // exact value
    };
}

// INITIALIZE TRANSDUCER (connects to global kernel)
window.hexOS_transducer = new hexOS_Transducer(window.hexOS);
