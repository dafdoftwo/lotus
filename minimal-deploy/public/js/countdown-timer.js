// Script para manejar el contador regresivo con animaciones profesionales
document.addEventListener('DOMContentLoaded', function() {
    const timerValue = document.getElementById('timerValue');
    const mobileTimerValue = document.getElementById('mobileTimerValue');
    
    // Función para actualizar el formato del tiempo
    function formatTime(hours, minutes, seconds) {
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
    
    // Función para crear efecto de número parpadeante al cambiar
    function animateValue(element, newValue) {
        if (!element) return;
        
        // Crear elemento temporal para la animación
        const tempElement = document.createElement('span');
        tempElement.textContent = element.textContent;
        tempElement.style.position = 'absolute';
        tempElement.style.top = '0';
        tempElement.style.left = '0';
        tempElement.style.width = '100%';
        tempElement.style.animation = 'fadeOut 0.5s forwards';
        
        // Crear elemento para el nuevo valor
        const newElement = document.createElement('span');
        newElement.textContent = newValue;
        newElement.style.animation = 'fadeIn 0.5s forwards';
        
        // Crear un contenedor si no existe
        if (element.parentElement.style.position !== 'relative') {
            element.parentElement.style.position = 'relative';
        }
        
        // Limpiar y actualizar
        element.parentElement.appendChild(tempElement);
        element.textContent = newValue;
        
        // Eliminar el elemento temporal después de la animación
        setTimeout(() => {
            if (tempElement.parentElement) {
                tempElement.parentElement.removeChild(tempElement);
            }
        }, 500);
    }
    
    // Configuración inicial del contador (5 horas)
    let hours = 5;
    let minutes = 0;
    let seconds = 0;
    
    // Función para actualizar el contador
    function updateTimer() {
        if (seconds > 0) {
            seconds--;
        } else {
            if (minutes > 0) {
                minutes--;
                seconds = 59;
            } else {
                if (hours > 0) {
                    hours--;
                    minutes = 59;
                    seconds = 59;
                } else {
                    // El contador ha terminado, reiniciar o mostrar mensaje
                    hours = 5;
                    minutes = 0;
                    seconds = 0;
                    
                    // Agregar efecto visual cuando el tiempo se acaba
                    document.querySelectorAll('.floating-badge.bottom, .mobile-timer').forEach(element => {
                        element.classList.add('time-ended');
                        setTimeout(() => element.classList.remove('time-ended'), 3000);
                    });
                }
            }
        }
        
        const formattedTime = formatTime(hours, minutes, seconds);
        
        // Animar los cambios de valor
        animateValue(timerValue, formattedTime);
        animateValue(mobileTimerValue, formattedTime);
        
        // Aplicar clase especial para los últimos 5 minutos
        const isAlmostOver = hours === 0 && minutes < 5;
        
        document.querySelectorAll('.floating-badge.bottom, .mobile-timer').forEach(element => {
            if (isAlmostOver) {
                element.classList.add('almost-over');
            } else {
                element.classList.remove('almost-over');
            }
        });
    }
    
    // Inicializar y actualizar cada segundo
    updateTimer();
    setInterval(updateTimer, 1000);
    
    // Agregar animación de resplandor aleatorio para efecto profesional
    function randomGlowEffect() {
        document.querySelectorAll('.floating-badge.bottom, .mobile-timer').forEach(element => {
            element.classList.add('glow-effect');
            setTimeout(() => element.classList.remove('glow-effect'), 1500);
        });
        
        // Programar el próximo efecto en un tiempo aleatorio
        const nextTime = 5000 + Math.random() * 10000; // Entre 5 y 15 segundos
        setTimeout(randomGlowEffect, nextTime);
    }
    
    // Iniciar efectos aleatorios después de 3 segundos
    setTimeout(randomGlowEffect, 3000);
}); 