// ===== Bird Recognition using TensorFlow.js =====
// Camera-based AI bird detection

class BirdRecognition {
    constructor() {
        this.model = null;
        this.isModelLoaded = false;
        this.videoElement = null;
        this.canvasElement = null;
        this.isScanning = false;
        this.confidenceThreshold = 0.3;
        
        // Bird name mapping for MobileNet classes
        this.birdMapping = {
            'robin': 'Robin',
            'jay': 'Blue Jay',
            'chickadee': 'Chickadee',
            'water_ouzel': 'Water Ouzel',
            'kite': 'Kite',
            'bald_eagle': 'Bald Eagle',
            'vulture': 'Vulture',
            'great_grey_owl': 'Owl',
            'magpie': 'Magpie',
            'goldfinch': 'Goldfinch',
            'house_finch': 'Finch',
            'junco': 'Junco',
            'indigo_bunting': 'Indigo Bunting',
            'king_penguin': 'King Penguin',
            'albatross': 'Albatross',
            'toucan': 'Toucan',
            'drake': 'Duck',
            'goose': 'Goose',
            'black_swan': 'Black Swan',
            'white_stork': 'Stork',
            'black_stork': 'Stork',
            'spoonbill': 'Spoonbill',
            'flamingo': 'Flamingo',
            'heron': 'Heron',
            'bittern': 'Bittern',
            'crane': 'Crane',
            'limpkin': 'Limpkin',
            'bustard': 'Bustard',
            'ruddy_turnstone': 'Turnstone',
            'red-backed_sandpiper': 'Sandpiper',
            'redshank': 'Redshank',
            'dowitcher': 'Dowitcher',
            'oystercatcher': 'Oystercatcher',
            'pelican': 'Pelican',
            'king_penguin': 'Penguin',
            'ostrich': 'Ostrich',
            'hornbill': 'Hornbill',
            'bee_eater': 'Bee-eater',
            'hoopoe': 'Hoopoe',
            'jacamar': 'Jacamar',
            'toucanet': 'Toucanet',
            'lorikeet': 'Lorikeet',
            'coucal': 'Coucal',
            'roadrunner': 'Roadrunner',
            'turaco': 'Turaco',
            'red-breasted_merganser': 'Merganser',
            'American_coot': 'Coot',
            'bustard': 'Bustard',
            'quail': 'Quail',
            'partridge': 'Partridge',
            'prairie_chicken': 'Prairie Chicken',
            'peacock': 'Peacock',
            'macaw': 'Macaw',
            'sulphur-crested_cockatoo': 'Cockatoo',
            'african_grey': 'Parrot',
            'lorikeet': 'Lorikeet',
            'owl': 'Owl',
            'eagle': 'Eagle',
            'hawk': 'Hawk',
            'parrot': 'Parrot',
            'pigeon': 'Pigeon',
            'dove': 'Dove',
            'crow': 'Crow',
            'raven': 'Raven',
            'sparrow': 'Sparrow',
            'swallow': 'Swallow',
            'woodpecker': 'Woodpecker',
            'kingfisher': 'Kingfisher',
            'hummingbird': 'Hummingbird',
            'cardinal': 'Cardinal',
            'canary': 'Canary',
            'seagull': 'Seagull',
            'gull': 'Seagull',
            'turkey': 'Turkey',
            'chicken': 'Chicken',
            'rooster': 'Rooster',
            'hen': 'Hen',
            'pheasant': 'Pheasant'
        };
        
        this.initializeElements();
        this.setupEventListeners();
    }

    initializeElements() {
        this.cameraContainer = document.getElementById('cameraRecognitionContainerBirds');
        this.cameraBtn = document.getElementById('cameraRecognitionBtnBirds');
        this.startCameraBtn = document.getElementById('startCameraBtnBirds');
        this.captureBtn = document.getElementById('captureBtnBirds');
        this.stopCameraBtn = document.getElementById('stopCameraBtnBirds');
        this.uploadBtn = document.getElementById('uploadBtnBirds');
        this.uploadInput = document.getElementById('uploadImageBirds');
        this.closeCameraBtn = document.getElementById('closeCameraBtnBirds');
        this.videoElement = document.getElementById('cameraVideoBirds');
        this.canvasElement = document.getElementById('cameraCanvasBirds');
        this.resultDisplay = document.getElementById('recognitionResultBirds');
        this.confidenceDisplay = document.getElementById('confidenceLevelBirds');
        this.loadingStatus = document.getElementById('loadingStatusBirds');
    }

