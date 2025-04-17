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
                <input type="range" min="150" max="185" value="165" class="range-slider" id="height-slider">
                <div class="range-values">
                    <span>150</span>
                    <span>155</span>
                    <span>160</span>
                    <span>165</span>
                    <span>170</span>
                    <span>175</span>
                    <span>180</span>
                    <span>185</span>
                </div>
            </div>
            
            <div class="slider-container" id="weight-slider-container">
                <span class="slider-label">الوزن <span class="slider-value" id="weight-value">60 كجم</span></span>
                <input type="range" min="40" max="90" value="60" class="range-slider" id="weight-slider">
                <div class="range-values">
                    <span>40</span>
                    <span>50</span>
                    <span>60</span>
                    <span>70</span>
                    <span>80</span>
                    <span>90</span>
                </div>
            </div>
            
            <div class="result-container">
                <h4 class="result-title">المقاس الموصى به</h4>
                <div class="recommended-size" id="recommended-size">M</div>
                <p class="size-note">المقاس الموصى به هو <span id="size-name">M</span></p>
            </div>
        </div>
    `;

    // البحث عن مكان لإضافة الآلة الحاسبة
    const orderFormSection = document.querySelector('#order-form');
    if (orderFormSection) {
        // إنشاء حاوية لآلة حاسبة المقاسات
        const calculatorContainer = document.createElement('div');
        calculatorContainer.innerHTML = calculatorHTML;
        
        // إدراج الآلة الحاسبة قبل نموذج الطلب
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
        // Variables para almacenar los valores actuales
        let currentHeight = 165; // Valor inicial en cm
        let currentWeight = 60; // Valor inicial en kg
        let currentUnit = 'metric'; // Unidad inicial: metric o imperial
        
        // Definición de tallas para mujeres
        const womenSizes = [
            { size: 'M', heightRange: [155, 165], weightRange: [50, 60] },
            { size: 'L', heightRange: [165, 170], weightRange: [60, 70] },
            { size: 'XL', heightRange: [170, 175], weightRange: [70, 80] },
            { size: 'XXL', heightRange: [175, 185], weightRange: [80, 90] }
        ];
        
        // العناصر الرئيسية
        const heightSlider = document.getElementById('height-slider');
        const weightSlider = document.getElementById('weight-slider');
        const heightValue = document.getElementById('height-value');
        const weightValue = document.getElementById('weight-value');
        const recommendedSize = document.getElementById('recommended-size');
        const sizeName = document.getElementById('size-name');
        const unitOptions = document.querySelectorAll('.unit-option');
        
        // تهيئة قيم البداية
        initializeCalculator();
        
        // تحويث أشرطة التمرير عند تغيير الوحدة
        unitOptions.forEach(option => {
            option.addEventListener('click', function() {
                unitOptions.forEach(opt => opt.classList.remove('active'));
                this.classList.add('active');
                
                const newUnit = this.getAttribute('data-unit');
                if (newUnit !== currentUnit) {
                    currentUnit = newUnit;
                    convertValues();
                    updateSliders();
                }
            });
        });
        
        // تحديث قيمة الطول عند تحريك شريط التمرير
        heightSlider.addEventListener('input', function() {
            currentHeight = parseFloat(this.value);
            updateHeightValue();
            updateRecommendedSize();
        });
        
        // تحديث قيمة الوزن عند تحريك شريط التمرير
        weightSlider.addEventListener('input', function() {
            currentWeight = parseFloat(this.value);
            updateWeightValue();
            updateRecommendedSize();
        });
        
        // وظيفة لتحديث المقاس الموصى به بناءً على الطول والوزن
        function updateRecommendedSize() {
            let size = '';
            const height = parseInt(heightValue.textContent);
            const weight = parseInt(weightValue.textContent);
            
            // تحديد المقاس بناءً على نطاقات محددة للنساء
            // تحديثات نطاقات المقاسات للنساء
            if (currentUnit === 'metric') {
                // النطاقات المترية (سم/كجم)
                if (height >= 155 && height < 165 && weight >= 50 && weight < 60) {
                    size = 'M';
                } else if ((height >= 165 && height < 170 && weight >= 60 && weight < 70)) {
                    size = 'L';
                } else if ((height >= 170 && height < 175 && weight >= 70 && weight < 80)) {
                    size = 'XL';
                } else if ((height >= 175 && height <= 185 && weight >= 80 && weight <= 90)) {
                    size = 'XXL';
                } else {
                    // خارج النطاق المحدد
                    size = 'غير متوفر';
                }
            } else {
                // النطاقات الإمبريالية (بوصة/رطل)
                // تحويل نطاقات المقاسات المترية إلى الإمبريالية
                // M: 155-165 cm (61-65 inches), 50-60 kg (110-132 lbs)
                // L: 165-170 cm (65-67 inches), 60-70 kg (132-154 lbs)
                // XL: 170-175 cm (67-69 inches), 70-80 kg (154-176 lbs)
                // XXL: 175-185 cm (69-73 inches), 80-90 kg (176-198 lbs)
                if (height >= 61 && height < 65 && weight >= 110 && weight < 132) {
                    size = 'M';
                } else if ((height >= 65 && height < 67 && weight >= 132 && weight < 154)) {
                    size = 'L';
                } else if ((height >= 67 && height < 69 && weight >= 154 && weight < 176)) {
                    size = 'XL';
                } else if ((height >= 69 && height <= 73 && weight >= 176 && weight <= 198)) {
                    size = 'XXL';
                } else {
                    // خارج النطاق المحدد
                    size = 'غير متوفر';
                }
            }
            
            // تحديث المقاس الموصى به في الواجهة
            recommendedSize.textContent = size;
            sizeName.textContent = size;
        }
        
        // تحديث أشرطة التمرير عند تغيير الوحدة
        function updateSliders() {
            if (currentUnit === 'metric') {
                // Configuración para centímetros
                heightSlider.min = 150;
                heightSlider.max = 190;
                heightSlider.step = 1;
                heightSlider.value = currentHeight;
                
                // Configuración para kilogramos
                weightSlider.min = 45;
                weightSlider.max = 95;
                weightSlider.step = 1;
                weightSlider.value = currentWeight;
            } else {
                // Configuración para pulgadas
                heightSlider.min = 59; // ~150cm
                heightSlider.max = 75; // ~190cm
                heightSlider.step = 1;
                heightSlider.value = currentHeight;
                
                // Configuración para libras
                weightSlider.min = 99; // ~45kg
                weightSlider.max = 209; // ~95kg
                weightSlider.step = 1;
                weightSlider.value = currentWeight;
            }
            
            updateHeightValue();
            updateWeightValue();
        }
        
        // التحديث المبدئي
        updateRecommendedSize();
    }

    // تهيئة قيم البداية
    function initializeCalculator() {
        // تعيين القيم الافتراضية للوحدات المترية
        if (currentUnit === 'metric') {
            // القيم المترية
            heightSlider.min = 150;
            heightSlider.max = 190;
            heightSlider.value = 165;
            heightSlider.step = 1;
            heightValue.textContent = heightSlider.value;
            heightUnitLabel.textContent = 'سم';

            weightSlider.min = 45;
            weightSlider.max = 95;
            weightSlider.value = 60;
            weightSlider.step = 1;
            weightValue.textContent = weightSlider.value;
            weightUnitLabel.textContent = 'كجم';
        } else {
            // القيم الإمبريالية
            heightSlider.min = 59; // ~150 cm
            heightSlider.max = 75; // ~190 cm
            heightSlider.value = 65; // ~165 cm
            heightSlider.step = 1;
            heightValue.textContent = heightSlider.value;
            heightUnitLabel.textContent = 'بوصة';

            weightSlider.min = 99; // ~45 kg
            weightSlider.max = 209; // ~95 kg
            weightSlider.value = 132; // ~60 kg
            weightSlider.step = 1;
            weightValue.textContent = weightSlider.value;
            weightUnitLabel.textContent = 'رطل';
        }

        // تحديث القيم الحالية
        currentHeight = heightSlider.value;
        currentWeight = weightSlider.value;
        
        // تحديث المقاس الموصى به
        updateRecommendedSize();
    }

    // تهيئة قيم البداية
    // العثور على أقرب مقاس بناء على الطول والوزن
    function findClosestSize(sizes) {
        let closestSize = '';
        let minDistance = Infinity;
        
        for (const size of sizes) {
            let heightDist = 0;
            let weightDist = 0;
            
            if (currentUnit === 'metric') {
                // حساب المسافة للطول
                if (currentHeight < size.heightRange[0]) {
                    heightDist = size.heightRange[0] - currentHeight;
                } else if (currentHeight > size.heightRange[1]) {
                    heightDist = currentHeight - size.heightRange[1];
                }
                
                // حساب المسافة للوزن
                if (currentWeight < size.weightRange[0]) {
                    weightDist = size.weightRange[0] - currentWeight;
                } else if (currentWeight > size.weightRange[1]) {
                    weightDist = currentWeight - size.weightRange[1];
                }
            } else {
                // حساب المسافة للطول (النظام الإمبراطوري)
                if (currentHeight < size.heightRange[0]) {
                    heightDist = size.heightRange[0] - currentHeight;
                } else if (currentHeight > size.heightRange[1]) {
                    heightDist = currentHeight - size.heightRange[1];
                }
                
                // حساب المسافة للوزن (النظام الإمبراطوري)
                if (currentWeight < size.weightRange[0]) {
                    weightDist = size.weightRange[0] - currentWeight;
                } else if (currentWeight > size.weightRange[1]) {
                    weightDist = currentWeight - size.weightRange[1];
                }
            }
            
            // حساب المسافة الإجمالية
            const totalDist = heightDist + weightDist;
            
            if (totalDist < minDistance) {
                minDistance = totalDist;
                closestSize = size.size;
            }
        }
        
        return closestSize;
    }

    // Función para actualizar el valor mostrado de altura
    function updateHeightValue() {
        if (currentUnit === 'metric') {
            heightValue.textContent = `${currentHeight} سم`;
        } else {
            // Convertir cm a pies y pulgadas para mostrar
            const inches = Math.round(currentHeight);
            const feet = Math.floor(inches / 12);
            const remainingInches = inches % 12;
            heightValue.textContent = `${feet}'${remainingInches}"`;
        }
    }
    
    // Función para actualizar el valor mostrado de peso
    function updateWeightValue() {
        if (currentUnit === 'metric') {
            weightValue.textContent = `${currentWeight} كجم`;
        } else {
            weightValue.textContent = `${currentWeight} رطل`;
        }
    }
    
    // Función para convertir valores entre unidades métricas e imperiales
    function convertValues() {
        if (currentUnit === 'metric') {
            // Convertir de imperial a métrico
            currentHeight = Math.round(currentHeight * 2.54); // pulgadas a cm
            currentWeight = Math.round(currentWeight * 0.453592); // libras a kg
        } else {
            // Convertir de métrico a imperial
            currentHeight = Math.round(currentHeight / 2.54); // cm a pulgadas
            currentWeight = Math.round(currentWeight / 0.453592); // kg a libras
        }
    }
}); 