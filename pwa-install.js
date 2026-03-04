/**
 * PWA Install Prompt System
 * Handles app installation and updates
 */

class PWAInstaller {
  constructor() {
    this.deferredPrompt = null;
    this.isInstalled = false;
    this.updateAvailable = false;
    this.registration = null;
    
    this.init();
  }
  
  init() {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches || 
        window.navigator.standalone === true) {
      this.isInstalled = true;
      console.log('[PWA] App is running as installed PWA');
    }
    
    // Register service worker
    this.registerServiceWorker();
    
    // Setup install prompt
    this.setupInstallPrompt();
    
    // Check for updates
    this.checkForUpdates();
    
    // Create install button
    if (!this.isInstalled) {
      this.createInstallButton();
    }
  }
  
  async registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        this.registration = await navigator.serviceWorker.register('./service-worker.js', {
          scope: './'
        });
        
        console.log('[PWA] Service Worker registered successfully:', this.registration.scope);
        
        // Check for updates every hour
        setInterval(() => {
          this.registration.update();
        }, 60 * 60 * 1000);
        
        // Listen for updates
        this.registration.addEventListener('updatefound', () => {
          const newWorker = this.registration.installing;
          
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              this.updateAvailable = true;
              this.showUpdateNotification();
            }
          });
        });
        
      } catch (error) {
        console.error('[PWA] Service Worker registration failed:', error);
      }
    } else {
      console.warn('[PWA] Service Workers not supported');
    }
  }
  
  setupInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e) => {
      console.log('[PWA] Install prompt triggered');
      
      // Prevent the mini-infobar from appearing
      e.preventDefault();
      
      // Save the event for later
      this.deferredPrompt = e;
      
      // Show install button
      const installBtn = document.getElementById('pwaInstallBtn');
      if (installBtn) {
        installBtn.style.display = 'flex';
        installBtn.classList.add('pulse-animation');
      }
    });
    
    // Listen for app installed
    window.addEventListener('appinstalled', () => {
      console.log('[PWA] App installed successfully');
      this.isInstalled = true;
      this.hideInstallButton();
      this.showInstalledMessage();
    });
  }
  
  createInstallButton() {
    // Check if button already exists
    if (document.getElementById('pwaInstallBtn')) return;
    
    const button = document.createElement('button');
    button.id = 'pwaInstallBtn';
    button.className = 'pwa-install-btn';
    button.innerHTML = `
      <span class="install-icon">📱</span>
      <span class="install-text">Install App</span>
    `;
    button.style.display = 'none';
    
    button.addEventListener('click', () => this.promptInstall());
    
    document.body.appendChild(button);
    
    // Add styles
    if (!document.getElementById('pwaInstallStyles')) {
      const style = document.createElement('style');
      style.id = 'pwaInstallStyles';
      style.textContent = `
        .pwa-install-btn {
          position: fixed;
          bottom: 20px;
          right: 20px;
          background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%);
          color: white;
          border: none;
          border-radius: 50px;
          padding: 16px 32px;
          font-size: 18px;
          font-weight: 700;
          font-family: 'Fredoka', sans-serif;
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          box-shadow: 0 8px 24px rgba(102, 126, 234, 0.5);
          z-index: 10000;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          animation: slideInUp 0.6s ease-out;
        }
        
        .pwa-install-btn:hover {
          transform: translateY(-5px) scale(1.05);
          box-shadow: 0 12px 32px rgba(102, 126, 234, 0.7);
        }
        
        .pwa-install-btn:active {
          transform: scale(0.95);
        }
        
        .pwa-install-btn.pulse-animation {
          animation: installPulse 2s ease-in-out infinite;
        }
        
        .install-icon {
          font-size: 24px;
          animation: iconBounce 1.5s ease-in-out infinite;
        }
        
        .pwa-update-banner {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: linear-gradient(135deg, #FF6B9D 0%, #FF8E53 100%);
          color: white;
          padding: 16px;
          text-align: center;
          font-family: 'Fredoka', sans-serif;
          font-weight: 600;
          z-index: 10001;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
          animation: slideInDown 0.5s ease-out;
        }
        
        .pwa-update-banner button {
          background: white;
          color: #FF6B9D;
          border: none;
          padding: 8px 24px;
          border-radius: 20px;
          font-weight: 700;
          margin-left: 12px;
          cursor: pointer;
          transition: transform 0.2s;
        }
        
        .pwa-update-banner button:hover {
          transform: scale(1.1);
        }
        
        .pwa-installed-toast {
          position: fixed;
          bottom: 100px;
          right: 20px;
          background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
          color: white;
          padding: 20px 30px;
          border-radius: 16px;
          font-family: 'Fredoka', sans-serif;
          font-weight: 600;
          font-size: 16px;
          z-index: 10000;
          box-shadow: 0 8px 24px rgba(72, 187, 120, 0.5);
          animation: slideInUp 0.5s ease-out;
        }
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes installPulse {
          0%, 100% {
            box-shadow: 0 8px 24px rgba(102, 126, 234, 0.5);
          }
          50% {
            box-shadow: 0 8px 32px rgba(102, 126, 234, 0.8), 
                        0 0 0 10px rgba(102, 126, 234, 0.2);
          }
        }
        
        @keyframes iconBounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        
        @media (max-width: 768px) {
          .pwa-install-btn {
            bottom: 15px;
            right: 15px;
            padding: 14px 24px;
            font-size: 16px;
          }
          
          .install-icon {
            font-size: 20px;
          }
        }
        
        @media (max-width: 480px) {
          .pwa-install-btn {
            bottom: 10px;
            right: 10px;
            padding: 12px 20px;
            font-size: 14px;
          }
          
          .install-text {
            display: none;
          }
          
          .install-icon {
            font-size: 24px;
            margin: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }
  
  hideInstallButton() {
    const button = document.getElementById('pwaInstallBtn');
    if (button) {
      button.style.display = 'none';
    }
  }
  
  async promptInstall() {
    if (!this.deferredPrompt) {
      console.log('[PWA] No install prompt available');
      return;
    }
    
    // Show the install prompt
    this.deferredPrompt.prompt();
    
    // Wait for the user's response
    const { outcome } = await this.deferredPrompt.userChoice;
    
    console.log('[PWA] User choice:', outcome);
    
    if (outcome === 'accepted') {
      console.log('[PWA] User accepted the install');
    } else {
      console.log('[PWA] User dismissed the install');
    }
    
    // Clear the deferred prompt
    this.deferredPrompt = null;
    
    // Hide the button
    this.hideInstallButton();
  }
  
  showUpdateNotification() {
    // Create update banner
    const banner = document.createElement('div');
    banner.className = 'pwa-update-banner';
    banner.innerHTML = `
      🎉 New version available!
      <button onclick="window.pwaInstaller.applyUpdate()">Update Now</button>
      <button onclick="this.parentElement.remove()" style="background: transparent; color: white; border: 2px solid white;">Later</button>
    `;
    
    document.body.insertBefore(banner, document.body.firstChild);
    
    // Auto-remove after 10 seconds if user doesn't interact
    setTimeout(() => {
      if (banner.parentElement) {
        banner.remove();
      }
    }, 10000);
  }
  
  applyUpdate() {
    if (this.registration && this.registration.waiting) {
      // Tell the service worker to skip waiting
      this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      
      // Reload to activate the new service worker
      window.location.reload();
    }
  }
  
  showInstalledMessage() {
    const toast = document.createElement('div');
    toast.className = 'pwa-installed-toast';
    toast.innerHTML = '✅ App installed successfully!';
    
    document.body.appendChild(toast);
    
    // Remove after 3 seconds
    setTimeout(() => {
      toast.style.animation = 'slideInUp 0.5s ease-out reverse';
      setTimeout(() => toast.remove(), 500);
    }, 3000);
  }
  
  checkForUpdates() {
    if (this.registration) {
      this.registration.update().catch((error) => {
        console.error('[PWA] Update check failed:', error);
      });
    }
  }
  
  // iOS Add to Home Screen guidance
  showIOSInstallGuide() {
    if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.navigator.standalone) {
      const guide = document.createElement('div');
      guide.className = 'pwa-update-banner';
      guide.innerHTML = `
        📱 Install this app: Tap <strong>Share</strong> icon and then <strong>Add to Home Screen</strong>
        <button onclick="this.parentElement.remove()" style="background: white; color: #FF6B9D;">Got it!</button>
      `;
      
      document.body.insertBefore(guide, document.body.firstChild);
    }
  }
}

// Initialize PWA installer when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.pwaInstaller = new PWAInstaller();
    
    // Show iOS guide after a delay
    setTimeout(() => {
      if (window.pwaInstaller) {
        window.pwaInstaller.showIOSInstallGuide();
      }
    }, 3000);
  });
} else {
  window.pwaInstaller = new PWAInstaller();
  
  setTimeout(() => {
    if (window.pwaInstaller) {
      window.pwaInstaller.showIOSInstallGuide();
    }
  }, 3000);
}

// Export for module systems (if needed)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PWAInstaller;
}
