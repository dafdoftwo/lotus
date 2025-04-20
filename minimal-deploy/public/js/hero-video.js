/**
 * Hero Video Handler - تحسين تجربة المستخدم للموبايل
 */
document.addEventListener('DOMContentLoaded', function() {
    const heroVideo = document.getElementById('hero-video');
    if (!heroVideo) return;
    
    // إنشاء مؤشر التحميل
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'video-loading';
    loadingIndicator.innerHTML = '<div class="spinner"></div>';
    heroVideo.parentElement.appendChild(loadingIndicator);
    
    // إنشاء أزرار التحكم
    const videoControls = document.createElement('div');
    videoControls.className = 'video-controls';
    videoControls.innerHTML = '<i class="fas fa-pause"></i>';
    heroVideo.parentElement.appendChild(videoControls);
    
    // التعامل مع تحميل الفيديو
    heroVideo.addEventListener('loadeddata', function() {
        loadingIndicator.classList.add('hidden');
    });
    
    // التعامل مع أخطاء تحميل الفيديو
    heroVideo.addEventListener('error', function() {
        console.error('خطأ في تحميل الفيديو');
        loadingIndicator.innerHTML = '<div class="error-message">فشل تحميل الفيديو</div>';
    });
    
    // التعامل مع أزرار التحكم
    let isPlaying = true;
    videoControls.addEventListener('click', function() {
        if (isPlaying) {
            heroVideo.pause();
            videoControls.innerHTML = '<i class="fas fa-play"></i>';
        } else {
            heroVideo.play();
            videoControls.innerHTML = '<i class="fas fa-pause"></i>';
        }
        isPlaying = !isPlaying;
    });
    
    // تحسين أداء الموبايل: إيقاف الفيديو عندما لا يكون مرئيًا لتوفير البطارية
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (!isPlaying) return;
                heroVideo.play();
            } else {
                heroVideo.pause();
            }
        });
    }, { threshold: 0.3 });
    
    observer.observe(heroVideo);
    
    // مزامنة المؤقت على الموبايل والديسكتوب
    function syncTimers() {
        const desktopTimer = document.getElementById('timerValue');
        const mobileTimer = document.getElementById('mobileTimerValue');
        
        if (desktopTimer && mobileTimer) {
            mobileTimer.textContent = desktopTimer.textContent;
        }
    }
    
    // تحديث المؤقت كل ثانية
    setInterval(syncTimers, 1000);
    
    // تحسين أداء الموبايل: فيديو بجودة أقل للموبايل
    function handleResize() {
        if (window.innerWidth <= 768) {
            if (heroVideo.getAttribute('data-src-mobile') && heroVideo.src !== heroVideo.getAttribute('data-src-mobile')) {
                const currentTime = heroVideo.currentTime;
                const wasPlaying = !heroVideo.paused;
                
                heroVideo.src = heroVideo.getAttribute('data-src-mobile');
                
                // استعادة حالة التشغيل بعد تغيير المصدر
                heroVideo.addEventListener('loadedmetadata', function onceLoaded() {
                    heroVideo.currentTime = currentTime;
                    if (wasPlaying) heroVideo.play();
                    heroVideo.removeEventListener('loadedmetadata', onceLoaded);
                });
            }
        } else {
            if (heroVideo.getAttribute('data-src-desktop') && heroVideo.src !== heroVideo.getAttribute('data-src-desktop')) {
                const currentTime = heroVideo.currentTime;
                const wasPlaying = !heroVideo.paused;
                
                heroVideo.src = heroVideo.getAttribute('data-src-desktop');
                
                // استعادة حالة التشغيل بعد تغيير المصدر
                heroVideo.addEventListener('loadedmetadata', function onceLoaded() {
                    heroVideo.currentTime = currentTime;
                    if (wasPlaying) heroVideo.play();
                    heroVideo.removeEventListener('loadedmetadata', onceLoaded);
                });
            }
        }
    }
    
    // تحديد مصادر الفيديو
    const videoSource = heroVideo.querySelector('source');
    if (videoSource) {
        // الديسكتوب - المصدر الأصلي
        heroVideo.setAttribute('data-src-desktop', videoSource.src);
        
        // الموبايل - مصدر بجودة أقل
        // افتراض وجود نسخة منخفضة الجودة باسم نفس الملف مع إضافة -mobile
        const mobileSrc = videoSource.src.replace('.mp4', '-mobile.mp4');
        heroVideo.setAttribute('data-src-mobile', mobileSrc);
        
        // تأكد من استخدام المصدر المناسب للجهاز
        handleResize();
    }
    
    // الاستماع إلى تغيير حجم النافذة
    window.addEventListener('resize', handleResize);
    
    // تحميل مسبق للفيديو على الديسكتوب فقط
    if (window.innerWidth > 768) {
        heroVideo.setAttribute('preload', 'auto');
    } else {
        heroVideo.setAttribute('preload', 'metadata');
    }
}); 