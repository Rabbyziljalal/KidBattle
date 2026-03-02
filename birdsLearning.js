// ===== Birds Learning Mode - Main Logic =====

class BirdsLearning {
    constructor() {
        this.birds = birdsDatabase;
        this.currentMode = 'learn'; // 'learn' or 'quiz'
        this.quizScore = 0;
        this.quizTotal = 0;
        this.currentQuizBird = null;
        this.currentOptions = [];
        this.speech = window.speechSynthesis;
        
        // Pagination
        this.currentPage = 1;
        this.birdsPerPage = 8; // 8 birds per page
        this.totalPages = Math.ceil(this.birds.length / this.birdsPerPage);
        
        this.initializeElements();
        this.setupEventListeners();
    }

    initializeElements() {
        // Main containers
        this.birdScreen = document.getElementById('birdsLearningScreen');
        this.birdGridContainer = document.getElementById('birdsGridContainer');
        this.quizContainer = document.getElementById('birdsQuizContainer');
        
        // Buttons
        this.birdLearningBtn = document.getElementById('birdsLearningBtn');
        this.backToMainBtn = document.getElementById('backToMainBtnBirds');
        this.quizModeBtn = document.getElementById('quizModeBtnBirds');
        this.learnModeBtn = document.getElementById('learnModeBtnBirds');
        this.cameraRecognitionBtn = document.getElementById('cameraRecognitionBtnBirds');
        this.nextQuestionBtn = document.getElementById('nextQuestionBtnBirds');
        
        // Pagination elements
        this.prevPageBtn = document.getElementById('prevPageBtnBirds');
        this.nextPageBtn = document.getElementById('nextPageBtnBirds');
        this.pageInfo = document.getElementById('pageInfoBirds');
        this.pageDots = document.getElementById('pageDotsBirds');
        
        // Quiz elements
        this.quizScoreDisplay = document.getElementById('quizScoreDisplayBirds');
        this.quizBirdDisplay = document.getElementById('quizBirdDisplay');
        this.quizOptionsContainer = document.getElementById('quizOptionsBirds');
        this.quizFeedback = document.getElementById('quizFeedbackBirds');
    }

