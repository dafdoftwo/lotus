#!/bin/bash

# Ensure the script stops on first error
set -e

echo "🔄 مزامنة الملفات من المجلد الرئيسي إلى مجلد public..."

# نسخ ملفات HTML الرئيسية
cp index.html public/
cp admin.html public/

# نسخ أي ملفات JavaScript جديدة إذا وجدت
if [ -d "js" ]; then
  cp -r js/* public/js/
fi

# نسخ أي ملفات CSS جديدة إذا وجدت
if [ -d "css" ]; then
  cp -r css/* public/css/
fi

# نسخ أي صور جديدة إذا وجدت
if [ -d "images" ]; then
  cp -r images/* public/images/
fi

# نسخ أي مكونات جديدة إذا وجدت
if [ -d "components" ]; then
  cp -r components/* public/components/
fi

echo "✅ تمت المزامنة بنجاح!"

# النشر على Firebase Hosting
echo "🔥 جاري النشر على Firebase Hosting..."
./deploy.sh

echo "🎉 تم النشر بنجاح! يمكنك الآن زيارة موقعك على: https://lotus-48d81.web.app" 