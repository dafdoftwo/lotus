#!/bin/bash

# Ensure the script stops on first error
set -e

echo "🔄 مزامنة الملفات من المجلد الرئيسي إلى مجلد public..."

# نسخ ملفات HTML الرئيسية
cp index.html public/
cp admin.html public/

# نسخ أي ملفات JavaScript جديدة إذا وجدت
if [ -d "js" ]; then
  mkdir -p public/js
  cp -r js/* public/js/
fi

# نسخ أي ملفات CSS جديدة إذا وجدت
if [ -d "css" ]; then
  mkdir -p public/css
  cp -r css/* public/css/
fi

# نسخ أي صور جديدة إذا وجدت
if [ -d "images" ]; then
  mkdir -p public/images
  cp -r images/* public/images/
fi

# نسخ أي مكونات جديدة إذا وجدت
if [ -d "components" ]; then
  mkdir -p public/components
  cp -r components/* public/components/
fi

echo "✅ تمت المزامنة بنجاح!"

# التحقق من وجود كافة الملفات المطلوبة قبل النشر
echo "🔍 التحقق من وجود كافة الملفات المطلوبة قبل النشر..."
./check-files.sh

# حفظ التغييرات في Git
echo "💾 حفظ التغييرات في Git..."
git add .
git commit -m "تحديث قبل النشر: $(date)" || echo "لا توجد تغييرات لحفظها"
git push || echo "تعذر دفع التغييرات إلى GitHub"

# النشر على Firebase Hosting
echo "🔥 جاري النشر على Firebase Hosting..."
./deploy.sh

echo "🎉 تم النشر بنجاح! يمكنك الآن زيارة موقعك على: https://lotus-48d81.web.app" 