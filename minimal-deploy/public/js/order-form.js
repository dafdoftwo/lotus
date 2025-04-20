// Order Form JavaScript with Dynamic Pricing
// Isolated using IIFE to prevent global scope pollution
(function() {
    // Configuration
    const config = {
        basePrice: 499,
        dealPrice: 349,
        isDealActive: true,
        freeShippingThreshold: 3,
        shippingCost: 40,
        colorOptions: ['black', 'navy_blue', 'red', 'white'],
        defaultColor: 'red',
        maxQuantity: 10,
        inventory: {
            black: 32,
            navy_blue: 28,
            red: 18,
            white: 25
        }
    };

    // DOM Elements
    let elements = {
        form: null,
        quantityInput: null,
        quantityDecrement: null,
        quantityIncrement: null,
        colorSelectors: null,
        regularPrice: null,
        salePrice: null,
        totalPrice: null,
        shippingMsg: null,
        savings: null,
        submitButton: null,
        stockWarning: null
    };

    // Current state
    let state = {
        quantity: 1,
        selectedColor: config.defaultColor,
        isSubmitting: false
    };

    // Initialize the form
    function init() {
        // Get DOM elements
        elements.form = document.getElementById('order-form');
        elements.quantityInput = document.getElementById('quantity');
        elements.quantityDecrement = document.getElementById('quantity-decrement');
        elements.quantityIncrement = document.getElementById('quantity-increment');
        elements.colorSelectors = document.querySelectorAll('.color-selector');
        elements.regularPrice = document.getElementById('regular-price');
        elements.salePrice = document.getElementById('sale-price');
        elements.totalPrice = document.getElementById('total-price');
        elements.shippingMsg = document.getElementById('shipping-message');
        elements.savings = document.getElementById('savings-amount');
        elements.submitButton = document.getElementById('submit-order');
        elements.stockWarning = document.getElementById('stock-warning');

        // Set initial values
        if (elements.quantityInput) {
            elements.quantityInput.value = state.quantity.toString();
        }

        // Set initial prices
        updatePriceDisplay();

        // Add event listeners
        bindEvents();
    }

    // Bind all event listeners
    function bindEvents() {
        // Quantity increment/decrement
        if (elements.quantityDecrement) {
            elements.quantityDecrement.addEventListener('click', () => updateQuantity(-1));
        }
        
        if (elements.quantityIncrement) {
            elements.quantityIncrement.addEventListener('click', () => updateQuantity(1));
        }

        // Quantity direct input
        if (elements.quantityInput) {
            elements.quantityInput.addEventListener('change', handleQuantityInputChange);
        }

        // Color selection
        if (elements.colorSelectors) {
            elements.colorSelectors.forEach(selector => {
                selector.addEventListener('click', handleColorSelection);
            });
        }

        // Form submission
        if (elements.form) {
            elements.form.addEventListener('submit', handleSubmit);
        }
    }

    // Handle quantity changes
    function updateQuantity(change) {
        const newQuantity = state.quantity + change;
        
        // Validate min/max
        if (newQuantity >= 1 && newQuantity <= config.maxQuantity) {
            state.quantity = newQuantity;
            
            // Update input value
            if (elements.quantityInput) {
                elements.quantityInput.value = state.quantity.toString();
            }
            
            // Update display
            updatePriceDisplay();
            checkInventory();
        }
    }

    // Handle direct quantity input
    function handleQuantityInputChange() {
        let newQuantity = parseInt(elements.quantityInput.value, 10);
        
        // Validate input
        if (isNaN(newQuantity) || newQuantity < 1) {
            newQuantity = 1;
        } else if (newQuantity > config.maxQuantity) {
            newQuantity = config.maxQuantity;
        }
        
        // Update state and input value (in case it was adjusted)
        state.quantity = newQuantity;
        elements.quantityInput.value = state.quantity.toString();
        
        // Update display
        updatePriceDisplay();
        checkInventory();
    }

    // Handle color selection
    function handleColorSelection(e) {
        const selected = e.currentTarget;
        const color = selected.dataset.color;
        
        if (config.colorOptions.includes(color) && color !== state.selectedColor) {
            // Update state
            state.selectedColor = color;
            
            // Update UI
            elements.colorSelectors.forEach(selector => {
                selector.classList.remove('active');
                if (selector.dataset.color === color) {
                    selector.classList.add('active');
                }
            });
            
            // Check inventory for the new color
            checkInventory();
        }
    }

    // Check inventory levels and update UI
    function checkInventory() {
        if (!elements.stockWarning) return;
        
        const currentStock = config.inventory[state.selectedColor] || 0;
        const remainingStock = currentStock - state.quantity;
        
        if (remainingStock < 0) {
            // Out of stock
            elements.stockWarning.textContent = 'الكمية المطلوبة غير متوفرة';
            elements.stockWarning.classList.add('show');
            if (elements.submitButton) {
                elements.submitButton.disabled = true;
            }
        } else if (remainingStock < 5) {
            // Low stock warning
            elements.stockWarning.textContent = `بقي ${remainingStock} قطع فقط من هذا اللون`;
            elements.stockWarning.classList.add('show');
            if (elements.submitButton) {
                elements.submitButton.disabled = false;
            }
        } else {
            // Plenty in stock
            elements.stockWarning.textContent = '';
            elements.stockWarning.classList.remove('show');
            if (elements.submitButton) {
                elements.submitButton.disabled = false;
            }
        }
    }

    // Update all price displays
    function updatePriceDisplay() {
        const quantity = state.quantity;
        const isFreeShipping = quantity >= config.freeShippingThreshold;
        const currentPrice = config.isDealActive ? config.dealPrice : config.basePrice;
        
        // Calculate prices
        const subtotal = currentPrice * quantity;
        const shipping = isFreeShipping ? 0 : config.shippingCost;
        const total = subtotal + shipping;
        const savings = config.isDealActive ? (config.basePrice - config.dealPrice) * quantity : 0;
        
        // Update price displays
        if (elements.regularPrice) {
            elements.regularPrice.textContent = `${config.basePrice} درهم`;
        }
        
        if (elements.salePrice) {
            elements.salePrice.textContent = `${currentPrice} درهم`;
        }
        
        if (elements.totalPrice) {
            elements.totalPrice.textContent = `${total} درهم`;
        }
        
        // Update shipping message
        if (elements.shippingMsg) {
            if (isFreeShipping) {
                elements.shippingMsg.textContent = 'شحن مجاني!';
                elements.shippingMsg.classList.add('free-shipping');
            } else {
                const remaining = config.freeShippingThreshold - quantity;
                elements.shippingMsg.textContent = `أضف ${remaining} قطع للحصول على شحن مجاني`;
                elements.shippingMsg.classList.remove('free-shipping');
            }
        }
        
        // Update savings amount
        if (elements.savings && config.isDealActive) {
            elements.savings.textContent = `وفرت ${savings} درهم`;
        }
    }

    // Handle form submission
    function handleSubmit(e) {
        e.preventDefault();
        
        if (state.isSubmitting) return;
        state.isSubmitting = true;
        
        // Disable submit button and show loading state
        if (elements.submitButton) {
            elements.submitButton.disabled = true;
            elements.submitButton.classList.add('loading');
            elements.submitButton.innerHTML = '<span class="spinner"></span> جاري إرسال الطلب...';
        }
        
        // Collect form data
        const formData = new FormData(elements.form);
        const orderData = {
            color: state.selectedColor,
            quantity: state.quantity,
            price: config.isDealActive ? config.dealPrice : config.basePrice,
            total: (config.isDealActive ? config.dealPrice : config.basePrice) * state.quantity,
            customer: {
                name: formData.get('name'),
                phone: formData.get('phone'),
                email: formData.get('email'),
                address: formData.get('address'),
                city: formData.get('city')
            },
            date: new Date().toISOString()
        };
        
        // Send to Firebase or other backend
        saveOrderToFirebase(orderData)
            .then(response => {
                // Show success message
                showOrderConfirmation(response.orderId);
            })
            .catch(error => {
                // Show error message
                showErrorMessage(error);
            })
            .finally(() => {
                // Reset submit button
                if (elements.submitButton) {
                    elements.submitButton.disabled = false;
                    elements.submitButton.classList.remove('loading');
                    elements.submitButton.textContent = 'إرسال الطلب';
                }
                state.isSubmitting = false;
            });
    }

    // Save order to Firebase (placeholder)
    function saveOrderToFirebase(orderData) {
        // This would be replaced with actual Firebase code
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate a successful response
                resolve({
                    success: true,
                    orderId: 'ORD-' + Math.floor(100000 + Math.random() * 900000)
                });
                
                // Or simulate an error
                // reject(new Error('فشل في الاتصال بالخادم، يرجى المحاولة مجدداً'));
            }, 1500);
        });
    }

    // Show order confirmation
    function showOrderConfirmation(orderId) {
        // Create confirmation UI
        const confirmationEl = document.createElement('div');
        confirmationEl.className = 'order-confirmation';
        confirmationEl.innerHTML = `
            <div class="confirmation-content">
                <div class="checkmark-circle">
                    <div class="checkmark"></div>
                </div>
                <h3>تم استلام طلبك بنجاح!</h3>
                <p>رقم الطلب: <strong>${orderId}</strong></p>
                <p>سنتواصل معك قريباً لتأكيد الطلب</p>
                <button class="btn-primary" id="continue-shopping">العودة للتسوق</button>
            </div>
        `;
        
        // Add to page
        document.body.appendChild(confirmationEl);
        
        // Fade in effect
        setTimeout(() => {
            confirmationEl.classList.add('show');
        }, 10);
        
        // Handle continue shopping button
        document.getElementById('continue-shopping').addEventListener('click', () => {
            confirmationEl.classList.remove('show');
            setTimeout(() => {
                confirmationEl.remove();
                // Reset form
                elements.form.reset();
                state.quantity = 1;
                elements.quantityInput.value = '1';
                updatePriceDisplay();
            }, 300);
        });
    }

    // Show error message
    function showErrorMessage(error) {
        // Create error toast
        const errorToast = document.createElement('div');
        errorToast.className = 'error-toast';
        errorToast.innerHTML = `
            <div class="error-icon">!</div>
            <div class="error-message">${error.message || 'حدث خطأ، يرجى المحاولة مرة أخرى'}</div>
        `;
        
        // Add to page
        document.body.appendChild(errorToast);
        
        // Fade in effect
        setTimeout(() => {
            errorToast.classList.add('show');
        }, 10);
        
        // Auto dismiss after 5 seconds
        setTimeout(() => {
            errorToast.classList.remove('show');
            setTimeout(() => {
                errorToast.remove();
            }, 300);
        }, 5000);
    }

    // Initialize when DOM is fully loaded
    document.addEventListener('DOMContentLoaded', init);
})(); 