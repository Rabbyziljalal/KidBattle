// ===== Brain Tug - Kids Learning Tug of War Game =====
// Main Game Logic

// ===== Game State Variables =====
let gameState = {
    isPlaying: false,
    currentDifficulty: 'easy',
    currentTeam: 'A', // 'A' or 'B'
    teamAName: 'TEAM A',
    teamBName: 'TEAM B',
    teamAScore: 0,
    teamBScore: 0,
    ropePosition: 0, // -100 (Team B wins) to +100 (Team A wins)
    timeRemaining: 300, // 5 minutes in seconds
    timerInterval: null,
    currentQuestion: null,
    questionPool: [],
    questionIndex: 0
};

// ===== DOM Elements =====
const elements = {
    // Screens
    difficultyScreen: document.getElementById('difficultyScreen'),
    gameScreen: document.getElementById('gameScreen'),
    gameOverScreen: document.getElementById('gameOverScreen'),
    
    // Difficulty buttons
    difficultyButtons: document.querySelectorAll('.difficulty-btn'),
    
    // Team name inputs
    teamANameInput: document.getElementById('teamANameInput'),
    teamBNameInput: document.getElementById('teamBNameInput'),
    
    // Team name labels
    teamALabel: document.getElementById('teamALabel'),
    teamBLabel: document.getElementById('teamBLabel'),
    teamAArenaLabel: document.getElementById('teamAArenaLabel'),
    teamBArenaLabel: document.getElementById('teamBArenaLabel'),
    finalTeamALabel: document.getElementById('finalTeamALabel'),
    finalTeamBLabel: document.getElementById('finalTeamBLabel'),
    
    // Timer
    timer: document.getElementById('timer'),
    progressBar: document.getElementById('progressBar'),
    
    // Scores
    teamAScore: document.getElementById('teamAScore'),
    teamBScore: document.getElementById('teamBScore'),
    
    // Rope
    rope: document.getElementById('rope'),
    
    // Turn indicator
    currentTurn: document.getElementById('currentTurn'),
    
    // Question section
    questionText: document.getElementById('questionText'),
    questionType: document.getElementById('questionType'),
    answerInput: document.getElementById('answerInput'),
    submitBtn: document.getElementById('submitBtn'),
    feedback: document.getElementById('feedback'),
    
    // Control buttons
    startBtn: document.getElementById('startBtn'),
    restartBtn: document.getElementById('restartBtn'),
    changeLevelBtn: document.getElementById('changeLevelBtn'),
    
    // Game over
    gameOverTitle: document.getElementById('gameOverTitle'),
    winnerAnnouncement: document.getElementById('winnerAnnouncement'),
    finalTeamAScore: document.getElementById('finalTeamAScore'),
    finalTeamBScore: document.getElementById('finalTeamBScore'),
    playAgainBtn: document.getElementById('playAgainBtn'),
    
    // Audio
    correctSound: document.getElementById('correctSound'),
    wrongSound: document.getElementById('wrongSound'),
    gameOverSound: document.getElementById('gameOverSound'),
    
    // Confetti
    confetti: document.getElementById('confetti')
};

// ===== Event Listeners =====
function initializeEventListeners() {
    // Difficulty selection
    elements.difficultyButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const level = btn.getAttribute('data-level');
            selectDifficulty(level);
        });
    });
    
    // Start game
    elements.startBtn.addEventListener('click', startGame);
    
    // Submit answer
    elements.submitBtn.addEventListener('click', submitAnswer);
    
    // Enter key to submit
    elements.answerInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !elements.submitBtn.disabled) {
            submitAnswer();
        }
    });
    
    // Restart game
    elements.restartBtn.addEventListener('click', restartGame);
    
    // Change level
    elements.changeLevelBtn.addEventListener('click', changeLevel);
    
    // Play again
    elements.playAgainBtn.addEventListener('click', playAgain);
}

// ===== Difficulty Selection =====
function selectDifficulty(level) {
    // Update team names from input fields
    updateTeamNames();
    
    gameState.currentDifficulty = level;
    gameState.questionPool = shuffleArray(getQuestionsByDifficulty(level));
    gameState.questionIndex = 0;
    
    // Hide difficulty screen, show game screen
    elements.difficultyScreen.classList.add('hidden');
    elements.gameScreen.classList.remove('hidden');
    
    console.log(`Difficulty selected: ${level}`);
    console.log(`Team names: ${gameState.teamAName} vs ${gameState.teamBName}`);
}

