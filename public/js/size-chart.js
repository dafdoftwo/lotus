// JavaScript para añadir dinámicamente la tabla de tamaños
document.addEventListener('DOMContentLoaded', function() {
    // Estilos CSS para la tabla de tamaños
    const style = document.createElement('style');
    style.textContent = `
        .size-chart-container {
            margin: 2rem 0;
            padding: 1.5rem;
            border-radius: 8px;
            background-color: #f9f9f9;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            direction: rtl;
            text-align: center;
            max-width: 800px;
            margin-left: auto;
            margin-right: auto;
        }
        .size-chart-container.highlight {
            background-color: #fff9e6;
            animation: highlight 2s ease-in-out;
        }
        @keyframes highlight {
            0% { background-color: #fff9e6; }
            50% { background-color: #ffecb3; }
            100% { background-color: #fff9e6; }
        }
        .size-chart-title {
            margin-bottom: 1rem;
            font-size: 1.5rem;
            font-weight: 600;
            color: var(--primary-color);
        }
        .size-chart-table {
            width: 100%;
            border-collapse: collapse;
        }
        .size-chart-table th, .size-chart-table td {
            padding: 0.75rem 1rem;
            border: 1px solid #ddd;
            text-align: center;
        }
        .size-chart-table th {
            background-color: var(--accent-color);
            color: white;
            font-weight: 500;
        }
        .size-chart-table tr:nth-child(even) {
            background-color: #f2f2f2;
        }
    `;
    document.head.appendChild(style);

    // Crear el contenido HTML de la tabla de tamaños
    const sizeChartHTML = `
        <div id="size-chart" class="size-chart-container">
            <h3 class="size-chart-title">دليل المقاسات</h3>
            <table class="size-chart-table">
                <thead>
                    <tr>
                        <th>المقاس</th>
                        <th>الطول (سم)</th>
                        <th>الوزن (كجم)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>M</td>
                        <td>155-165</td>
                        <td>50-60</td>
                    </tr>
                    <tr>
                        <td>L</td>
                        <td>165-170</td>
                        <td>60-70</td>
                    </tr>
                    <tr>
                        <td>XL</td>
                        <td>170-175</td>
                        <td>70-80</td>
                    </tr>
                    <tr>
                        <td>XXL</td>
                        <td>175-185</td>
                        <td>80-90</td>
                    </tr>
                </tbody>
            </table>
        </div>
    `;

    // Encontrar el formulario de pedido y añadir la tabla de tamaños justo antes
    const orderFormTitle = document.querySelector('.order-form-title');
    if (orderFormTitle) {
        orderFormTitle.insertAdjacentHTML('beforebegin', sizeChartHTML);
    } else {
        // Fallback: add to the bottom of the container
        const container = document.querySelector('.container');
        if (container) {
            container.insertAdjacentHTML('beforeend', sizeChartHTML);
        }
    }

    // Conectar el enlace "دليل المقاسات" con la tabla de tamaños
    const sizeGuideLinks = document.querySelectorAll('a[href="#size-chart"], .size-guide-link');
    sizeGuideLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sizeChart = document.getElementById('size-chart');
            if (sizeChart) {
                sizeChart.scrollIntoView({ behavior: 'smooth' });
                
                // Destacar la tabla para llamar la atención
                sizeChart.classList.add('highlight');
                setTimeout(() => {
                    sizeChart.classList.remove('highlight');
                }, 2000);
            }
        });
    });
});