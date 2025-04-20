// Hero Functions

// Hero countdown timer
(function() {
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');
    
    if (!hoursElement || !minutesElement || !secondsElement) return;
    
    // Set end time to 24 hours from now
    const endTime = new Date();
    endTime.setHours(endTime.getHours() + 24);
    
    function updateCountdown() {
        const now = new Date();
        const diff = endTime - now;
        
        if (diff <= 0) {
            // Reset when countdown ends
            endTime.setHours(endTime.getHours() + 24);
            updateCountdown();
            return;
        }
        
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        // Update display
        hoursElement.textContent = hours.toString().padStart(2, '0');
        minutesElement.textContent = minutes.toString().padStart(2, '0');
        secondsElement.textContent = seconds.toString().padStart(2, '0');
    }
    
    // Initial update
    updateCountdown();
    
    // Update every second
    setInterval(updateCountdown, 1000);
})();

// Hero image animation
(function() {
    const heroImage = document.getElementById('hero-main-img');
    if (!heroImage) return;
    
    // Add floating animation effect
    function addFloatingEffect() {
        heroImage.style.transition = 'transform 3s ease-in-out';
        heroImage.style.transform = 'translateY(-10px)';
        
        setTimeout(() => {
            heroImage.style.transform = 'translateY(0)';
            
            setTimeout(() => {
                addFloatingEffect();
            }, 3000);
        }, 3000);
    }
    
    // Start floating animation
    addFloatingEffect();
    
    // Add hover effect
    heroImage.addEventListener('mouseover', function() {
        this.style.transform = 'scale(1.05)';
        this.style.transition = 'transform 0.5s ease';
    });
    
    heroImage.addEventListener('mouseout', function() {
        this.style.transform = 'scale(1)';
        addFloatingEffect();
    });
})();

// Initialize all elements with fade-in effects
(function() {
    const fadeElements = document.querySelectorAll('.fade-in');
    
    function handleScroll() {
        fadeElements.forEach(element => {
            const position = element.getBoundingClientRect().top;
            const screenHeight = window.innerHeight;
            
            if (position < screenHeight * 0.85) {
                element.classList.add('visible');
            }
        });
    }
    
    // Initial check
    handleScroll();
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
})();

// Mobile menu toggle
(function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (!mobileMenuBtn || !navLinks) return;
    
    mobileMenuBtn.addEventListener('click', function() {
        navLinks.classList.toggle('active');
    });
})();

console.log('Hero functions initialized'); 