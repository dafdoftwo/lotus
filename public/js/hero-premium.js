/**
 * Lotus Dress Premium Hero Section JavaScript
 * ==========================================
 * Handles all interactive features of the premium hero section
 */

(function() {
  // Page Components
  let components = {
    countdown: null,
    hours: null,
    minutes: null,
    seconds: null,
    mainDressImage: null,
    stockBar: null,
    colorOptions: null
  };

  // Color Data with image sources
  const colorData = {
    black: {
      mainImg: "images/Black/TH_K1109614_001_F0.avif",
      altText: "فستان لوتس باللون الأسود"
    },
    beige: {
      mainImg: "images/Beige/in-home.jpg",
      altText: "فستان لوتس باللون البيج"
    },
    red: {
      mainImg: "images/Red/red-color-official-5.avif",
      altText: "فستان لوتس باللون الأحمر"
    }
  };

  // Initialize page components
  function initPage() {
    // Get DOM elements
    components.countdown = document.getElementById('hero-countdown');
    components.hours = document.getElementById('hero-hours');
    components.minutes = document.getElementById('hero-minutes');
    components.seconds = document.getElementById('hero-seconds');
    components.mainDressImage = document.getElementById('hero-main-dress');
    components.stockBar = document.getElementById('hero-stock-bar');
    components.colorOptions = document.querySelectorAll('.hero-color-option');

    // Initialize components if they exist
    if (components.stockBar) {
      animateStockBar();
    }

    if (components.countdown) {
      startCountdown();
    }

    if (components.colorOptions.length > 0) {
      initColorOptions();
    }
  }

  // Animate the stock bar to show decreasing availability
  function animateStockBar() {
    const stockBar = components.stockBar;
    if (!stockBar) return;

    // Set initial width
    let currentWidth = 85; // 85% remaining
    stockBar.style.width = currentWidth + '%';

    // Slowly decrease width every few minutes to create urgency
    setInterval(() => {
      if (currentWidth > 15) {
        currentWidth -= 1;
        stockBar.style.width = currentWidth + '%';
        
        // Update color based on availability
        if (currentWidth < 30) {
          stockBar.style.backgroundColor = '#dc3545'; // Red for low stock
        } else if (currentWidth < 60) {
          stockBar.style.backgroundColor = '#ffc107'; // Yellow for medium stock
        }
      }
    }, 180000); // Every 3 minutes
  }

  // Start countdown timer for limited time offer
  function startCountdown() {
    // Set countdown for 24 hours from now
    let countDownDate = new Date();
    countDownDate.setHours(countDownDate.getHours() + 24);
    
    // Update countdown every second
    const countdownInterval = setInterval(updateCountdown, 1000);
    updateCountdown(); // Initial update
    
    function updateCountdown() {
      const now = new Date().getTime();
      const distance = countDownDate.getTime() - now;
      
      // Calculate time units
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      
      // Update DOM elements if they exist
      if (components.hours) components.hours.textContent = hours.toString().padStart(2, '0');
      if (components.minutes) components.minutes.textContent = minutes.toString().padStart(2, '0');
      if (components.seconds) components.seconds.textContent = seconds.toString().padStart(2, '0');
      
      // If countdown finished, reset it
      if (distance < 0) {
        clearInterval(countdownInterval);
        countDownDate = new Date();
        countDownDate.setHours(countDownDate.getHours() + 24);
        setTimeout(updateCountdown, 1000);
      }
    }
  }

  // Initialize color option selection functionality
  function initColorOptions() {
    components.colorOptions.forEach(option => {
      option.addEventListener('click', function() {
        // Get selected color
        const selectedColor = this.dataset.color;
        
        // Update active class
        components.colorOptions.forEach(opt => opt.classList.remove('active'));
        this.classList.add('active');
        
        // Update main image if color data exists
        if (colorData[selectedColor] && components.mainDressImage) {
          components.mainDressImage.src = colorData[selectedColor].mainImg;
          components.mainDressImage.alt = colorData[selectedColor].altText;
          
          // Add fade effect
          components.mainDressImage.classList.add('image-fade');
          setTimeout(() => {
            components.mainDressImage.classList.remove('image-fade');
          }, 500);
        }
      });
    });
  }

  // Initialize when DOM is fully loaded
  document.addEventListener('DOMContentLoaded', initPage);
})(); 