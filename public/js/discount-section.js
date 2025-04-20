/**
 * Discount Section Enhancer
 * Adds additional functionality to the discount section
 */
document.addEventListener('DOMContentLoaded', function() {
    // The main functionality is handled in partials-loader.js
    // This file adds additional enhancements
    
    // Function to check if element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.bottom >= 0
        );
    }
    
    // Animate discount options when they come into view
    function handleDiscountAnimation() {
        const discountSection = document.getElementById('discount-section-placeholder');
        if (!discountSection) return;
        
        const discountOptions = discountSection.querySelectorAll('.discount-option');
        if (!discountOptions.length) return;
        
        if (isInViewport(discountSection)) {
            discountOptions.forEach((option, index) => {
                setTimeout(() => {
                    option.classList.add('animated');
                }, index * 200);
            });
            // Remove scroll listener once animation is triggered
            window.removeEventListener('scroll', handleDiscountAnimation);
        }
    }
    
    // Add hover effect for better mobile experience
    function addTouchEffects() {
        const discountOptions = document.querySelectorAll('.discount-option');
        if (!discountOptions.length) return;
        
        discountOptions.forEach(option => {
            option.addEventListener('touchstart', function() {
                this.classList.add('touch-active');
            }, { passive: true });
            
            option.addEventListener('touchend', function() {
                this.classList.remove('touch-active');
            }, { passive: true });
        });
    }
    
    // Initialize the discount section enhancements
    function init() {
        // Handle initial animation
        handleDiscountAnimation();
        
        // Add scroll listener for animation
        window.addEventListener('scroll', handleDiscountAnimation);
        
        // Add touch effects for mobile
        addTouchEffects();
    }
    
    // Run initialization
    init();
}); 