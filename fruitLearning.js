// ===== Fruit Learning Mode - Main Logic =====

class FruitLearning {
    constructor() {
        this.fruits = fruitDatabase;
        this.currentMode = 'learn'; // 'learn' or 'quiz'
        this.quizScore = 0;
        this.quizTotal = 0;
        this.currentQuizFruit = null;
        this.currentOptions = [];
        this.speech = window.speechSynthesis;
        
        // Pagination
        this.currentPage = 1;
        this.fruitsPerPage = 8; // 8 fruits per page for better book layout
        this.totalPages = Math.ceil(this.fruits.length / this.fruitsPerPage);
        
        this.initializeElements();
        this.setupEventListeners();
    }

    initializeElements() {
        // Main containers
        this.fruitScreen = document.getElementById('fruitLearningScreen');
        this.fruitGridContainer = document.getElementById('fruitGridContainer');
        this.quizContainer = document.getElementById('quizContainer');
        
        // Buttons
        this.fruitLearningBtn = document.getElementById('fruitLearningBtn');
        this.backToMainBtn = document.getElementById('backToMainBtn');
        this.quizModeBtn = document.getElementById('quizModeBtn');
        this.learnModeBtn = document.getElementById('learnModeBtn');
        this.cameraRecognitionBtn = document.getElementById('cameraRecognitionBtn');
        this.nextQuestionBtn = document.getElementById('nextQuestionBtn');
        
        // Pagination elements
        this.prevPageBtn = document.getElementById('prevPageBtn');
        this.nextPageBtn = document.getElementById('nextPageBtn');
        this.pageInfo = document.getElementById('pageInfo');
        this.pageDots = document.getElementById('pageDots');
        
        // Quiz elements
        this.quizScoreDisplay = document.getElementById('quizScoreDisplay');
        this.quizFruitDisplay = document.getElementById('quizFruitDisplay');
        this.quizOptionsContainer = document.getElementById('quizOptions');
        this.quizFeedback = document.getElementById('quizFeedback');
    }

    setupEventListeners() {
        // Main entry button
        if (this.fruitLearningBtn) {
            this.fruitLearningBtn.addEventListener('click', () => this.openFruitLearning());
        }
        
        // Back button
        if (this.backToMainBtn) {
            this.backToMainBtn.addEventListener('click', () => this.backToMain());
        }
        
        // Mode switch buttons
        if (this.quizModeBtn) {
            this.quizModeBtn.addEventListener('click', () => this.switchToQuizMode());
        }
        
        if (this.learnModeBtn) {
            this.learnModeBtn.addEventListener('click', () => this.switchToLearnMode());
        }
        
        // Camera recognition button
        if (this.cameraRecognitionBtn) {
            this.cameraRecognitionBtn.addEventListener('click', () => this.openCameraScanner());
        }
        
        // Pagination buttons
        if (this.prevPageBtn) {
            this.prevPageBtn.addEventListener('click', () => this.goToPreviousPage());
        }
        
        if (this.nextPageBtn) {
            this.nextPageBtn.addEventListener('click', () => this.goToNextPage());
        }
        
        // Next question button
        if (this.nextQuestionBtn) {
            this.nextQuestionBtn.addEventListener('click', () => this.loadNextQuestion());
        }
    }

    openFruitLearning() {
        // Hide difficulty screen and game screen
        const difficultyScreen = document.getElementById('difficultyScreen');
        const gameScreen = document.getElementById('gameScreen');
        const mainHeader = document.querySelector('.header');
        const mainContainer = document.querySelector('.container');
        
        if (difficultyScreen) {
            difficultyScreen.classList.add('hidden');
        }
        
        if (gameScreen) {
            gameScreen.style.display = 'none';
        }
        
        // Hide main header and container
        if (mainHeader) {
            mainHeader.style.display = 'none';
        }
        if (mainContainer) {
            mainContainer.style.display = 'none';
        }
        
        // Show fruit learning screen
        this.fruitScreen.classList.add('active');
        
        // Initialize in learn mode
        this.switchToLearnMode();
    }

