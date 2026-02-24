// ===== Vegetable Recognition using TensorFlow.js =====
// Camera-based AI vegetable detection

class VegetableRecognition {
    constructor() {
        this.model = null;
        this.isModelLoaded = false;
        this.videoElement = null;
        this.canvasElement = null;
        this.isScanning = false;
        this.confidenceThreshold = 0.35;
        
        // Vegetable name mapping for MobileNet classes
        this.vegetableMapping = {
            'broccoli': 'Broccoli',
            'cauliflower': 'Cauliflower',
            'carrot': 'Carrot',
            'mushroom': 'Mushroom',
            'bell_pepper': 'Bell Pepper',
            'cucumber': 'Cucumber',
            'zucchini': 'Zucchini',
            'corn': 'Corn',
            'cabbage': 'Cabbage',
            'artichoke': 'Artichoke',
            'butternut_squash': 'Squash',
            'acorn_squash': 'Squash',
            'spaghetti_squash': 'Squash',
            'head_cabbage': 'Cabbage',
            'ear': 'Corn',
            'green_bean': 'Green Bean',
            'cardoon': 'Cardoon'
        };
        
        this.initializeElements();
        this.setupEventListeners();
    }

    initializeElements() {
        this.cameraContainer = document.getElementById('cameraRecognitionContainerVeg');
        this.cameraBtn = document.getElementById('cameraRecognitionBtnVeg');
        this.startCameraBtn = document.getElementById('startCameraBtnVeg');
        this.stopCameraBtn = document.getElementById('stopCameraBtnVeg');
        this.closeCameraBtn = document.getElementById('closeCameraBtnVeg');
        this.videoElement = document.getElementById('cameraVideoVeg');
        this.canvasElement = document.getElementById('cameraCanvasVeg');
        this.resultDisplay = document.getElementById('recognitionResultVeg');
        this.confidenceDisplay = document.getElementById('confidenceLevelVeg');
        this.loadingStatus = document.getElementById('loadingStatusVeg');
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
            
            console.log('TensorFlow.js MobileNet model loaded for vegetables');
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
        this.resultDisplay.textContent = 'Point camera at a vegetable';
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
        
        // Check if it's a vegetable we recognize
        let recognizedVegetable = null;
        
        for (const [key, value] of Object.entries(this.vegetableMapping)) {
            if (className.includes(key)) {
                recognizedVegetable = value;
                break;
            }
        }
        
        if (recognizedVegetable && confidence > this.confidenceThreshold) {
            // Found a vegetable with good confidence
            this.resultDisplay.textContent = `🎯 ${recognizedVegetable}`;
            this.resultDisplay.style.color = '#4caf50';
            this.resultDisplay.style.fontSize = '2.5em';
            
            const confidencePercent = Math.round(confidence * 100);
            this.confidenceDisplay.textContent = `Confidence: ${confidencePercent}%`;
            this.confidenceDisplay.style.color = '#666';
            
            // Capture snapshot to canvas
            this.captureSnapshot();
            
            // Speak the vegetable name
            this.speakVegetableName(recognizedVegetable);
            
            // Add animation
            this.resultDisplay.style.animation = 'none';
            setTimeout(() => {
                this.resultDisplay.style.animation = 'bounce 0.5s ease';
            }, 10);
            
        } else {
            // Not recognized or low confidence
            if (confidence < this.confidenceThreshold && predictions.length > 0) {
                this.resultDisplay.textContent = '❌ Not recognized';
                this.resultDisplay.style.color = '#ff6b6b';
                this.resultDisplay.style.fontSize = '2em';
                this.confidenceDisplay.textContent = `Point camera at a vegetable`;
                this.confidenceDisplay.style.color = '#999';
            } else {
                this.resultDisplay.textContent = 'Point camera at a vegetable';
                this.resultDisplay.style.color = '#666';
                this.resultDisplay.style.fontSize = '1.5em';
                this.confidenceDisplay.textContent = '';
            }
        }
    }

    speakVegetableName(vegetableName) {
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
        
        const utterance = new SpeechSynthesisUtterance(vegetableName);
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

// Initialize Vegetable Recognition
let vegetableRecognitionApp;

// Wait for both TensorFlow.js and the DOM to be ready
function initializeVegetableRecognition() {
    if (typeof mobilenet !== 'undefined' && document.getElementById('cameraRecognitionBtnVeg')) {
        vegetableRecognitionApp = new VegetableRecognition();
    } else {
        // Retry after a short delay
        setTimeout(initializeVegetableRecognition, 500);
    }
}

// Start initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeVegetableRecognition);
} else {
    initializeVegetableRecognition();
}
