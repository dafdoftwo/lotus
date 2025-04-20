// Discount Offers Section Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Add animated icon to free shipping option
    const shippingIcon = document.querySelector('.shipping-icon');
    if (shippingIcon) {
        function animateShipping() {
            shippingIcon.style.transform = 'translateX(-5px)';
            setTimeout(() => {
                shippingIcon.style.transform = 'translateX(0)';
            }, 300);
        }
        
        // Animate every 3 seconds
        setInterval(animateShipping, 3000);
        
        // Start with animation
        setTimeout(animateShipping, 1000);
    }
    
    // Handle order buttons click
    const offerButtons = document.querySelectorAll('.discount-offers-section .order-button');
    offerButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Get the parent card to determine which offer was selected
            const parentCard = this.closest('.offer-card');
            const offerTitle = parentCard.querySelector('.offer-title').textContent;
            
            // Set quantity in order form based on selected offer
            setTimeout(() => {
                const quantitySelect = document.getElementById('dress-quantity');
                if (quantitySelect) {
                    // Extract quantity from offer title
                    const quantity = parseInt(offerTitle.match(/\d+/)[0]);
                    
                    // Set the quantity in the dropdown
                    for (let i = 0; i < quantitySelect.options.length; i++) {
                        if (parseInt(quantitySelect.options[i].value) === quantity) {
                            quantitySelect.selectedIndex = i;
                            
                            // Trigger change event to update form calculations
                            const changeEvent = new Event('change');
                            quantitySelect.dispatchEvent(changeEvent);
                            break;
                        }
                    }
                    
                    // Show feedback to user
                    const feedbackMsg = document.createElement('div');
                    feedbackMsg.className = 'quantity-feedback';
                    feedbackMsg.textContent = `تم اختيار ${offerTitle}`;
                    feedbackMsg.style.color = '#d4796f';
                    feedbackMsg.style.fontWeight = 'bold';
                    feedbackMsg.style.marginTop = '5px';
                    feedbackMsg.style.fontSize = '14px';
                    
                    const quantityContainer = quantitySelect.parentElement;
                    
                    // Remove existing feedback if any
                    const existingFeedback = quantityContainer.querySelector('.quantity-feedback');
                    if (existingFeedback) {
                        existingFeedback.remove();
                    }
                    
                    // Add new feedback
                    quantityContainer.appendChild(feedbackMsg);
                    
                    // Fade out after 3 seconds
                    setTimeout(() => {
                        feedbackMsg.style.opacity = '0';
                        feedbackMsg.style.transition = 'opacity 0.5s ease';
                        
                        // Remove after fade
                        setTimeout(() => {
                            feedbackMsg.remove();
                        }, 500);
                    }, 3000);
                }
            }, 800); // Wait for smooth scroll to complete
        });
    });
}); 