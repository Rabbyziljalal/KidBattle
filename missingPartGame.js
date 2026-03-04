// ===== Missing Part Game - Drag & Drop Spelling Game =====

class MissingPartGame {
    constructor() {
        this.gameScreen = document.getElementById('missingPartGameScreen');
        this.speech = window.speechSynthesis;
        this.speakerEnabled = true;
        
        // Game state
        this.score = 0;
        this.lives = 3;
        this.level = 'easy'; // easy, medium, hard
        this.currentWord = null;
        this.currentImage = null;
        this.missingIndices = [];
        this.questionPool = [];
        
        // DOM elements
        this.backBtn = document.getElementById('backToMainBtnMissing');
        this.speakerBtn = document.getElementById('speakerToggleBtnMissing');
        this.newQuestionBtn = document.getElementById('newQuestionBtn');
        this.checkAnswerBtn = document.getElementById('checkAnswerBtn');
        this.letterPool = document.getElementById('letterPool');
        this.wordDisplay = document.getElementById('wordDisplay');
        this.objectPicture = document.getElementById('objectPicture');
        this.cartoonFace = document.getElementById('cartoonFace');
        this.feedbackMessage = document.getElementById('feedbackMessage');
        this.celebrationConfetti = document.getElementById('celebrationConfetti');
        this.scoreDisplay = document.getElementById('gameScore');
        this.livesDisplay = document.getElementById('gameLives');
        this.levelDisplay = document.getElementById('gameLevel');

        // Show Picture Part elements
        this.showPicturePartBtn = document.getElementById('showPicturePartBtn');
        this.pictureHintPanel  = document.getElementById('pictureHintPanel');
        this.hintEmoji         = document.getElementById('hintEmoji');
        this.hintWordLabel     = document.getElementById('hintWordLabel');
        this.pictureHintVisible = false;
        
        this.initializeEventListeners();
        this.loadQuestions();
    }

    initializeEventListeners() {
        if (this.backBtn) {
            this.backBtn.addEventListener('click', () => this.backToMain());
        }
        
        if (this.speakerBtn) {
            this.speakerBtn.addEventListener('click', () => this.toggleSpeaker());
        }
        
        if (this.newQuestionBtn) {
            this.newQuestionBtn.addEventListener('click', () => this.loadNewQuestion());
        }
        
        if (this.checkAnswerBtn) {
            this.checkAnswerBtn.addEventListener('click', () => this.checkAnswer());
        }

        if (this.showPicturePartBtn) {
            this.showPicturePartBtn.addEventListener('click', () => this.togglePictureHint());
        }
    }

    togglePictureHint() {
        this.pictureHintVisible = !this.pictureHintVisible;

        if (this.pictureHintVisible) {
            // Update hint content
            if (this.hintEmoji)     this.hintEmoji.textContent = this.currentImage || '❓';
            if (this.hintWordLabel) {
                // Show masked word: revealed letters shown, missing shown as _
                const masked = this.currentWord
                    ? this.currentWord.split('').map((ch, i) =>
                        this.missingIndices.includes(i) ? '_' : ch).join(' ')
                    : '?????';
                this.hintWordLabel.textContent = masked;
            }

            // Show panel with fresh animation
            if (this.pictureHintPanel) {
                this.pictureHintPanel.classList.remove('hidden');
                // Re-trigger animation by cloning trick
                this.pictureHintPanel.style.animation = 'none';
                void this.pictureHintPanel.offsetWidth; // reflow
                this.pictureHintPanel.style.animation = '';
            }

            // Toggle button label & style
            if (this.showPicturePartBtn) {
                this.showPicturePartBtn.classList.add('active-toggle');
                this.showPicturePartBtn.querySelector('.spb-icon').textContent = '🙈';
                this.showPicturePartBtn.querySelector('.spb-text').textContent = 'Hide Picture Part';
            }

            // Play a cheerful hint sound
            this.playSound('hint');
        } else {
            if (this.pictureHintPanel) this.pictureHintPanel.classList.add('hidden');
            if (this.showPicturePartBtn) {
                this.showPicturePartBtn.classList.remove('active-toggle');
                this.showPicturePartBtn.querySelector('.spb-icon').textContent = '🖼️';
                this.showPicturePartBtn.querySelector('.spb-text').textContent = 'Show Picture Part';
            }
        }
    }

