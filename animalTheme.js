/**
 * Animal Theme System for Main Button Page
 * Creates interactive floating animals with sounds and animations
 */

class AnimalThemeSystem {
    constructor() {
        this.animals = [];
        this.audioContext = null;
        this.soundEnabled = true;
        this.currentTheme = this.selectRandomTheme();
        this.animationFrame = null;
        this.initialized = false;
        
        // Animal definitions with sounds and animations
        this.animalTypes = [
            { emoji: '🐻', name: 'bear', sound: 'growl', speed: 0.3, size: 120 },
            { emoji: '🦊', name: 'fox', sound: 'yelp', speed: 0.5, size: 100 },
            { emoji: '🐰', name: 'rabbit', sound: 'squeak', speed: 0.7, size: 90 },
            { emoji: '🐘', name: 'elephant', sound: 'trumpet', speed: 0.2, size: 140 },
            { emoji: '🐼', name: 'panda', sound: 'chirp', speed: 0.4, size: 110 },
            { emoji: '🦁', name: 'lion', sound: 'roar', speed: 0.35, size: 130 },
            { emoji: '🦅', name: 'eagle', sound: 'screech', speed: 0.6, size: 95 },
            { emoji: '🦜', name: 'parrot', sound: 'chirp', speed: 0.8, size: 85 }
        ];
    }

    selectRandomTheme() {
        const themes = ['morning', 'day', 'evening', 'night'];
        return themes[Math.floor(Math.random() * themes.length)];
    }

    init() {
        if (this.initialized) return;
        
        // Create audio context
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Apply theme
        this.applyTheme();
        
        // Create animals
        this.createAnimals();
        
        // Create clouds
        this.createClouds();
        
        // Create sound toggle button
        this.createSoundToggle();
        
        // Start animation loop
        this.startAnimation();
        
        this.initialized = true;
    }

    applyTheme() {
        const screen = document.getElementById('difficultyScreen');
        if (!screen) return;
        
        screen.setAttribute('data-theme', this.currentTheme);
        
        // Apply theme-specific styles
        const themes = {
            morning: { sky: 'linear-gradient(180deg, #87CEEB 0%, #B0E0E6 50%, #FFE4B5 100%)', stars: false },
            day: { sky: 'linear-gradient(180deg, #4A90E2 0%, #87CEEB 50%, #B0E0E6 100%)', stars: false },
            evening: { sky: 'linear-gradient(180deg, #FF6B6B 0%, #FF8E53 50%, #FFD93D 100%)', stars: false },
            night: { sky: 'linear-gradient(180deg, #0F2027 0%, #203A43 50%, #2C5364 100%)', stars: true }
        };
        
        const theme = themes[this.currentTheme];
        screen.style.background = theme.sky;
        
        // Add stars for night theme
        if (theme.stars) {
            this.createStars();
        }
    }

    createAnimals() {
        const container = document.getElementById('animalContainer');
        if (!container) {
            const newContainer = document.createElement('div');
            newContainer.id = 'animalContainer';
            newContainer.className = 'animal-container';
            document.getElementById('difficultyScreen').appendChild(newContainer);
        }
        
        const numAnimals = Math.min(6, this.animalTypes.length);
        const selectedTypes = this.shuffleArray([...this.animalTypes]).slice(0, numAnimals);
        
        selectedTypes.forEach((type, index) => {
            this.createAnimal(type, index);
        });
    }

    createAnimal(type, index) {
        const animal = document.createElement('div');
        animal.className = 'floating-animal';
        animal.innerHTML = type.emoji;
        animal.style.fontSize = `${type.size}px`;
        
        // Random starting position (avoid center where buttons are)
        const position = this.getRandomSafePosition();
        animal.style.left = `${position.x}px`;
        animal.style.top = `${position.y}px`;
        
        // Store animal data
        const animalData = {
            element: animal,
            type: type,
            x: position.x,
            y: position.y,
            vx: (Math.random() - 0.5) * type.speed,
            vy: (Math.random() - 0.5) * type.speed,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 0.5,
            idleTimer: 0,
            idleInterval: 3000 + Math.random() * 3000
        };
        
        this.animals.push(animalData);
        
        // Add click handler
        animal.addEventListener('click', (e) => this.handleAnimalClick(animalData, e));
        
        // Add to container
        document.getElementById('animalContainer').appendChild(animal);
        
        // Add entrance animation
        setTimeout(() => {
            animal.classList.add('animal-visible');
        }, index * 200);
    }

