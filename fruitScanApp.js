// ===== Fruit Scan Application - Main Controller =====

class FruitScanApp {
    constructor() {
        // Initialize modules
        this.camera = new CameraModule();
        this.ai = new AIModule();
        
        // Get DOM elements
        this.elements = {
            video: document.getElementById('videoElement'),
            canvas: document.getElementById('capturedCanvas'),
            statusBar: document.getElementById('statusBar'),
            statusText: document.getElementById('statusText'),
            cameraPlaceholder: document.getElementById('cameraPlaceholder'),
            previewSection: document.getElementById('previewSection'),
            capturedPreview: document.getElementById('capturedPreview'),
            resultSection: document.getElementById('resultSection'),
            startCameraBtn: document.getElementById('startCameraBtn'),
            stopCameraBtn: document.getElementById('stopCameraBtn'),
            scanBtn: document.getElementById('scanBtn'),
            backBtn: document.getElementById('backBtn')
        };
        
        this.setupEventListeners();
        this.initialize();
    }

    setupEventListeners() {
        this.elements.startCameraBtn.addEventListener('click', () => this.handleStartCamera());
        this.elements.stopCameraBtn.addEventListener('click', () => this.handleStopCamera());
        this.elements.scanBtn.addEventListener('click', () => this.handleScan());
        this.elements.backBtn.addEventListener('click', () => this.handleBack());
    }

    async initialize() {
        this.updateStatus('Initializing AI model...', 'loading');
        
        try {
            // Initialize camera module
            await this.camera.init(this.elements.video, this.elements.canvas);
            
            // Load AI model
            await this.ai.loadModel();
            
            this.updateStatus('✅ Ready! Click "Start Camera" to begin', 'ready');
            
        } catch (error) {
            console.error('Initialization error:', error);
            this.updateStatus('❌ Error: ' + error.message, 'error');
        }
    }

    async handleStartCamera() {
        this.updateStatus('Starting camera...', 'loading');
        
        try {
            await this.camera.startCamera();
            
            // Hide placeholder, show video
            this.elements.cameraPlaceholder.classList.add('hidden');
            this.elements.video.style.display = 'block';
            
            // Update buttons
            this.elements.startCameraBtn.style.display = 'none';
            this.elements.stopCameraBtn.style.display = 'inline-block';
            this.elements.scanBtn.disabled = false;
            
            this.updateStatus('✅ Camera active - Point at a fruit and click Scan', 'ready');
            
        } catch (error) {
            console.error('Camera error:', error);
            this.updateStatus('❌ ' + error.message, 'error');
            alert(error.message + '\n\nPlease ensure:\n- You\'re using HTTPS or localhost\n- Camera permissions are granted\n- No other app is using the camera');
        }
    }

    handleStopCamera() {
        this.camera.stopCamera();
        
        // Show placeholder, hide video
        this.elements.cameraPlaceholder.classList.remove('hidden');
        this.elements.video.style.display = 'none';
        
        // Update buttons
        this.elements.startCameraBtn.style.display = 'inline-block';
        this.elements.stopCameraBtn.style.display = 'none';
        this.elements.scanBtn.disabled = true;
        
        // Hide preview
        this.elements.previewSection.classList.remove('visible');
        
        this.updateStatus('Camera stopped. Click "Start Camera" to begin again', '');
    }