    hidePictureHint() {
        this.pictureHintVisible = false;
        if (this.pictureHintPanel) this.pictureHintPanel.classList.add('hidden');
        if (this.showPicturePartBtn) {
            this.showPicturePartBtn.classList.remove('active-toggle');
            if (this.showPicturePartBtn.querySelector('.spb-icon'))
                this.showPicturePartBtn.querySelector('.spb-icon').textContent = '🖼️';
            if (this.showPicturePartBtn.querySelector('.spb-text'))
                this.showPicturePartBtn.querySelector('.spb-text').textContent = 'Show Picture Part';
        }
    }

    openGame() {
        // Hide main screens
        const difficultyScreen = document.getElementById('difficultyScreen');
        const mainHeader = document.querySelector('.header');
        const mainContainer = document.querySelector('.container');
        
        if (difficultyScreen) difficultyScreen.classList.add('hidden');
        if (mainHeader) mainHeader.style.display = 'none';
        if (mainContainer) mainContainer.style.display = 'none';
        
        // Show game screen
        if (this.gameScreen) {
            this.gameScreen.classList.add('active');
        }
        
        // Reset game
        this.resetGame();
        this.loadNewQuestion();
    }

    backToMain() {
        // Hide game screen
        if (this.gameScreen) {
            this.gameScreen.classList.remove('active');
        }
        
        // Hide Team Game screen explicitly
        const teamGameScreen = document.getElementById('gameScreen');
        const gameOverScreen = document.getElementById('gameOverScreen');
        if (teamGameScreen) {
            teamGameScreen.classList.add('hidden');
        }
        if (gameOverScreen) {
            gameOverScreen.classList.add('hidden');
        }
        
        // Show main menu
        const difficultyScreen = document.getElementById('difficultyScreen');
        const mainHeader = document.querySelector('.header');
        const mainContainer = document.querySelector('.container');
        
        if (mainHeader) mainHeader.style.display = 'block';
        if (mainContainer) mainContainer.style.display = 'block';
        if (difficultyScreen) difficultyScreen.classList.remove('hidden');
        
        // Reset game states if gameState exists
        if (typeof window.gameState !== 'undefined') {
            window.gameState.isPlaying = false;
            window.gameState.currentDifficulty = null;
        }
        
        // Stop any speech
        this.speech.cancel();
        
        // Clear any active intervals/timeouts
        if (typeof window.gameState !== 'undefined' && window.gameState.timerInterval) {
            clearInterval(window.gameState.timerInterval);
            window.gameState.timerInterval = null;
        }
    }

    toggleSpeaker() {
        this.speakerEnabled = !this.speakerEnabled;
        if (this.speakerBtn) {
            this.speakerBtn.textContent = this.speakerEnabled ? '🔊' : '🔇';
            this.speakerBtn.title = this.speakerEnabled ? 'Sound On' : 'Sound Off';
        }
        if (!this.speakerEnabled) {
            this.speech.cancel();
        }
    }

    resetGame() {
        this.score = 0;
        this.lives = 3;
        this.updateStats();
        this.changeFace('😊');
    }

    updateStats() {
        if (this.scoreDisplay) {
            this.scoreDisplay.textContent = this.score;
        }
        if (this.livesDisplay) {
            this.livesDisplay.textContent = '❤️'.repeat(this.lives);
        }
        if (this.levelDisplay) {
            const levelNames = { easy: 'Easy', medium: 'Medium', hard: 'Hard' };
            this.levelDisplay.textContent = levelNames[this.level] || 'Easy';
        }
    }

