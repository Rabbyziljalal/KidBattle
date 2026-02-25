// ===== Animal Learning Mode - Main Logic =====

class AnimalLearning {
    constructor() {
        this.animals = animalDatabase;
        this.currentMode = 'learn'; // 'learn' or 'quiz'
        this.quizScore = 0;
        this.quizTotal = 0;
        this.currentQuizAnimal = null;
        this.currentOptions = [];
        this.speech = window.speechSynthesis;
        
        // Pagination
        this.currentPage = 1;
        this.animalsPerPage = 8; // 8 animals per page
        this.totalPages = Math.ceil(this.animals.length / this.animalsPerPage);
        
        this.initializeElements();
        this.setupEventListeners();
    }

    initializeElements() {
        // Main containers
        this.animalScreen = document.getElementById('animalLearningScreen');
        this.animalGridContainer = document.getElementById('animalGridContainer');
        this.quizContainer = document.getElementById('animalQuizContainer');
        
        // Buttons
        this.animalLearningBtn = document.getElementById('animalLearningBtn');
        this.backToMainBtn = document.getElementById('backToMainBtnAnimal');
        this.quizModeBtn = document.getElementById('quizModeBtnAnimal');
        this.learnModeBtn = document.getElementById('learnModeBtnAnimal');
        this.cameraRecognitionBtn = document.getElementById('cameraRecognitionBtnAnimal');
        this.nextQuestionBtn = document.getElementById('nextQuestionBtnAnimal');
        
        // Pagination elements
        this.prevPageBtn = document.getElementById('prevPageBtnAnimal');
        this.nextPageBtn = document.getElementById('nextPageBtnAnimal');
        this.pageInfo = document.getElementById('pageInfoAnimal');
        this.pageDots = document.getElementById('pageDotsAnimal');
        
        // Quiz elements
        this.quizScoreDisplay = document.getElementById('quizScoreDisplayAnimal');
        this.quizAnimalDisplay = document.getElementById('quizAnimalDisplay');
        this.quizOptionsContainer = document.getElementById('quizOptionsAnimal');
        this.quizFeedback = document.getElementById('quizFeedbackAnimal');
    }

