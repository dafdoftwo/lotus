import re; content = open('index.html', 'r').read(); modified = re.sub(r"'أحمر': \{\s*name: 'اللون الأحمر',\s*description: 'فستان باللون الأحمر الجذاب للإطلالات المميزة والمناسبات الخاصة',\s*thumbnails: \[\s*'public/images/red/red-color-official-3\.avif',\s*'public/images/red/red_color_fabric\.avif',\s*'public/images/red/red-color-official-3\.avif',\s*'public/images/red/red-color-official-2\.avif',\s*'public/images/red/red-color-official-3\.avif'\s*\]\s*\},", "'أحمر': {
                    name: 'اللون الأحمر',
                    description: 'فستان باللون الأحمر الجذاب للإطلالات المميزة والمناسبات الخاصة',
                    thumbnails: [
                        'public/images/red/red-color.png',
                        'public/images/red/red_color_fabric.avif',
                        'public/images/red/red-color-official-2.avif',
                        'public/images/red/red-color-official-4.avif',
                        'public/images/red/red-official-order.png'
                    ]
                },", content, flags=re.DOTALL); open('index.html', 'w').write(modified); print('First replacement done'); modified = re.sub(r"'أحمر': \{\s*name: 'اللون الأحمر',\s*description: 'فستان باللون الأحمر الجذاب للإطلالات المميزة والمناسبات الخاصة',\s*mainImage: 'public/images/red/red-color\.png',\s*thumbnails: \[\s*'public/images/red/red_color_fabric\.avif',\s*'public/images/red/red-color-official\.avif',\s*'public/images/red/red-color-official-2\.avif',\s*'public/images/red/red-color-official-3\.avif'\s*\]\s*\}", "'أحمر': {
                    name: 'اللون الأحمر',
                    description: 'فستان باللون الأحمر الجذاب للإطلالات المميزة والمناسبات الخاصة',
                    mainImage: 'public/images/red/red-color.png',
                    thumbnails: [
                        'public/images/red/red-color-main.png',
                        'public/images/red/red_color_fabric.avif',
                        'public/images/red/red-color-official-3.avif',
                        'public/images/red/red-official-order.png'
                    ]
                }", modified, flags=re.DOTALL); open('index.html', 'w').write(modified); print('Second replacement done');
