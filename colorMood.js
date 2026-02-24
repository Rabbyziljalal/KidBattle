// ===== Color Mood Feature =====

// Initialize Color Mood Feature
function initColorMood() {
    console.log('🎨 Initializing Color Mood Feature...');
    
    const colorMoodToggle = document.getElementById('colorMoodToggle');
    const colorMoodPanel = document.getElementById('colorMoodPanel');
    const closeMoodPanel = document.getElementById('closeMoodPanel');
    const themeButtons = document.querySelectorAll('.theme-btn');

    // Check if elements exist
    if (!colorMoodToggle) {
        console.error('❌ Color Mood Toggle button not found!');
        return;
    }
    if (!colorMoodPanel) {
        console.error('❌ Color Mood Panel not found!');
        return;
    }
    
    console.log('✅ Color Mood elements found!');
    console.log('Toggle button:', colorMoodToggle);
    console.log('Panel:', colorMoodPanel);

    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('selectedTheme') || 'rainbow-dream';
    applyTheme(savedTheme);
    console.log('📌 Applied saved theme:', savedTheme);

    // Toggle panel open/close
    colorMoodToggle.addEventListener('click', () => {
        console.log('🎨 Toggle button clicked!');
        colorMoodPanel.classList.toggle('active');
    });

    closeMoodPanel.addEventListener('click', () => {
        console.log('❌ Close button clicked!');
        colorMoodPanel.classList.remove('active');
    });

    // Close panel when clicking outside
    document.addEventListener('click', (e) => {
        if (!colorMoodPanel.contains(e.target) && 
            !colorMoodToggle.contains(e.target) && 
            colorMoodPanel.classList.contains('active')) {
            colorMoodPanel.classList.remove('active');
        }
    });

    // Theme button click handlers
    themeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const theme = button.getAttribute('data-theme');
            console.log(`🎨 Theme button clicked: ${theme}`);
            
            applyTheme(theme);
            
            // Update active state
            themeButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Save to localStorage
            localStorage.setItem('selectedTheme', theme);
            console.log(`💾 Theme saved to localStorage: ${theme}`);
            
            // Show feedback animation
            showThemeChangeAnimation();
        });
    });

    // Set initial active button
    const activeThemeBtn = document.querySelector(`[data-theme="${savedTheme}"]`);
    if (activeThemeBtn) {
        themeButtons.forEach(btn => btn.classList.remove('active'));
        activeThemeBtn.classList.add('active');
    }
    
    console.log(`✅ Color Mood initialized with ${themeButtons.length} themes!`);
    
    // Log all available themes for debugging
    const allThemes = Array.from(themeButtons).map(btn => btn.getAttribute('data-theme'));
    console.log('📋 Available themes:', allThemes);
}

// Apply theme to body
function applyTheme(theme) {
    console.log(`🎨 Applying theme: ${theme}`);
    
    // Set the theme attribute on body
    document.body.setAttribute('data-theme', theme);
    
    // Force browser reflow to ensure CSS updates immediately
    void document.body.offsetHeight;
    
    // Verify the attribute was set
    const currentTheme = document.body.getAttribute('data-theme');
    console.log(`🔍 Current body data-theme: ${currentTheme}`);
    
    // Check if CSS variable is being read
    const computedStyle = getComputedStyle(document.body);
    const bgGradient = computedStyle.getPropertyValue('--background-gradient');
    console.log(`🎨 CSS Variable --background-gradient: ${bgGradient || 'NOT FOUND'}`);
    
    // Add smooth transition effect
    document.body.style.transition = 'all 0.5s ease';
    
    // Create visible theme indicator
    let indicator = document.getElementById('theme-indicator');
    if (!indicator) {
        indicator = document.createElement('div');
        indicator.id = 'theme-indicator';
        indicator.style.cssText = 'position: fixed; top: 10px; left: 10px; background: rgba(0,0,0,0.8); color: white; padding: 8px 12px; border-radius: 6px; font-size: 12px; z-index: 99999; font-family: monospace; pointer-events: none;';
        document.body.appendChild(indicator);
    }
    indicator.innerHTML = `Active Theme: <strong style="color: #4CAF50;">${theme}</strong>`;
    indicator.style.display = 'block';
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
        if (indicator) indicator.style.display = 'none';
    }, 3000);
    
    // Log confirmation
    console.log(`✅ Theme successfully changed to: ${theme}`);
}

// Show theme change animation
function showThemeChangeAnimation() {
    const colorMoodToggle = document.getElementById('colorMoodToggle');
    
    // Create a sparkle effect
    for (let i = 0; i < 8; i++) {
        setTimeout(() => {
            createSparkle(colorMoodToggle);
        }, i * 100);
    }
    
    // Animate the toggle button
    colorMoodToggle.style.transform = 'scale(1.2) rotate(360deg)';
    setTimeout(() => {
        colorMoodToggle.style.transform = '';
    }, 500);
}

// Create sparkle particle
function createSparkle(element) {
    const sparkle = document.createElement('div');
    sparkle.innerHTML = '✨';
    sparkle.style.position = 'fixed';
    sparkle.style.fontSize = '1.5em';
    sparkle.style.pointerEvents = 'none';
    sparkle.style.zIndex = '10001';
    
    const rect = element.getBoundingClientRect();
    sparkle.style.left = rect.left + rect.width / 2 + 'px';
    sparkle.style.top = rect.top + rect.height / 2 + 'px';
    
    document.body.appendChild(sparkle);
    
    // Random angle for sparkle direction
    const angle = Math.random() * Math.PI * 2;
    const distance = 50 + Math.random() * 50;
    const targetX = Math.cos(angle) * distance;
    const targetY = Math.sin(angle) * distance;
    
    // Animate sparkle
    sparkle.animate([
        { 
            transform: 'translate(-50%, -50%) scale(0) rotate(0deg)',
            opacity: 1
        },
        { 
            transform: `translate(calc(-50% + ${targetX}px), calc(-50% + ${targetY}px)) scale(1.5) rotate(360deg)`,
            opacity: 0
        }
    ], {
        duration: 1000,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    });
    
    // Remove sparkle after animation
    setTimeout(() => {
        sparkle.remove();
    }, 1000);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initColorMood);
} else {
    initColorMood();
}
