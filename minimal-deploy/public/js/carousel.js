// Hero carousel functionality
(function() {
    document.addEventListener('DOMContentLoaded', function() {
        // Obtener el contenedor del carrusel
        const carouselContainer = document.getElementById('heroCarouselContainer');
        
        if (!carouselContainer) {
            console.error('No se encontró el contenedor del carrusel');
            return;
        }
        
        // Crear el carrusel
        const carouselHTML = `
            <div class="hero-carousel">
                <div class="carousel-slide active">
                    <img src="images/Beigeـcolor_sea.jpg" alt="فستان لوتس الأنيق - بيج" class="carousel-img">
                </div>
                <div class="carousel-slide">
                    <img src="images/black-in-home.jpg" alt="فستان لوتس الأنيق - أسود" class="carousel-img">
                </div>
                <div class="carousel-slide">
                    <img src="images/Beige/in-seat.jpg" alt="فستان لوتس الأنيق - جلسة" class="carousel-img">
                </div>
                <div class="carousel-slide">
                    <img src="images/white/white-color-4.jpg" alt="فستان لوتس الأنيق - أبيض" class="carousel-img">
                </div>
                <div class="carousel-dots">
                    <span class="dot active" data-slide="0"></span>
                    <span class="dot" data-slide="1"></span>
                    <span class="dot" data-slide="2"></span>
                    <span class="dot" data-slide="3"></span>
                </div>
            </div>
        `;
        
        // Insertar el HTML en el contenedor
        carouselContainer.innerHTML = carouselHTML;
        
        // Obtener los elementos del carrusel
        const slides = document.querySelectorAll('.carousel-slide');
        const dots = document.querySelectorAll('.dot');
        let currentSlide = 0;
        let slideInterval;
        
        // Function to set active slide
        function setActiveSlide(index) {
            // Remove active class from all slides and dots
            slides.forEach(slide => slide.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));
            
            // Add active class to current slide and dot
            slides[index].classList.add('active');
            dots[index].classList.add('active');
            
            currentSlide = index;
        }
        
        // Function for automatic slideshow
        function startSlideshow() {
            slideInterval = setInterval(() => {
                currentSlide = (currentSlide + 1) % slides.length;
                setActiveSlide(currentSlide);
            }, 4000); // Change slide every 4 seconds
        }
        
        // Add click event to dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                clearInterval(slideInterval);
                setActiveSlide(index);
                startSlideshow();
            });
        });
        
        // Start slideshow
        startSlideshow();
        
        console.log('Hero carousel initialized');
    });
})(); 