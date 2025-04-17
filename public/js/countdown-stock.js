(function() {
    'use strict';
    
    // Configuration settings for countdown and stock
    const config = {
        // Countdown settings - 3 days from now
        endDate: new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000),
        
        // Stock settings
        totalStock: 50,
        remainingStock: 37,
        
        // When to show low stock warning (percentage)
        lowStockThreshold: 30
    };
    
    // DOM elements
    const elements = {
        daysElement: document.getElementById('countdown-days'),
        hoursElement: document.getElementById('countdown-hours'),
        minutesElement: document.getElementById('countdown-minutes'),
        secondsElement: document.getElementById('countdown-seconds'),
        stockCountElement: document.getElementById('stock-count'),
        stockBarElement: document.getElementById('stock-bar')
    };
    
    // Initialize countdown and stock display
    function init() {
        // Check if all required elements exist
        if (!validateElements()) {
            console.warn('Some countdown or stock elements are missing.');
            return;
        }
        
        // Set initial values
        updateStockDisplay();
        
        // Start countdown
        updateCountdown();
        setInterval(updateCountdown, 1000);
        
        // Add some randomization to make stock decrease occasionally
        setInterval(randomStockDecrease, 30000);
    }
    
    // Validate that all required elements exist in the DOM
    function validateElements() {
        return Object.values(elements).every(element => element !== null);
    }
    
    // Update countdown display
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = config.endDate - now;
        
        // Check if countdown has ended
        if (distance < 0) {
            // Optionally reset the countdown or show a message
            resetCountdown();
            return;
        }
        
        // Calculate time units
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // Update DOM
        elements.daysElement.textContent = formatNumber(days);
        elements.hoursElement.textContent = formatNumber(hours);
        elements.minutesElement.textContent = formatNumber(minutes);
        elements.secondsElement.textContent = formatNumber(seconds);
    }
    
    // Format numbers to always have two digits
    function formatNumber(num) {
        return num < 10 ? '0' + num : num;
    }
    
    // Reset countdown after it ends
    function resetCountdown() {
        // Reset to a new date (e.g., 24 hours from now)
        config.endDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
    }
    
    // Update stock display
    function updateStockDisplay() {
        // Calculate percentage and update display
        const percentage = Math.max(0, Math.min(100, (config.remainingStock / config.totalStock) * 100));
        
        // Update text and progress bar
        if (elements.stockCountElement) {
            elements.stockCountElement.textContent = config.remainingStock;
        }
        
        if (elements.stockBarElement) {
            elements.stockBarElement.style.width = percentage + '%';
            
            // Change color based on stock level
            if (percentage <= config.lowStockThreshold) {
                elements.stockBarElement.style.background = 'linear-gradient(to right, #e74c3c, #e74c3c)';
            }
        }
    }
    
    // Randomly decrease stock for dynamic effect
    function randomStockDecrease() {
        // 20% chance to decrease stock by 1
        if (Math.random() < 0.2 && config.remainingStock > 1) {
            config.remainingStock -= 1;
            updateStockDisplay();
            
            // If this purchase brought stock below a threshold, show urgency notification
            if ((config.remainingStock / config.totalStock) * 100 <= config.lowStockThreshold) {
                showUrgencyNotification();
            }
        }
    }
    
    // Show low stock notification
    function showUrgencyNotification() {
        // You can implement a custom notification here
        // For example, a toast message or highlighting the stock count
        const notification = document.createElement('div');
        notification.className = 'urgency-notification';
        notification.textContent = 'الكمية محدودة! فقط ' + config.remainingStock + ' قطعة متبقية!';
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: 'rgba(231, 76, 60, 0.9)',
            color: 'white',
            padding: '12px 20px',
            borderRadius: '8px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
            zIndex: '999',
            transform: 'translateX(120%)',
            transition: 'transform 0.3s ease'
        });
        
        // Add to DOM
        document.body.appendChild(notification);
        
        // Trigger animation
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(120%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 5000);
    }
    
    // Initialize on load if in browser environment
    if (typeof window !== 'undefined') {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
        } else {
            init();
        }
    }
})(); 