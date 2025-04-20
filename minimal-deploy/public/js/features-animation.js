/**
 * Features Animation & Interactions
 * Este script agrega animaciones y efectos interactivos a la sección de características
 * Optimizado para rendimiento en dispositivos móviles
 */

// Variable global para evitar inicializaciones múltiples
let featuresInitialized = false;

// Detectar si es un dispositivo móvil
const isMobileDevice = () => window.innerWidth <= 768;

// Escuchar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Intentar inicializar si la sección ya está en el DOM
    if (document.querySelector('.features-section') && !featuresInitialized) {
        initializeFeaturesAnimations();
    } else {
        // Si no está disponible, configurar un observador para esperar a que la sección esté cargada
        const checkFeaturesLoaded = setInterval(() => {
            if (document.querySelector('.features-section') && !featuresInitialized) {
                initializeFeaturesAnimations();
                clearInterval(checkFeaturesLoaded);
            }
        }, 100);

        // Limpiar el intervalo después de 10 segundos por si acaso
        setTimeout(() => clearInterval(checkFeaturesLoaded), 10000);
    }
});

// Función principal para inicializar las animaciones
function initializeFeaturesAnimations() {
    // Evitar inicializaciones múltiples
    if (featuresInitialized) return;
    featuresInitialized = true;
    
    console.log('Inicializando animaciones de características');
    
    const featureCards = document.querySelectorAll('.feature-card');
    const featuresSection = document.querySelector('.features-section');
    const sectionTitle = document.querySelector('.features-section .section-title');
    const banner = document.querySelector('.features-banner');
    const additionalFeatures = document.querySelectorAll('.additional-feature');
    
    // Detectar si estamos en un dispositivo móvil
    const isMobile = isMobileDevice();
    
    // Añadir contador de beneficios si no existe aún
    if (!document.querySelector('.benefits-counter')) {
        const benefitsCount = document.createElement('div');
        benefitsCount.className = 'benefits-counter';
        benefitsCount.innerHTML = `<span>${featureCards.length}</span> مميزات أساسية`;
        const sectionHeader = document.querySelector('.section-header');
        if (sectionHeader) {
            sectionHeader.appendChild(benefitsCount);
        }
    }
    
    // Animaciones de entrada al hacer scroll - optimizadas para móvil
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // En móvil, aplicamos la animación inmediatamente para mayor rendimiento
                if (isMobile) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                } else {
                    // En escritorio mantenemos la animación con retraso
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            }
        });
    }, { 
        threshold: isMobile ? 0.1 : 0.2, // Umbral más bajo en móviles para activación más rápida
        rootMargin: isMobile ? '0px 0px 50px 0px' : '0px' // Activar un poco antes en móviles
    });
    
    // Observar los elementos para animarlos al entrar en el viewport
    featureCards.forEach((card, index) => {
        // Menos retraso en móviles para mejor rendimiento
        card.style.animationDelay = `${isMobile ? index * 0.05 : index * 0.1}s`;
        observer.observe(card);
    });
    
    if (sectionTitle) observer.observe(sectionTitle);
    if (banner) observer.observe(banner);
    
    additionalFeatures.forEach((feature, index) => {
        feature.style.animationDelay = `${isMobile ? index * 0.05 : index * 0.1}s`;
        observer.observe(feature);
    });
    
    // Efecto hover en las tarjetas - optimizado para dispositivos móviles
    featureCards.forEach(card => {
        // Solo añadir efecto de brillo en escritorio para ahorrar recursos en móvil
        if (!isMobile && !card.querySelector('.card-shine')) {
            const shine = document.createElement('div');
            shine.className = 'card-shine';
            card.appendChild(shine);
        }
        
        // Eventos de mouse/touch - solo agregar si no están ya configurados
        if (!card.hasAttribute('data-animated')) {
            // Marcar la tarjeta como ya configurada
            card.setAttribute('data-animated', 'true');
            
            if (isMobile) {
                // En móvil, simplificamos el comportamiento a un tap/click
                card.addEventListener('click', function(e) {
                    // Solo expandir si no se hizo clic en un enlace
                    if (!e.target.closest('a')) {
                        // Cerrar otras tarjetas expandidas para ahorrar recursos
                        featureCards.forEach(c => {
                            if (c !== this) c.classList.remove('card-expanded');
                        });
                        this.classList.toggle('card-expanded');
                    }
                });
            } else {
                // Comportamiento completo para escritorio
                card.addEventListener('mouseenter', function() {
                    this.classList.add('card-hovered');
                    const otherCards = [...featureCards].filter(c => c !== this);
                    otherCards.forEach(c => c.classList.add('card-dimmed'));
                });
                
                card.addEventListener('mouseleave', function() {
                    this.classList.remove('card-hovered');
                    const otherCards = [...featureCards].filter(c => c !== this);
                    otherCards.forEach(c => c.classList.remove('card-dimmed'));
                });
                
                // Efecto de expansión al hacer clic
                card.addEventListener('click', function(e) {
                    // Solo expandir si no se hizo clic en un enlace
                    if (!e.target.closest('a')) {
                        this.classList.toggle('card-expanded');
                    }
                });
            }
        }
    });
    
    // Animación del banner intermedio - solo en escritorio
    if (banner && !banner.hasAttribute('data-animated')) {
        banner.setAttribute('data-animated', 'true');
        
        if (!isMobile) {
            banner.addEventListener('mouseenter', function() {
                this.classList.add('banner-hovered');
            });
            
            banner.addEventListener('mouseleave', function() {
                this.classList.remove('banner-hovered');
            });
        }
    }
    
    // Escuchar cambios de orientación y redimensionamiento para adaptar la experiencia
    window.addEventListener('resize', debounce(handleResponsiveChanges, 250));
    window.addEventListener('orientationchange', function() {
        setTimeout(handleResponsiveChanges, 300);
    });
    
    // Función para manejar cambios responsivos
    function handleResponsiveChanges() {
        const wasMobile = isMobile;
        const isNowMobile = isMobileDevice();
        
        // Solo actuar si hubo un cambio entre móvil y escritorio
        if (wasMobile !== isNowMobile) {
            // Ajustar los efectos de brillo
            featureCards.forEach(card => {
                const hasShine = !!card.querySelector('.card-shine');
                
                if (isNowMobile && hasShine) {
                    // Eliminar efecto de brillo en móvil
                    card.querySelector('.card-shine').remove();
                } else if (!isNowMobile && !hasShine) {
                    // Añadir efecto de brillo en escritorio
                    const shine = document.createElement('div');
                    shine.className = 'card-shine';
                    card.appendChild(shine);
                }
            });
            
            // Reiniciar estados
            featureCards.forEach(card => {
                card.classList.remove('card-hovered', 'card-dimmed');
                if (isNowMobile) {
                    // En móvil, asegurarnos de que solo una tarjeta esté expandida
                    const expandedCards = Array.from(featureCards).filter(c => c.classList.contains('card-expanded'));
                    if (expandedCards.length > 1) {
                        expandedCards.forEach((c, i) => {
                            if (i > 0) c.classList.remove('card-expanded');
                        });
                    }
                }
            });
        }
    }
    
    // Función debounce para evitar múltiples ejecuciones
    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }
}

