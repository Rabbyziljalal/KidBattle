// ===== Fruit Recognition using TensorFlow.js =====
// Camera-based AI fruit detection

class FruitRecognition {
    constructor() {
        this.model = null;
        this.isModelLoaded = false;
        this.videoElement = null;
        this.canvasElement = null;
        this.isScanning = false;
        this.confidenceThreshold = 0.4;
        
        // Fruit name mapping for MobileNet classes
        this.fruitMapping = {
            'banana': 'Banana',
            'lemon': 'Lemon',
            'orange': 'Orange',
            'strawberry': 'Strawberry',
            'pineapple': 'Pineapple',
            'apple': 'Apple',
            'pomegranate': 'Pomegranate',
            'fig': 'Fig',
            'granny_smith': 'Apple',
            'custard_apple': 'Apple',
            'jackfruit': 'Jackfruit',
            'pear': 'Pear',
            'acorn': 'Acorn',
            'corn': 'Corn'
        };
        
        this.initializeElements();
        this.setupEventListeners();
    }

    initializeElements() {
        this.cameraContainer = document.getElementById('cameraRecognitionContainer');
        this.cameraBtn = document.getElementById('cameraRecognitionBtn');
        this.startCameraBtn = document.getElementById('startCameraBtn');
        this.stopCameraBtn = document.getElementById('stopCameraBtn');
        this.closeCameraBtn = document.getElementById('closeCameraBtn');
        this.videoElement = document.getElementById('cameraVideo');
        this.canvasElement = document.getElementById('cameraCanvas');
        this.resultDisplay = document.getElementById('recognitionResult');
        this.confidenceDisplay = document.getElementById('confidenceLevel');
        this.loadingStatus = document.getElementById('loadingStatus');
    }

    setupEventListeners() {
        if (this.cameraBtn) {
            this.cameraBtn.addEventListener('click', () => this.openCameraMode());
        }
        
        if (this.startCameraBtn) {
            this.startCameraBtn.addEventListener('click', () => this.startCamera());
        }
        
        if (this.stopCameraBtn) {
            this.stopCameraBtn.addEventListener('click', () => this.stopCamera());
        }
        
        if (this.closeCameraBtn) {
            this.closeCameraBtn.addEventListener('click', () => this.closeCameraMode());
        }
    }

    async openCameraMode() {
        this.cameraContainer.classList.add('active');
        
        // Load TensorFlow model if not already loaded
        if (!this.isModelLoaded) {
            await this.loadModel();
        }
    }

    closeCameraMode() {
        this.stopCamera();
        this.cameraContainer.classList.remove('active');
    }

    async loadModel() {
        try {
            this.loadingStatus.textContent = '🔄 Loading AI Model...';
            this.loadingStatus.style.display = 'block';
            
            // Load MobileNet model for image classification
            this.model = await mobilenet.load();
            
            this.isModelLoaded = true;
            this.loadingStatus.textContent = '✅ AI Model Loaded! Ready to scan.';
            this.loadingStatus.style.color = '#4caf50';
            
            setTimeout(() => {
                this.loadingStatus.style.display = 'none';
            }, 2000);
            
            console.log('TensorFlow.js MobileNet model loaded successfully');
        } catch (error) {
            console.error('Error loading model:', error);
            this.loadingStatus.textContent = '❌ Error loading AI model. Please refresh.';
            this.loadingStatus.style.color = '#f44336';
        }
    }