// ===== Update Team Names =====
function updateTeamNames() {
    // Get custom names or use defaults
    const teamAInput = elements.teamANameInput.value.trim().toUpperCase();
    const teamBInput = elements.teamBNameInput.value.trim().toUpperCase();
    
    gameState.teamAName = teamAInput || 'TEAM A';
    gameState.teamBName = teamBInput || 'TEAM B';
    
    // Update all team name displays
    elements.teamALabel.textContent = `${gameState.teamAName} 🔵`;
    elements.teamBLabel.textContent = `${gameState.teamBName} 🔴`;
    elements.teamAArenaLabel.textContent = gameState.teamAName;
    elements.teamBArenaLabel.textContent = gameState.teamBName;
    elements.finalTeamALabel.textContent = `${gameState.teamAName} 🔵`;
    elements.finalTeamBLabel.textContent = `${gameState.teamBName} 🔴`;
    
    // Update turn indicator
    updateTurnIndicator();
}

// ===== Start Game =====
function startGame() {
    if (gameState.isPlaying) return;
    
    gameState.isPlaying = true;
    gameState.timeRemaining = 300;
    gameState.teamAScore = 0;
    gameState.teamBScore = 0;
    gameState.ropePosition = 0;
    gameState.currentTeam = 'A';
    gameState.questionIndex = 0;
    
    // Update UI
    updateScores();
    updateRopePosition();
    
    // Enable inputs
    elements.answerInput.disabled = false;
    elements.submitBtn.disabled = false;
    
    // Hide start button, show restart button
    elements.startBtn.classList.add('hidden');
    elements.restartBtn.classList.remove('hidden');
    
    // Start timer
    startTimer();
    
    // Load first question
    loadNextQuestion();
    
    console.log('Game started!');
}

