/**
 * Desktop Color Theme Picker Functionality
 * Handles desktop color theme switching for the neobrutalist website
 */

class DesktopColorThemeManager {
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
        // Get desktop DOM elements
        this.picker = document.getElementById('color-picker');
        this.options = document.getElementById('color-options');
        this.toggle = document.getElementById('color-picker-toggle');
        
        // Load saved theme
        this.loadSavedTheme();
        
        // Setup event listeners
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Handle toggle button click
        if (this.toggle) {
            this.toggle.addEventListener('click', (e) => {
                e.stopPropagation();
                this.togglePicker();
            });
        }
        
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
        
        // Close picker when clicking outside
        document.addEventListener('click', (e) => {
            if (this.picker && !this.picker.contains(e.target) && this.picker.classList.contains('expanded')) {
                this.collapsePicker();
            }
        });
    }
    
    togglePicker() {
        if (this.picker) {
            this.picker.classList.toggle('expanded');
            if (this.toggle) {
                this.toggle.classList.toggle('expanded');
            }
        }
    }
    
    collapsePicker() {
        if (this.picker) {
            this.picker.classList.remove('expanded');
            if (this.toggle) {
                this.toggle.classList.remove('expanded');
            }
        }
    }
    
    setColorTheme(theme) {
        // Validate theme
        const validThemes = ['blue', 'orange', 'green', 'purple', 'pink', 'neon-blue', 'neon-green'];
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
        return ['blue', 'orange', 'green', 'purple', 'pink', 'neon-blue', 'neon-green'];
    }
}

// Initialize desktop color theme manager
const colorThemeManager = new DesktopColorThemeManager();

// Export for other scripts if needed
if (typeof window !== 'undefined') {
    window.colorThemeManager = colorThemeManager;
}