function addDynamicStyles() {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        /* Animaciones de entrada */
        .features-section .section-title {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.8s ease, transform 0.8s ease;
        }
        
        .features-section .section-title.animated {
            opacity: a;
            transform: translateY(0);
        }
        
        .feature-card {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.5s ease-out !important;
        }
        
        .feature-card.animated {
            opacity: 1;
            transform: translateY(0);
        }
        
        /* Efectos hover y expansión */
        .card-shine {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, 
                rgba(255,255,255,0) 0%, 
                rgba(255,255,255,0.05) 40%, 
                rgba(255,255,255,0.1) 50%, 
                rgba(255,255,255,0.05) 60%, 
                rgba(255,255,255,0) 100%);
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
        }
        
        .card-hovered {
            transform: translateY(-10px) !important;
            box-shadow: 0 15px 30px rgba(0,0,0,0.1) !important;
            z-index: 10;
        }
        
        .card-hovered .card-shine {
            opacity: 1;
        }
        
        .card-dimmed {
            opacity: 0.7 !important;
            filter: grayscale(20%);
        }
        
        .card-expanded {
            height: auto !important;
            z-index: 20;
        }
        
        .card-expanded .feature-description {
            max-height: 500px !important;
            overflow: visible !important;
        }
        
        /* Animación del banner */
        .features-banner {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .banner-hovered {
            transform: translateY(-5px);
            box-shadow: 0 15px 40px rgba(0,0,0,0.15);
        }
        
        /* Contador de beneficios */
        .benefits-counter {
            position: absolute;
            top: 0;
            left: 20px;
            background: var(--primary-color);
            color: white;
            padding: 5px 15px;
            border-radius: 0 0 10px 10px;
            font-size: 0.9rem;
            font-weight: 600;
            box-shadow: 0 3px 10px rgba(0,0,0,0.1);
        }
        
        .benefits-counter span {
            font-size: 1.2rem;
            font-weight: 700;
            margin-right: 5px;
            color: var(--accent-color);
        }
        
        /* Animaciones para características adicionales */
        .additional-feature {
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.3s ease;
        }
        
        .additional-feature.animated {
            opacity: 1;
            transform: translateY(0);
        }
        
        @media (max-width: 768px) {
            .benefits-counter {
                position: relative;
                top: -10px;
                left: 0;
                display: inline-block;
                margin-bottom: 20px;
            }
        }
    `;
    document.head.appendChild(styleElement);
} 