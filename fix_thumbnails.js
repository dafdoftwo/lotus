const fs = require('fs'); const filePath = 'index.html'; let content = fs.readFileSync(filePath, 'utf8'); const redThumbnailsRegex = /(thumbnails: \[\s*)'public\/images\/red\/red-color-official-3\.avif',\s*'public\/images\/red\/red_color_fabric\.avif',\s*'public\/images\/red\/red-color-official-3\.avif',\s*'public\/images\/red\/red-color-official-2\.avif',\s*'public\/images\/red\/red-color-official-3\.avif'/g; const newRedThumbnails = "$1'public/images/red/red-color-official-3.avif',
                        'public/images/red/red_color_fabric.avif',
                        'public/images/red/red-color-official-2.avif',
                        'public/images/red/red-color-official-4.avif',
                        'public/images/red/red-color-official.avif'"; content = content.replace(redThumbnailsRegex, newRedThumbnails); fs.writeFileSync(filePath, content); console.log('تم تحديث الملف بنجاح');