    getRandomSafePosition() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        // Avoid center area where buttons are (30% to 70% of width/height)
        let x, y;
        do {
            x = Math.random() * (width - 200) + 100;
            y = Math.random() * (height - 200) + 100;
        } while (
            x > width * 0.25 && x < width * 0.75 &&
            y > height * 0.25 && y < height * 0.75
        );
        
        return { x, y };
    }

    handleAnimalClick(animalData, event) {
        event.stopPropagation();
        
        const animal = animalData.element;
        
        // Jump animation
        animal.classList.add('animal-jump');
        setTimeout(() => animal.classList.remove('animal-jump'), 600);
        
        // Play sound
        if (this.soundEnabled) {
            this.playAnimalSound(animalData.type.sound);
        }
        
        // Create sparkle effect
        this.createSparkle(event.clientX, event.clientY);
        
        // Move to new position
        setTimeout(() => {
            const newPos = this.getRandomSafePosition();
            animalData.x = newPos.x;
            animalData.y = newPos.y;
            animalData.vx = (Math.random() - 0.5) * animalData.type.speed;
            animalData.vy = (Math.random() - 0.5) * animalData.type.speed;
            
            animal.style.transition = 'all 1s cubic-bezier(0.34, 1.56, 0.64, 1)';
            animal.style.left = `${newPos.x}px`;
            animal.style.top = `${newPos.y}px`;
            
            setTimeout(() => {
                animal.style.transition = '';
            }, 1000);
        }, 300);
        
        // Change expression variation
        this.changeAnimalExpression(animal);
    }

    changeAnimalExpression(animal) {
        animal.style.filter = `hue-rotate(${Math.random() * 60 - 30}deg) brightness(${0.9 + Math.random() * 0.2})`;
        setTimeout(() => {
            animal.style.filter = '';
        }, 1000);
    }

    playAnimalSound(soundType) {
        if (!this.audioContext) return;
        
        const sounds = {
            roar: () => this.createRoarSound(),
            growl: () => this.createGrowlSound(),
            trumpet: () => this.createTrumpetSound(),
            screech: () => this.createScreechSound(),
            chirp: () => this.createChirpSound(),
            yelp: () => this.createYelpSound(),
            squeak: () => this.createSqueakSound()
        };
        
        if (sounds[soundType]) {
            sounds[soundType]();
        }
    }

    createRoarSound() {
        const ctx = this.audioContext;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(80, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.8);
        
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
        
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.8);
    }

    createGrowlSound() {
        const ctx = this.audioContext;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(100, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.5);
        
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.5);
    }

    createTrumpetSound() {
        const ctx = this.audioContext;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(200, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 1);
        
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1);
        
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 1);
    }

    createScreechSound() {
        const ctx = this.audioContext;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = 'square';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.3);
        
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.3);
    }

    createChirpSound() {
        const ctx = this.audioContext;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1000, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1500, ctx.currentTime + 0.1);
        osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.2);
        
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.2);
    }

    createYelpSound() {
        const ctx = this.audioContext;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(400, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.15);
        
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.15);
    }

    createSqueakSound() {
        const ctx = this.audioContext;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(2000, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(2500, ctx.currentTime + 0.05);
        
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.1);
    }

    createSparkle(x, y) {
        const sparkleCount = 8;
        const container = document.getElementById('difficultyScreen');
        
        for (let i = 0; i < sparkleCount; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.textContent = ['✨', '⭐', '💫', '🌟'][Math.floor(Math.random() * 4)];
            sparkle.style.left = `${x}px`;
            sparkle.style.top = `${y}px`;
            
            const angle = (Math.PI * 2 * i) / sparkleCount;
            const distance = 50 + Math.random() * 50;
            const endX = x + Math.cos(angle) * distance;
            const endY = y + Math.sin(angle) * distance;
            
            sparkle.style.setProperty('--end-x', `${endX}px`);
            sparkle.style.setProperty('--end-y', `${endY}px`);
            
            container.appendChild(sparkle);
            
            setTimeout(() => sparkle.remove(), 1000);
        }
    }

    createClouds() {
        const container = document.createElement('div');
        container.className = 'clouds-container';
        
        for (let i = 0; i < 5; i++) {
            const cloud = document.createElement('div');
            cloud.className = 'cloud';
            cloud.textContent = '☁️';
            cloud.style.left = `${Math.random() * 100}%`;
            cloud.style.top = `${Math.random() * 30 + 5}%`;
            cloud.style.fontSize = `${40 + Math.random() * 60}px`;
            cloud.style.animationDuration = `${30 + Math.random() * 40}s`;
            cloud.style.animationDelay = `${Math.random() * 10}s`;
            cloud.style.opacity = 0.4 + Math.random() * 0.4;
            
            container.appendChild(cloud);
        }
        
        document.getElementById('difficultyScreen').appendChild(container);
    }

    createStars() {
        const container = document.createElement('div');
        container.className = 'stars-container';
        
        for (let i = 0; i < 30; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.textContent = '⭐';
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 60}%`;
            star.style.fontSize = `${10 + Math.random() * 20}px`;
            star.style.animationDuration = `${1 + Math.random() * 2}s`;
            star.style.animationDelay = `${Math.random() * 2}s`;
            
            container.appendChild(star);
        }
        
        document.getElementById('difficultyScreen').appendChild(container);
    }

    createSoundToggle() {
        const toggle = document.createElement('button');
        toggle.id = 'soundToggle';
        toggle.className = 'sound-toggle';
        toggle.innerHTML = '🔊';
        toggle.title = 'Toggle Sound';
        
        toggle.addEventListener('click', () => {
            this.soundEnabled = !this.soundEnabled;
            toggle.innerHTML = this.soundEnabled ? '🔊' : '🔇';
            toggle.classList.toggle('muted', !this.soundEnabled);
        });
        
        document.getElementById('difficultyScreen').appendChild(toggle);
    }

    startAnimation() {
        const animate = () => {
            this.updateAnimals();
            this.animationFrame = requestAnimationFrame(animate);
        };
        animate();
    }

    updateAnimals() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const now = Date.now();
        
        this.animals.forEach(animalData => {
            // Update position
            animalData.x += animalData.vx;
            animalData.y += animalData.vy;
            
            // Bounce off edges
            if (animalData.x < 50 || animalData.x > width - 150) {
                animalData.vx *= -1;
                animalData.x = Math.max(50, Math.min(width - 150, animalData.x));
            }
            if (animalData.y < 50 || animalData.y > height - 150) {
                animalData.vy *= -1;
                animalData.y = Math.max(50, Math.min(height - 150, animalData.y));
            }
            
            // Update rotation
            animalData.rotation += animalData.rotationSpeed;
            
            // Apply transforms
            animalData.element.style.transform = `translate(${animalData.x}px, ${animalData.y}px) rotate(${animalData.rotation}deg)`;
            
            // Idle animation
            if (now - animalData.idleTimer > animalData.idleInterval) {
                this.playIdleAnimation(animalData);
                animalData.idleTimer = now;
                animalData.idleInterval = 3000 + Math.random() * 3000;
            }
        });
    }

    playIdleAnimation(animalData) {
        const animations = ['bounce', 'wiggle', 'spin'];
        const animation = animations[Math.floor(Math.random() * animations.length)];
        
        animalData.element.classList.add(`idle-${animation}`);
        setTimeout(() => {
            animalData.element.classList.remove(`idle-${animation}`);
        }, 1000);
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    destroy() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        
        this.animals.forEach(a => a.element.remove());
        this.animals = [];
        
        const containers = ['animalContainer', 'clouds-container', 'stars-container'];
        containers.forEach(id => {
            const elem = document.querySelector(`.${id}, #${id}`);
            if (elem) elem.remove();
        });
        
        const toggle = document.getElementById('soundToggle');
        if (toggle) toggle.remove();
        
        this.initialized = false;
    }
}

