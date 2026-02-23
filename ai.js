// ===== AI Module - TensorFlow.js Image Classification =====

class AIModule {
    constructor() {
        this.model = null;
        this.isModelLoaded = false;
        this.isLoading = false;
    }

    /**
     * Load MobileNet model from TensorFlow.js
     */
    async loadModel() {
        if (this.isModelLoaded) {
            console.log('Model already loaded');
            return true;
        }

        if (this.isLoading) {
            console.log('Model is currently loading, please wait...');
            // Wait for loading to complete
            while (this.isLoading) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            return this.isModelLoaded;
        }

        try {
            this.isLoading = true;
            console.log('Loading MobileNet model...');

            // Check if TensorFlow.js is available
            if (typeof tf === 'undefined') {
                throw new Error('TensorFlow.js library not loaded');
            }

            // Check if MobileNet is available
            if (typeof mobilenet === 'undefined') {
                throw new Error('MobileNet model library not loaded');
            }

            // Load the pre-trained MobileNet model
            this.model = await mobilenet.load({
                version: 2,
                alpha: 1.0
            });

            this.isModelLoaded = true;
            this.isLoading = false;
            console.log('MobileNet model loaded successfully');
            return true;

        } catch (error) {
            this.isLoading = false;
            console.error('Error loading model:', error);
            throw new Error('Failed to load AI model: ' + error.message);
        }
    }

    /**
     * Classify image from canvas element
     */
    async classifyImage(canvasElement) {
        if (!this.isModelLoaded) {
            throw new Error('Model not loaded. Call loadModel() first.');
        }

        if (!canvasElement) {
            throw new Error('No image provided for classification');
        }

        try {
            console.log('Classifying image...');

            // Run classification on the canvas element
            const predictions = await this.model.classify(canvasElement);

            console.log('Classification complete. Predictions:', predictions);

            // Return top predictions
            return predictions;

        } catch (error) {
            console.error('Error during classification:', error);
            throw new Error('Classification failed: ' + error.message);
        }
    }

    /**
     * Get top prediction with confidence check
     */
    async getBestPrediction(canvasElement, minConfidence = 0.5) {
        const predictions = await this.classifyImage(canvasElement);

        if (!predictions || predictions.length === 0) {
            return {
                name: 'Unknown',
                confidence: 0,
                isConfident: false
            };
        }

        const topPrediction = predictions[0];
        const confidence = topPrediction.probability;
        const isConfident = confidence >= minConfidence;

        return {
            name: topPrediction.className,
            confidence: confidence,
            isConfident: isConfident,
            allPredictions: predictions.slice(0, 3) // Top 3 predictions
        };
    }

    /**
     * Detect if prediction is a fruit
     */
    isFruit(className) {
        const fruitKeywords = [
            'apple', 'banana', 'orange', 'lemon', 'strawberry', 
            'pineapple', 'grape', 'grapes', 'watermelon', 'mango',
            'peach', 'pear', 'cherry', 'plum', 'fig', 'pomegranate',
            'kiwi', 'papaya', 'coconut', 'avocado', 'berry', 
            'fruit', 'citrus', 'melon'
        ];

        const lowerClassName = className.toLowerCase();
        return fruitKeywords.some(keyword => lowerClassName.includes(keyword));
    }

    /**
     * Get fruit-specific prediction
     */
    async detectFruit(canvasElement, minConfidence = 0.4) {
        const predictions = await this.classifyImage(canvasElement);

        // Find first fruit in predictions
        for (const pred of predictions) {
            if (this.isFruit(pred.className)) {
                return {
                    name: this.formatFruitName(pred.className),
                    confidence: pred.probability,
                    isConfident: pred.probability >= minConfidence,
                    rawName: pred.className,
                    isFruit: true
                };
            }
        }

        // No fruit detected
        return {
            name: predictions[0]?.className || 'Unknown',
            confidence: predictions[0]?.probability || 0,
            isConfident: false,
            rawName: predictions[0]?.className || 'Unknown',
            isFruit: false
        };
    }

    /**
     * Format fruit name for display
     */
    formatFruitName(className) {
        // Remove common prefixes/suffixes
        let name = className.replace(/granny smith/i, 'Apple');
        name = name.replace(/_/g, ' ');
        
        // Capitalize first letter of each word
        name = name.split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
        
        return name;
    }

    /**
     * Check if model is ready
     */
    isReady() {
        return this.isModelLoaded;
    }

    /**
     * Dispose model to free memory
     */
    dispose() {
        if (this.model) {
            this.model.dispose();
            this.model = null;
            this.isModelLoaded = false;
            console.log('Model disposed');
        }
    }
}

// Export for use in other modules
window.AIModule = AIModule;