    setupEventListeners() {
        if (this.cameraBtn) {
            this.cameraBtn.addEventListener('click', () => this.openCameraMode());
        }
        
        if (this.startCameraBtn) {
            this.startCameraBtn.addEventListener('click', () => this.startCamera());
        }
        
        if (this.captureBtn) {
            this.captureBtn.addEventListener('click', () => this.captureAndAnalyze());
        }
        
        if (this.stopCameraBtn) {
            this.stopCameraBtn.addEventListener('click', () => this.stopCamera());
        }
        
        if (this.uploadBtn) {
            this.uploadBtn.addEventListener('click', () => this.uploadInput.click());
        }
        
        if (this.uploadInput) {
            this.uploadInput.addEventListener('change', (e) => this.handleImageUpload(e));
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
            
            console.log('TensorFlow.js MobileNet model loaded for birds');
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
            this.canvasElement.style.display = 'none';
            this.isScanning = true;
            
            // Wait for video to load
            this.videoElement.onloadedmetadata = () => {
                this.videoElement.play();
                this.startCameraBtn.style.display = 'none';
                this.captureBtn.style.display = 'inline-block';
                this.stopCameraBtn.style.display = 'block';
                
                this.resultDisplay.textContent = 'Click "Capture & Analyze" to identify';
                this.resultDisplay.style.color = '#666';
                this.confidenceDisplay.textContent = '';
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
        this.captureBtn.style.display = 'none';
        this.stopCameraBtn.style.display = 'none';
        this.canvasElement.style.display = 'none';
        this.resultDisplay.textContent = 'Point camera at a bird';
        this.confidenceDisplay.textContent = '';
    }

    async captureAndAnalyze() {
        if (!this.isModelLoaded) {
            this.resultDisplay.textContent = '⏳ Loading model...';
            return;
        }

        try {
            // Capture current video frame to canvas
            const context = this.canvasElement.getContext('2d');
            this.canvasElement.width = this.videoElement.videoWidth;
            this.canvasElement.height = this.videoElement.videoHeight;
            context.drawImage(this.videoElement, 0, 0);
            
            // Show canvas, hide video
            this.videoElement.style.display = 'none';
            this.canvasElement.style.display = 'block';
            
            this.resultDisplay.textContent = '🔍 Analyzing...';
            this.resultDisplay.style.color = '#2196F3';
            this.confidenceDisplay.textContent = '';
            
            // Analyze the captured image
            const predictions = await this.model.classify(this.canvasElement);
            
            if (predictions && predictions.length > 0) {
                this.processPredictons(predictions);
            } else {
                this.resultDisplay.textContent = '❌ Not recognized';
                this.resultDisplay.style.color = '#ff6b6b';
                this.confidenceDisplay.textContent = 'Try again with better lighting';
            }
            
        } catch (error) {
            console.error('Capture analysis error:', error);
            this.resultDisplay.textContent = '❌ Analysis failed';
            this.resultDisplay.style.color = '#f44336';
        }
    }

    async handleImageUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        if (!this.isModelLoaded) {
            await this.loadModel();
        }

        try {
            // Read the uploaded image
            const reader = new FileReader();
            reader.onload = async (e) => {
                const img = new Image();
                img.onload = async () => {
                    // Draw image to canvas
                    const context = this.canvasElement.getContext('2d');
                    this.canvasElement.width = img.width;
                    this.canvasElement.height = img.height;
                    context.drawImage(img, 0, 0);
                    
                    // Show canvas
                    this.videoElement.style.display = 'none';
                    this.canvasElement.style.display = 'block';
                    
                    this.resultDisplay.textContent = '🔍 Analyzing uploaded image...';
                    this.resultDisplay.style.color = '#2196F3';
                    this.confidenceDisplay.textContent = '';
                    
                    // Analyze the image
                    const predictions = await this.model.classify(this.canvasElement);
                    
                    if (predictions && predictions.length > 0) {
                        this.processPredictons(predictions);
                    } else {
                        this.resultDisplay.textContent = '❌ Not recognized';
                        this.resultDisplay.style.color = '#ff6b6b';
                        this.confidenceDisplay.textContent = 'Try another image';
                    }
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
            
        } catch (error) {
            console.error('Image upload error:', error);
            this.resultDisplay.textContent = '❌ Upload failed';
            this.resultDisplay.style.color = '#f44336';
        }
    }

    async predictLoop() {
        // Removed continuous scanning - now using capture-based analysis
        return;
    }

    processPredictons(predictions) {
        // Get the top prediction
        const topPrediction = predictions[0];
        const className = topPrediction.className.toLowerCase();
        const confidence = topPrediction.probability;
        
        // Check if it's a bird we recognize
        let recognizedBird = null;
        
        for (const [key, value] of Object.entries(this.birdMapping)) {
            if (className.includes(key)) {
                recognizedBird = value;
                break;
            }
        }
        
        if (recognizedBird && confidence > this.confidenceThreshold) {
            // Found a bird with good confidence
            this.resultDisplay.textContent = `🎯 ${recognizedBird}`;
            this.resultDisplay.style.color = '#4caf50';
            this.resultDisplay.style.fontSize = '2.5em';
            
            const confidencePercent = Math.round(confidence * 100);
            this.confidenceDisplay.textContent = `Confidence: ${confidencePercent}%`;
            this.confidenceDisplay.style.color = '#666';
            
            // Capture snapshot to canvas
            this.captureSnapshot();
            
            // Speak the bird name
            this.speakBirdName(recognizedBird);
            
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
                this.confidenceDisplay.textContent = `Point camera at a bird`;
                this.confidenceDisplay.style.color = '#999';
            } else {
                this.resultDisplay.textContent = 'Point camera at a bird';
                this.resultDisplay.style.color = '#666';
                this.resultDisplay.style.fontSize = '1.5em';
                this.confidenceDisplay.textContent = '';
            }
        }
    }

    speakBirdName(birdName) {
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
        
        const utterance = new SpeechSynthesisUtterance(birdName);
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

// Initialize Bird Recognition
let birdRecognitionApp;

// Wait for both TensorFlow.js and the DOM to be ready
function initializeBirdRecognition() {
    if (typeof mobilenet !== 'undefined' && document.getElementById('cameraRecognitionBtnBirds')) {
        birdRecognitionApp = new BirdRecognition();
    } else {
        // Retry after a short delay
        setTimeout(initializeBirdRecognition, 500);
    }
}

// Start initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeBirdRecognition);
} else {
    initializeBirdRecognition();
}
