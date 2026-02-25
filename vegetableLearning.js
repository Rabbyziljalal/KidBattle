// ===== Vegetable Learning Mode - Main Logic =====

class VegetableLearning {
    constructor() {
        this.vegetables = vegetableDatabase;
        this.currentMode = 'learn'; // 'learn' or 'quiz'
        this.quizScore = 0;
        this.quizTotal = 0;
        this.currentQuizVegetable = null;
        this.currentOptions = [];
        this.speech = window.speechSynthesis;
        this.activeCard = null; // Track currently active card
        this.colorClasses = ['color-1', 'color-2', 'color-3', 'color-4', 'color-5', 'color-6']; // Bright color options
        
        // Pagination
        this.currentPage = 1;
        this.vegetablesPerPage = 8; // 8 vegetables per page
        this.totalPages = Math.ceil(this.vegetables.length / this.vegetablesPerPage);
        
        this.initializeElements();
        this.setupEventListeners();
    }

    initializeElements() {
        // Main containers
        this.vegetableScreen = document.getElementById('vegetableLearningScreen');
        this.vegetableGridContainer = document.getElementById('vegetableGridContainer');
        this.quizContainer = document.getElementById('vegetableQuizContainer');
        
        // Buttons
        this.vegetableLearningBtn = document.getElementById('vegetableLearningBtn');
        this.backToMainBtn = document.getElementById('backToMainBtnVeg');
        this.quizModeBtn = document.getElementById('quizModeBtnVeg');
        this.learnModeBtn = document.getElementById('learnModeBtnVeg');
        this.cameraRecognitionBtn = document.getElementById('cameraRecognitionBtnVeg');
        this.nextQuestionBtn = document.getElementById('nextQuestionBtnVeg');
        
        // Pagination elements
        this.prevPageBtn = document.getElementById('prevPageBtnVeg');
        this.nextPageBtn = document.getElementById('nextPageBtnVeg');
        this.pageInfo = document.getElementById('pageInfoVeg');
        this.pageDots = document.getElementById('pageDotsVeg');
        
        // Quiz elements
        this.quizScoreDisplay = document.getElementById('quizScoreDisplayVeg');
        this.quizVegetableDisplay = document.getElementById('quizVegetableDisplay');
        this.quizOptionsContainer = document.getElementById('quizOptionsVeg');
        this.quizFeedback = document.getElementById('quizFeedbackVeg');
    }

