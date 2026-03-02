// ===== Poem Learning Mode - Main Logic =====

class PoemLearning {
    constructor() {
        this.poems = poemDatabase;
        this.speech = window.speechSynthesis;
        this.currentlyReading = null;
        this.activeCard = null;
        
        this.initializeElements();
        this.setupEventListeners();
    }

    initializeElements() {
        // Main containers
        this.poemScreen = document.getElementById('poemLearningScreen');
        this.banglaContainer = document.getElementById('banglaPoems');
        this.englishContainer = document.getElementById('englishPoems');
        
        // Control buttons
        this.backBtn = document.getElementById('backToMainBtnPoem');
    }

    setupEventListeners() {
        // Back button
        if (this.backBtn) {
            this.backBtn.addEventListener('click', () => this.backToMain());
        }
        
        // Render poems when screen becomes active
        if (this.poemScreen) {
            this.renderPoems();
        }
    }

    openPoemLearning() {
        // Hide difficulty screen and game screen
        const difficultyScreen = document.getElementById('difficultyScreen');
        const gameScreen = document.getElementById('gameScreen');
        const fruitScreen = document.getElementById('fruitLearningScreen');
        const vegetableScreen = document.getElementById('vegetableLearningScreen');
        const animalScreen = document.getElementById('animalLearningScreen');
        const birdsScreen = document.getElementById('birdsLearningScreen');
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
        
        if (birdsScreen) {
            birdsScreen.classList.remove('active');
        }
        
        // Hide main header and container
        if (mainHeader) {
            mainHeader.style.display = 'none';
        }
        if (mainContainer) {
            mainContainer.style.display = 'none';
        }
        
        // Show poem learning screen
        if (this.poemScreen) {
            this.poemScreen.classList.add('active');
        }
    }

    backToMain() {
        // Stop any ongoing speech
        if (this.speech.speaking) {
            this.speech.cancel();
        }
        
        // Hide poem learning screen
        if (this.poemScreen) {
            this.poemScreen.classList.remove('active');
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

    renderPoems() {
        // Render Bangla poems
        if (this.banglaContainer) {
            this.banglaContainer.innerHTML = '';
            this.poems.bangla.forEach(poem => {
                const card = this.createPoemCard(poem, 'bangla');
                this.banglaContainer.appendChild(card);
            });
        }
        
        // Render English poems
        if (this.englishContainer) {
            this.englishContainer.innerHTML = '';
            this.poems.english.forEach(poem => {
                const card = this.createPoemCard(poem, 'english');
                this.englishContainer.appendChild(card);
            });
        }
    }

    createPoemCard(poem, language) {
        const card = document.createElement('div');
        card.className = 'poem-card';
        card.style.borderLeftColor = poem.color;
        
        // Create poem lines HTML
        const linesHTML = poem.lines.map((line, index) => 
            `<div class="poem-line" data-line-index="${index}">${line}</div>`
        ).join('');
        
        card.innerHTML = `
            <div class="poem-card-header">
                <h3 class="poem-title">${poem.title}</h3>
                <span class="poem-emoji">${poem.emoji}</span>
            </div>
            <div class="poem-content">
                ${linesHTML}
            </div>
            <p class="poem-author">— ${poem.author}</p>
            <button class="play-poem-btn" title="Play Poem">🔊</button>
        `;
        
        // Add click event to play button
        const playBtn = card.querySelector('.play-poem-btn');
        playBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.readPoem(poem, language, card);
        });
        
        // Add click event to card
        card.addEventListener('click', () => {
            this.highlightCard(card);
        });
        
        return card;
    }

    highlightCard(card) {
        // Remove active class from previously active card
        if (this.activeCard && this.activeCard !== card) {
            this.activeCard.classList.remove('active');
        }
        
        // Toggle active state
        if (card.classList.contains('active')) {
            card.classList.remove('active');
            this.activeCard = null;
        } else {
            card.classList.add('active');
            this.activeCard = card;
        }
    }

    async readPoem(poem, language, cardElement) {
        // Stop any ongoing speech
        if (this.speech.speaking) {
            this.speech.cancel();
            
            // Reset all play buttons and line highlights
            document.querySelectorAll('.play-poem-btn').forEach(btn => {
                btn.classList.remove('playing');
                btn.textContent = '🔊';
            });
            document.querySelectorAll('.poem-line').forEach(line => {
                line.classList.remove('reading');
            });
            
            this.currentlyReading = null;
            return;
        }
        
        const playBtn = cardElement.querySelector('.play-poem-btn');
        const lines = cardElement.querySelectorAll('.poem-line');
        
        // Mark as playing
        playBtn.classList.add('playing');
        playBtn.textContent = '⏸️';
        this.currentlyReading = poem.id;
        
        // Set voice based on language
        const voices = this.speech.getVoices();
        let selectedVoice = null;
        
        if (language === 'bangla') {
            // Try to find Bengali voice
            selectedVoice = voices.find(voice => 
                voice.lang.includes('bn') || 
                voice.lang.includes('bengali')
            );
        } else {
            // Use English voice
            selectedVoice = voices.find(voice => 
                voice.lang.includes('en-US') || 
                voice.lang.includes('en-GB')
            );
        }
        
        // Read each line with highlight
        for (let i = 0; i < poem.lines.length; i++) {
            if (this.currentlyReading !== poem.id) break;
            
            // Highlight current line
            lines[i].classList.add('reading');
            
            await this.speakLine(poem.lines[i], selectedVoice);
            
            // Remove highlight after speaking
            lines[i].classList.remove('reading');
            
            // Small pause between lines
            await this.sleep(300);
        }
        
        // Reset button after finishing
        playBtn.classList.remove('playing');
        playBtn.textContent = '🔊';
        this.currentlyReading = null;
    }

    speakLine(text, voice) {
        return new Promise((resolve) => {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.8;
            utterance.pitch = 1.1;
            utterance.volume = 1.0;
            
            if (voice) {
                utterance.voice = voice;
            }
            
            utterance.onend = () => resolve();
            utterance.onerror = () => resolve();
            
            this.speech.speak(utterance);
        });
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize Poem Learning Mode
let poemLearning;

document.addEventListener('DOMContentLoaded', () => {
    // Initialize immediately
    poemLearning = new PoemLearning();
    
    // Wait for voices to load
    if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = () => {
            console.log('Voices loaded for poem reading');
        };
    }
    
    // Setup poem learning button
    const poemLearningBtn = document.getElementById('poemLearningBtn');
    if (poemLearningBtn) {
        poemLearningBtn.addEventListener('click', () => {
            if (poemLearning) {
                poemLearning.openPoemLearning();
            }
        });
    }
});
