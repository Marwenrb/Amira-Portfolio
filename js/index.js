import { preloadImages } from './utils.js';
import { Content } from './content.js?v=5';
import { LanguageSwitcher } from './languageSwitcher.js?v=4';

// Smooth scrolling.
let lenis;
const initSmoothScrolling = () => {
	// Smooth scrolling initialization (using Lenis https://github.com/studio-freight/lenis)
	lenis = new Lenis({
		lerp: 0.1,
		smoothWheel: true,
		orientation: 'vertical',
	});
    
    lenis.on('scroll', () => ScrollTrigger.update());
	
    const scrollFn = () => {
		lenis.raf();
		requestAnimationFrame(scrollFn);
	};
	requestAnimationFrame(scrollFn);
};

// Initialize language switcher and UI elements
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        LanguageSwitcher.init();
    });
} else {
    // DOM already loaded (common with type="module")
    LanguageSwitcher.init();
}

// .content elements
const contentElems = [...document.querySelectorAll('.content')];
contentElems.forEach(el => new Content(el));

// smooth scrolling with Lenis
initSmoothScrolling();

// Preload images then remove loader (loading class) from body with a premium delay
preloadImages('.canvas-wrap').then(() => {
    setTimeout(() => {
        document.body.classList.remove('loading');
    }, 1500); // 1.5 second delay for premium feel
});