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
        this.captureBtn = document.getElementById('captureBtnAnimal');
        this.stopCameraBtn = document.getElementById('stopCameraBtnAnimal');
        this.uploadBtn = document.getElementById('uploadBtnAnimal');
        this.uploadInput = document.getElementById('uploadImageAnimal');
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
        this.resultDisplay.textContent = 'Point camera at an animal';
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
