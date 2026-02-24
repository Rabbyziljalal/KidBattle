// ===== Animal Recognition using TensorFlow.js =====
// Camera-based AI animal detection

class AnimalRecognition {
    constructor() {
        this.model = null;
        this.isModelLoaded = false;
        this.videoElement = null;
        this.canvasElement = null;
        this.isScanning = false;
        this.confidenceThreshold = 0.35;
        
        // Animal name mapping for MobileNet classes
        this.animalMapping = {
            'lion': 'Lion',
            'tiger': 'Tiger',
            'elephant': 'Elephant',
            'giraffe': 'Giraffe',
            'zebra': 'Zebra',
            'bear': 'Bear',
            'panda': 'Panda',
            'monkey': 'Monkey',
            'gorilla': 'Gorilla',
            'chimpanzee': 'Chimpanzee',
            'cat': 'Cat',
            'dog': 'Dog',
            'tabby': 'Cat',
            'persian_cat': 'Cat',
            'siamese_cat': 'Cat',
            'golden_retriever': 'Dog',
            'labrador_retriever': 'Dog',
            'german_shepherd': 'Dog',
            'beagle': 'Dog',
            'horse': 'Horse',
            'cow': 'Cow',
            'ox': 'Cow',
            'sheep': 'Sheep',
            'ram': 'Sheep',
            'goat': 'Goat',
            'pig': 'Pig',
            'hog': 'Pig',
            'rabbit': 'Rabbit',
            'hare': 'Rabbit',
            'hamster': 'Hamster',
            'guinea_pig': 'Guinea Pig',
            'squirrel': 'Squirrel',
            'fox': 'Fox',
            'wolf': 'Wolf',
            'deer': 'Deer',
            'kangaroo': 'Kangaroo',
            'koala': 'Koala',
            'rhinoceros': 'Rhino',
            'hippopotamus': 'Hippo',
            'camel': 'Camel',
            'dromedary': 'Camel',
            'llama': 'Llama',
            'alpaca': 'Alpaca',
            'porcupine': 'Porcupine',
            'skunk': 'Skunk',
            'raccoon': 'Raccoon',
            'otter': 'Otter',
            'seal': 'Seal',
            'sea_lion': 'Sea Lion',
            'walrus': 'Walrus',
            'whale': 'Whale',
            'dolphin': 'Dolphin',
            'shark': 'Shark',
            'fish': 'Fish',
            'jellyfish': 'Jellyfish',
            'turtle': 'Turtle',
            'tortoise': 'Turtle',
            'crocodile': 'Crocodile',
            'alligator': 'Alligator',
            'lizard': 'Lizard',
            'snake': 'Snake',
            'frog': 'Frog',
            'toad': 'Toad'
        };
        
        this.initializeElements();
        this.setupEventListeners();
    }

    initializeElements() {
        this.cameraContainer = document.getElementById('cameraRecognitionContainerAnimal');
        this.cameraBtn = document.getElementById('cameraRecognitionBtnAnimal');
        this.startCameraBtn = document.getElementById('startCameraBtnAnimal');
        this.stopCameraBtn = document.getElementById('stopCameraBtnAnimal');
        this.closeCameraBtn = document.getElementById('closeCameraBtnAnimal');
        this.videoElement = document.getElementById('cameraVideoAnimal');
        this.canvasElement = document.getElementById('cameraCanvasAnimal');
        this.resultDisplay = document.getElementById('recognitionResultAnimal');
        this.confidenceDisplay = document.getElementById('confidenceLevelAnimal');
        this.loadingStatus = document.getElementById('loadingStatusAnimal');
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
            
            console.log('TensorFlow.js MobileNet model loaded for animals');
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
        this.resultDisplay.textContent = 'Point camera at an animal';
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
        
        // Check if it's an animal we recognize
        let recognizedAnimal = null;
        
        for (const [key, value] of Object.entries(this.animalMapping)) {
            if (className.includes(key)) {
                recognizedAnimal = value;
                break;
            }
        }
        
        if (recognizedAnimal && confidence > this.confidenceThreshold) {
            // Found an animal with good confidence
            this.resultDisplay.textContent = `🎯 ${recognizedAnimal}`;
            this.resultDisplay.style.color = '#4caf50';
            this.resultDisplay.style.fontSize = '2.5em';
            
            const confidencePercent = Math.round(confidence * 100);
            this.confidenceDisplay.textContent = `Confidence: ${confidencePercent}%`;
            this.confidenceDisplay.style.color = '#666';
            
            // Capture snapshot to canvas
            this.captureSnapshot();
            
            // Speak the animal name
            this.speakAnimalName(recognizedAnimal);
            
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
                this.confidenceDisplay.textContent = `Point camera at an animal`;
                this.confidenceDisplay.style.color = '#999';
            } else {
                this.resultDisplay.textContent = 'Point camera at an animal';
                this.resultDisplay.style.color = '#666';
                this.resultDisplay.style.fontSize = '1.5em';
                this.confidenceDisplay.textContent = '';
            }
        }
    }

    speakAnimalName(animalName) {
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
        
        const utterance = new SpeechSynthesisUtterance(animalName);
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

// Initialize Animal Recognition
let animalRecognitionApp;

// Wait for both TensorFlow.js and the DOM to be ready
function initializeAnimalRecognition() {
    if (typeof mobilenet !== 'undefined' && document.getElementById('cameraRecognitionBtnAnimal')) {
        animalRecognitionApp = new AnimalRecognition();
    } else {
        // Retry after a short delay
        setTimeout(initializeAnimalRecognition, 500);
    }
}

// Start initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAnimalRecognition);
} else {
    initializeAnimalRecognition();
}