    setupEventListeners() {
        // Main entry button
        if (this.vegetableLearningBtn) {
            this.vegetableLearningBtn.addEventListener('click', () => this.openVegetableLearning());
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

    openVegetableLearning() {
        // Hide difficulty screen and game screen
        const difficultyScreen = document.getElementById('difficultyScreen');
        const gameScreen = document.getElementById('gameScreen');
        const fruitScreen = document.getElementById('fruitLearningScreen');
        const mainHeader = document.querySelector('.header');
        const mainContainer = document.querySelector('.container');
        
        if (difficultyScreen) {
            difficultyScreen.classList.add('hidden');
        }
        
        if (gameScreen) {
            gameScreen.style.display = 'none';
        }
        
        if (fruitScreen) {
            fruitScreen.classList.remove('active');
        }
        
        // Hide main header and container
        if (mainHeader) {
            mainHeader.style.display = 'none';
        }
        if (mainContainer) {
            mainContainer.style.display = 'none';
        }
        
        // Show vegetable learning screen
        this.vegetableScreen.classList.add('active');
        
        // Initialize in learn mode
        this.switchToLearnMode();
    }

    backToMain() {
        // Hide vegetable learning screen
        this.vegetableScreen.classList.remove('active');
        
        // Show main header and container
        const mainHeader = document.querySelector('.header');
        const mainContainer = document.querySelector('.container');
        if (mainHeader) {
            mainHeader.style.display = 'block';
        }
        if (mainContainer) {
            mainContainer.style.display = 'block';
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
        this.vegetableGridContainer.classList.remove('hidden');
        this.quizContainer.classList.remove('active');
        
        // Reset to first page and render
        this.currentPage = 1;
        this.renderVegetableGrid();
        this.renderPageDots();
        this.updatePaginationButtons();
    }

    switchToQuizMode() {
        this.currentMode = 'quiz';
        this.vegetableGridContainer.classList.add('hidden');
        this.quizContainer.classList.add('active');
        
        // Reset quiz
        this.quizScore = 0;
        this.quizTotal = 0;
        this.updateQuizScore();
        
        // Load first question
        this.loadNextQuestion();
    }

    renderVegetableGrid() {
        const vegetableGrid = document.getElementById('vegetableGrid');
        if (!vegetableGrid) return;
        
        // Reset active card reference when rendering new page
        this.activeCard = null;
        
        // Calculate which vegetables to show
        const startIndex = (this.currentPage - 1) * this.vegetablesPerPage;
        const endIndex = startIndex + this.vegetablesPerPage;
        const vegetablesToShow = this.vegetables.slice(startIndex, endIndex);
        
        // Clear grid
        vegetableGrid.innerHTML = '';
        
        // Add page turn animation
        vegetableGrid.classList.remove('page-turn-next', 'page-turn-prev');
        void vegetableGrid.offsetWidth; // Trigger reflow
        
        // Render vegetables for this page
        vegetablesToShow.forEach((vegetable, index) => {
            const card = document.createElement('div');
            card.className = 'vegetable-card';
            card.style.borderBottom = `5px solid ${vegetable.color}`;
            card.style.animationDelay = `${index * 0.1}s`;
            
            card.innerHTML = `
                <span class="vegetable-emoji">${vegetable.emoji}</span>
                <p class="vegetable-name">${vegetable.name}</p>
                <p class="vegetable-name-bengali">${vegetable.bengaliName}</p>
            `;
            
            // Click event for pronunciation and animation
            card.addEventListener('click', () => this.handleVegetableClick(vegetable, card));
            
            vegetableGrid.appendChild(card);
        });
        
        // Update page info
        this.updatePageInfo();
    }

    goToNextPage() {
        if (this.currentPage < this.totalPages) {
            const vegetableGrid = document.getElementById('vegetableGrid');
            vegetableGrid.classList.add('page-turn-next');
            
            setTimeout(() => {
                this.currentPage++;
                this.renderVegetableGrid();
                this.renderPageDots();
                this.updatePaginationButtons();
            }, 400);
        }
    }

    goToPreviousPage() {
        if (this.currentPage > 1) {
            const vegetableGrid = document.getElementById('vegetableGrid');
            vegetableGrid.classList.add('page-turn-prev');
            
            setTimeout(() => {
                this.currentPage--;
                this.renderVegetableGrid();
                this.renderPageDots();
                this.updatePaginationButtons();
            }, 400);
        }
    }

    goToPage(pageNumber) {
        if (pageNumber >= 1 && pageNumber <= this.totalPages && pageNumber !== this.currentPage) {
            const vegetableGrid = document.getElementById('vegetableGrid');
            
            // Determine animation direction
            if (pageNumber > this.currentPage) {
                vegetableGrid.classList.add('page-turn-next');
            } else {
                vegetableGrid.classList.add('page-turn-prev');
            }
            
            setTimeout(() => {
                this.currentPage = pageNumber;
                this.renderVegetableGrid();
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

    handleVegetableClick(vegetable, cardElement) {
        // Remove active state from previously selected card
        if (this.activeCard && this.activeCard !== cardElement) {
            this.activeCard.classList.remove('active');
            // Remove all color classes
            this.colorClasses.forEach(colorClass => {
                this.activeCard.classList.remove(colorClass);
            });
        }
        
        // Toggle active state on clicked card
        if (cardElement.classList.contains('active')) {
            cardElement.classList.remove('active');
            this.colorClasses.forEach(colorClass => {
                cardElement.classList.remove(colorClass);
            });
            this.activeCard = null;
        } else {
            // Add active class with random bright color
            const randomColor = this.colorClasses[Math.floor(Math.random() * this.colorClasses.length)];
            cardElement.classList.add('active', randomColor);
            this.activeCard = cardElement;
        }
        
        // Speak the vegetable name in both English and Bengali
        this.speakVegetableName(`${vegetable.name}, ${vegetable.bengaliName}`);
        
        // Visual feedback - bounce effect
        cardElement.classList.add('vegetable-clicked');
        setTimeout(() => {
            cardElement.classList.remove('vegetable-clicked');
        }, 500);
    }

    speakVegetableName(vegetableName) {
        // Cancel any ongoing speech
        if (this.speech.speaking) {
            this.speech.cancel();
        }
        
        const utterance = new SpeechSynthesisUtterance(vegetableName);
        utterance.rate = 0.8;
        utterance.pitch = 1.2;
        utterance.volume = 1.0;
        
        this.speech.speak(utterance);
    }

    // Quiz Mode Functions
    loadNextQuestion() {
        // Pick a random vegetable
        const randomIndex = Math.floor(Math.random() * this.vegetables.length);
        this.currentQuizVegetable = this.vegetables[randomIndex];
        
        // Display the vegetable emoji
        if (this.quizVegetableDisplay) {
            this.quizVegetableDisplay.textContent = this.currentQuizVegetable.emoji;
        }
        
        // Generate 4 options (1 correct + 3 wrong)
        this.generateQuizOptions();
        
        // Hide feedback and next button
        if (this.quizFeedback) {
            this.quizFeedback.classList.remove('show', 'correct', 'wrong');
        }
        
        if (this.nextQuestionBtn) {
            this.nextQuestionBtn.style.display = 'none';
        }
    }

    generateQuizOptions() {
        if (!this.quizOptionsContainer) return;
        
        // Clear previous options
        this.quizOptionsContainer.innerHTML = '';
        
        // Create options array with correct answer
        this.currentOptions = [this.currentQuizVegetable];
        
        // Add 3 random wrong answers
        while (this.currentOptions.length < 4) {
            const randomVeg = this.vegetables[Math.floor(Math.random() * this.vegetables.length)];
            if (!this.currentOptions.find(v => v.id === randomVeg.id)) {
                this.currentOptions.push(randomVeg);
            }
        }
        
        // Shuffle options
        this.currentOptions.sort(() => Math.random() - 0.5);
        
        // Create option buttons
        this.currentOptions.forEach(vegetable => {
            const button = document.createElement('button');
            button.className = 'quiz-option-btn';
            button.textContent = vegetable.name;
            button.addEventListener('click', () => this.checkAnswer(vegetable, button));
            this.quizOptionsContainer.appendChild(button);
        });
    }

    checkAnswer(selectedVegetable, buttonElement) {
        // Disable all buttons
        const allButtons = this.quizOptionsContainer.querySelectorAll('.quiz-option-btn');
        allButtons.forEach(btn => btn.disabled = true);
        
        // Increment total
        this.quizTotal++;
        
        if (selectedVegetable.id === this.currentQuizVegetable.id) {
            // Correct answer
            this.quizScore++;
            buttonElement.classList.add('correct');
            this.showFeedback('Correct! 🎉', 'correct');
            this.speakVegetableName('Correct! ' + selectedVegetable.name);
        } else {
            // Wrong answer
            buttonElement.classList.add('wrong');
            
            // Highlight correct answer
            allButtons.forEach(btn => {
                if (btn.textContent === this.currentQuizVegetable.name) {
                    btn.classList.add('correct');
                }
            });
            
            this.showFeedback(`Wrong! The correct answer is ${this.currentQuizVegetable.name}`, 'wrong');
            this.speakVegetableName('Wrong! The correct answer is ' + this.currentQuizVegetable.name);
        }
        
        // Update score
        this.updateQuizScore();
        
        // Show next question button
        if (this.nextQuestionBtn) {
            this.nextQuestionBtn.style.display = 'block';
        }
    }

    showFeedback(message, type) {
        if (!this.quizFeedback) return;
        
        this.quizFeedback.textContent = message;
        this.quizFeedback.className = 'quiz-feedback show ' + type;
    }

    updateQuizScore() {
        if (this.quizScoreDisplay) {
            this.quizScoreDisplay.textContent = `Score: ${this.quizScore} / ${this.quizTotal}`;
        }
    }

    openCameraScanner() {
        // Camera scanner is handled by vegetableRecognition.js
        // The button click will be handled by the VegetableRecognition class
    }
}

// Initialize Vegetable Learning when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const vegetableLearning = new VegetableLearning();
});
