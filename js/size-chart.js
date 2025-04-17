// JavaScript para añadir dinámicamente la tabla de tamaños
document.addEventListener('DOMContentLoaded', function() {
    // Estilos CSS para la tabla de tamaños
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        /* جدول المقاسات التفاعلي */
        .size-chart-container {
            background-color: #fff;
            border-radius: 15px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
            padding: 25px;
            margin-bottom: 30px;
            max-width: 800px;
            margin-left: auto;
            margin-right: auto;
        }

        .size-chart-title {
            text-align: center;
            color: var(--secondary-color);
            font-size: 1.5rem;
            margin-bottom: 20px;
            position: relative;
        }

        .size-chart-title:after {
            content: '';
            display: block;
            width: 80px;
            height: 3px;
            background-color: var(--accent-color);
            margin: 10px auto 0;
        }

        .size-chart-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
            direction: rtl;
            text-align: center;
        }

        .size-chart-table th {
            background-color: var(--primary-color);
            color: var(--secondary-color);
            padding: 12px;
            font-weight: bold;
        }

        .size-chart-table td {
            padding: 12px;
            border-bottom: 1px solid #eee;
        }

        .size-chart-table tr:hover {
            background-color: #f9f9f9;
        }

        .size-chart-table .size-column {
            font-weight: bold;
            font-size: 1.2rem;
        }
        
        .size-chart-help {
            text-align: center;
            margin-top: 15px;
            color: #777;
            font-size: 0.9rem;
        }

        /* Efecto de destaque cuando se hace clic en el enlace */
        .size-chart-container.highlight {
            animation: highlight-pulse 1s ease;
        }
        
        @keyframes highlight-pulse {
            0% { box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08); }
            50% { box-shadow: 0 5px 30px rgba(191, 30, 46, 0.4); }
            100% { box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08); }
        }
    `;
    document.head.appendChild(styleElement);

    // Crear el contenido HTML de la tabla de tamaños
    const sizeChartHTML = `
        <div class="size-chart-container">
            <h3 class="size-chart-title">جدول المقاسات</h3>
            <table class="size-chart-table">
                <thead>
                    <tr>
                        <th>المقاس</th>
                        <th>الطول</th>
                        <th>الوزن</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="size-column">M</td>
                        <td>155-165 سم</td>
                        <td>50-60 كجم</td>
                    </tr>
                    <tr>
                        <td class="size-column">L</td>
                        <td>165-170 سم</td>
                        <td>60-70 كجم</td>
                    </tr>
                    <tr>
                        <td class="size-column">XL</td>
                        <td>170-175 سم</td>
                        <td>70-80 كجم</td>
                    </tr>
                    <tr>
                        <td class="size-column">XXL</td>
                        <td>175-185 سم</td>
                        <td>80-90 كجم</td>
                    </tr>
                </tbody>
            </table>
            <p class="size-chart-help">لمساعدتك في اختيار المقاس المناسب، يرجى الرجوع إلى الجدول أعلاه</p>
        </div>
    `;

    // Encontrar el formulario de pedido y añadir la tabla de tamaños justo antes
    const orderFormSection = document.querySelector('#order-form');
    if (orderFormSection) {
        const orderFormTitle = orderFormSection.querySelector('.section-title');
        if (orderFormTitle) {
            // Crear un contenedor para la tabla de tamaños
            const sizeChartContainer = document.createElement('div');
            sizeChartContainer.innerHTML = sizeChartHTML;
            
            // Insertar la tabla de tamaños antes del título del formulario
            orderFormTitle.parentNode.insertBefore(sizeChartContainer, orderFormTitle);
        }
    }

    // Conectar el enlace "دليل المقاسات" con la tabla de tamaños
    const sizeGuideLink = document.getElementById('sizeGuideLink');
    if (sizeGuideLink) {
        sizeGuideLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Desplazarse suavemente hacia la tabla de tamaños
            const sizeChartElement = document.querySelector('.size-chart-container');
            if (sizeChartElement) {
                sizeChartElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                // Destacar la tabla para llamar la atención
                sizeChartElement.classList.add('highlight');
                setTimeout(() => {
                    sizeChartElement.classList.remove('highlight');
                }, 2000);
            }
        });
    }
});