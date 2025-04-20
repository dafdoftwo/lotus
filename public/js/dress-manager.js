/**
 * Lotus Dress Manager
 * ==================
 * This script handles all color, size, and product selection functionality
 * for the main product page.
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Dress Manager initialized');
    
    // ===== ELEMENT SELECTORS =====
    const mainImage = document.querySelector('.lotus-main-image img');
    const colorOptions = document.querySelectorAll('.lotus-color-option');
    const colorName = document.querySelector('.lotus-color-name');
    const colorDescription = document.querySelector('#color-description');
    const thumbnailContainer = document.querySelector('.lotus-thumbnails');
    const thumbnails = document.querySelectorAll('.lotus-thumbnail');
    const sizeOptions = document.querySelectorAll('.lotus-size-option');
    const priceDisplay = document.querySelector('.lotus-price');
    const orderButton = document.querySelector('.lotus-order-button');
    
    // ===== COLOR DATA =====
    const colorData = {
        'أسود': {  // Black
            name: 'اللون الأسود',
            description: 'فستان أنيق بتصميم عصري يناسب مختلف المناسبات',
            mainImage: 'images/Black/Firefly 20250418003250.png',
            thumbnails: [
                'images/Black/Firefly 20250418003250.png',
                'images/Black/Firefly 20250418003545.png',
                'images/Black/Firefly 20250418003641.png',
                'images/Black/Firefly 20250418004444.png'
            ],
            price: 770
        },
        'أبيض': {  // White
            name: 'اللون الأبيض',
            description: 'فستان بلون أبيض ناصع مثالي للمناسبات الرسمية والإطلالات الأنيقة',
            mainImage: 'images/White/Firefly 20250418004632.png',
            thumbnails: [
                'images/White/Firefly 20250418004632.png',
                'images/White/Firefly 20250418004614.png',
                'images/White/Firefly 20250418004951.png',
                'images/White/Firefly 20250418005000.png'
            ],
            price: 770
        },
        'أحمر': {  // Red
            name: 'اللون الأحمر',
            description: 'فستان باللون الأحمر الجذاب للإطلالات المميزة والمناسبات الخاصة',
            mainImage: 'images/red/Firefly 20250418003957.png',
            thumbnails: [
                'images/red/Firefly 20250418003957.png',
                'images/red/Firefly 20250418003751.png',
                'images/red/Firefly 20250418003815.png',
                'images/red/Firefly 20250418004250.png'
            ],
            price: 770
        },
        'كحلي': {  // Navy Blue
            name: 'اللون الكحلي',
            description: 'فستان باللون الكحلي الراقي المثالي للمناسبات المسائية والرسمية',
            mainImage: 'images/navy_blue/Firefly 20250418003030.png',
            thumbnails: [
                'images/navy_blue/Firefly 20250418003030.png',
                'images/navy_blue/Firefly 20250418002955.png',
                'images/navy_blue/Firefly 20250418002919.png',
                'images/navy_blue/Firefly 20250418002847.png'
            ],
            price: 770
        }
    };
    
    // ===== SIZE DATA =====
    const sizeData = {
        'S': { name: 'صغير', display: 'S', description: 'مناسب للمقاس 38-40' },
        'M': { name: 'متوسط', display: 'M', description: 'مناسب للمقاس 40-42' },
        'L': { name: 'كبير', display: 'L', description: 'مناسب للمقاس 42-44' },
        'XL': { name: 'كبير جداً', display: 'XL', description: 'مناسب للمقاس 44-46' },
        'XXL': { name: 'كبير جداً جداً', display: 'XXL', description: 'مناسب للمقاس 46-48' }
    };
    
    // ===== STATE MANAGEMENT =====
    let currentState = {
        color: 'أسود',  // Default color
        size: 'M',     // Default size
        quantity: 1
    };
    
    // ===== FUNCTIONS =====
    
    /**
     * Update thumbnails based on selected color
     */
    function updateThumbnails(color) {
        if (!thumbnailContainer || !colorData[color] || !colorData[color].thumbnails) return;
        
        // Clear existing thumbnails
        thumbnailContainer.innerHTML = '';
        
        // Add new thumbnails
        colorData[color].thumbnails.forEach((src, index) => {
            const thumbnail = document.createElement('div');
            thumbnail.className = `lotus-thumbnail ${index === 0 ? 'active' : ''}`;
            thumbnail.setAttribute('data-image', src);
            
            const img = document.createElement('img');
            img.src = src;
            img.alt = `فستان لوتس ${color}`;
            
            thumbnail.appendChild(img);
            thumbnailContainer.appendChild(thumbnail);
            
            // Add click event to new thumbnail
            thumbnail.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                // Update main image
                if (mainImage) {
                    mainImage.src = this.getAttribute('data-image');
                    mainImage.classList.add('fade-in');
                    setTimeout(() => mainImage.classList.remove('fade-in'), 500);
                }
                
                // Update active class
                document.querySelectorAll('.lotus-thumbnail').forEach(thumb => {
                    thumb.classList.remove('active');
                });
                this.classList.add('active');
            });
        });
        
        // Set main image
        if (mainImage && colorData[color].mainImage) {
            mainImage.src = colorData[color].mainImage;
            mainImage.classList.add('fade-in');
            setTimeout(() => mainImage.classList.remove('fade-in'), 500);
        } else if (mainImage && colorData[color].thumbnails.length > 0) {
            mainImage.src = colorData[color].thumbnails[0];
            mainImage.classList.add('fade-in');
            setTimeout(() => mainImage.classList.remove('fade-in'), 500);
        }
    }
    
    /**
     * Update color information display
     */
    function updateColorInfo(color) {
        if (!colorData[color]) return;
        
        if (colorName) {
            colorName.textContent = colorData[color].name;
            colorName.classList.add('flash-text');
            setTimeout(() => colorName.classList.remove('flash-text'), 500);
        }
        
        if (colorDescription) {
            colorDescription.textContent = colorData[color].description;
            colorDescription.classList.add('flash-text');
            setTimeout(() => colorDescription.classList.remove('flash-text'), 500);
        }
    }
    
    /**
     * Update price based on current selection
     */
    function updatePrice() {
        if (!priceDisplay) return;
        
        let basePrice = colorData[currentState.color].price;
        let finalPrice = basePrice;
        
        // Quantity discounts
        if (currentState.quantity === 2) {
            finalPrice = basePrice + 649; // Second dress discount price
        } else if (currentState.quantity >= 3) {
            finalPrice = basePrice + 649 + 549; // Third dress discount price
        } else {
            finalPrice = basePrice;
        }
        
        // Update price display
        priceDisplay.innerHTML = `${finalPrice} <span class="currency">جنيه</span>`;
        priceDisplay.classList.add('flash-price');
        setTimeout(() => priceDisplay.classList.remove('flash-price'), 500);
        
        // Update any quantity-based promotions
        const freeShippingNotice = document.querySelector('.free-shipping-notice');
        if (freeShippingNotice) {
            freeShippingNotice.style.display = currentState.quantity >= 3 ? 'block' : 'none';
        }
    }
    
    /**
     * Set active state for color options
     */
    function setActiveColor(color) {
        // Reset all color options
        colorOptions.forEach(option => {
            option.classList.remove('active');
        });
        
        // Set active for selected color
        const selectedOption = document.querySelector(`.lotus-color-option[data-color="${color}"]`);
        if (selectedOption) {
            selectedOption.classList.add('active');
        }
        
        // Update state
        currentState.color = color;
    }
    
    /**
     * Set active state for size options
     */
    function setActiveSize(size) {
        // Reset all size options
        sizeOptions.forEach(option => {
            option.classList.remove('active');
        });
        
        // Set active for selected size
        const selectedOption = document.querySelector(`.lotus-size-option[data-size="${size}"]`);
        if (selectedOption) {
            selectedOption.classList.add('active');
        }
        
        // Update state
        currentState.size = size;
    }
    
    /**
     * Initialize the quantity selector
     */
    function initQuantitySelector() {
        const quantitySelector = document.querySelector('.lotus-quantity-selector');
        const decreaseBtn = document.querySelector('.quantity-decrease');
        const increaseBtn = document.querySelector('.quantity-increase');
        const quantityDisplay = document.querySelector('.quantity-value');
        
        if (!quantitySelector || !decreaseBtn || !increaseBtn || !quantityDisplay) return;
        
        // Set initial value
        quantityDisplay.textContent = currentState.quantity;
        
        // Decrease quantity
        decreaseBtn.addEventListener('click', function() {
            if (currentState.quantity > 1) {
                currentState.quantity--;
                quantityDisplay.textContent = currentState.quantity;
                updatePrice();
            }
        });
        
        // Increase quantity
        increaseBtn.addEventListener('click', function() {
            if (currentState.quantity < 3) { // Maximum 3 dresses
                currentState.quantity++;
                quantityDisplay.textContent = currentState.quantity;
                updatePrice();
            }
        });
    }
    
    /**
     * Update all UI elements based on current state
     */
    function updateAllUI() {
        setActiveColor(currentState.color);
        setActiveSize(currentState.size);
        updateThumbnails(currentState.color);
        updateColorInfo(currentState.color);
        updatePrice();
    }
    
    /**
     * Initialize all event listeners
     */
    function initEventListeners() {
        // Color option click events
        colorOptions.forEach(option => {
            option.addEventListener('click', function() {
                const color = this.getAttribute('data-color');
                if (!color || color === currentState.color) return;
                
                currentState.color = color;
                updateAllUI();
            });
        });
        
        // Size option click events
        sizeOptions.forEach(option => {
            option.addEventListener('click', function() {
                const size = this.getAttribute('data-size');
                if (!size || size === currentState.size) return;
                
                currentState.size = size;
                updateAllUI();
            });
        });
        
        // Order button click
        if (orderButton) {
            orderButton.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Scroll to order form if it exists
                const orderForm = document.querySelector('#order-form');
                if (orderForm) {
                    orderForm.scrollIntoView({ behavior: 'smooth' });
                    
                    // Pre-fill form with selected options
                    const colorSelect = document.querySelector('select[name="color"]');
                    const sizeSelect = document.querySelector('select[name="size"]');
                    const quantityInput = document.querySelector('input[name="quantity"]');
                    
                    if (colorSelect) colorSelect.value = currentState.color;
                    if (sizeSelect) sizeSelect.value = currentState.size;
                    if (quantityInput) quantityInput.value = currentState.quantity;
                }
            });
        }
    }
    
    // ===== INITIALIZATION =====
    function init() {
        updateAllUI();
        initEventListeners();
        initQuantitySelector();
        
        // Get URL parameters if any
        const urlParams = new URLSearchParams(window.location.search);
        const colorParam = urlParams.get('color');
        
        // Set initial color from URL if available
        if (colorParam && colorData[colorParam]) {
            currentState.color = colorParam;
            updateAllUI();
        }
    }
    
    // Initialize the dress manager
    init();
}); 