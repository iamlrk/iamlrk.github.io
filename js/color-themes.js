/**
 * Color Theme Picker Functionality
 * Handles dynamic color theme switching for the neobrutalist website
 */

class ColorThemeManager {
    constructor() {
        this.currentTheme = 'blue';
        this.picker = null;
        this.options = null;
        
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
        // Get DOM elements (both desktop and mobile)
        this.picker = document.getElementById('color-picker');
        this.options = document.getElementById('color-options');
        this.mobileOptions = document.getElementById('mobile-color-options');
        
        // Load saved theme
        this.loadSavedTheme();
        
        // Setup event listeners
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Handle desktop color option clicks
        if (this.options) {
            const colorOptions = this.options.querySelectorAll('.color-option');
            colorOptions.forEach(option => {
                option.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const color = option.dataset.color;
                    if (color) {
                        this.setColorTheme(color);
                    }
                });
            });
        }
        
        // Handle mobile color option clicks
        if (this.mobileOptions) {
            const mobileColorOptions = this.mobileOptions.querySelectorAll('.mobile-color-option');
            mobileColorOptions.forEach(option => {
                option.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const color = option.dataset.color;
                    if (color) {
                        this.setColorTheme(color);
                    }
                });
            });
        }
    }
    
    // Color picker is now always visible, no toggle needed
    
    setColorTheme(theme) {
        // Validate theme
        const validThemes = ['blue', 'orange', 'green', 'purple'];
        if (!validThemes.includes(theme)) {
            console.warn(`Invalid color theme: ${theme}`);
            return;
        }
        
        // Update current theme
        this.currentTheme = theme;
        
        // Update HTML data attribute
        document.documentElement.setAttribute('data-color-theme', theme);
        
        // Update active state in picker
        this.updateActiveOption(theme);
        
        // Save to localStorage
        this.saveTheme(theme);
        
        // Trigger custom event for other scripts
        this.dispatchThemeChangeEvent(theme);
        
        console.log(`Color theme changed to: ${theme}`);
    }
    
    updateActiveOption(theme) {
        // Update desktop color options
        if (this.options) {
            const allOptions = this.options.querySelectorAll('.color-option');
            allOptions.forEach(option => {
                option.classList.remove('active');
            });
            
            const activeOption = this.options.querySelector(`[data-color="${theme}"]`);
            if (activeOption) {
                activeOption.classList.add('active');
            }
        }
        
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
    
    saveTheme(theme) {
        try {
            localStorage.setItem('colorTheme', theme);
        } catch (e) {
            console.warn('Failed to save color theme to localStorage:', e);
        }
    }
    
    loadSavedTheme() {
        try {
            const savedTheme = localStorage.getItem('colorTheme');
            if (savedTheme) {
                this.setColorTheme(savedTheme);
            } else {
                // Default to blue theme
                this.setColorTheme('blue');
            }
        } catch (e) {
            console.warn('Failed to load saved color theme:', e);
            this.setColorTheme('blue');
        }
    }
    
    dispatchThemeChangeEvent(theme) {
        const event = new CustomEvent('colorThemeChange', {
            detail: { theme, previousTheme: this.currentTheme }
        });
        document.dispatchEvent(event);
    }
    
    // Public API methods
    getCurrentTheme() {
        return this.currentTheme;
    }
    
    getAvailableThemes() {
        return ['blue', 'orange', 'green', 'purple'];
    }
}

// Initialize color theme manager
const colorThemeManager = new ColorThemeManager();

// Export for other scripts if needed
if (typeof window !== 'undefined') {
    window.colorThemeManager = colorThemeManager;
}