// ===== Timer Functions =====
function startTimer() {
    updateTimerDisplay();
    
    gameState.timerInterval = setInterval(() => {
        gameState.timeRemaining--;
        updateTimerDisplay();
        updateProgressBar();
        
        // Check for game end
        if (gameState.timeRemaining <= 0) {
            endGame();
        }
        
        // Add warning effects
        if (gameState.timeRemaining <= 30) {
            elements.timer.classList.add('danger');
        } else if (gameState.timeRemaining <= 60) {
            elements.timer.classList.add('warning');
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(gameState.timeRemaining / 60);
    const seconds = gameState.timeRemaining % 60;
    elements.timer.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function updateProgressBar() {
    const percentage = (gameState.timeRemaining / 300) * 100;
    elements.progressBar.style.width = `${percentage}%`;
}

function stopTimer() {
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
        gameState.timerInterval = null;
    }
}

// ===== Question Management =====
function loadNextQuestion() {
    if (!gameState.isPlaying) return;
    
    // Loop back to start if we've gone through all questions
    if (gameState.questionIndex >= gameState.questionPool.length) {
        gameState.questionPool = shuffleArray(gameState.questionPool);
        gameState.questionIndex = 0;
    }
    
    gameState.currentQuestion = gameState.questionPool[gameState.questionIndex];
    gameState.questionIndex++;
    
    // Display question
    elements.questionText.textContent = gameState.currentQuestion.question;
    elements.questionType.textContent = `${gameState.currentQuestion.type} - ${gameState.currentQuestion.category}`;
    
    // Clear previous answer and feedback
    elements.answerInput.value = '';
    elements.feedback.classList.add('hidden');
    
    // Update turn indicator
    updateTurnIndicator();
    
    // Focus on input
    elements.answerInput.focus();
}

// ===== Update Turn Indicator =====
function updateTurnIndicator() {
    const currentTeamName = gameState.currentTeam === 'A' ? gameState.teamAName : gameState.teamBName;
    elements.currentTurn.textContent = `${currentTeamName}'s Turn`;
}

// ===== Answer Submission =====
function submitAnswer() {
    if (!gameState.isPlaying) return;
    
    const userAnswer = elements.answerInput.value.trim().toLowerCase();
    const correctAnswer = gameState.currentQuestion.answer.toLowerCase();
    
    if (!userAnswer) {
        showFeedback('Please enter an answer!', false);
        return;
    }
    
    // Check if answer is correct
    const isCorrect = userAnswer === correctAnswer;
    
    if (isCorrect) {
        handleCorrectAnswer();
    } else {
        handleIncorrectAnswer();
    }
    
    // Load next question after delay
    setTimeout(() => {
        switchTeam();
        loadNextQuestion();
    }, 1500);
}

function handleCorrectAnswer() {
    // Update score
    if (gameState.currentTeam === 'A') {
        gameState.teamAScore++;
        gameState.ropePosition += 5; // Move rope right (Team A pulling)
        animateTeamPull('A');
    } else {
        gameState.teamBScore++;
        gameState.ropePosition -= 5; // Move rope left (Team B pulling)
        animateTeamPull('B');
    }
    
    // Ensure rope position stays within bounds
    gameState.ropePosition = Math.max(-100, Math.min(100, gameState.ropePosition));
    
    // Update UI
    updateScores();
    updateRopePosition();
    showFeedback('✓ Correct! Great job!', true);
    
    // Play sound
    playSound(elements.correctSound);
    
    const currentTeamName = gameState.currentTeam === 'A' ? gameState.teamAName : gameState.teamBName;
    console.log(`Correct answer by ${currentTeamName}`);
}

// ===== Animate Team Pull =====
function animateTeamPull(team) {
    const teamClass = team === 'A' ? '.char-team-a' : '.char-team-b';
    const characters = document.querySelectorAll(teamClass);
    
    characters.forEach(char => {
        // Add a strong pull animation
        char.style.animation = 'none';
        setTimeout(() => {
            char.style.animation = '';
        }, 50);
    });
}

function handleIncorrectAnswer() {
    showFeedback(`✗ Incorrect. The answer is: ${gameState.currentQuestion.answer}`, false);
    
    // Play sound
    playSound(elements.wrongSound);
    
    const currentTeamName = gameState.currentTeam === 'A' ? gameState.teamAName : gameState.teamBName;
    console.log(`Incorrect answer by ${currentTeamName}`);
}

function showFeedback(message, isCorrect) {
    elements.feedback.textContent = message;
    elements.feedback.className = 'feedback';
    
    if (isCorrect) {
        elements.feedback.classList.add('correct');
    } else {
        elements.feedback.classList.add('incorrect');
    }
    
    elements.feedback.classList.remove('hidden');
}

// ===== Team Management =====
function switchTeam() {
    gameState.currentTeam = gameState.currentTeam === 'A' ? 'B' : 'A';
}

// ===== UI Update Functions =====
function updateScores() {
    elements.teamAScore.textContent = gameState.teamAScore;
    elements.teamBScore.textContent = gameState.teamBScore;
}

function updateRopePosition() {
    // Calculate percentage: -100 to 100 maps to -50% to 50% transform
    const translateX = (gameState.ropePosition / 100) * 50;
    elements.rope.style.transform = `translateX(${translateX}%)`;
    
    // Update 3D scene if available
    if (window.tugScene3D) {
        const normalizedPosition = gameState.ropePosition / 100; // -1 to 1
        window.tugScene3D.updateRopePosition(normalizedPosition);
    }
    
    // Make characters lean based on rope position
    const teamACharacters = document.querySelectorAll('.char-team-a');
    const teamBCharacters = document.querySelectorAll('.char-team-b');
    
    // Calculate lean angle (max 15 degrees)
    const leanAngle = Math.min(Math.abs(gameState.ropePosition) / 10, 15);
    
    teamACharacters.forEach(char => {
        if (gameState.ropePosition > 0) {
            // Team A is winning, lean back more
            char.style.transform = `rotate(${leanAngle}deg)`;
        } else {
            // Team A is losing, lean forward
            char.style.transform = `rotate(-${leanAngle * 0.5}deg)`;
        }
    });
    
    teamBCharacters.forEach(char => {
        if (gameState.ropePosition < 0) {
            // Team B is winning, lean back more
            char.style.transform = `rotate(-${leanAngle}deg)`;
        } else {
            // Team B is losing, lean forward
            char.style.transform = `rotate(${leanAngle * 0.5}deg)`;
        }
    });
}

// ===== Game End =====
function endGame() {
    gameState.isPlaying = false;
    stopTimer();
    
    // Disable inputs
    elements.answerInput.disabled = true;
    elements.submitBtn.disabled = true;
    
    // Play game over sound
    playSound(elements.gameOverSound);
    
    // Determine winner
    let winner;
    if (gameState.ropePosition > 10) {
        winner = 'A';
    } else if (gameState.ropePosition < -10) {
        winner = 'B';
    } else {
        winner = 'Draw';
    }
    
    // Display game over screen
    displayGameOver(winner);
    
    console.log('Game ended!');
}

function displayGameOver(winner) {
    // Update final scores
    elements.finalTeamAScore.textContent = gameState.teamAScore;
    elements.finalTeamBScore.textContent = gameState.teamBScore;
    
    // Update winner announcement
    elements.winnerAnnouncement.className = 'winner-announcement';
    
    if (winner === 'A') {
        elements.winnerAnnouncement.textContent = `🎉 ${gameState.teamAName} Wins! 🎉`;
        elements.winnerAnnouncement.classList.add('team-a-wins');
        createConfetti();
    } else if (winner === 'B') {
        elements.winnerAnnouncement.textContent = `🎉 ${gameState.teamBName} Wins! 🎉`;
        elements.winnerAnnouncement.classList.add('team-b-wins');
        createConfetti();
    } else {
        elements.winnerAnnouncement.textContent = '🤝 It\'s a Draw! 🤝';
    }
    
    // Show game over screen
    elements.gameOverScreen.classList.remove('hidden');
}

// ===== Confetti Animation =====
function createConfetti() {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#feca57', '#ff9ff3', '#48dbfb'];
    const confettiCount = 100;
    
    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            const confettiPiece = document.createElement('div');
            confettiPiece.className = 'confetti-piece';
            confettiPiece.style.left = Math.random() * 100 + '%';
            confettiPiece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confettiPiece.style.animationDelay = '0s';
            confettiPiece.style.animationDuration = (Math.random() * 2 + 2) + 's';
            
            elements.confetti.appendChild(confettiPiece);
            
            // Remove after animation
            setTimeout(() => {
                confettiPiece.remove();
            }, 4000);
        }, i * 30);
    }
}

