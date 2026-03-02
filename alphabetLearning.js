// ===== Alphabet / Bornomala Learning Mode =====

class AlphabetLearning {
    constructor() {
        this.speech        = window.speechSynthesis;
        this.activeCard    = null;
        this.currentTab    = 'english';
        this.voices        = [];
        this.engVoice      = null;
        this.banglaVoice   = null;
        this.speakerEnabled = true; // Speaker default ON for Times Tables
        this.pendingTimeouts = []; // Track setTimeout IDs for clearing

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
        this._clearPendingTimeouts();
        this.activeCard = null;

        // Hide alphabet screen
        const screen = document.getElementById('alphabetLearningScreen');
        if (screen) screen.classList.remove('active');

        // Show main header and container
        const mainHeader = document.querySelector('.header');
        const mainContainer = document.querySelector('.container');
        if (mainHeader) mainHeader.style.display = 'block';
        if (mainContainer) mainContainer.style.display = 'block';

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
        if (difficultyScreen) difficultyScreen.classList.remove('hidden');
    }

    // ── Speaker Toggle (Times Tables) ────────────────────────
    toggleSpeaker() {
        this.speakerEnabled = !this.speakerEnabled;
        const btn = document.getElementById('speakerToggleBtn');
        if (btn) {
            btn.textContent = this.speakerEnabled ? '🔊' : '🔇';
            btn.title = this.speakerEnabled ? 'Turn Sound Off' : 'Turn Sound On';
        }
        // Immediately cancel any ongoing speech and pending timeouts when turning off
        if (!this.speakerEnabled) {
            this.speech.cancel();
            this._clearPendingTimeouts();
        }
    }

    // ── Clear Pending Speech Timeouts ────────────────────────
    _clearPendingTimeouts() {
        this.pendingTimeouts.forEach(id => clearTimeout(id));
        this.pendingTimeouts = [];
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
        this._clearPendingTimeouts();
        this.activeCard = null;
    }

    // ── Render All Tabs ──────────────────────────────────────
    _renderAll() {
        this._renderGrid('panel-english',        englishAlphabet,     'english');
        this._renderGrid('panel-vowels',         banglaVowels,        'bangla');
        this._renderGrid('panel-consonants',     banglaConsonants,    'bangla');
        this._renderNumberGrid('panel-eng-numbers',    englishNumbers,      'english');
        this._renderNumberGrid('panel-bangla-numbers', banglaNumbers,       'bangla');
        this._renderMultiplicationTables('panel-multiplication', multiplicationTables);
        this._renderNumberGrid('panel-even',           evenNumbers,         'english');
        this._renderNumberGrid('panel-odd',            oddNumbers,          'english');
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

    _renderNumberGrid(panelId, dataArray, lang) {
        const panel = document.getElementById(panelId);
        if (!panel) return;

        const grid = panel.querySelector('.alphabet-grid');
        if (!grid) return;

        grid.innerHTML = '';

        dataArray.forEach(item => {
            const card = document.createElement('div');
            card.className = 'letter-card number-card';
            card.style.borderColor = item.color;
            card.style.background  = `${item.color}18`; // 10% tint

            // Simple number display without emoji
            card.innerHTML = `
                <span class="card-letter" style="color:${item.color}; font-size: 1.8rem;">${item.letter}</span>
                <span class="card-word" style="font-size: 0.7rem;">${item.word}</span>
            `;

            card.addEventListener('click', () => this._handleClick(card, item, lang));
            grid.appendChild(card);
        });
    }

    _renderMultiplicationTables(panelId, dataArray) {
        const panel = document.getElementById(panelId);
        if (!panel) return;

        const grid = panel.querySelector('.multiplication-tables-grid');
        if (!grid) return;

        grid.innerHTML = '';
        grid.style.display = 'grid';
        grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(120px, 1fr))';
        grid.style.gap = '14px';

        dataArray.forEach(table => {
            const card = document.createElement('div');
            card.className = 'letter-card';
            card.style.borderColor = table.color;
            card.style.background = `${table.color}18`;

            card.innerHTML = `
                <span class="card-emoji">${table.emoji}</span>
                <span class="card-letter" style="color:${table.color}">${table.letter}</span>
                <span class="card-word">${table.word}</span>
            `;

            card.addEventListener('click', () => this._handleTableClick(card, table));
            grid.appendChild(card);
        });
    }

