// ===== Flower Learning Mode - Main Logic =====

class FlowerLearning {
    constructor() {
        this.flowers = flowerDatabase;
        this.currentMode = 'learn';
        this.quizScore = 0;
        this.quizTotal = 0;
        this.currentQuizFlower = null;
        this.currentOptions = [];
        this.speech = window.speechSynthesis;

        this.currentPage = 1;
        this.flowersPerPage = 8;
        this.totalPages = Math.ceil(this.flowers.length / this.flowersPerPage);

        this.touchStartX = 0;
        this.touchEndX = 0;

        this.initializeElements();
        this.setupEventListeners();
    }

    initializeElements() {
        this.flowerScreen = document.getElementById('flowerLearningScreen');
        this.flowerGridContainer = document.getElementById('flowerGridContainer');
        this.quizContainer = document.getElementById('flowerQuizContainer');

        this.flowerLearningBtn = document.getElementById('flowerLearningBtn');
        this.backToMainBtn = document.getElementById('backToMainBtnFlower');
        this.homeBtn = document.getElementById('homeBtnFlower');
        this.quizModeBtn = document.getElementById('quizModeBtnFlower');
        this.learnModeBtn = document.getElementById('learnModeBtnFlower');
        this.nextQuestionBtn = document.getElementById('nextQuestionBtnFlower');

        this.prevPageBtn = document.getElementById('prevPageBtnFlower');
        this.nextPageBtn = document.getElementById('nextPageBtnFlower');
        this.pageInfo = document.getElementById('pageInfoFlower');
        this.pageDots = document.getElementById('pageDotsFlower');
        this.flowerGrid = document.getElementById('flowerGrid');

        this.quizScoreDisplay = document.getElementById('quizScoreDisplayFlower');
        this.quizFlowerDisplay = document.getElementById('quizFlowerDisplay');
        this.quizOptionsContainer = document.getElementById('quizOptionsFlower');
        this.quizFeedback = document.getElementById('quizFeedbackFlower');
    }

    setupEventListeners() {
        if (this.flowerLearningBtn) {
            this.flowerLearningBtn.addEventListener('click', () => this.openFlowerLearning());
        }

        if (this.backToMainBtn) {
            this.backToMainBtn.addEventListener('click', () => this.backToMain());
        }

        if (this.homeBtn) {
            this.homeBtn.addEventListener('click', () => this.goHome());
        }

        if (this.quizModeBtn) {
            this.quizModeBtn.addEventListener('click', () => this.switchToQuizMode());
        }

        if (this.learnModeBtn) {
            this.learnModeBtn.addEventListener('click', () => this.switchToLearnMode());
        }

        if (this.prevPageBtn) {
            this.prevPageBtn.addEventListener('click', () => this.goToPreviousPage());
        }

        if (this.nextPageBtn) {
            this.nextPageBtn.addEventListener('click', () => this.goToNextPage());
        }

        if (this.nextQuestionBtn) {
            this.nextQuestionBtn.addEventListener('click', () => this.loadNextQuestion());
        }

        if (this.flowerGridContainer) {
            this.flowerGridContainer.addEventListener('touchstart', (event) => {
                this.touchStartX = event.changedTouches[0].screenX;
            }, { passive: true });

            this.flowerGridContainer.addEventListener('touchend', (event) => {
                this.touchEndX = event.changedTouches[0].screenX;
                this.handleSwipe();
            }, { passive: true });
        }
    }

    handleSwipe() {
        const swipeDistance = this.touchStartX - this.touchEndX;
        const minSwipeDistance = 50;

        if (Math.abs(swipeDistance) < minSwipeDistance) return;

        if (swipeDistance > 0) {
            this.goToNextPage();
        } else {
            this.goToPreviousPage();
        }
    }

