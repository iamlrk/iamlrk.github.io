/**
 * Mobile Color Theme Picker Functionality
 * Handles mobile color theme switching
 */

class MobileColorThemeManager {
    constructor() {
        this.mobileOptions = null;
        this.init();
    }
    
    init() {
        // Wait for DOM to load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }
    
    setup() {
        // Get mobile DOM elements
        this.mobileOptions = document.getElementById('mobile-color-options');
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Sync with current theme from HTML data attribute or desktop manager
        const htmlTheme = document.documentElement.getAttribute('data-color-theme');
        if (htmlTheme) {
            this.updateActiveOption(htmlTheme);
        } else if (typeof window.colorThemeManager !== 'undefined') {
            const currentTheme = window.colorThemeManager.getCurrentTheme();
            if (currentTheme) {
                this.updateActiveOption(currentTheme);
            }
        }
    }
    
    setupEventListeners() {
        // Handle mobile color option clicks
        if (this.mobileOptions) {
            const mobileColorOptions = this.mobileOptions.querySelectorAll('.mobile-color-option');
            mobileColorOptions.forEach(option => {
                option.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const color = option.dataset.color;
                    if (color && typeof window.colorThemeManager !== 'undefined') {
                        window.colorThemeManager.setColorTheme(color);
                    }
                });
            });
        }
    }
    
    updateActiveOption(theme) {
        // Update mobile color options
        if (this.mobileOptions) {
            const allMobileOptions = this.mobileOptions.querySelectorAll('.mobile-color-option');
            allMobileOptions.forEach(option => {
                option.classList.remove('active');
            });
            
            const activeMobileOption = this.mobileOptions.querySelector(`[data-color="${theme}"]`);
            if (activeMobileOption) {
                activeMobileOption.classList.add('active');
            }
        }
    }
}

// Initialize mobile color theme manager
const mobileColorThemeManager = new MobileColorThemeManager();

// Listen for theme changes from desktop color theme manager
document.addEventListener('colorThemeChange', (event) => {
    mobileColorThemeManager.updateActiveOption(event.detail.theme);
});

// Export for other scripts if needed
if (typeof window !== 'undefined') {
    window.mobileColorThemeManager = mobileColorThemeManager;
}