    backToMain() {
        // Hide fruit learning screen
        this.fruitScreen.classList.remove('active');
        
        // Show main header and container
        const mainHeader = document.querySelector('.header');
        const mainContainer = document.querySelector('.container');
        if (mainHeader) {
            mainHeader.style.display = 'block';
        }
        if (mainContainer) {
            mainContainer.style.display = 'block';
        }
        
        // Hide team game screen explicitly
        const teamGameScreen = document.getElementById('gameScreen');
        const gameOverScreen = document.getElementById('gameOverScreen');
        if (teamGameScreen) {
            teamGameScreen.classList.add('hidden');
        }
        if (gameOverScreen) {
            gameOverScreen.classList.add('hidden');
        }
        
        // Show difficulty screen
        const difficultyScreen = document.getElementById('difficultyScreen');
        if (difficultyScreen) {
            difficultyScreen.classList.remove('hidden');
        }
        
        // Stop any ongoing speech
        if (this.speech.speaking) {
            this.speech.cancel();
        }
    }

    switchToLearnMode() {
        this.currentMode = 'learn';
        this.fruitGridContainer.classList.remove('hidden');
        this.quizContainer.classList.remove('active');
        
        // Reset to first page and render
        this.currentPage = 1;
        this.renderFruitGrid();
        this.renderPageDots();
        this.updatePaginationButtons();
    }

    switchToQuizMode() {
        this.currentMode = 'quiz';
        this.fruitGridContainer.classList.add('hidden');
        this.quizContainer.classList.add('active');
        
        // Reset quiz
        this.quizScore = 0;
        this.quizTotal = 0;
        this.updateQuizScore();
        
        // Load first question
        this.loadNextQuestion();
    }

    renderFruitGrid() {
        const fruitGrid = document.getElementById('fruitGrid');
        if (!fruitGrid) return;
        
        // Calculate which fruits to show
        const startIndex = (this.currentPage - 1) * this.fruitsPerPage;
        const endIndex = startIndex + this.fruitsPerPage;
        const fruitsToShow = this.fruits.slice(startIndex, endIndex);
        
        // Clear grid
        fruitGrid.innerHTML = '';
        
        // Add page turn animation
        fruitGrid.classList.remove('page-turn-next', 'page-turn-prev');
        void fruitGrid.offsetWidth; // Trigger reflow
        
        // Render fruits for this page
        fruitsToShow.forEach((fruit, index) => {
            const card = document.createElement('div');
            card.className = 'fruit-card';
            card.style.borderBottom = `5px solid ${fruit.color}`;
            card.style.animationDelay = `${index * 0.1}s`;
            
            card.innerHTML = `
                <span class="fruit-emoji">${fruit.emoji}</span>
                <p class="fruit-name">${fruit.name}</p>
                <p class="fruit-name-bengali">${fruit.bengaliName}</p>
            `;
            
            // Click event for pronunciation and animation
            card.addEventListener('click', () => this.handleFruitClick(fruit, card));
            
            fruitGrid.appendChild(card);
        });
        
        // Update page info
        this.updatePageInfo();
    }

    goToNextPage() {
        if (this.currentPage < this.totalPages) {
            const fruitGrid = document.getElementById('fruitGrid');
            fruitGrid.classList.add('page-turn-next');
            
            setTimeout(() => {
                this.currentPage++;
                this.renderFruitGrid();
                this.renderPageDots();
                this.updatePaginationButtons();
            }, 400);
        }
    }

    goToPreviousPage() {
        if (this.currentPage > 1) {
            const fruitGrid = document.getElementById('fruitGrid');
            fruitGrid.classList.add('page-turn-prev');
            
            setTimeout(() => {
                this.currentPage--;
                this.renderFruitGrid();
                this.renderPageDots();
                this.updatePaginationButtons();
            }, 400);
        }
    }

    goToPage(pageNumber) {
        if (pageNumber >= 1 && pageNumber <= this.totalPages && pageNumber !== this.currentPage) {
            const fruitGrid = document.getElementById('fruitGrid');
            
            // Determine animation direction
            if (pageNumber > this.currentPage) {
                fruitGrid.classList.add('page-turn-next');
            } else {
                fruitGrid.classList.add('page-turn-prev');
            }
            
            setTimeout(() => {
                this.currentPage = pageNumber;
                this.renderFruitGrid();
                this.renderPageDots();
                this.updatePaginationButtons();
            }, 400);
        }
    }

    updatePageInfo() {
        if (this.pageInfo) {
            this.pageInfo.textContent = `Page ${this.currentPage} of ${this.totalPages}`;
        }
    }

    updatePaginationButtons() {
        if (this.prevPageBtn) {
            this.prevPageBtn.disabled = this.currentPage === 1;
        }
        
        if (this.nextPageBtn) {
            this.nextPageBtn.disabled = this.currentPage === this.totalPages;
        }
    }