    async handleScan() {
        if (!this.camera.isActive()) {
            alert('Camera is not running!');
            return;
        }

        if (!this.ai.isReady()) {
            alert('AI model is not loaded yet. Please wait...');
            return;
        }

        this.updateStatus('📸 Capturing image...', 'loading');
        this.elements.scanBtn.disabled = true;

        try {
            // Capture frame from video
            const canvas = this.camera.captureFrame();
            
            // Show captured image preview
            const imageDataURL = this.camera.getImageDataURL();
            this.elements.capturedPreview.src = imageDataURL;
            this.elements.previewSection.classList.add('visible');
            
            this.updateStatus('🤖 Analyzing with AI...', 'loading');
            
            // Show loading in result section
            this.elements.resultSection.innerHTML = `
                <h2>Analyzing...</h2>
                <div class="loading-spinner"></div>
                <p style="color: #666;">Please wait while AI identifies the fruit</p>
            `;

            // Use AI to detect fruit
            const result = await this.ai.detectFruit(canvas, 0.4);
            
            console.log('Detection result:', result);
            
            // Display result
            this.displayResult(result);
            
            this.updateStatus('✅ Scan complete!', 'ready');
            
        } catch (error) {
            console.error('Scan error:', error);
            this.updateStatus('❌ Scan failed: ' + error.message, 'error');
            this.elements.resultSection.innerHTML = `
                <h2>Error</h2>
                <p style="color: #f44336;">Failed to scan: ${error.message}</p>
            `;
        } finally {
            this.elements.scanBtn.disabled = false;
        }
    }

    displayResult(result) {
        const { name, confidence, isConfident, isFruit } = result;
        const confidencePercent = Math.round(confidence * 100);

        let resultHTML = '';

        if (isConfident && confidence >= 0.5) {
            // High confidence detection
            const emoji = this.getFruitEmoji(name);
            const confidenceClass = confidence >= 0.7 ? '' : 'low-confidence';
            
            resultHTML = `
                <div class="fruit-emoji">${emoji}</div>
                <div class="fruit-name">${name}</div>
                <div class="confidence">Confidence: ${confidencePercent}%</div>
                <div class="confidence-bar">
                    <div class="confidence-fill ${confidenceClass}" style="width: ${confidencePercent}%"></div>
                </div>
                ${!isFruit ? '<p style="color: #ffa500; margin-top: 10px;">⚠️ This might not be a fruit</p>' : ''}
            `;
            
            // Speak the result
            this.speak(name);
            
        } else {
            // Low confidence or not sure
            resultHTML = `
                <div style="font-size: 3em; margin: 20px 0;">❓</div>
                <div class="not-confident">Not sure, try again</div>
                <p style="color: #666;">Confidence: ${confidencePercent}%</p>
                <p style="color: #999; margin-top: 15px;">Tips:</p>
                <ul style="color: #666; text-align: left; display: inline-block;">
                    <li>Ensure good lighting</li>
                    <li>Hold fruit closer to camera</li>
                    <li>Try a different angle</li>
                    <li>Use a plain background</li>
                </ul>
                <p style="color: #999; margin-top: 10px; font-size: 0.9em;">Detected: ${name}</p>
            `;
        }

        this.elements.resultSection.innerHTML = resultHTML;
    }

    getFruitEmoji(name) {
        const fruitEmojis = {
            'apple': '🍎',
            'banana': '🍌',
            'orange': '🍊',
            'lemon': '🍋',
            'strawberry': '🍓',
            'grape': '🍇',
            'watermelon': '🍉',
            'pineapple': '🍍',
            'mango': '🥭',
            'peach': '🍑',
            'pear': '🍐',
            'cherry': '🍒',
            'kiwi': '🥝',
            'coconut': '🥥',
            'avocado': '🥑',
            'melon': '🍈'
        };

        const lowerName = name.toLowerCase();
        for (const [fruit, emoji] of Object.entries(fruitEmojis)) {
            if (lowerName.includes(fruit)) {
                return emoji;
            }
        }

        return '🍎'; // Default fruit emoji
    }

    speak(text) {
        try {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.9;
            utterance.pitch = 1.1;
            utterance.volume = 1;
            window.speechSynthesis.speak(utterance);
        } catch (error) {
            console.error('Speech error:', error);
        }
    }

    updateStatus(message, type = '') {
        this.elements.statusText.textContent = message;
        this.elements.statusBar.className = 'status-bar ' + type;
    }

    handleBack() {
        // Stop camera if running
        if (this.camera.isActive()) {
            this.camera.stopCamera();
        }
        
        // Go back to main app
        window.location.href = 'index.html';
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing Fruit Scanner App...');
    const app = new FruitScanApp();
    window.fruitScanApp = app; // Make available globally for debugging
});