    openFlowerLearning() {
        const difficultyScreen = document.getElementById('difficultyScreen');
        const gameScreen = document.getElementById('gameScreen');
        const fruitScreen = document.getElementById('fruitLearningScreen');
        const vegetableScreen = document.getElementById('vegetableLearningScreen');
        const animalScreen = document.getElementById('animalLearningScreen');
        const birdsScreen = document.getElementById('birdsLearningScreen');
        const poemScreen = document.getElementById('poemLearningScreen');
        const alphabetScreen = document.getElementById('alphabetLearningScreen');
        const mainHeader = document.querySelector('.header');
        const mainContainer = document.querySelector('.container');

        if (difficultyScreen) difficultyScreen.classList.add('hidden');
        if (gameScreen) gameScreen.style.display = 'none';
        if (fruitScreen) fruitScreen.classList.remove('active');
        if (vegetableScreen) vegetableScreen.classList.remove('active');
        if (animalScreen) animalScreen.classList.remove('active');
        if (birdsScreen) birdsScreen.classList.remove('active');
        if (poemScreen) poemScreen.classList.remove('active');
        if (alphabetScreen) alphabetScreen.classList.remove('active');

        if (mainHeader) mainHeader.style.display = 'none';
        if (mainContainer) mainContainer.style.display = 'none';

        if (this.flowerScreen) this.flowerScreen.classList.add('active');

        this.switchToLearnMode();
    }

    backToMain() {
        if (this.flowerScreen) this.flowerScreen.classList.remove('active');

        const mainHeader = document.querySelector('.header');
        const mainContainer = document.querySelector('.container');
        if (mainHeader) mainHeader.style.display = 'block';
        if (mainContainer) mainContainer.style.display = 'block';

        const teamGameScreen = document.getElementById('gameScreen');
        const gameOverScreen = document.getElementById('gameOverScreen');
        if (teamGameScreen) teamGameScreen.classList.add('hidden');
        if (gameOverScreen) gameOverScreen.classList.add('hidden');

        const difficultyScreen = document.getElementById('difficultyScreen');
        if (difficultyScreen) difficultyScreen.classList.remove('hidden');
    }

    goHome() {
        window.location.reload();
    }

    switchToLearnMode() {
        this.currentMode = 'learn';

        if (this.flowerGridContainer) this.flowerGridContainer.classList.remove('hidden');
        if (this.quizContainer) this.quizContainer.classList.remove('active');

        this.currentPage = 1;
        this.renderFlowerGrid();
        this.updatePaginationButtons();
        this.renderPageDots();
    }

    switchToQuizMode() {
        this.currentMode = 'quiz';

        if (this.flowerGridContainer) this.flowerGridContainer.classList.add('hidden');
        if (this.quizContainer) this.quizContainer.classList.add('active');

        this.quizScore = 0;
        this.quizTotal = 0;
        this.updateQuizScore();
        this.loadNextQuestion();
    }

    renderFlowerGrid() {
        if (!this.flowerGrid) return;

        this.flowerGrid.innerHTML = '';

        const startIndex = (this.currentPage - 1) * this.flowersPerPage;
        const endIndex = startIndex + this.flowersPerPage;
        const flowersToShow = this.flowers.slice(startIndex, endIndex);

        this.flowerGrid.classList.remove('page-turn-next', 'page-turn-prev');
        void this.flowerGrid.offsetWidth;

        flowersToShow.forEach((flower, index) => {
            const card = document.createElement('div');
            card.className = 'birds-card';
            card.style.borderBottom = `5px solid ${flower.color}`;
            card.style.animationDelay = `${index * 0.1}s`;

            card.innerHTML = `
                <div class="bird-type-badge">${flower.type || 'Flower'}</div>
                <span class="birds-emoji">${flower.emoji || '🌸'}</span>
                <p class="birds-name">${flower.name}</p>
                <p class="birds-name-bengali">${flower.bengaliName || flower.name}</p>
            `;

            card.addEventListener('click', () => {
                this.speakFlowerName(flower.pronunciation || flower.name);
                card.classList.add('birds-clicked');
                setTimeout(() => card.classList.remove('birds-clicked'), 500);
            });

            this.flowerGrid.appendChild(card);
        });

        this.updatePageInfo();
    }

    updatePageInfo() {
        if (this.pageInfo) {
            this.pageInfo.textContent = `Page ${this.currentPage} of ${this.totalPages}`;
        }
    }

