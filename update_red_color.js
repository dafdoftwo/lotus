// Update red color images
const fs = require('fs'); const content = fs.readFileSync('index.html', 'utf8'); const firstPattern = /thumbnails: \[\s*'public\/images\/red\/red-color-official-3\.avif',\s*'public\/images\/red\/red_color_fabric\.avif',\s*'public\/images\/red\/red-color-official-3\.avif',\s*'public\/images\/red\/red-color-official-2\.avif',\s*'public\/images\/red\/red-color-official-3\.avif'/g; const firstReplacement = "thumbnails: [
                        'public/images/red/red-color.png',
                        'public/images/red/red_color_fabric.avif',
                        'public/images/red/red-color-official-2.avif',
                        'public/images/red/red-color-official-4.avif',
                        'public/images/red/red-official-order.png'"; const secondPattern = /thumbnails: \[\s*'public\/images\/red\/red_color_fabric\.avif',\s*'public\/images\/red\/red-color-official\.avif',\s*'public\/images\/red\/red-color-official-2\.avif',\s*'public\/images\/red\/red-color-official-3\.avif'/g; const secondReplacement = "thumbnails: [
                        'public/images/red/red-color-main.png',
                        'public/images/red/red_color_fabric.avif',
                        'public/images/red/red-color-official-3.avif',
                        'public/images/red/red-official-order.png'"; const newContent = content.replace(firstPattern, firstReplacement).replace(secondPattern, secondReplacement); fs.writeFileSync('index.html', newContent); console.log('Done');
