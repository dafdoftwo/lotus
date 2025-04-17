// آلة حاسبة المقاسات التفاعلية
document.addEventListener('DOMContentLoaded', function() {
    // إنشاء أنماط CSS للآلة الحاسبة
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        .size-calculator-container {
            background-color: #f9f9f9;
            border-radius: 15px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
            padding: 30px;
            margin-bottom: 30px;
            max-width: 800px;
            margin-left: auto;
            margin-right: auto;
            font-family: 'Tajawal', sans-serif;
            direction: rtl;
        }

        .size-calculator-title {
            text-align: center;
            color: var(--secondary-color);
            font-size: 1.8rem;
            margin-bottom: 20px;
            position: relative;
        }

        .size-calculator-title:after {
            content: '';
            display: block;
            width: 80px;
            height: 3px;
            background-color: var(--accent-color);
            margin: 15px auto 0;
        }

        .unit-selector {
            display: flex;
            justify-content: center;
            margin-bottom: 25px;
            gap: 10px;
        }

        .unit-option {
            background-color: #fff;
            border: 2px solid #eee;
            border-radius: 30px;
            padding: 10px 20px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .unit-option.active {
            background-color: var(--primary-color);
            color: var(--secondary-color);
            border-color: var(--primary-color);
            box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
        }

        .slider-container {
            margin: 40px 0;
        }

        .slider-label {
            font-size: 1.2rem;
            font-weight: 600;
            color: var(--secondary-color);
            margin-bottom: 15px;
            display: block;
        }

        .slider-value {
            background-color: var(--primary-color);
            color: var(--secondary-color);
            border-radius: 30px;
            padding: 5px 15px;
            font-weight: 700;
            display: inline-block;
            margin-right: 10px;
        }

        .range-slider {
            -webkit-appearance: none;
            width: 100%;
            height: 6px;
            border-radius: 5px;
            background: #e0e0e0;
            outline: none;
            margin-top: 10px;
        }

        .range-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 22px;
            height: 22px;
            border-radius: 50%;
            background: var(--accent-color);
            cursor: pointer;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
            transition: all 0.2s ease;
        }

        .range-slider::-webkit-slider-thumb:hover {
            transform: scale(1.1);
            background: #a01825;
        }

        .range-values {
            display: flex;
            justify-content: space-between;
            margin-top: 8px;
            color: #777;
            font-size: 0.9rem;
        }

        .result-container {
            background-color: white;
            border-radius: 15px;
            padding: 20px;
            text-align: center;
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
            margin-top: 40px;
        }

        .result-title {
            color: var(--secondary-color);
            font-size: 1.4rem;
            margin-bottom: 20px;
            position: relative;
        }

        .result-title:after {
            content: '';
            display: block;
            width: 50px;
            height: 2px;
            background-color: var(--primary-color);
            margin: 10px auto 0;
        }

        .recommended-size {
            font-size: 4rem;
            font-weight: 800;
            color: var(--primary-color);
            margin: 15px 0;
            line-height: 1.2;
        }

        .size-note {
            font-size: 0.9rem;
            color: #777;
            margin-top: 15px;
            line-height: 1.5;
        }

        .size-note a {
            color: var(--accent-color);
            text-decoration: none;
        }

        .size-note a:hover {
            text-decoration: underline;
        }
    `;
    document.head.appendChild(styleElement);

    // كود HTML لآلة حاسبة المقاسات
    const calculatorHTML = `
        <div class="size-calculator-container">
            <h3 class="size-calculator-title">حساب المقاس المناسب</h3>
            
            <div class="unit-selector">
                <div class="unit-option active" data-unit="metric">متري (سم، كجم)</div>
                <div class="unit-option" data-unit="imperial">إمبريالي (قدم، رطل)</div>
            </div>
            
            <div class="slider-container" id="height-slider-container">
                <span class="slider-label">الطول <span class="slider-value" id="height-value">165 سم</span></span>
                <input type="range" min="145" max="190" value="165" class="range-slider" id="height-slider">
                <div class="range-values">
                    <span>145</span>
                    <span>150</span>
                    <span>155</span>
                    <span>160</span>
                    <span>165</span>
                    <span>170</span>
                    <span>175</span>
                    <span>180</span>
                    <span>185</span>
                    <span>190</span>
                </div>
            </div>
            
            <div class="slider-container" id="weight-slider-container">
                <span class="slider-label">الوزن <span class="slider-value" id="weight-value">65 كجم</span></span>
                <input type="range" min="40" max="100" value="65" class="range-slider" id="weight-slider">
                <div class="range-values">
                    <span>40</span>
                    <span>50</span>
                    <span>60</span>
                    <span>70</span>
                    <span>80</span>
                    <span>90</span>
                    <span>100</span>
                </div>
            </div>
            
            <div class="result-container">
                <h4 class="result-title">المقاس الموصى به</h4>
                <div class="recommended-size" id="recommended-size">L</div>
                <p class="size-note">المقاس الموصى به هو <span id="size-name">L</span></p>
            </div>
        </div>
    `;

    // البحث عن مكان لإضافة الآلة الحاسبة
    const orderFormSection = document.querySelector('#order-form');
    if (orderFormSection) {
        // إنشاء حاوية لآلة حاسبة المقاسات وإدراجها قبل فورم الطلب
        const calculatorContainer = document.createElement('div');
        calculatorContainer.innerHTML = calculatorHTML;
        orderFormSection.parentNode.insertBefore(calculatorContainer.firstElementChild, orderFormSection);
            
        // تنفيذ وظائف آلة حاسبة المقاسات
        initSizeCalculator();
        
        // حذف جدول المقاسات الثابت إذا وجد
        const sizeChartContainer = document.querySelector('.size-chart-container');
        if (sizeChartContainer) {
            sizeChartContainer.remove();
        }
    }

    // وظيفة لتهيئة آلة حاسبة المقاسات
    function initSizeCalculator() {
        // العناصر الرئيسية
        const heightSlider = document.getElementById('height-slider');
        const weightSlider = document.getElementById('weight-slider');
        const heightValue = document.getElementById('height-value');
        const weightValue = document.getElementById('weight-value');
        const recommendedSize = document.getElementById('recommended-size');
        const sizeName = document.getElementById('size-name');
        const unitOptions = document.querySelectorAll('.unit-option');
        
        // المقاسات بناءً على البيانات المقدمة للنساء
        const sizesMetric = [
            { size: 'M', heightMin: 155, heightMax: 165, weightMin: 50, weightMax: 60 },
            { size: 'L', heightMin: 165, heightMax: 170, weightMin: 60, weightMax: 70 },
            { size: 'XL', heightMin: 170, heightMax: 175, weightMin: 70, weightMax: 80 },
            { size: 'XXL', heightMin: 175, heightMax: 185, weightMin: 80, weightMax: 90 }
        ];
        
        // تحويل المقاسات المترية إلى إمبريالي
        const sizesImperial = sizesMetric.map(size => ({
            size: size.size,
            heightMin: Math.round(size.heightMin / 30.48 * 10) / 10, // تحويل سم إلى قدم
            heightMax: Math.round(size.heightMax / 30.48 * 10) / 10,
            weightMin: Math.round(size.weightMin * 2.205), // تحويل كجم إلى رطل
            weightMax: Math.round(size.weightMax * 2.205)
        }));
        
        // المتغيرات الحالية
        let currentUnit = 'metric';
        let currentHeight = 165;
        let currentWeight = 65;
        
        // تحديث أشرطة التمرير عند تغيير الوحدة
        unitOptions.forEach(option => {
            option.addEventListener('click', function() {
                const unit = this.dataset.unit;
                if (unit === currentUnit) return;
                
                // تحديث التنشيط المرئي
                unitOptions.forEach(opt => opt.classList.remove('active'));
                this.classList.add('active');
                
                // تحويل القيم
                if (unit === 'imperial') {
                    // تحويل من متري إلى إمبريالي
                    currentHeight = Math.round(currentHeight / 30.48 * 10) / 10;
                    currentWeight = Math.round(currentWeight * 2.205);
                    
                    // تحديث أشرطة التمرير
                    heightSlider.min = 4.8;
                    heightSlider.max = 6.2;
                    heightSlider.step = 0.1;
                    heightSlider.value = currentHeight;
                    heightValue.textContent = currentHeight + ' قدم';
                    
                    weightSlider.min = 88;
                    weightSlider.max = 220;
                    weightSlider.value = currentWeight;
                    weightValue.textContent = currentWeight + ' رطل';
                    
                    // تحديث نص القيم
                    document.querySelectorAll('#height-slider-container .range-values span').forEach((span, i) => {
                        const value = 4.8 + (i * 0.15);
                        span.textContent = value.toFixed(1);
                    });
                    
                    document.querySelectorAll('#weight-slider-container .range-values span').forEach((span, i) => {
                        const value = 88 + (i * 22);
                        span.textContent = Math.round(value);
                    });
                    
                } else {
                    // تحويل من إمبريالي إلى متري
                    currentHeight = Math.round(currentHeight * 30.48) / 100;
                    currentWeight = Math.round(currentWeight / 2.205);
                    
                    // تحديث أشرطة التمرير
                    heightSlider.min = 145;
                    heightSlider.max = 190;
                    heightSlider.step = 1;
                    heightSlider.value = currentHeight;
                    heightValue.textContent = currentHeight + ' سم';
                    
                    weightSlider.min = 40;
                    weightSlider.max = 100;
                    weightSlider.value = currentWeight;
                    weightValue.textContent = currentWeight + ' كجم';
                    
                    // تحديث نص القيم
                    document.querySelectorAll('#height-slider-container .range-values span').forEach((span, i) => {
                        span.textContent = 145 + (i * 5);
                    });
                    
                    document.querySelectorAll('#weight-slider-container .range-values span').forEach((span, i) => {
                        span.textContent = 40 + (i * 10);
                    });
                }
                
                currentUnit = unit;
                updateRecommendedSize();
            });
        });
        
        // تحديث قيمة الطول عند تحريك شريط التمرير
        heightSlider.addEventListener('input', function() {
            currentHeight = parseFloat(this.value);
            heightValue.textContent = currentHeight + (currentUnit === 'metric' ? ' سم' : ' قدم');
            updateRecommendedSize();
        });
        
        // تحديث قيمة الوزن عند تحريك شريط التمرير
        weightSlider.addEventListener('input', function() {
            currentWeight = parseFloat(this.value);
            weightValue.textContent = currentWeight + (currentUnit === 'metric' ? ' كجم' : ' رطل');
            updateRecommendedSize();
        });
        
        // وظيفة لتحديث المقاس الموصى به بناءً على الطول والوزن
        function updateRecommendedSize() {
            const sizes = currentUnit === 'metric' ? sizesMetric : sizesImperial;
            let selectedSize = '';
            
            // التحقق من كل نطاق مقاس
            for (const size of sizes) {
                if (currentHeight >= size.heightMin && currentHeight <= size.heightMax && 
                    currentWeight >= size.weightMin && currentWeight <= size.weightMax) {
                    selectedSize = size.size;
                    break;
                }
            }
            
            // إذا لم يتم العثور على مقاس مطابق، ابحث عن أقرب مقاس بناءً على الطول
            if (!selectedSize) {
                let closestSize = sizes[0];
                let minDistance = Infinity;
                
                for (const size of sizes) {
                    // التحقق مما إذا كان الطول ضمن النطاق، ثم التحقق من المسافة للوزن
                    if (currentHeight >= size.heightMin && currentHeight <= size.heightMax) {
                        if (currentWeight < size.weightMin) {
                            const distance = size.weightMin - currentWeight;
                            if (distance < minDistance) {
                                minDistance = distance;
                                closestSize = size;
                            }
                        } else {
                            const distance = currentWeight - size.weightMax;
                            if (distance < minDistance) {
                                minDistance = distance;
                                closestSize = size;
                            }
                        }
                    } else {
                        // إذا كان الطول خارج النطاق، فحدد أقرب نطاق
                        const heightDist = currentHeight < size.heightMin ? 
                                        size.heightMin - currentHeight : 
                                        currentHeight - size.heightMax;
                        
                        // أضف مسافة إضافية للوزن إذا كان خارج النطاق
                        let weightDist = 0;
                        if (currentWeight < size.weightMin) {
                            weightDist = size.weightMin - currentWeight;
                        } else if (currentWeight > size.weightMax) {
                            weightDist = currentWeight - size.weightMax;
                        }
                        
                        const totalDist = heightDist + weightDist;
                        if (totalDist < minDistance) {
                            minDistance = totalDist;
                            closestSize = size;
                        }
                    }
                }
                
                selectedSize = closestSize.size;
            }
            
            // التحقق من الحالات الخاصة للقيم المتطرفة
            if (currentHeight < 155 || currentHeight > 185 || currentWeight < 50 || currentWeight > 90) {
                if (currentUnit === 'metric') {
                    if (currentHeight < 155 && currentWeight < 50) selectedSize = 'S'; // أصغر من الحد الأدنى
                    else if (currentHeight > 185 && currentWeight > 90) selectedSize = 'XXXL'; // أكبر من الحد الأقصى
                }
            }
            
            // تحديث المقاس الموصى به
            recommendedSize.textContent = selectedSize;
            sizeName.textContent = selectedSize;
        }
        
        // التحديث المبدئي
        updateRecommendedSize();
    }
}); 