// Language switcher functionality
const LanguageSwitcher = {
    // Current language (default: French)
    currentLang: 'fr',
    
    // Languages available
    languages: ['fr', 'en', 'ar'],
    
    // Language display names
    languageNames: {
        'fr': 'Français',
        'en': 'English',
        'ar': 'العربية'
    },
    
    // Store translations
    translations: {},
    
    // Initialize the language switcher
    init: async function() {
        // Load translations
        try {
            const response = await fetch('js/translations.json');
            this.translations = await response.json();
            
            // Check localStorage for saved language preference
            const savedLang = localStorage.getItem('preferredLanguage');
            if (savedLang && this.languages.includes(savedLang)) {
                this.currentLang = savedLang;
            } else {
                this.currentLang = 'fr'; // Official default language
            }
            
            // Initialize language toggle
            this.initLanguageToggle();
            
            // Apply current language
            this.applyLanguage();

            // Apply RTL for Arabic if that's the current language
            this.applyRTL();

            // Initialize back to top button
            this.initBackToTop();
        } catch (error) {
            console.error('Failed to load translations:', error);
        }
    },

    // Apply RTL styling based on current language
    applyRTL: function() {
        if (this.currentLang === 'ar') {
            document.documentElement.setAttribute('dir', 'rtl');
            document.body.classList.add('rtl');
        } else {
            document.documentElement.setAttribute('dir', 'ltr');
            document.body.classList.remove('rtl');
        }
    },
    
    // Initialize the language toggle
    initLanguageToggle: function() {
        const toggle = document.getElementById('lang-switcher');
        if (!toggle) return;
        
        const btn = toggle.querySelector('.lang-switcher__btn');
        const currentSpan = toggle.querySelector('.lang-switcher__current');
        const options = toggle.querySelectorAll('.lang-switcher__option');
        
        // Setup initial state
        if (currentSpan) {
            currentSpan.textContent = this.currentLang.toUpperCase();
        }
        
        options.forEach(opt => {
            if (opt.getAttribute('data-lang') === this.currentLang) {
                opt.classList.add('active');
            } else {
                opt.classList.remove('active');
            }
        });
        
        // Toggle dropdown on button click
        if (btn) {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                toggle.classList.toggle('is-open');
            });
            
            // Close when clicking anywhere else
            document.addEventListener('click', () => {
                toggle.classList.remove('is-open');
            });
        }
        
        // Handle language option clicks
        options.forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                
                // Close dropdown
                toggle.classList.remove('is-open');
                
                const lang = option.getAttribute('data-lang');
                if (lang === this.currentLang) return;
                
                // Switch language
                this.switchLanguage(lang);
                
                // Update UI immediately
                if (currentSpan) {
                    currentSpan.textContent = lang.toUpperCase();
                }
                
                options.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
                
                // Add transition effect to content
                document.querySelectorAll('.content__inner').forEach(element => {
                    element.classList.remove('lang-change-animation');
                    void element.offsetWidth; // Force reflow
                    element.classList.add('lang-change-animation');
                });
            });
        });
    },

    // Initialize back to top button
    initBackToTop: function() {
        const backToTop = document.querySelector('.back-to-top');
        if (!backToTop) return;

        const progressCircle = backToTop.querySelector('.back-to-top__circle-progress');
        const totalLength = progressCircle ? parseFloat(progressCircle.getAttribute('stroke-dasharray')) : 0;

        // Handle scroll events
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            
            // Show/hide button based on scroll position
            if (scrollTop > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
            
            // Update progress circle
            if (progressCircle && scrollHeight > 0) {
                const progress = Math.min(scrollTop / scrollHeight, 1);
                const dashOffset = totalLength - (progress * totalLength);
                progressCircle.style.strokeDashoffset = dashOffset;
            }
        });
        
        // Scroll to top when clicked
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    },
    
    // Switch to a different language
    switchLanguage: function(lang) {
        if (!this.languages.includes(lang)) return;
        
        // Update current language
        this.currentLang = lang;
        
        // Save preference
        localStorage.setItem('preferredLanguage', lang);
        
        // Apply the language
        this.applyLanguage();
        
        // Apply RTL for Arabic
        this.applyRTL();
    },
    
    // Apply the current language to all elements
    applyLanguage: function() {
        const langData = this.translations[this.currentLang];
        if (!langData) return;
        
        // Update document title and meta tags
        document.title = langData.title;
        document.querySelector('meta[name="description"]').setAttribute('content', langData.description);
        document.querySelector('meta[name="keywords"]').setAttribute('content', langData.keywords);
        
        // Update header
        document.querySelector('.frame__title-main').textContent = langData.header;
        
        // Update back link
        const backLink = document.querySelector('.frame__title-back .oh__inner');
        if (backLink) backLink.textContent = langData.backToArticle;
        
        // Update previous demo
        const prevDemo = document.querySelector('.frame__prev');
        if (prevDemo) prevDemo.textContent = langData.previousDemo;
        
        // Update sections
        const sections = document.querySelectorAll('.content');
        sections.forEach((section, index) => {
            const sectionKeys = Object.keys(langData.sections);
            if (index < sectionKeys.length) {
                const sectionKey = sectionKeys[index];
                const sectionData = langData.sections[sectionKey];
                
                // Update heading
                const heading = section.querySelector('h2');
                if (heading) {
                    // Clear existing spans
                    heading.innerHTML = '';
                    
                    // Create new spans for each character
                    const title = sectionData.title;
                    const firstHalf = title.substring(0, Math.ceil(title.length / 2));
                    const secondHalf = title.substring(Math.ceil(title.length / 2));
                    
                    // Add first line
                    firstHalf.split('').forEach(char => {
                        const span = document.createElement('span');
                        span.textContent = char;
                        heading.appendChild(span);
                    });
                    
                    // Add line break
                    heading.appendChild(document.createElement('br'));
                    
                    // Add second line
                    secondHalf.split('').forEach(char => {
                        const span = document.createElement('span');
                        span.textContent = char;
                        heading.appendChild(span);
                    });
                }
                
                // Update paragraph
                const paragraph = section.querySelector('p');
                if (paragraph) {
                    paragraph.textContent = sectionData.content;
                }
            }
        });
        
        // Update footer navigation links
        if (langData.navigation) {
            document.querySelectorAll('[data-lang-key^="navigation."]').forEach(element => {
                const key = element.dataset.langKey.split('.')[1];
                if (langData.navigation[key]) {
                    element.textContent = langData.navigation[key];
                }
            });
        }
        
        // Update footer text elements
        if (langData.footer) {
            document.querySelectorAll('[data-lang-key^="footer."]').forEach(element => {
                const key = element.dataset.langKey.split('.')[1];
                if (langData.footer[key]) {
                    element.textContent = langData.footer[key];
                }
            });
        }
    }
};

export { LanguageSwitcher }; 