    setupEventListeners() {
        // Main entry button
        if (this.birdLearningBtn) {
            this.birdLearningBtn.addEventListener('click', () => this.openBirdsLearning());
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

    openBirdsLearning() {
        // Hide difficulty screen and game screen
        const difficultyScreen = document.getElementById('difficultyScreen');
        const gameScreen = document.getElementById('gameScreen');
        const fruitScreen = document.getElementById('fruitLearningScreen');
        const vegetableScreen = document.getElementById('vegetableLearningScreen');
        const animalScreen = document.getElementById('animalLearningScreen');
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
        
        if (animalScreen) {
            animalScreen.classList.remove('active');
        }
        
        // Hide main header and container
        if (mainHeader) {
            mainHeader.style.display = 'none';
        }
        if (mainContainer) {
            mainContainer.style.display = 'none';
        }
        
        // Show bird learning screen
        if (this.birdScreen) {
            this.birdScreen.classList.add('active');
        }
        
        // Initialize learn mode
        this.switchToLearnMode();
    }

    backToMain() {
        // Hide bird learning screen
        if (this.birdScreen) {
            this.birdScreen.classList.remove('active');
        }
        
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
    }

    switchToLearnMode() {
        this.currentMode = 'learn';
        
        // Show grid, hide quiz
        if (this.birdGridContainer) {
            this.birdGridContainer.classList.remove('hidden');
        }
        
        if (this.quizContainer) {
            this.quizContainer.classList.remove('active');
        }
        
        // Reset to page 1 and render
        this.currentPage = 1;
        this.renderBirdGrid();
        this.updatePaginationButtons();
        this.renderPageDots();
    }

    switchToQuizMode() {
        this.currentMode = 'quiz';
        
        // Hide grid, show quiz
        if (this.birdGridContainer) {
            this.birdGridContainer.classList.add('hidden');
        }
        
        if (this.quizContainer) {
            this.quizContainer.classList.add('active');
        }
        
        // Reset quiz
        this.quizScore = 0;
        this.quizTotal = 0;
        this.updateQuizScore();
        this.loadNextQuestion();
    }

    renderBirdGrid() {
        const grid = document.getElementById('birdsGrid');
        if (!grid) return;
        
        // Clear grid
        grid.innerHTML = '';
        
        // Calculate which birds to show on current page
        const startIndex = (this.currentPage - 1) * this.birdsPerPage;
        const endIndex = startIndex + this.birdsPerPage;
        const birdsToShow = this.birds.slice(startIndex, endIndex);
        
        // Add page turn animation
        grid.classList.remove('page-turn-next', 'page-turn-prev');
        void grid.offsetWidth; // Trigger reflow
        
        // Render bird cards
        birdsToShow.forEach((bird, index) => {
            const card = document.createElement('div');
            card.className = 'birds-card';
            card.style.borderBottom = `5px solid ${bird.color}`;
            card.style.animationDelay = `${index * 0.1}s`;
            
            card.innerHTML = `
                <div class="bird-type-badge">${bird.type || 'Bird'}</div>
                <span class="birds-emoji">${bird.emoji}</span>
                <p class="birds-name">${bird.name}</p>
                <p class="birds-name-bengali">${bird.bengaliName}</p>
            `;
            
            // Add click event to speak bird name
            card.addEventListener('click', () => {
                this.speakBirdName(`${bird.name}, ${bird.bengaliName}`);
                card.classList.add('birds-clicked');
                setTimeout(() => {
                    card.classList.remove('birds-clicked');
                }, 500);
            });
            
            grid.appendChild(card);
        });
        
        // Update page info
        this.updatePageInfo();
    }

    updatePageInfo() {
        if (this.pageInfo) {
            this.pageInfo.textContent = `Page ${this.currentPage} of ${this.totalPages}`;
        }
    }

    updatePaginationButtons() {
        // Disable prev button on first page
        if (this.prevPageBtn) {
            this.prevPageBtn.disabled = (this.currentPage === 1);
        }
        
        // Disable next button on last page
        if (this.nextPageBtn) {
            this.nextPageBtn.disabled = (this.currentPage === this.totalPages);
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

    goToNextPage() {
        if (this.currentPage < this.totalPages) {
            const grid = document.getElementById('birdsGrid');
            if (grid) {
                grid.classList.add('page-turn-next');
            }
            
            this.currentPage++;
            setTimeout(() => {
                this.renderBirdGrid();
                this.updatePaginationButtons();
                this.renderPageDots();
            }, 400);
        }
    }

    goToPreviousPage() {
        if (this.currentPage > 1) {
            const grid = document.getElementById('birdsGrid');
            if (grid) {
                grid.classList.add('page-turn-prev');
            }
            
            this.currentPage--;
            setTimeout(() => {
                this.renderBirdGrid();
                this.updatePaginationButtons();
                this.renderPageDots();
            }, 400);
        }
    }

    goToPage(pageNumber) {
        if (pageNumber !== this.currentPage && pageNumber >= 1 && pageNumber <= this.totalPages) {
            const grid = document.getElementById('birdsGrid');
            if (grid) {
                grid.classList.add(pageNumber > this.currentPage ? 'page-turn-next' : 'page-turn-prev');
            }
            
            this.currentPage = pageNumber;
            setTimeout(() => {
                this.renderBirdGrid();
                this.updatePaginationButtons();
                this.renderPageDots();
            }, 400);
        }
    }

    speakBirdName(name) {
        if (this.speech) {
            this.speech.cancel(); // Cancel any ongoing speech
            const utterance = new SpeechSynthesisUtterance(name);
            utterance.rate = 0.8;
            utterance.pitch = 1.1;
            utterance.volume = 1;
            this.speech.speak(utterance);
        }
    }

    openCameraScanner() {
        // Camera scanner is handled by birdRecognition.js
        // The button click will be handled by the BirdRecognition class
    }

    // ===== Quiz Mode Methods =====

    loadNextQuestion() {
        // Hide feedback and next button
        if (this.quizFeedback) {
            this.quizFeedback.classList.remove('show', 'correct', 'wrong');
            this.quizFeedback.textContent = '';
        }
        
        if (this.nextQuestionBtn) {
            this.nextQuestionBtn.style.display = 'none';
        }
        
        // Select random bird
        this.currentQuizBird = this.birds[Math.floor(Math.random() * this.birds.length)];
        
        // Display bird emoji
        if (this.quizBirdDisplay) {
            this.quizBirdDisplay.textContent = this.currentQuizBird.emoji;
        }
        
        // Generate options
        this.generateQuizOptions();
    }

    generateQuizOptions() {
        if (!this.quizOptionsContainer) return;
        
        const correctAnswer = this.currentQuizBird.name;
        this.currentOptions = [correctAnswer];
        
        // Generate 3 random wrong answers
        while (this.currentOptions.length < 4) {
            const randomBird = this.birds[Math.floor(Math.random() * this.birds.length)];
            if (!this.currentOptions.includes(randomBird.name)) {
                this.currentOptions.push(randomBird.name);
            }
        }
        
        // Shuffle options
        this.currentOptions.sort(() => Math.random() - 0.5);
        
        // Clear and create option buttons
        this.quizOptionsContainer.innerHTML = '';
        
        this.currentOptions.forEach(option => {
            const button = document.createElement('button');
            button.className = 'quiz-option-btn';
            button.textContent = option;
            button.addEventListener('click', () => this.checkAnswer(option, button));
            this.quizOptionsContainer.appendChild(button);
        });
    }

    checkAnswer(selectedAnswer, button) {
        const correctAnswer = this.currentQuizBird.name;
        const allButtons = this.quizOptionsContainer.querySelectorAll('.quiz-option-btn');
        
        // Disable all buttons
        allButtons.forEach(btn => btn.disabled = true);
        
        // Check if correct
        if (selectedAnswer === correctAnswer) {
            button.classList.add('correct');
            this.quizScore++;
            if (this.quizFeedback) {
                this.quizFeedback.textContent = '✅ Correct! Well done!';
                this.quizFeedback.classList.add('show', 'correct');
            }
            this.speakBirdName(correctAnswer);
        } else {
            button.classList.add('wrong');
            // Highlight correct answer
            allButtons.forEach(btn => {
                if (btn.textContent === correctAnswer) {
                    btn.classList.add('correct');
                }
            });
            if (this.quizFeedback) {
                this.quizFeedback.textContent = `❌ Wrong! It's ${correctAnswer}`;
                this.quizFeedback.classList.add('show', 'wrong');
            }
        }
        
        this.quizTotal++;
        this.updateQuizScore();
        
        // Show next question button
        if (this.nextQuestionBtn) {
            this.nextQuestionBtn.style.display = 'block';
        }
    }

    updateQuizScore() {
        if (this.quizScoreDisplay) {
            this.quizScoreDisplay.textContent = `Score: ${this.quizScore} / ${this.quizTotal}`;
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.birdsLearning = new BirdsLearning();
});