// ===== Sound Functions =====
function playSound(audioElement) {
    if (audioElement) {
        audioElement.currentTime = 0;
        audioElement.play().catch(err => {
            console.log('Audio play failed:', err);
        });
    }
}

// ===== Game Control Functions =====
function restartGame() {
    // Reset game state
    stopTimer();
    
    // Reset timer display
    elements.timer.classList.remove('warning', 'danger');
    
    // Clear confetti
    elements.confetti.innerHTML = '';
    
    // Hide restart button, show start button
    elements.restartBtn.classList.add('hidden');
    elements.startBtn.classList.remove('hidden');
    
    // Reset UI
    gameState.isPlaying = false;
    gameState.timeRemaining = 300;
    gameState.teamAScore = 0;
    gameState.teamBScore = 0;
    gameState.ropePosition = 0;
    gameState.currentTeam = 'A';
    gameState.questionIndex = 0;
    
    // Keep team names as they are (don't reset them)
    
    updateScores();
    updateRopePosition();
    updateTimerDisplay();
    updateProgressBar();
    updateTurnIndicator();
    
    // Reset question display
    elements.questionText.textContent = 'Click Start to begin!';
    elements.questionType.textContent = '';
    elements.answerInput.value = '';
    elements.answerInput.disabled = true;
    elements.submitBtn.disabled = true;
    elements.feedback.classList.add('hidden');
    
    // Reshuffle questions
    gameState.questionPool = shuffleArray(getQuestionsByDifficulty(gameState.currentDifficulty));
    
    // 🔥 Reset 3D tug-of-war scene
    if (window.tugScene3D) {
        window.tugScene3D.resetGame();
    }
    
    console.log('Game restarted');
}

function changeLevel() {
    // Confirm if game is playing
    if (gameState.isPlaying) {
        const confirm = window.confirm('Are you sure you want to change level? Current game will be lost.');
        if (!confirm) return;
        
        stopTimer();
    }
    
    // Update input fields with current team names
    elements.teamANameInput.value = gameState.teamAName === 'TEAM A' ? '' : gameState.teamAName;
    elements.teamBNameInput.value = gameState.teamBName === 'TEAM B' ? '' : gameState.teamBName;
    
    // Reset scores and go back to difficulty selection
    restartGame();
    elements.gameScreen.classList.add('hidden');
    elements.difficultyScreen.classList.remove('hidden');
}

function playAgain() {
    // Hide game over screen
    elements.gameOverScreen.classList.add('hidden');
    
    // Clear confetti
    elements.confetti.innerHTML = '';
    
    // Restart game
    restartGame();
}

// ===== Initialization =====
function initializeGame() {
    console.log('Initializing Brain Tug game...');
    initializeEventListeners();
    
    // Show difficulty selection screen initially
    elements.difficultyScreen.classList.remove('hidden');
    elements.gameScreen.classList.add('hidden');
    elements.gameOverScreen.classList.add('hidden');
    
    console.log('Game initialized successfully!');
}

// Start the game when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeGame);
} else {
    initializeGame();
}