    async startCamera() {
        try {
            // Request camera access
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'environment', // Use back camera on mobile
                    width: { ideal: 640 },
                    height: { ideal: 480 }
                }
            });
            
            this.videoElement.srcObject = stream;
            this.videoElement.style.display = 'block';
            this.isScanning = true;
            
            // Wait for video to load
            this.videoElement.onloadedmetadata = () => {
                this.videoElement.play();
                this.startCameraBtn.style.display = 'none';
                this.stopCameraBtn.style.display = 'block';
                
                // Start continuous prediction
                this.predictLoop();
            };
            
        } catch (error) {
            console.error('Error accessing camera:', error);
            alert('Unable to access camera. Please ensure camera permissions are granted.');
        }
    }

    stopCamera() {
        this.isScanning = false;
        
        if (this.videoElement && this.videoElement.srcObject) {
            const tracks = this.videoElement.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            this.videoElement.srcObject = null;
            this.videoElement.style.display = 'none';
        }
        
        this.startCameraBtn.style.display = 'block';
        this.stopCameraBtn.style.display = 'none';
        this.resultDisplay.textContent = 'Point camera at a fruit';
        this.confidenceDisplay.textContent = '';
    }

    async predictLoop() {
        if (!this.isScanning || !this.isModelLoaded) return;
        
        try {
            // Classify the current video frame
            const predictions = await this.model.classify(this.videoElement);
            
            if (predictions && predictions.length > 0) {
                this.processPredictons(predictions);
            }
            
        } catch (error) {
            console.error('Prediction error:', error);
        }
        
        // Continue prediction loop
        if (this.isScanning) {
            requestAnimationFrame(() => this.predictLoop());
        }
    }

    processPredictons(predictions) {
        // Get the top prediction
        const topPrediction = predictions[0];
        const className = topPrediction.className.toLowerCase();
        const confidence = topPrediction.probability;
        
        // Check if it's a fruit we recognize
        let recognizedFruit = null;
        
        for (const [key, value] of Object.entries(this.fruitMapping)) {
            if (className.includes(key)) {
                recognizedFruit = value;
                break;
            }
        }
        
        if (recognizedFruit && confidence > this.confidenceThreshold) {
            // Found a fruit with good confidence
            this.resultDisplay.textContent = `🎯 ${recognizedFruit}`;
            this.resultDisplay.style.color = '#4caf50';
            this.resultDisplay.style.fontSize = '2.5em';
            
            const confidencePercent = Math.round(confidence * 100);
            this.confidenceDisplay.textContent = `Confidence: ${confidencePercent}%`;
            this.confidenceDisplay.style.color = '#666';
            
            // Speak the fruit name
            this.speakFruitName(recognizedFruit);
            
            // Add animation
            this.resultDisplay.style.animation = 'none';
            setTimeout(() => {
                this.resultDisplay.style.animation = 'bounce 0.5s ease';
            }, 10);
            
        } else {
            // Not a fruit or low confidence
            this.resultDisplay.textContent = 'Point camera at a fruit';
            this.resultDisplay.style.color = '#666';
            this.resultDisplay.style.fontSize = '1.5em';
            
            if (predictions.length > 0) {
                this.confidenceDisplay.textContent = `Scanning... (${predictions[0].className})`;
                this.confidenceDisplay.style.color = '#999';
            }
        }
    }

    speakFruitName(fruitName) {
        // Throttle speech to avoid repeating too quickly
        const now = Date.now();
        if (this.lastSpeechTime && (now - this.lastSpeechTime) < 3000) {
            return; // Wait 3 seconds between speeches
        }
        
        this.lastSpeechTime = now;
        
        const speech = window.speechSynthesis;
        if (speech.speaking) {
            speech.cancel();
        }
        
        const utterance = new SpeechSynthesisUtterance(fruitName);
        utterance.rate = 0.8;
        utterance.pitch = 1.1;
        utterance.volume = 1;
        
        speech.speak(utterance);
    }

    captureSnapshot() {
        if (!this.videoElement || !this.canvasElement) return;
        
        const context = this.canvasElement.getContext('2d');
        this.canvasElement.width = this.videoElement.videoWidth;
        this.canvasElement.height = this.videoElement.videoHeight;
        
        context.drawImage(this.videoElement, 0, 0);
    }
}

// Initialize Fruit Recognition
let fruitRecognitionApp;

// Wait for both TensorFlow.js and the DOM to be ready
function initializeFruitRecognition() {
    if (typeof mobilenet !== 'undefined' && document.getElementById('cameraRecognitionBtn')) {
        fruitRecognitionApp = new FruitRecognition();
    } else {
        // Retry after a short delay
        setTimeout(initializeFruitRecognition, 500);
    }
}

// Start initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeFruitRecognition);
} else {
    initializeFruitRecognition();
}