    loadQuestions() {
        // Collect words from various learning modes
        this.questionPool = [];
        
        // From Alphabet Data
        if (typeof englishAlphabet !== 'undefined') {
            this.questionPool.push(...englishAlphabet.map(item => ({
                word: item.word.toUpperCase(),
                emoji: item.emoji,
                category: 'alphabet'
            })));
        }
        
        // From Fruit Data
        if (typeof fruitDatabase !== 'undefined') {
            this.questionPool.push(...fruitDatabase.map(item => ({
                word: item.name.toUpperCase(),
                emoji: item.emoji,
                category: 'fruit'
            })));
        }
        
        // From Vegetable Data
        if (typeof vegetableDatabase !== 'undefined') {
            this.questionPool.push(...vegetableDatabase.map(item => ({
                word: item.name.toUpperCase(),
                emoji: item.emoji,
                category: 'vegetable'
            })));
        }
        
        // From Animal Data
        if (typeof animalDatabase !== 'undefined') {
            this.questionPool.push(...animalDatabase.map(item => ({
                word: item.name.toUpperCase(),
                emoji: item.emoji,
                category: 'animal'
            })));
        }
        
        // From Birds Data
        if (typeof birdsDatabase !== 'undefined') {
            this.questionPool.push(...birdsDatabase.map(item => ({
                word: item.name.toUpperCase(),
                emoji: item.emoji,
                category: 'birds'
            })));
        }
        
        // Filter out words that are too short or too long
        this.questionPool = this.questionPool.filter(q => 
            q.word.length >= 3 && q.word.length <= 10
        );
    }

    loadNewQuestion() {
        if (this.questionPool.length === 0) {
            this.showFeedback('No questions available!', 'wrong');
            return;
        }
        
        // Pick random word
        const randomIndex = Math.floor(Math.random() * this.questionPool.length);
        this.currentWord = this.questionPool[randomIndex].word;
        this.currentImage = this.questionPool[randomIndex].emoji;
        
        // Determine how many letters to hide based on level
        const hideCount = this.level === 'easy' ? 1 : 
                         this.level === 'medium' ? 2 : 3;
        
        // Select random indices to hide
        this.missingIndices = [];
        const availableIndices = [...Array(this.currentWord.length).keys()];
        
        for (let i = 0; i < Math.min(hideCount, this.currentWord.length - 1); i++) {
            const randomIdx = Math.floor(Math.random() * availableIndices.length);
            this.missingIndices.push(availableIndices[randomIdx]);
            availableIndices.splice(randomIdx, 1);
        }
        
        // Render the word and letter pool
        this.renderWord();
        this.renderLetterPool();
        
        // Update object picture
        this.updateObjectPicture();
        
        // Speak the word
        this.speakWord();
        
        // Reset feedback
        this.feedbackMessage.classList.remove('show', 'correct', 'wrong');
        this.changeFace('😊');

        // Auto-hide the picture hint when a new question loads
        this.hidePictureHint();
    }

    renderWord() {
        if (!this.wordDisplay) return;
        
        this.wordDisplay.innerHTML = '';
        
        for (let i = 0; i < this.currentWord.length; i++) {
            const box = document.createElement('div');
            box.className = 'letter-box';
            box.dataset.index = i;
            
            if (this.missingIndices.includes(i)) {
                // Empty box for dropping
                box.setAttribute('data-empty', 'true');
                this.setupDropZone(box);
            } else {
                // Show the letter
                box.textContent = this.currentWord[i];
                box.classList.add('visible-letter');
            }
            
            this.wordDisplay.appendChild(box);
        }
    }

    renderLetterPool() {
        if (!this.letterPool) return;
        
        this.letterPool.innerHTML = '';
        
        // Get missing letters
        const missingLetters = this.missingIndices.map(i => this.currentWord[i]);
        
        // Add some wrong letters as distractors
        const wrongLetters = this.getWrongLetters(3);
        const allLetters = [...missingLetters, ...wrongLetters];
        
        // Shuffle letters
        this.shuffleArray(allLetters);
        
        // Create draggable tiles
        allLetters.forEach(letter => {
            const tile = document.createElement('div');
            tile.className = 'letter-tile';
            tile.textContent = letter;
            tile.draggable = true;
            tile.dataset.letter = letter;
            
            this.setupDraggable(tile);
            this.letterPool.appendChild(tile);
        });
    }

