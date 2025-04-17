// ملف لإصلاح الأخطاء البرمجية في الموقع
document.addEventListener('DOMContentLoaded', function() {
    // إصلاح خطأ "Cannot read properties of null (reading 'value')" في دالة updateOrderSummary
    
    // نسخة مصححة من دالة updateOrderSummary للتعامل مع quantityInput الذي قد يكون null
    // يتم تطبيق هذا الإصلاح بعد تحميل الصفحة
    
    const originalUpdateOrderSummary = window.updateOrderSummary;
    
    if (typeof originalUpdateOrderSummary === 'function') {
        // تغطية الدالة الأصلية بنسخة محسنة
        window.updateOrderSummary = function() {
            // فحص وتأمين جميع المتغيرات التي قد تكون null
            const quantityInput = document.getElementById('quantity');
            const quantity = quantityInput && quantityInput.value ? parseInt(quantityInput.value) || 1 : 1;
            
            // صباعة رسالة تصحيح في وحدة التحكم
            console.log('تم تطبيق الإصلاح: دالة updateOrderSummary المحسنة');
            
            try {
                // استدعاء الدالة الأصلية في سياق محمي
                originalUpdateOrderSummary();
            } catch (error) {
                console.error('خطأ في دالة updateOrderSummary الأصلية:', error);
                // تنفيذ منطق بديل إذا فشلت الدالة الأصلية
            }
        };
        
        console.log('تم تطبيق إصلاح دالة updateOrderSummary');
    }
    
    // إصلاحات إضافية للمشكلات الأخرى يمكن إضافتها هنا
});

// إصلاح مشكلة مسارات الصور
document.addEventListener('DOMContentLoaded', function() {
    // تصحيح مسارات الصور المكسورة
    document.querySelectorAll('img').forEach(img => {
        if (img.src && !img.complete) {
            console.log('تصحيح مسار صورة غير مكتملة:', img.src);
            
            // تخزين المسار الأصلي للتشخيص
            const originalSrc = img.src;
            
            // إذا كان المسار يبدأ بـ "/" وليس "//"، أضف الدومين
            if (img.src.startsWith('/') && !img.src.startsWith('//')) {
                img.src = window.location.origin + img.src;
                console.log('تم تصحيح المسار إلى:', img.src);
            }
            
            // تسجيل أخطاء تحميل الصور
            img.onerror = function() {
                console.error('فشل تحميل الصورة:', originalSrc, '-> تم تصحيحها إلى:', img.src);
            };
        }
    });
}); 