    _handleTableClick(card, table) {
        // De-activate previous card
        if (this.activeCard && this.activeCard !== card) {
            this.activeCard.classList.remove('active-card');
            const badge = this.activeCard.querySelector('.playing-badge');
            if (badge) badge.remove();
        }

        // Toggle
        if (this.activeCard === card) {
            this.speech.cancel();
            this._clearPendingTimeouts();
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

        // Update preview with table content
        const emojiEl = document.getElementById('previewEmoji');
        const letterEl = document.getElementById('previewLetter');
        const wordEl = document.getElementById('previewWord');
        const hintEl = document.getElementById('previewHint');
        const speakEl = document.getElementById('previewSpeaking');

        if (emojiEl) {
            emojiEl.textContent = table.emoji;
            emojiEl.classList.remove('pop');
            void emojiEl.offsetWidth;
            emojiEl.classList.add('pop');
        }
        if (letterEl) {
            letterEl.textContent = table.letter;
            letterEl.style.background = `linear-gradient(135deg, ${table.color}, #764BA2)`;
            letterEl.style.webkitBackgroundClip = 'text';
            letterEl.style.webkitTextFillColor = 'transparent';
            letterEl.style.backgroundClip = 'text';
        }
        if (wordEl) {
            // Display all rows
            wordEl.innerHTML = table.rows.map(r => `<div style="font-size: 0.85rem; margin: 2px 0;">${r.equation}</div>`).join('');
        }
        if (hintEl) hintEl.textContent = table.speech;
        if (speakEl) speakEl.classList.remove('hidden');

        // Speak the table
        this._speakTable(table);
    }

    _speakTable(table) {
        this.speech.cancel();
        this._clearPendingTimeouts(); // Clear any pending speech timeouts
        
        // Don't speak if speaker is disabled
        if (!this.speakerEnabled) {
            return;
        }
        
        // Speak header first
        const headerUtter = new SpeechSynthesisUtterance(`Table of ${table.letter}`);
        headerUtter.rate = 0.85;
        headerUtter.pitch = 1.1;
        if (this.engVoice) headerUtter.voice = this.engVoice;
        
        this.speech.speak(headerUtter);

        // Then speak each row with delay
        table.rows.forEach((row, idx) => {
            const timeoutId = setTimeout(() => {
                // Check speaker state before speaking (in case it was turned off during delay)
                if (!this.speakerEnabled) return;
                
                const utter = new SpeechSynthesisUtterance(row.speech);
                utter.rate = 0.85;
                utter.pitch = 1.1;
                if (this.engVoice) utter.voice = this.engVoice;
                
                if (idx === table.rows.length - 1) {
                    utter.onend = () => {
                        if (this.activeCard) {
                            const badge = this.activeCard.querySelector('.playing-badge');
                            if (badge) badge.remove();
                        }
                        const speakEl = document.getElementById('previewSpeaking');
                        if (speakEl) speakEl.classList.add('hidden');
                    };
                }
                
                this.speech.speak(utter);
            }, idx * 1200); // 1.2 second delay between rows
            
            // Store timeout ID so we can clear it if needed
            this.pendingTimeouts.push(timeoutId);
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
            this._clearPendingTimeouts();
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

        // Hide emoji for number sections
        const isNumber = item.emoji === "🔢" || item.emoji === "2️⃣" || item.emoji === "1️⃣";
        
        if (emojiEl) {
            if (isNumber) {
                emojiEl.style.display = 'none';
            } else {
                emojiEl.style.display = 'block';
                emojiEl.textContent = item.emoji;
                emojiEl.classList.remove('pop');
                void emojiEl.offsetWidth; // reflow
                emojiEl.classList.add('pop');
            }
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

        if (emojiEl) {
            emojiEl.style.display = 'block';
            emojiEl.textContent = '🔤';
        }
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

    // Speaker toggle button (Times Tables)
    const speakerBtn = document.getElementById('speakerToggleBtn');
    if (speakerBtn) {
        speakerBtn.addEventListener('click', () => alphabetLearning.toggleSpeaker());
    }
});