// Initialize when difficulty screen is shown
let animalTheme = null;

function initAnimalTheme() {
    const diffScreen = document.getElementById('difficultyScreen');
    if (diffScreen && !diffScreen.classList.contains('hidden')) {
        if (!animalTheme) {
            animalTheme = new AnimalThemeSystem();
        }
        if (!animalTheme.initialized) {
            animalTheme.init();
        }
    }
}

// Button Click Sound System
function playButtonPopSound() {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
    
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.2);
}

function addButtonSounds() {
    // Add sound to all mode buttons
    const buttons = document.querySelectorAll('.mode-btn-card, .difficulty-btn, .easy-btn, .medium-btn, .hard-btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            if (animalTheme && animalTheme.soundEnabled) {
                playButtonPopSound();
            }
        });
    });
}

// Auto-initialize when difficulty screen becomes visible
document.addEventListener('DOMContentLoaded', () => {
    const observer = new MutationObserver(() => {
        initAnimalTheme();
    });
    
    const diffScreen = document.getElementById('difficultyScreen');
    if (diffScreen) {
        observer.observe(diffScreen, { attributes: true, attributeFilter: ['class'] });
        
        // Add button sounds when difficulty screen is shown
        setTimeout(addButtonSounds, 200);
    }
    
    // Also check on start button click
    const startBtn = document.getElementById('startLearningBtn');
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            setTimeout(() => {
                initAnimalTheme();
                addButtonSounds();
            }, 100);
        });
    }
});