    updatePaginationButtons() {
        if (this.prevPageBtn) this.prevPageBtn.disabled = (this.currentPage === 1);
        if (this.nextPageBtn) this.nextPageBtn.disabled = (this.currentPage === this.totalPages);
    }

    renderPageDots() {
        if (!this.pageDots) return;

        this.pageDots.innerHTML = '';
        for (let i = 1; i <= this.totalPages; i++) {
            const dot = document.createElement('div');
            dot.className = 'page-dot';
            if (i === this.currentPage) dot.classList.add('active');
            dot.addEventListener('click', () => this.goToPage(i));
            this.pageDots.appendChild(dot);
        }
    }

    goToNextPage() {
        if (this.currentPage < this.totalPages) {
            if (this.flowerGrid) this.flowerGrid.classList.add('page-turn-next');
            this.currentPage++;
            setTimeout(() => {
                this.renderFlowerGrid();
                this.updatePaginationButtons();
                this.renderPageDots();
            }, 400);
        }
    }

    goToPreviousPage() {
        if (this.currentPage > 1) {
            if (this.flowerGrid) this.flowerGrid.classList.add('page-turn-prev');
            this.currentPage--;
            setTimeout(() => {
                this.renderFlowerGrid();
                this.updatePaginationButtons();
                this.renderPageDots();
            }, 400);
        }
    }

    goToPage(pageNumber) {
        if (pageNumber !== this.currentPage && pageNumber >= 1 && pageNumber <= this.totalPages) {
            if (this.flowerGrid) {
                this.flowerGrid.classList.add(pageNumber > this.currentPage ? 'page-turn-next' : 'page-turn-prev');
            }
            this.currentPage = pageNumber;
            setTimeout(() => {
                this.renderFlowerGrid();
                this.updatePaginationButtons();
                this.renderPageDots();
            }, 400);
        }
    }

    speakFlowerName(name) {
        if (this.speech) {
            this.speech.cancel();
            const utterance = new SpeechSynthesisUtterance(name);
            utterance.rate = 0.8;
            utterance.pitch = 1.1;
            utterance.volume = 1;
            this.speech.speak(utterance);
        }
    }

    loadNextQuestion() {
        if (this.quizFeedback) {
            this.quizFeedback.classList.remove('show', 'correct', 'wrong');
            this.quizFeedback.textContent = '';
        }

        if (this.nextQuestionBtn) this.nextQuestionBtn.style.display = 'none';

        this.currentQuizFlower = this.flowers[Math.floor(Math.random() * this.flowers.length)];

        if (this.quizFlowerDisplay) {
            this.quizFlowerDisplay.textContent = this.currentQuizFlower.emoji || '🌸';
        }

        this.generateQuizOptions();
    }

    generateQuizOptions() {
        if (!this.quizOptionsContainer) return;

        const correctAnswer = this.currentQuizFlower.name;
        this.currentOptions = [correctAnswer];

        while (this.currentOptions.length < 4) {
            const randomFlower = this.flowers[Math.floor(Math.random() * this.flowers.length)];
            if (!this.currentOptions.includes(randomFlower.name)) {
                this.currentOptions.push(randomFlower.name);
            }
        }

        this.currentOptions.sort(() => Math.random() - 0.5);
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
        const correctAnswer = this.currentQuizFlower.name;
        const allButtons = this.quizOptionsContainer.querySelectorAll('.quiz-option-btn');

        allButtons.forEach(btn => btn.disabled = true);

        if (selectedAnswer === correctAnswer) {
            button.classList.add('correct');
            this.quizScore++;
            if (this.quizFeedback) {
                this.quizFeedback.textContent = '✅ Correct! Great job!';
                this.quizFeedback.classList.add('show', 'correct');
            }
            this.speakFlowerName(correctAnswer);
        } else {
            button.classList.add('wrong');
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

        if (this.nextQuestionBtn) this.nextQuestionBtn.style.display = 'block';
    }

    updateQuizScore() {
        if (this.quizScoreDisplay) {
            this.quizScoreDisplay.textContent = `Score: ${this.quizScore} / ${this.quizTotal}`;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.flowerLearning = new FlowerLearning();
});
