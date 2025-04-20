// Script para mejorar la interactividad del badge de descuento
document.addEventListener('DOMContentLoaded', function() {
    // Seleccionar los badges de descuento
    const discountBadges = document.querySelectorAll('.floating-badge.top, .mobile-discount-badge');
    
    // Añadir efecto de brillo al pasar el mouse
    discountBadges.forEach(badge => {
        // Crear elemento de brillo
        const shine = document.createElement('div');
        shine.classList.add('badge-shine');
        badge.appendChild(shine);
        
        // Añadir efectos de hover
        badge.addEventListener('mouseenter', () => {
            // Activar efecto de brillo
            shine.style.opacity = '1';
            shine.style.transform = 'translateX(100%)';
            
            // Añadir clase de destaque
            badge.classList.add('highlighted');
            
            // Mostrar tooltip
            showTooltip(badge);
        });
        
        badge.addEventListener('mouseleave', () => {
            // Restablecer efecto de brillo
            shine.style.opacity = '0';
            shine.style.transform = 'translateX(-100%)';
            
            // Quitar clase de destaque
            badge.classList.remove('highlighted');
            
            // Ocultar tooltip
            hideTooltip();
        });
        
        // Añadir efecto de clic para móviles
        badge.addEventListener('click', () => {
            badge.classList.add('clicked');
            
            // Quitar clase después de la animación
            setTimeout(() => {
                badge.classList.remove('clicked');
            }, 300);
            
            // Desplazamiento suave al formulario de pedido
            scrollToOrderForm();
        });
    });
    
    // Función para mostrar tooltip
    function showTooltip(badge) {
        // Verificar si ya existe un tooltip
        if (document.querySelector('.discount-tooltip')) return;
        
        // Crear tooltip
        const tooltip = document.createElement('div');
        tooltip.classList.add('discount-tooltip');
        tooltip.innerHTML = 'اطلبي الآن واحصلي على خصم 30%';
        
        // Posicionar tooltip
        document.body.appendChild(tooltip);
        
        // Calcular posición
        const badgeRect = badge.getBoundingClientRect();
        tooltip.style.top = `${badgeRect.top + window.scrollY - tooltip.offsetHeight - 10}px`;
        tooltip.style.left = `${badgeRect.left + window.scrollX + badgeRect.width/2 - tooltip.offsetWidth/2}px`;
        
        // Mostrar con animación
        setTimeout(() => {
            tooltip.classList.add('visible');
        }, 10);
    }
    
    // Función para ocultar tooltip
    function hideTooltip() {
        const tooltip = document.querySelector('.discount-tooltip');
        if (tooltip) {
            tooltip.classList.remove('visible');
            setTimeout(() => {
                if (tooltip.parentNode) {
                    tooltip.parentNode.removeChild(tooltip);
                }
            }, 300);
        }
    }
    
    // Función para desplazamiento suave al formulario
    function scrollToOrderForm() {
        const orderForm = document.querySelector('#order-form-placeholder');
        if (orderForm) {
            orderForm.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
    
    // Añadir estilos dinámicamente para el brillo y el tooltip
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        .badge-shine {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(
                90deg, 
                rgba(255,255,255,0) 0%, 
                rgba(255,255,255,0.4) 50%, 
                rgba(255,255,255,0) 100%
            );
            opacity: 0;
            transform: translateX(-100%);
            transition: transform 0.5s ease-in-out, opacity 0.3s;
            pointer-events: none;
            z-index: 2;
        }
        
        .highlighted {
            transform: scale(1.1) !important;
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4) !important;
        }
        
        .clicked {
            transform: scale(0.9) !important;
            transition: transform 0.1s ease-in-out !important;
        }
        
        .discount-tooltip {
            position: absolute;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 8px 15px;
            border-radius: 20px;
            font-size: 14px;
            z-index: 100;
            opacity: 0;
            transform: translateY(10px);
            transition: opacity 0.3s, transform 0.3s;
            pointer-events: none;
            white-space: nowrap;
            text-align: center;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }
        
        .discount-tooltip:after {
            content: '';
            position: absolute;
            bottom: -8px;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 8px solid transparent;
            border-right: 8px solid transparent;
            border-top: 8px solid rgba(0, 0, 0, 0.8);
        }
        
        .discount-tooltip.visible {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(styleElement);
}); 