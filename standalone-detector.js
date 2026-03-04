/**
 * Standalone Mode Detector
 * Forces desktop layout when PWA is installed on mobile
 * Runs immediately before any other scripts
 */

(function() {
    'use strict';
    
    /**
     * Check if app is running in standalone mode
     * @returns {boolean}
     */
    function isStandaloneMode() {
        // Check PWA display mode (Android Chrome, Desktop)
        if (window.matchMedia('(display-mode: standalone)').matches) {
            return true;
        }
        
        // Check iOS standalone
        if (window.navigator.standalone === true) {
            return true;
        }
        
        // Check for minimal-ui or fullscreen modes
        if (window.matchMedia('(display-mode: minimal-ui)').matches || 
            window.matchMedia('(display-mode: fullscreen)').matches) {
            return true;
        }
        
        return false;
    }
    
    /**
     * Check if device is mobile
     * @returns {boolean}
     */
    function isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    
    /**
     * Apply desktop mode class
     */
    function applyDesktopMode() {
        // Add class to html and body for maximum selector coverage
        document.documentElement.classList.add('pwa-installed', 'desktop-mode');
        document.body.classList.add('pwa-installed', 'desktop-mode');
        
        // Store in sessionStorage for consistency
        sessionStorage.setItem('desktopModeActive', 'true');
        
        console.log('✅ Desktop Mode activated for installed PWA');
    }
    
    /**
     * Initialize detection
     */
    function init() {
        const standalone = isStandaloneMode();
        const mobile = isMobileDevice();
        
        console.log('Standalone Mode:', standalone);
        console.log('Mobile Device:', mobile);
        
        // If installed on mobile, force desktop mode
        if (standalone && mobile) {
            applyDesktopMode();
        }
        
        // Also check if forced via storage (for consistency across pages)
        if (sessionStorage.getItem('desktopModeActive') === 'true') {
            applyDesktopMode();
        }
    }
    
    // Run immediately
    init();
    
    // Re-check on DOMContentLoaded in case document wasn't ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    }
    
    // Listen for display mode changes
    if (window.matchMedia) {
        const standaloneMedia = window.matchMedia('(display-mode: standalone)');
        standaloneMedia.addEventListener('change', (e) => {
            if (e.matches && isMobileDevice()) {
                applyDesktopMode();
            }
        });
    }
    
    // Expose utility for other scripts
    window.DesktopModeDetector = {
        isStandalone: isStandaloneMode,
        isMobile: isMobileDevice,
        isDesktopMode: () => document.body.classList.contains('desktop-mode')
    };
})();
