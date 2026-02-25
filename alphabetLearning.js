// ===== Alphabet / Bornomala Learning Mode =====

class AlphabetLearning {
    constructor() {
        this.speech        = window.speechSynthesis;
        this.activeCard    = null;
        this.currentTab    = 'english';
        this.voices        = [];
        this.engVoice      = null;
        this.banglaVoice   = null;

        // Load voices (async in most browsers)
        this._loadVoices();
        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = () => this._loadVoices();
        }
    }

    // ── Voice Loading ───────────────────────────────────────
    _loadVoices() {
        this.voices      = this.speech.getVoices();
        this.banglaVoice = this.voices.find(v => v.lang.includes('bn') || v.lang.includes('ben')) || null;
        this.engVoice    = this.voices.find(v => v.lang.startsWith('en')) || null;
    }

    // ── Open / Close ────────────────────────────────────────
    openAlphabetLearning() {
        // Hide main header and container
        const mainHeader = document.querySelector('.header');
        const mainContainer = document.querySelector('.container');
        if (mainHeader) mainHeader.style.display = 'none';
        if (mainContainer) mainContainer.style.display = 'none';

        // Hide difficulty screen using class
        const difficultyScreen = document.getElementById('difficultyScreen');
        if (difficultyScreen) difficultyScreen.classList.add('hidden');

        // Hide game screen (Team A / Team B tug-of-war)
        const gameScreen = document.getElementById('gameScreen');
        if (gameScreen) gameScreen.style.display = 'none';

        // Show alphabet screen
        const screen = document.getElementById('alphabetLearningScreen');
        if (screen) screen.classList.add('active');

        // Render all tabs (once)
        if (!this._rendered) {
            this._renderAll();
            this._rendered = true;
        }

        // Activate the default tab
        this._switchTab(this.currentTab);
    }

    backToMain() {
        this.speech.cancel();
        this.activeCard = null;

        // Hide alphabet screen
        const screen = document.getElementById('alphabetLearningScreen');
        if (screen) screen.classList.remove('active');

        // Show main header and container
        const mainHeader = document.querySelector('.header');
        const mainContainer = document.querySelector('.container');
        if (mainHeader) mainHeader.style.display = 'block';
        if (mainContainer) mainContainer.style.display = 'block';

        // Show difficulty screen
        const difficultyScreen = document.getElementById('difficultyScreen');
        if (difficultyScreen) difficultyScreen.classList.remove('hidden');
    }

    // ── Tab Switching ────────────────────────────────────────
    _switchTab(tabId) {
        this.currentTab = tabId;

        // Update tab buttons
        document.querySelectorAll('.alphabet-tab-btn').forEach(btn => {
            btn.classList.toggle('active-tab', btn.dataset.tab === tabId);
        });

        // Update panels
        document.querySelectorAll('.alphabet-tab-panel').forEach(p => {
            p.classList.toggle('active-panel', p.id === `panel-${tabId}`);
        });

        // Reset preview
        this._resetPreview();
        this.speech.cancel();
        this.activeCard = null;
    }

    // ── Render All Tabs ──────────────────────────────────────
    _renderAll() {
        this._renderGrid('panel-english',     englishAlphabet,  'english');
        this._renderGrid('panel-vowels',      banglaVowels,     'bangla');
        this._renderGrid('panel-consonants',  banglaConsonants, 'bangla');
    }

    _renderGrid(panelId, dataArray, lang) {
        const panel = document.getElementById(panelId);
        if (!panel) return;

        const grid = panel.querySelector('.alphabet-grid');
        if (!grid) return;

        grid.innerHTML = '';

        dataArray.forEach(item => {
            const card = document.createElement('div');
            card.className = 'letter-card';
            card.style.borderColor = item.color;
            card.style.background  = `${item.color}18`; // 10% tint

            card.innerHTML = `
                <span class="card-emoji">${item.emoji}</span>
                <span class="card-letter" style="color:${item.color}">${item.letter}</span>
                <span class="card-word">${item.word}</span>
            `;

            card.addEventListener('click', () => this._handleClick(card, item, lang));
            grid.appendChild(card);
        });
    }

    // ── Click Handler ────────────────────────────────────────
    _handleClick(card, item, lang) {
        // De-activate previous card
        if (this.activeCard && this.activeCard !== card) {
            this.activeCard.classList.remove('active-card');
            const badge = this.activeCard.querySelector('.playing-badge');
            if (badge) badge.remove();
        }

        // Toggle: if same card clicked again, stop
        if (this.activeCard === card) {
            this.speech.cancel();
            card.classList.remove('active-card');
            const badge = card.querySelector('.playing-badge');
            if (badge) badge.remove();
            this.activeCard = null;
            this._resetPreview();
            return;
        }

        this.activeCard = card;
        card.classList.add('active-card', 'bounce');
        card.addEventListener('animationend', () => card.classList.remove('bounce'), { once: true });

        // Add playing badge
        const oldBadge = card.querySelector('.playing-badge');
        if (!oldBadge) {
            const badge = document.createElement('span');
            badge.className = 'playing-badge';
            badge.textContent = '♪';
            card.appendChild(badge);
        }

        // Update preview panel
        this._updatePreview(item);

        // Speak
        this._speak(item.speech, lang);
    }

    // ── Preview Panel ────────────────────────────────────────
    _updatePreview(item) {
        const emojiEl  = document.getElementById('previewEmoji');
        const letterEl = document.getElementById('previewLetter');
        const wordEl   = document.getElementById('previewWord');
        const hintEl   = document.getElementById('previewHint');
        const speakEl  = document.getElementById('previewSpeaking');

        if (emojiEl) {
            emojiEl.textContent = item.emoji;
            emojiEl.classList.remove('pop');
            void emojiEl.offsetWidth; // reflow
            emojiEl.classList.add('pop');
        }
        if (letterEl) {
            letterEl.textContent = item.letter;
            letterEl.style.background = `linear-gradient(135deg, ${item.color}, #764BA2)`;
            letterEl.style.webkitBackgroundClip = 'text';
            letterEl.style.webkitTextFillColor  = 'transparent';
            letterEl.style.backgroundClip       = 'text';
        }
        if (wordEl)  wordEl.textContent  = item.word;
        if (hintEl)  hintEl.textContent  = item.speech;
        if (speakEl) speakEl.classList.remove('hidden');
    }

    _resetPreview() {
        const emojiEl  = document.getElementById('previewEmoji');
        const letterEl = document.getElementById('previewLetter');
        const wordEl   = document.getElementById('previewWord');
        const hintEl   = document.getElementById('previewHint');
        const speakEl  = document.getElementById('previewSpeaking');

        if (emojiEl)  emojiEl.textContent  = '🔤';
        if (letterEl) {
            letterEl.textContent = '?';
            letterEl.style.background = '';
            letterEl.style.webkitBackgroundClip = '';
            letterEl.style.webkitTextFillColor  = '';
        }
        if (wordEl)  wordEl.textContent  = 'একটি অক্ষর বেছে নাও!';
        if (hintEl)  hintEl.textContent  = 'Pick a letter';
        if (speakEl) speakEl.classList.add('hidden');
    }

    // ── Speech Synthesis ─────────────────────────────────────
    _speak(text, lang) {
        this.speech.cancel();

        const utter = new SpeechSynthesisUtterance(text);
        utter.rate   = 0.85;
        utter.pitch  = 1.1;
        utter.volume = 1;

        if (lang === 'bangla' && this.banglaVoice) {
            utter.voice = this.banglaVoice;
            utter.lang  = 'bn-BD';
        } else if (lang === 'english' && this.engVoice) {
            utter.voice = this.engVoice;
            utter.lang  = 'en-US';
        } else {
            utter.lang = lang === 'bangla' ? 'bn-BD' : 'en-US';
        }

        utter.onend = () => {
            // Remove badge after speaking
            if (this.activeCard) {
                const badge = this.activeCard.querySelector('.playing-badge');
                if (badge) badge.remove();
            }
            const speakEl = document.getElementById('previewSpeaking');
            if (speakEl) speakEl.classList.add('hidden');
        };

        utter.onerror = () => {
            // Fallback: try again without specific voice
            try {
                const fallback = new SpeechSynthesisUtterance(text);
                fallback.rate  = 0.85;
                fallback.pitch = 1.1;
                this.speech.speak(fallback);
            } catch (e) {
                console.warn('Speech synthesis not available.');
            }
        };

        this.speech.speak(utter);
    }
}

// ── Init ─────────────────────────────────────────────────────
let alphabetLearning;

document.addEventListener('DOMContentLoaded', () => {
    alphabetLearning = new AlphabetLearning();

    // Main button
    const openBtn = document.getElementById('alphabetLearningBtn');
    if (openBtn) openBtn.addEventListener('click', () => alphabetLearning.openAlphabetLearning());

    // Back button
    const backBtn = document.getElementById('backToMainBtnAlphabet');
    if (backBtn) backBtn.addEventListener('click', () => alphabetLearning.backToMain());

    // Tab buttons
    document.querySelectorAll('.alphabet-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => alphabetLearning._switchTab(btn.dataset.tab));
    });
});