    renderPageDots() {
        if (!this.pageDots) return;
        
        this.pageDots.innerHTML = '';
        
        for (let i = 1; i <= this.totalPages; i++) {
            const dot = document.createElement('div');
            dot.className = 'page-dot';
            if (i === this.currentPage) {
                dot.classList.add('active');
            }
            
            dot.addEventListener('click', () => this.goToPage(i));
            
            this.pageDots.appendChild(dot);
        }
    }

    handleFruitClick(fruit, cardElement) {
        // Speak the fruit name in both English and Bengali
        this.speakFruitName(`${fruit.name}, ${fruit.bengaliName}`);
        
        // Visual feedback - bounce effect
        cardElement.classList.add('fruit-clicked');
        setTimeout(() => {
            cardElement.classList.remove('fruit-clicked');
        }, 500);
    }

    speakFruitName(fruitName) {
        // Cancel any ongoing speech
        if (this.speech.speaking) {
            this.speech.cancel();
        }
        
        // Create speech utterance
        const utterance = new SpeechSynthesisUtterance(fruitName);
        utterance.rate = 0.8; // Slightly slower for kids
        utterance.pitch = 1.1; // Slightly higher pitch for friendliness
        utterance.volume = 1;
        
        // Speak
        this.speech.speak(utterance);
    }

    loadNextQuestion() {
        this.quizTotal++;
        
        // Reset feedback and button
        this.quizFeedback.textContent = '';
        this.quizFeedback.className = 'quiz-feedback';
        this.nextQuestionBtn.classList.remove('active');
        
        // Select random fruit
        this.currentQuizFruit = this.fruits[Math.floor(Math.random() * this.fruits.length)];
        
        // Display fruit emoji
        this.quizFruitDisplay.textContent = this.currentQuizFruit.emoji;
        
        // Generate options (1 correct + 2 wrong)
        this.currentOptions = this.generateQuizOptions(this.currentQuizFruit);
        
        // Render options
        this.renderQuizOptions();
    }

    generateQuizOptions(correctFruit) {
        const options = [correctFruit];
        
        // Get 2 random wrong answers
        const otherFruits = this.fruits.filter(f => f.id !== correctFruit.id);
        
        while (options.length < 3) {
            const randomFruit = otherFruits[Math.floor(Math.random() * otherFruits.length)];
            if (!options.includes(randomFruit)) {
                options.push(randomFruit);
            }
        }
        
        // Shuffle options
        return options.sort(() => Math.random() - 0.5);
    }

    renderQuizOptions() {
        this.quizOptionsContainer.innerHTML = '';
        
        this.currentOptions.forEach(fruit => {
            const optionBtn = document.createElement('button');
            optionBtn.className = 'quiz-option';
            optionBtn.textContent = fruit.name;
            
            optionBtn.addEventListener('click', () => this.checkAnswer(fruit, optionBtn));
            
            this.quizOptionsContainer.appendChild(optionBtn);
        });
    }

    checkAnswer(selectedFruit, buttonElement) {
        const isCorrect = selectedFruit.id === this.currentQuizFruit.id;
        
        // Disable all options
        const allOptions = this.quizOptionsContainer.querySelectorAll('.quiz-option');
        allOptions.forEach(opt => opt.classList.add('disabled'));
        
        if (isCorrect) {
            this.quizScore++;
            buttonElement.classList.add('correct');
            this.quizFeedback.textContent = 'Correct! 🎉';
            this.quizFeedback.className = 'quiz-feedback correct';
            this.speakFruitName(selectedFruit.name);
        } else {
            buttonElement.classList.add('incorrect');
            this.quizFeedback.textContent = 'Try Again ❌';
            this.quizFeedback.className = 'quiz-feedback incorrect';
            
            // Highlight correct answer
            allOptions.forEach(opt => {
                if (opt.textContent === this.currentQuizFruit.name) {
                    opt.classList.add('correct');
                }
            });
        }
        
        // Update score
        this.updateQuizScore();
        
        // Show next question button
        this.nextQuestionBtn.classList.add('active');
    }

    updateQuizScore() {
        this.quizScoreDisplay.textContent = `Score: ${this.quizScore} / ${this.quizTotal}`;
    }
    
    openCameraScanner() {
        // Navigate to the dedicated camera scanner page
        window.location.href = 'fruitScan.html';
    }
}

// Initialize Fruit Learning when DOM is loaded
let fruitLearningApp;

document.addEventListener('DOMContentLoaded', function() {
    // Small delay to ensure all elements are loaded
    setTimeout(() => {
        fruitLearningApp = new FruitLearning();
    }, 100);
});
