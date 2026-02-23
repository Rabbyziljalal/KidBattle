// ===== Camera Module - Real Camera Access and Image Capture =====

class CameraModule {
    constructor() {
        this.stream = null;
        this.videoElement = null;
        this.canvasElement = null;
        this.isStreaming = false;
    }

    /**
     * Initialize camera with video element
     */
    async init(videoElement, canvasElement) {
        this.videoElement = videoElement;
        this.canvasElement = canvasElement;
        
        if (!this.videoElement || !this.canvasElement) {
            throw new Error('Video or Canvas element not provided');
        }
    }

    /**
     * Start camera stream
     */
    async startCamera() {
        try {
            // Check if getUserMedia is supported
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error('Camera API not supported in this browser');
            }

            // Request camera access with constraints
            const constraints = {
                video: {
                    facingMode: 'environment', // Use back camera on mobile
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                },
                audio: false
            };

            this.stream = await navigator.mediaDevices.getUserMedia(constraints);
            
            // Attach stream to video element
            this.videoElement.srcObject = this.stream;
            
            // Wait for video metadata to load
            await new Promise((resolve) => {
                this.videoElement.onloadedmetadata = () => {
                    this.videoElement.play();
                    this.isStreaming = true;
                    resolve();
                };
            });

            console.log('Camera started successfully');
            return true;

        } catch (error) {
            console.error('Error starting camera:', error);
            
            if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
                throw new Error('Camera permission denied. Please allow camera access.');
            } else if (error.name === 'NotFoundError') {
                throw new Error('No camera found on this device.');
            } else if (error.name === 'NotReadableError') {
                throw new Error('Camera is already in use by another application.');
            } else {
                throw new Error('Unable to access camera: ' + error.message);
            }
        }
    }

    /**
     * Capture current frame from video
     */
    captureFrame() {
        if (!this.isStreaming) {
            throw new Error('Camera is not running');
        }

        const context = this.canvasElement.getContext('2d');
        
        // Set canvas dimensions to match video
        this.canvasElement.width = this.videoElement.videoWidth;
        this.canvasElement.height = this.videoElement.videoHeight;

        // Draw current video frame to canvas
        context.drawImage(
            this.videoElement, 
            0, 0, 
            this.canvasElement.width, 
            this.canvasElement.height
        );

        console.log('Frame captured:', this.canvasElement.width, 'x', this.canvasElement.height);
        
        // Return canvas element for AI processing
        return this.canvasElement;
    }

    /**
     * Get captured image as data URL
     */
    getImageDataURL() {
        return this.canvasElement.toDataURL('image/jpeg', 0.95);
    }

    /**
     * Stop camera stream
     */
    stopCamera() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => {
                track.stop();
                console.log('Camera track stopped');
            });
            this.stream = null;
        }
        
        if (this.videoElement) {
            this.videoElement.srcObject = null;
        }
        
        this.isStreaming = false;
    }

    /**
     * Check if camera is currently streaming
     */
    isActive() {
        return this.isStreaming;
    }

    /**
     * Get video dimensions
     */
    getDimensions() {
        return {
            width: this.videoElement?.videoWidth || 0,
            height: this.videoElement?.videoHeight || 0
        };
    }
}

// Export for use in other modules
window.CameraModule = CameraModule;
