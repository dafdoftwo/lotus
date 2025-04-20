/**
 * Mobile Optimizer Script
 * Script para optimizar el rendimiento en dispositivos móviles
 */

(function() {
    // Ejecutar cuando el DOM esté cargado
    document.addEventListener('DOMContentLoaded', function() {
        // Detectar si es un dispositivo móvil
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            console.log('Aplicando optimizaciones para móviles');
            
            // 1. Optimizar imágenes
            optimizeImages();
            
            // 2. Reducir animaciones
            reduceAnimations();
            
            // 3. Mejorar interacción táctil
            enhanceTouchInteraction();
            
            // 4. Establecer manejo de orientación
            setupOrientationHandling();
            
            // 5. Optimizar desplazamiento
            optimizeScrolling();
            
            // 6. Añadir navegación rápida
            enhanceMobileNavigation();
            
            // 7. Prevenir desplazamiento horizontal (nuevo)
            preventHorizontalScroll();
        }
    });
    
    // Función para optimizar imágenes
    function optimizeImages() {
        // Aplicar lazy loading a todas las imágenes
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            // No reemplazar si ya tiene el atributo loading
            if (!img.hasAttribute('loading')) {
                img.loading = 'lazy';
            }
            
            // Asegurarse de que todas las imágenes tengan alt para accesibilidad
            if (!img.hasAttribute('alt')) {
                img.alt = 'صورة فستان لوتس';
            }
        });
        
        // Añadir decode=async para las imágenes principales
        const mainImages = document.querySelectorAll('.lotus-main-image img, .hero-media img');
        mainImages.forEach(img => {
            img.decoding = 'async';
        });
    }
    
    // Función para reducir animaciones
    function reduceAnimations() {
        // Añadir clase para reducir animaciones
        document.body.classList.add('reduce-motion');
        
        // Añadir estilos para reducir animaciones
        const style = document.createElement('style');
        style.textContent = `
            @media (max-width: 768px) {
                /* Reducir las animaciones para mejorar rendimiento */
                .reduce-motion * {
                    transition-duration: 50% !important;
                    animation-duration: 50% !important;
                }
                
                /* Desactivar animaciones de fondo y sombras que consumen recursos */
                .reduce-motion .bg-animation,
                .reduce-motion .shadow-animation {
                    display: none !important;
                }
                
                /* Simplificar efectos de hover en botones */
                .reduce-motion .btn:hover,
                .reduce-motion .feature-cta:hover,
                .reduce-motion .lotus-color-button:hover {
                    transform: translateY(-3px) !important;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Función para mejorar la interacción táctil
    function enhanceTouchInteraction() {
        // Aumentar el tamaño de las áreas de toque para mejor usabilidad
        const touchableElements = document.querySelectorAll('a, button, .lotus-color-option, .lotus-thumbnail');
        
        touchableElements.forEach(el => {
            // Añadir feedback visual para interacciones táctiles
            el.addEventListener('touchstart', function() {
                this.classList.add('touch-active');
            });
            
            el.addEventListener('touchend', function() {
                this.classList.remove('touch-active');
                // Pequeño retraso para que el usuario vea el feedback
                setTimeout(() => {
                    this.classList.remove('touch-active');
                }, 150);
            });
        });
        
        // Añadir estilos para mejor feedback táctil
        const touchStyle = document.createElement('style');
        touchStyle.textContent = `
            .touch-active {
                opacity: 0.8 !important;
                transform: scale(0.98) !important;
            }
            
            @media (max-width: 768px) {
                /* Aumentar área de toque */
                nav a, .feature-cta, .footer-link {
                    padding: 10px !important;
                    margin: 5px !important;
                }
                
                /* Aumentar tamaño de botones */
                .btn, button, .submit-btn {
                    min-height: 44px;
                }
            }
        `;
        document.head.appendChild(touchStyle);
    }
    
    // Función para manejar cambios de orientación
    function setupOrientationHandling() {
        // Detectar cambio de orientación
        window.addEventListener('orientationchange', function() {
            // Añadir clase para aplicar estilos específicos durante el cambio
            document.body.classList.add('orientation-changing');
            
            // Reajustar después del cambio
            setTimeout(() => {
                document.body.classList.remove('orientation-changing');
                
                // Reoptimizar diseño
                updateLayoutForOrientation();
                
                // Volver a aplicar prevención de scroll horizontal
                preventHorizontalScroll();
            }, 300);
        });
        
        // Configuración inicial basada en la orientación
        updateLayoutForOrientation();
    }
    
    // Función para actualizar el diseño según la orientación
    function updateLayoutForOrientation() {
        const isLandscape = window.innerWidth > window.innerHeight;
        
        if (isLandscape) {
            document.body.classList.add('landscape');
            document.body.classList.remove('portrait');
        } else {
            document.body.classList.add('portrait');
            document.body.classList.remove('landscape');
        }
    }
    
    // Función para prevenir desplazamiento horizontal (nueva)
    function preventHorizontalScroll() {
        // Asegurar que el HTML y BODY tengan overflow-x: hidden
        const preventScrollStyle = document.createElement('style');
        preventScrollStyle.id = 'prevent-horizontal-scroll';
        
        // Eliminar estilo existente si ya existe
        const existingStyle = document.getElementById('prevent-horizontal-scroll');
        if (existingStyle) {
            existingStyle.remove();
        }
        
        // Aplicar nuevos estilos para prevenir desplazamiento horizontal
        preventScrollStyle.textContent = `
            @media (max-width: 768px) {
                html, body {
                    overflow-x: hidden !important;
                    width: 100% !important;
                    position: relative !important;
                    touch-action: pan-y !important;
                }
                
                /* Asegurar que los elementos no causen scroll horizontal */
                .container, section, div, nav {
                    max-width: 100vw !important;
                    box-sizing: border-box !important;
                }
                
                /* Solucionar problemas de RTL en algunos navegadores de móviles */
                [dir="rtl"] {
                    unicode-bidi: isolate !important;
                }
                
                /* Corregir cualquier transformación que pueda causar scroll horizontal */
                .transform-fix {
                    transform: none !important;
                }
                
                /* Asegurar que los elementos absolutos no causen overflow */
                .overflow-fix, 
                .hero-badge, 
                .notification,
                .floating-cta,
                .back-to-top {
                    left: auto !important;
                    right: auto !important;
                }
            }
        `;
        document.head.appendChild(preventScrollStyle);
        
        // Corregir cualquier elemento que pueda estar causando desplazamiento horizontal
        document.querySelectorAll('.container, section').forEach(el => {
            if (el.scrollWidth > window.innerWidth) {
                el.classList.add('overflow-fix');
                console.log('Elemento con overflow horizontal corregido:', el);
            }
        });
        
        // Deshabilitar eventos de touch que puedan causar desplazamiento horizontal
        document.addEventListener('touchmove', function(e) {
            if (e.touches.length > 1) return; // Permitir pellizcar para zoom
            
            const touch = e.touches[0];
            const startX = touch.pageX;
            
            document.addEventListener('touchmove', function moveHandler(e) {
                if (e.touches.length > 1) return;
                
                const moveX = e.touches[0].pageX;
                const diffX = startX - moveX;
                
                // Si hay un intento de desplazamiento horizontal significativo
                if (Math.abs(diffX) > 10 && Math.abs(diffX) > Math.abs(startX - e.touches[0].pageY)) {
                    // Solo prevenir si está en los bordes (para evitar afectar sliders)
                    if ((diffX > 0 && window.scrollX <= 0) || 
                        (diffX < 0 && window.scrollX + window.innerWidth >= document.body.scrollWidth)) {
                        e.preventDefault();
                    }
                }
            }, { passive: false });
            
            document.addEventListener('touchend', function() {
                document.removeEventListener('touchmove', moveHandler);
            }, { once: true });
        }, { passive: false });
    }
    
    // Función para optimizar el desplazamiento
    function optimizeScrolling() {
        // Añadir scroll suave para anclajes
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                
                if (targetId !== '#') {
                    e.preventDefault();
                    
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        // Desplazamiento suave con comportamiento nativo
                        targetElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                        
                        // Cerrar menú móvil si está abierto
                        const mobileMenu = document.querySelector('.nav-links.active');
                        if (mobileMenu) {
                            mobileMenu.classList.remove('active');
                        }
                    }
                }
            });
        });
        
        // Optimizar rendimiento durante el scroll
        let scrollTimeout;
        window.addEventListener('scroll', function() {
            // Añadir clase durante el scroll
            document.body.classList.add('is-scrolling');
            
            // Limpiar timeout existente
            clearTimeout(scrollTimeout);
            
            // Establecer timeout para quitar la clase cuando se termine de desplazar
            scrollTimeout = setTimeout(function() {
                document.body.classList.remove('is-scrolling');
            }, 150);
        }, { passive: true });
        
        // Añadir estilos para optimización de scroll
        const scrollStyle = document.createElement('style');
        scrollStyle.textContent = `
            @media (max-width: 768px) {
                .is-scrolling {
                    pointer-events: none;
                }
                
                .is-scrolling .parallax-effect,
                .is-scrolling .scroll-animation {
                    transition: none !important;
                    animation: none !important;
                }
            }
        `;
        document.head.appendChild(scrollStyle);
    }
    
    // Añadir navegación rápida para móvil
    function enhanceMobileNavigation() {
        // Crear botón flotante para volver al inicio rápidamente
        const backToTopBtn = document.createElement('button');
        backToTopBtn.className = 'mobile-back-to-top';
        backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        document.body.appendChild(backToTopBtn);
        
        // Mostrar botón solo cuando se hace scroll hacia abajo
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }, { passive: true });
        
        // Acción del botón
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        // Añadir estilos para botón
        const navStyle = document.createElement('style');
        navStyle.textContent = `
            .mobile-back-to-top {
                position: fixed;
                bottom: 20px;
                left: 20px; /* RTL - Positioned left instead of right */
                width: 40px;
                height: 40px;
                background-color: rgba(191, 30, 46, 0.8);
                color: white;
                border: none;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 20px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
                cursor: pointer;
                z-index: 999;
                opacity: 0;
                transform: translateY(20px);
                transition: opacity 0.3s ease, transform 0.3s ease;
            }
            
            .mobile-back-to-top.visible {
                opacity: 1;
                transform: translateY(0);
            }
            
            .mobile-back-to-top:hover,
            .mobile-back-to-top:focus {
                background-color: rgba(191, 30, 46, 1);
            }
        `;
        document.head.appendChild(navStyle);
    }
})(); 