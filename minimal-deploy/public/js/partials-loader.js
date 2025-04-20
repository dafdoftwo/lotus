/**
 * Lotus - Partials Loader
 * هذا الملف مسؤول عن تحميل الملفات الجزئية وإدراجها في الصفحة الرئيسية
 */

document.addEventListener('DOMContentLoaded', function() {
    // قائمة الملفات الجزئية التي يجب تحميلها
    const partials = [
        { id: 'header-placeholder', file: 'partials/_header.html' },
        { id: 'hero-placeholder', file: 'partials/_hero.html' },
        { id: 'color-showcase-placeholder', file: 'partials/_color-showcase.html' },
        { id: 'features-placeholder', file: 'partials/_features.html' },
        { id: 'testimonials-placeholder', file: 'partials/_testimonials.html' },
        { id: 'size-chart-container', file: 'partials/_size-chart.html' },
        { id: 'discount-section-placeholder', file: 'partials/_discount-section.html' },
        { id: 'order-form-placeholder', file: 'partials/_order-form.html' },
        { id: 'footer-placeholder', file: 'partials/_footer.html' }
    ];

    // Add Facebook Pixel scroll depth tracking
    setupScrollDepthTracking();

    // دالة لتحميل الملف الجزئي وإدراجه في العنصر المحدد
    function loadPartial(id, file) {
        const element = document.getElementById(id);
        if (!element) {
            console.warn(`العنصر بالمعرف ${id} غير موجود في الصفحة`);
            return;
        }

        fetch(file)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`فشل تحميل الملف ${file}: ${response.status} ${response.statusText}`);
                }
                return response.text();
            })
            .then(html => {
                element.innerHTML = html;
                
                // تشغيل السكربتات داخل الملف الجزئي (إن وجدت)
                const scripts = element.querySelectorAll('script');
                scripts.forEach(script => {
                    const newScript = document.createElement('script');
                    
                    // نسخ السمات
                    Array.from(script.attributes).forEach(attr => {
                        newScript.setAttribute(attr.name, attr.value);
                    });
                    
                    // نسخ المحتوى
                    newScript.innerHTML = script.innerHTML;
                    
                    // إزالة السكربت القديم وإضافة الجديد
                    script.parentNode.replaceChild(newScript, script);
                });
                
                // تفعيل الأحداث المرتبطة بالملف الجزئي
                if (id === 'header-placeholder') {
                    initializeHeader();
                } else if (id === 'testimonials-placeholder') {
                    initializeTestimonials();
                } else if (id === 'order-form-placeholder') {
                    initializeOrderForm();
                } else if (id === 'color-showcase-placeholder') {
                    initializeColorShowcase();
                } else if (id === 'footer-placeholder') {
                    initializeFooter();
                } else if (id === 'features-placeholder') {
                    initializeFeatures();
                } else if (id === 'hero-placeholder') {
                    initializeHero();
                } else if (id === 'size-chart-container') {
                    initializeSizeChart();
                } else if (id === 'discount-section-placeholder') {
                    initializeDiscountSection();
                }
            })
            .catch(error => {
                console.error(`خطأ في تحميل الملف الجزئي: ${error.message}`);
                element.innerHTML = `<div class="error-message">عذراً، حدث خطأ أثناء تحميل المحتوى</div>`;
            });
    }

    // تهيئة عناصر الهيدر
    function initializeHeader() {
        console.log('تم تحميل الهيدر بنجاح');
        
        // تفعيل قائمة الجوال
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const navLinks = document.querySelector('.nav-links');
        
        if (mobileMenuBtn && navLinks) {
            mobileMenuBtn.addEventListener('click', function() {
                navLinks.classList.toggle('active');
            });
        }
    }
    
    // تهيئة قسم البطل (Hero)
    function initializeHero() {
        console.log('تم تحميل قسم البطل بنجاح');
        
        // تفعيل العد التنازلي
        startTimer();
    }
    
    // دالة لبدء العد التنازلي
    function startTimer() {
        const timerDisplay = document.getElementById('timerValue');
        if (!timerDisplay) return;
        
        let hours = 5;
        let minutes = 0;
        let seconds = 0;
        
        const timer = setInterval(function() {
            seconds--;
            if (seconds < 0) {
                seconds = 59;
                minutes--;
                if (minutes < 0) {
                    minutes = 59;
                    hours--;
                    if (hours < 0) {
                        clearInterval(timer);
                        hours = 0;
                        minutes = 0;
                        seconds = 0;
                    }
                }
            }
            
            const displayHours = hours.toString().padStart(2, '0');
            const displayMinutes = minutes.toString().padStart(2, '0');
            const displaySeconds = seconds.toString().padStart(2, '0');
            
            timerDisplay.textContent = `${displayHours}:${displayMinutes}:${displaySeconds}`;
        }, 1000);
    }

    // تهيئة قسم عرض الألوان
    function initializeColorShowcase() {
        console.log('تم تحميل قسم عرض الألوان بنجاح');
        
        const mainImage = document.getElementById('main-color-image');
        const colorName = document.getElementById('color-name');
        const colorDescription = document.getElementById('color-description');
        const colorOptions = document.querySelectorAll('.lotus-color-option');
        const thumbnails = document.querySelectorAll('.lotus-thumbnail');
        
        // بيانات الألوان
        const colorData = {
            'أسود': {
                name: 'اللون الأسود',
                description: 'فستان أنيق بتصميم عصري يناسب مختلف المناسبات',
                thumbnails: [
                    'images/Black/Firefly 20250418003250.png',
                    'images/Black/Firefly 20250418003545.png',
                    'images/Black/Firefly 20250418003641.png',
                    'images/Black/Firefly 20250418004444.png'
                ]
            },
            'أحمر': {
                name: 'اللون الأحمر',
                description: 'فستان باللون الأحمر الجذاب للإطلالات المميزة والمناسبات الخاصة',
                thumbnails: [
                    'images/red/Firefly 20250418003957.png',
                    'images/red/Firefly 20250418003751.png',
                    'images/red/Firefly 20250418003815.png',
                    'images/red/Firefly 20250418004250.png'
                ]
            },
            'أبيض': {
                name: 'اللون الأبيض',
                description: 'فستان أبيض أنيق بتصميم راقي يناسب المناسبات الخاصة والإطلالات المميزة',
                thumbnails: [
                    'images/White/Firefly 20250418004632.png',
                    'images/White/Firefly 20250418004614.png',
                    'images/White/Firefly 20250418004951.png',
                    'images/White/Firefly 20250418005000.png'
                ]
            },
            'كحلي': {
                name: 'اللون الكحلي',
                description: 'فستان باللون الكحلي الراقي المثالي للمناسبات المسائية والرسمية',
                thumbnails: [
                    'images/navy_blue/Firefly 20250418003030.png',
                    'images/navy_blue/Firefly 20250418002955.png',
                    'images/navy_blue/Firefly 20250418002919.png',
                    'images/navy_blue/Firefly 20250418002847.png'
                ]
            }
        };
        
        // دالة لتحديث الصور المصغرة بناءً على اللون المحدد
        function updateThumbnails(color) {
            const thumbnailContainer = document.getElementById('color-thumbnails');
            if (thumbnailContainer && colorData[color] && colorData[color].thumbnails) {
                // مسح الصور المصغرة الحالية
                thumbnailContainer.innerHTML = '';
                
                // إضافة الصور المصغرة الجديدة
                colorData[color].thumbnails.forEach((src, index) => {
                    const thumbnail = document.createElement('div');
                    thumbnail.className = `lotus-thumbnail ${index === 0 ? 'active' : ''}`;
                    thumbnail.setAttribute('data-image', src);
                    
                    const img = document.createElement('img');
                    img.src = src;
                    img.alt = `فستان لوتس ${color}`;
                    
                    thumbnail.appendChild(img);
                    thumbnailContainer.appendChild(thumbnail);
                    
                    // إضافة حدث النقر على الصورة المصغرة
                    thumbnail.addEventListener('click', function() {
                        // تحديث الصورة الرئيسية
                        if (mainImage) {
                            mainImage.src = this.getAttribute('data-image');
                        }
                        
                        // تحديث فئة active
                        document.querySelectorAll('.lotus-thumbnail').forEach(thumb => {
                            thumb.classList.remove('active');
                        });
                        this.classList.add('active');
                    });
                });
            }
        }
        
        // إضافة مستمعي الأحداث لخيارات الألوان
        if (colorOptions.length > 0) {
            colorOptions.forEach(option => {
                option.addEventListener('click', function() {
                    // إزالة الحالة النشطة من جميع الخيارات
                    colorOptions.forEach(opt => opt.classList.remove('active'));
                    // إضافة الحالة النشطة للخيار المحدد
                    this.classList.add('active');
                    
                    // تحديث الصورة الرئيسية
                    if (mainImage) {
                        mainImage.src = this.getAttribute('data-main');
                    }
                    
                    // تحديث اسم اللون والوصف
                    const selectedColor = this.getAttribute('data-color');
                    if (colorName && colorData[selectedColor]) {
                        colorName.textContent = colorData[selectedColor].name;
                    }
                    
                    if (colorDescription && colorData[selectedColor]) {
                        colorDescription.textContent = colorData[selectedColor].description;
                    }
                    
                    // تحديث الصور المصغرة
                    updateThumbnails(selectedColor);
                });
            });
        }
        
        // إضافة مستمعي الأحداث للصور المصغرة
        if (thumbnails.length > 0) {
            thumbnails.forEach(thumbnail => {
                thumbnail.addEventListener('click', function() {
                    // إزالة الحالة النشطة من جميع الصور المصغرة
                    thumbnails.forEach(thumb => thumb.classList.remove('active'));
                    // إضافة الحالة النشطة للصورة المصغرة المحددة
                    this.classList.add('active');
                    
                    // تحديث الصورة الرئيسية
                    if (mainImage) {
                        mainImage.src = this.getAttribute('data-image');
                    }
                });
            });
        }
    }

    // تهيئة قسم الآراء والتقييمات
    function initializeTestimonials() {
        console.log('تم تحميل قسم الآراء بنجاح');
        
        // تهيئة التأثيرات الحركية للبطاقات
        const testimonialCards = document.querySelectorAll('.testimonial-card');
        if (testimonialCards.length > 0) {
            testimonialCards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('animated');
                }, index * 200);
            });
        }
    }

    // تهيئة قسم المميزات
    function initializeFeatures() {
        console.log('تم تحميل قسم المميزات بنجاح');
        
        // Llamar a la función de inicialización de animaciones si está disponible
        if (typeof initializeFeaturesAnimations === 'function') {
            initializeFeaturesAnimations();
        } else {
            // Código existente para animar las características como respaldo
            const featureCards = document.querySelectorAll('.feature-card');
            if (featureCards.length > 0) {
                featureCards.forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.add('fade-in-up');
                        card.classList.add(`delay-${index % 3 + 1}`);
                    }, 100 * index);
                });
            }
        }
    }

    // تهيئة نموذج الطلب
    function initializeOrderForm() {
        console.log('بدء تهيئة نموذج الطلب...');
        
        const orderFormElement = document.getElementById('order-form-placeholder');
        if (!orderFormElement) {
            console.error('لم يتم العثور على عنصر نموذج الطلب في الصفحة');
            return;
        }
        
        try {
            // تحقق من وجود الدالة العمومية
            if (typeof window.initOrderForm === 'function') {
                console.log('تم العثور على دالة initOrderForm العمومية، جاري التنفيذ...');
                window.initOrderForm();
                console.log('تم تنفيذ دالة initOrderForm بنجاح');
            } else {
                console.warn('دالة initOrderForm غير موجودة في النافذة العمومية');
                
                // محاولة تحميل النموذج مرة أخرى كحل بديل
                const scriptElement = document.createElement('script');
                scriptElement.textContent = `
                    console.log('محاولة إعادة تهيئة نموذج الطلب...');
                    if (document.readyState === 'loading') {
                        document.addEventListener('DOMContentLoaded', function() {
                            if (typeof window.initOrderForm === 'function') {
                                window.initOrderForm();
                            }
                        });
                    } else {
                        if (typeof window.initOrderForm === 'function') {
                            window.initOrderForm();
                        }
                    }
                `;
                document.body.appendChild(scriptElement);
            }
        } catch (error) {
            console.error('حدث خطأ أثناء تهيئة نموذج الطلب:', error);
            orderFormElement.innerHTML = '<div class="error-message">عذراً، حدث خطأ أثناء تحميل نموذج الطلب. يرجى تحديث الصفحة.</div>';
        }
    }
    
    // تهيئة الفوتر
    function initializeFooter() {
        console.log('تم تحميل الفوتر بنجاح');
        
        // تهيئة نموذج الاشتراك في النشرة البريدية
        const newsletterForm = document.querySelector('.newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const emailInput = this.querySelector('.newsletter-input');
                if (emailInput && emailInput.value) {
                    alert(`تم تسجيل البريد الإلكتروني "${emailInput.value}" في القائمة البريدية بنجاح!`);
                    emailInput.value = '';
                }
            });
        }
    }

    // تهيئة قسم جدول المقاسات
    function initializeSizeChart() {
        console.log('تم تحميل جدول المقاسات بنجاح');
        
        // هذه الدالة تم تبسيطها لأن المنطق الأساسي موجود الآن في ملف _size-chart.html
        // حيث تم عزل الكود بالكامل لتجنب أي تعارض
        
        // If needed, we can add additional initialization here that doesn't interfere
        // with the core functionality already contained in the isolated IIFE
    }

    // تهيئة قسم الخصومات
    function initializeDiscountSection() {
        console.log('تم تحميل قسم الخصومات بنجاح');
        
        // إضافة تأثيرات حركية لبطاقات الخصم
        const discountOptions = document.querySelectorAll('.discount-option');
        if (discountOptions.length > 0) {
            discountOptions.forEach((option, index) => {
                setTimeout(() => {
                    option.classList.add('animated');
                }, index * 200);
            });
        }
        
        // ربط أزرار الطلب بقسم نموذج الطلب
        const orderButtons = document.querySelectorAll('.discount-btn');
        if (orderButtons.length > 0) {
            orderButtons.forEach((button, index) => {
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    // تحديث كمية المنتج في نموذج الطلب بناءً على الباقة المختارة
                    const quantity = index + 1;
                    const quantitySelect = document.getElementById('quantity');
                    if (quantitySelect && quantitySelect.options && quantitySelect.options.length > quantity - 1) {
                        quantitySelect.selectedIndex = quantity - 1;
                        
                        // إطلاق حدث تغيير لتحديث ملخص الطلب
                        const event = new Event('change');
                        quantitySelect.dispatchEvent(event);
                    }
                    
                    // الانتقال إلى نموذج الطلب
                    const orderForm = document.getElementById('order-now');
                    if (orderForm) {
                        orderForm.scrollIntoView({ behavior: 'smooth' });
                    }
                });
            });
        }
    }

    // تحميل جميع الملفات الجزئية
    partials.forEach(partial => {
        loadPartial(partial.id, partial.file);
    });

    // Function to track scroll depth with Facebook Pixel
    function setupScrollDepthTracking() {
        if (typeof fbq === 'undefined') {
            console.warn('Facebook Pixel not available for scroll tracking');
            return;
        }

        // Sections to track
        const sectionsToTrack = [
            { id: 'color-showcase-placeholder', name: 'ColorShowcase', tracked: false },
            { id: 'features-placeholder', name: 'Features', tracked: false },
            { id: 'testimonials-placeholder', name: 'Testimonials', tracked: false },
            { id: 'order-form-placeholder', name: 'OrderForm', tracked: false }
        ];

        // Track scroll events
        window.addEventListener('scroll', function() {
            sectionsToTrack.forEach(section => {
                if (!section.tracked) {
                    const element = document.getElementById(section.id);
                    if (element && isElementInViewport(element)) {
                        // Track custom event in Facebook Pixel
                        fbq('trackCustom', 'Scroll_' + section.name, {
                            section: section.name,
                            timestamp: new Date().toISOString()
                        });
                        console.log('Facebook Pixel: Scroll tracked for ' + section.name);
                        section.tracked = true;
                    }
                }
            });
        });
    }

    // Helper function to check if an element is in viewport
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
}); 