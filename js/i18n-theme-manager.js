// i18n-theme-manager.js

class I18nThemeManager {
    constructor() {
        this.currentLanguage = 'pt';
        this.translations = null;
        this.themePreference = localStorage.getItem('theme') || 'light';
        this.initialized = false;
    }

    async initialize() {
        try {
            const response = await fetch('..data/translations.json');
            this.translations = await response.json();
            
            // Initialize language
            const savedLang = localStorage.getItem('language') || navigator.language.split('-')[0];
            if (this.translations[savedLang]) {
                this.currentLanguage = savedLang;
            }
            
            // Setup listeners
            this.setupLanguageSelector();
            this.setupThemeToggle();
            
            // Initial application
            this.applyTranslations();
            this.applyTheme(this.themePreference);
            
            this.initialized = true;
        } catch (error) {
            console.error('Error initializing I18nThemeManager:', error);
        }
    }

    setupLanguageSelector() {
        const selector = document.getElementById('language-select');
        if (selector) {
            selector.value = this.currentLanguage;
            selector.addEventListener('change', (e) => {
                this.setLanguage(e.target.value);
            });
        }
    }

    setupThemeToggle() {
        const toggle = document.getElementById('theme-toggle');
        if (toggle) {
            toggle.checked = this.themePreference === 'dark';
            toggle.addEventListener('change', (e) => {
                const newTheme = e.target.checked ? 'dark' : 'light';
                this.applyTheme(newTheme);
            });
        }
    }

    setLanguage(lang) {
        if (this.translations[lang]) {
            this.currentLanguage = lang;
            localStorage.setItem('language', lang);
            this.applyTranslations();
            // Dispatch event for components that need to know about language changes
            window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
        }
    }

    applyTranslations() {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.getTranslation(key);
            if (translation) {
                if (element.tagName === 'INPUT' && element.type === 'submit') {
                    element.value = translation;
                } else {
                    element.textContent = translation;
                }
            }
        });
    }

    getTranslation(key) {
        return key.split('.').reduce((obj, i) => obj ? obj[i] : null, this.translations[this.currentLanguage]);
    }

    translate(key, params = {}) {
        let text = this.getTranslation(key);
        if (!text) return key;

        // Replace parameters in the translation string
        Object.keys(params).forEach(param => {
            text = text.replace(`{${param}}`, params[param]);
        });

        return text;
    }

    applyTheme(theme) {
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.themePreference = theme;
        
        // Dispatch event for components that need to know about theme changes
        window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
    }

    // Helper method to check if touch is available
    static isTouchDevice() {
        return (('ontouchstart' in window) ||
                (navigator.maxTouchPoints > 0) ||
                (navigator.msMaxTouchPoints > 0));
    }
}

export const i18nThemeManager = new I18nThemeManager();
export default i18nThemeManager;