    updateObjectPicture() {
        if (!this.objectPicture) return;
        
        // Remove any existing animations
        this.objectPicture.classList.remove('bounce-animation', 'shake-animation');
        
        // Set the emoji/image for the current word
        if (this.currentImage) {
            this.objectPicture.textContent = this.currentImage;
        }
    }

    getWrongLetters(count) {
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const wrongLetters = [];
        const usedLetters = this.currentWord.split('');
        
        while (wrongLetters.length < count) {
            const randomLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
            if (!usedLetters.includes(randomLetter) && !wrongLetters.includes(randomLetter)) {
                wrongLetters.push(randomLetter);
            }
        }
        
        return wrongLetters;
    }

    setupDraggable(tile) {
        tile.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', tile.dataset.letter);
            tile.classList.add('dragging');
        });
        
        tile.addEventListener('dragend', () => {
            tile.classList.remove('dragging');
        });
    }

    setupDropZone(box) {
        box.addEventListener('dragover', (e) => {
            e.preventDefault();
            box.classList.add('drop-over');
        });
        
        box.addEventListener('dragleave', () => {
            box.classList.remove('drop-over');
        });
        
        box.addEventListener('drop', (e) => {
            e.preventDefault();
            box.classList.remove('drop-over');
            
            const letter = e.dataTransfer.getData('text/plain');
            
            // Place letter in box
            if (box.getAttribute('data-empty') === 'true') {
                box.textContent = letter;
                box.classList.add('filled');
                box.removeAttribute('data-empty');
                
                // Mark the tile as used
                const tiles = this.letterPool.querySelectorAll('.letter-tile');
                tiles.forEach(tile => {
                    if (tile.dataset.letter === letter && !tile.classList.contains('used')) {
                        tile.classList.add('used');
                        return;
                    }
                });
                
                // Play drop sound
                this.playSound('drop');
            }
        });
    }

    checkAnswer() {
        const boxes = this.wordDisplay.querySelectorAll('.letter-box');
        let userWord = '';
        let allFilled = true;
        
        boxes.forEach(box => {
            const letter = box.textContent.trim();
            if (letter) {
                userWord += letter;
            } else {
                allFilled = false;
            }
        });
        
        if (!allFilled) {
            this.showFeedback('Please fill all the blanks!', 'wrong');
            return;
        }
        
        if (userWord === this.currentWord) {
            this.handleCorrectAnswer();
        } else {
            this.handleWrongAnswer();
        }
    }

    handleCorrectAnswer() {
        this.score += 10;
        this.updateStats();
        
        // Show correct feedback
        this.showFeedback('🎉 Yay! Correct! Well done! 🎉', 'correct');
        this.changeFace('😄');
        this.cartoonFace.classList.add('happy');
        
        // Animate object picture (bounce)
        if (this.objectPicture) {
            this.objectPicture.classList.add('bounce-animation');
            setTimeout(() => {
                this.objectPicture.classList.remove('bounce-animation');
            }, 1800);
        }
        
        // Add glow to boxes
        const boxes = this.wordDisplay.querySelectorAll('.letter-box');
        boxes.forEach(box => box.classList.add('correct-glow'));
        
        // Play celebration sound
        this.playSound('correct');
        this.speak('Yay! Correct! Well done!');
        
        // Show confetti
        this.showConfetti();
        
        // Load new question after delay
        setTimeout(() => {
            this.cartoonFace.classList.remove('happy');
            this.loadNewQuestion();
        }, 3000);
    }

    handleWrongAnswer() {
        this.lives--;
        this.updateStats();
        
        if (this.lives <= 0) {
            this.showFeedback('Game Over! Try Again!', 'wrong');
            this.changeFace('😢');
            
            setTimeout(() => {
                this.resetGame();
                this.loadNewQuestion();
            }, 2000);
            return;
        }
        
        // Show wrong feedback
        this.showFeedback('❌ Oops! Try Again! Almost there!', 'wrong');
        this.changeFace('😢');
        this.cartoonFace.classList.add('sad');
        
        // Animate object picture (shake)
        if (this.objectPicture) {
            this.objectPicture.classList.add('shake-animation');
            setTimeout(() => {
                this.objectPicture.classList.remove('shake-animation');
            }, 1000);
        }
        
        // Highlight wrong letters
        const boxes = this.wordDisplay.querySelectorAll('.letter-box');
        boxes.forEach((box, i) => {
            if (box.textContent !== this.currentWord[i]) {
                box.classList.add('wrong-highlight');
                setTimeout(() => box.classList.remove('wrong-highlight'), 500);
            }
        });
        
        // Play wrong sound
        this.playSound('wrong');
        this.speak('Oops! Try again! Almost there!');
        
        setTimeout(() => {
            this.cartoonFace.classList.remove('sad');
            this.changeFace('😊');
            this.feedbackMessage.classList.remove('show');
            
            // Clear filled boxes
            boxes.forEach(box => {
                if (box.classList.contains('filled')) {
                    box.textContent = '';
                    box.classList.remove('filled');
                    box.setAttribute('data-empty', 'true');
                }
            });
            
            // Reset letter tiles
            const tiles = this.letterPool.querySelectorAll('.letter-tile');
            tiles.forEach(tile => tile.classList.remove('used'));
        }, 2000);
    }

    showFeedback(message, type) {
        if (!this.feedbackMessage) return;
        
        this.feedbackMessage.textContent = message;
        this.feedbackMessage.className = `feedback-message show ${type}`;
    }

    changeFace(emoji) {
        if (this.cartoonFace) {
            this.cartoonFace.textContent = emoji;
        }
    }

    showConfetti() {
        if (!this.celebrationConfetti) return;
        
        this.celebrationConfetti.classList.remove('hidden');
        this.celebrationConfetti.innerHTML = '';
        
        const colors = ['#FF6B6B', '#FFD93D', '#6BCF7F', '#4ECDC4', '#667eea', '#764ba2'];
        
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti-piece';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = (Math.random() * 0.5) + 's';
            confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
            this.celebrationConfetti.appendChild(confetti);
        }
        
        setTimeout(() => {
            this.celebrationConfetti.classList.add('hidden');
        }, 3000);
    }

    speakWord() {
        if (!this.speakerEnabled) return;
        
        this.speech.cancel();
        const utterance = new SpeechSynthesisUtterance(`Spell the word: ${this.currentWord}`);
        utterance.rate = 0.8;
        utterance.pitch = 1.2;
        this.speech.speak(utterance);
    }

    speak(text) {
        if (!this.speakerEnabled) return;
        
        this.speech.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1.1;
        this.speech.speak(utterance);
    }

    playSound(type) {
        // Simple beep sounds using Web Audio API
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            if (type === 'correct') {
                oscillator.frequency.value = 523.25; // C5
                gainNode.gain.value = 0.3;
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.2);
            } else if (type === 'wrong') {
                oscillator.frequency.value = 200; // Lower tone
                gainNode.gain.value = 0.2;
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.3);
            } else if (type === 'drop') {
                oscillator.frequency.value = 400;
                gainNode.gain.value = 0.1;
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.1);
            } else if (type === 'hint') {
                // Two-tone cheerful chime
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
                oscillator.frequency.setValueAtTime(1100, audioContext.currentTime + 0.12);
                gainNode.gain.setValueAtTime(0.25, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.4);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.4);
            }
        } catch (e) {
            console.log('Audio not supported');
        }
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
}

// Initialize game
let missingPartGame;

document.addEventListener('DOMContentLoaded', () => {
    missingPartGame = new MissingPartGame();
    
    // Button event listener
    const btn = document.getElementById('missingPartGameBtn');
    if (btn) {
        btn.addEventListener('click', () => {
            if (missingPartGame) {
                missingPartGame.openGame();
            }
        });
    }
});