    setupEventListeners() {
        // Main entry button
        if (this.animalLearningBtn) {
            this.animalLearningBtn.addEventListener('click', () => this.openAnimalLearning());
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

    openAnimalLearning() {
        // Hide difficulty screen and game screen
        const difficultyScreen = document.getElementById('difficultyScreen');
        const gameScreen = document.getElementById('gameScreen');
        const fruitScreen = document.getElementById('fruitLearningScreen');
        const vegetableScreen = document.getElementById('vegetableLearningScreen');
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
        
        if (vegetableScreen) {
            vegetableScreen.classList.remove('active');
        }
        
        // Hide main header and container
        if (mainHeader) {
            mainHeader.style.display = 'none';
        }
        if (mainContainer) {
            mainContainer.style.display = 'none';
        }
        
        // Show animal learning screen
        this.animalScreen.classList.add('active');
        
        // Initialize in learn mode
        this.switchToLearnMode();
    }

    backToMain() {
        // Hide animal learning screen
        this.animalScreen.classList.remove('active');
        
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
        this.animalGridContainer.classList.remove('hidden');
        this.quizContainer.classList.remove('active');
        
        // Reset to first page and render
        this.currentPage = 1;
        this.renderAnimalGrid();
        this.renderPageDots();
        this.updatePaginationButtons();
    }

    switchToQuizMode() {
        this.currentMode = 'quiz';
        this.animalGridContainer.classList.add('hidden');
        this.quizContainer.classList.add('active');
        
        // Reset quiz
        this.quizScore = 0;
        this.quizTotal = 0;
        this.updateQuizScore();
        
        // Load first question
        this.loadNextQuestion();
    }

    renderAnimalGrid() {
        const animalGrid = document.getElementById('animalGrid');
        if (!animalGrid) return;
        
        // Calculate which animals to show
        const startIndex = (this.currentPage - 1) * this.animalsPerPage;
        const endIndex = startIndex + this.animalsPerPage;
        const animalsToShow = this.animals.slice(startIndex, endIndex);
        
        // Clear grid
        animalGrid.innerHTML = '';
        
        // Add page turn animation
        animalGrid.classList.remove('page-turn-next', 'page-turn-prev');
        void animalGrid.offsetWidth; // Trigger reflow
        
        // Render animals for this page
        animalsToShow.forEach((animal, index) => {
            const card = document.createElement('div');
            card.className = 'animal-card';
            card.style.borderBottom = `5px solid ${animal.color}`;
            card.style.animationDelay = `${index * 0.1}s`;
            
            card.innerHTML = `
                <span class="animal-emoji">${animal.emoji}</span>
                <p class="animal-name">${animal.name}</p>
                <p class="animal-name-bengali">${animal.bengaliName}</p>
            `;
            
            // Click event for pronunciation and animation
            card.addEventListener('click', () => this.handleAnimalClick(animal, card));
            
            animalGrid.appendChild(card);
        });
        
        // Update page info
        this.updatePageInfo();
    }

    goToNextPage() {
        if (this.currentPage < this.totalPages) {
            const animalGrid = document.getElementById('animalGrid');
            animalGrid.classList.add('page-turn-next');
            
            setTimeout(() => {
                this.currentPage++;
                this.renderAnimalGrid();
                this.renderPageDots();
                this.updatePaginationButtons();
            }, 400);
        }
    }

    goToPreviousPage() {
        if (this.currentPage > 1) {
            const animalGrid = document.getElementById('animalGrid');
            animalGrid.classList.add('page-turn-prev');
            
            setTimeout(() => {
                this.currentPage--;
                this.renderAnimalGrid();
                this.renderPageDots();
                this.updatePaginationButtons();
            }, 400);
        }
    }

    goToPage(pageNumber) {
        if (pageNumber >= 1 && pageNumber <= this.totalPages && pageNumber !== this.currentPage) {
            const animalGrid = document.getElementById('animalGrid');
            
            // Determine animation direction
            if (pageNumber > this.currentPage) {
                animalGrid.classList.add('page-turn-next');
            } else {
                animalGrid.classList.add('page-turn-prev');
            }
            
            setTimeout(() => {
                this.currentPage = pageNumber;
                this.renderAnimalGrid();
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

    handleAnimalClick(animal, cardElement) {
        // Speak the animal name (both English and Bengali)
        this.speakAnimalName(`${animal.name}, ${animal.bengaliName}`);
        
        // Visual feedback - bounce effect
        cardElement.classList.add('animal-clicked');
        setTimeout(() => {
            cardElement.classList.remove('animal-clicked');
        }, 500);
    }

    speakAnimalName(animalName) {
        // Cancel any ongoing speech
        if (this.speech.speaking) {
            this.speech.cancel();
        }
        
        const utterance = new SpeechSynthesisUtterance(animalName);
        utterance.rate = 0.8;
        utterance.pitch = 1.2;
        utterance.volume = 1.0;
        
        this.speech.speak(utterance);
    }

    // Quiz Mode Functions
    loadNextQuestion() {
        // Pick a random animal
        const randomIndex = Math.floor(Math.random() * this.animals.length);
        this.currentQuizAnimal = this.animals[randomIndex];
        
        // Display the animal emoji
        if (this.quizAnimalDisplay) {
            this.quizAnimalDisplay.textContent = this.currentQuizAnimal.emoji;
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
        this.currentOptions = [this.currentQuizAnimal];
        
        // Add 3 random wrong answers
        while (this.currentOptions.length < 4) {
            const randomAnimal = this.animals[Math.floor(Math.random() * this.animals.length)];
            if (!this.currentOptions.find(a => a.id === randomAnimal.id)) {
                this.currentOptions.push(randomAnimal);
            }
        }
        
        // Shuffle options
        this.currentOptions.sort(() => Math.random() - 0.5);
        
        // Create option buttons
        this.currentOptions.forEach(animal => {
            const button = document.createElement('button');
            button.className = 'quiz-option-btn';
            button.textContent = animal.name;
            button.addEventListener('click', () => this.checkAnswer(animal, button));
            this.quizOptionsContainer.appendChild(button);
        });
    }

    checkAnswer(selectedAnimal, buttonElement) {
        // Disable all buttons
        const allButtons = this.quizOptionsContainer.querySelectorAll('.quiz-option-btn');
        allButtons.forEach(btn => btn.disabled = true);
        
        // Increment total
        this.quizTotal++;
        
        if (selectedAnimal.id === this.currentQuizAnimal.id) {
            // Correct answer
            this.quizScore++;
            buttonElement.classList.add('correct');
            this.showFeedback('Correct! 🎉', 'correct');
            this.speakAnimalName('Correct! ' + selectedAnimal.name);
        } else {
            // Wrong answer
            buttonElement.classList.add('wrong');
            
            // Highlight correct answer
            allButtons.forEach(btn => {
                if (btn.textContent === this.currentQuizAnimal.name) {
                    btn.classList.add('correct');
                }
            });
            
            this.showFeedback(`Wrong! The correct answer is ${this.currentQuizAnimal.name}`, 'wrong');
            this.speakAnimalName('Wrong! The correct answer is ' + this.currentQuizAnimal.name);
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
        // Camera scanner is handled by animalRecognition.js
        // The button click will be handled by the AnimalRecognition class
    }
}

// Initialize Animal Learning when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const animalLearning = new AnimalLearning();
});
