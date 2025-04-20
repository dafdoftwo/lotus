// Script para optimizar la experiencia del video en la sección hero, especialmente en móviles

document.addEventListener('DOMContentLoaded', function() {
    // Añadir clase 'js' al body para estilos CSS condicionados a JavaScript
    document.body.classList.add('js');
    
    const heroVideo = document.getElementById('hero-video');
    
    // Función para verificar si es un dispositivo móvil
    function isMobile() {
        return window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    
    // Función para optimizar el video en dispositivos móviles
    function optimizeVideoForMobile() {
        if (heroVideo) {
            if (isMobile()) {
                // En móviles, usamos una calidad más baja y aseguramos que esté visible
                heroVideo.setAttribute('playsinline', '');
                heroVideo.setAttribute('muted', '');
                heroVideo.setAttribute('autoplay', '');
                heroVideo.setAttribute('loop', '');
                
                // Iniciar reproducción manualmente para compatibilidad con iOS
                heroVideo.play().catch(error => {
                    console.log('Reproducción automática no permitida:', error);
                    // Mostrar un botón de reproducción si es necesario
                });
                
                // Pausar el video cuando no está visible para ahorrar recursos
                const observerOptions = {
                    root: null,
                    rootMargin: '0px',
                    threshold: 0.1
                };
                
                const videoObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            heroVideo.play().catch(e => console.log('Error al reproducir:', e));
                        } else {
                            heroVideo.pause();
                        }
                    });
                }, observerOptions);
                
                videoObserver.observe(heroVideo);
            }
        }
    }
    
    // Inicializar optimización
    optimizeVideoForMobile();
    
    // Reajustar en cambios de orientación o redimensionamiento
    window.addEventListener('resize', optimizeVideoForMobile);
    window.addEventListener('orientationchange', optimizeVideoForMobile);
}); 