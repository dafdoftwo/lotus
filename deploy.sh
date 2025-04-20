#!/bin/bash

# توضيح عمل السكريبت
echo "🚀 بدء عملية نشر موقع لوتس"
echo "============================"

# التأكد من وجود Firebase CLI
if ! command -v firebase &> /dev/null
then
    echo "❌ لم يتم العثور على Firebase CLI. جاري التثبيت..."
    npm install -g firebase-tools
else
    echo "✅ Firebase CLI موجود بالفعل."
fi

# التأكد من تسجيل الدخول إلى Firebase
echo "🔑 التحقق من حالة تسجيل الدخول إلى Firebase..."
firebase login:list
if [ $? -ne 0 ]; then
    echo "👤 يرجى تسجيل الدخول إلى حساب Firebase الخاص بك"
    firebase login
else
    echo "✅ تم تسجيل الدخول بالفعل إلى Firebase."
fi

# تحديد مشروع Firebase
echo "📦 Using project: loutus-higab"
firebase use loutus-higab

# بناء وتحسين الموقع (اختياري - يمكن تخصيصه حسب احتياجاتك)
echo "🔨 تحضير الملفات للنشر..."
# يمكنك إضافة خطوات بناء هنا مثل:
# npm run build

# نشر الموقع على Firebase Hosting
echo "🚀 جاري نشر الموقع على Firebase Hosting..."
firebase deploy --only hosting

# إظهار رسالة نجاح
echo "✨ تم نشر الموقع بنجاح!"
echo "🌐 Your website is now live at: https://loutus-higab.web.app" 