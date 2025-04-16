# إعداد Firebase لموقع لوتس

هذا الدليل يوضح كيفية إعداد Firebase لاستخدامه مع موقع لوتس للفساتين.

## خطوات الإعداد

### 1. إنشاء مشروع Firebase جديد

1. انتقل إلى [console.firebase.google.com](https://console.firebase.google.com/)
2. انقر على "إضافة مشروع"
3. أدخل اسم المشروع (مثلاً "lotus-dress")
4. اتبع الخطوات لإكمال إنشاء المشروع

### 2. إعداد Authentication لإدارة الدخول

1. من القائمة الجانبية، اختر "Authentication"
2. انقر على "البدء"
3. من قائمة طرق تسجيل الدخول، اختر "البريد الإلكتروني/كلمة المرور"
4. قم بتفعيل هذا الخيار
5. أضف مستخدم مسؤول عبر علامة التبويب "المستخدمون"، انقر على "إضافة مستخدم"

### 3. إعداد قاعدة البيانات Firestore

1. من القائمة الجانبية، اختر "Firestore Database"
2. انقر على "إنشاء قاعدة بيانات"
3. اختر وضع الأمان المناسب (يمكنك البدء بوضع الاختبار ثم تغييره لاحقاً)
4. حدد المنطقة الأقرب إليك
5. قم بتعديل قواعد الأمان Firestore Rules لتكون كالتالي:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // السماح للمستخدمين غير المسجلين بإنشاء طلبات جديدة فقط
    match /orders/{orderId} {
      allow create: if true;
      allow read, update, delete: if request.auth != null;
    }
    
    // بقية المجموعات تحتاج إلى صلاحيات مسؤول
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 4. استخراج معلومات تكوين Firebase

1. انتقل إلى إعدادات المشروع (رمز الترس بجانب اسم المشروع)
2. انتقل إلى علامة التبويب "تطبيقات الويب"
3. انقر على أيقونة "</>" لإضافة تطبيق ويب
4. أدخل اسم التطبيق (مثلاً "Lotus Dress Landing Page")
5. انسخ معلومات التكوين (firebaseConfig) التي تظهر لك

### 5. تحديث ملفات المشروع

1. افتح ملفي `index.html` و `admin.html`
2. ابحث عن كتلة التعليمات البرمجية التي تحتوي على `firebaseConfig`
3. استبدل القيم الافتراضية بالقيم الخاصة بمشروعك:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 6. نشر الموقع على Firebase Hosting

1. قم بتثبيت Firebase CLI:
```
npm install -g firebase-tools
```

2. سجل الدخول إلى Firebase من الطرفية:
```
firebase login
```

3. ابدأ مشروع Firebase في المجلد الحالي:
```
firebase init
```

4. حدد خدمات Firebase التي تريد استخدامها:
   - Firestore
   - Hosting
   - Authentication (إذا كان متاحًا)

5. اختر المشروع الذي أنشأته سابقًا

6. بالنسبة لإعدادات Hosting:
   - حدد المجلد العام كـ "." (النقطة تعني المجلد الحالي)
   - قم بتكوين التطبيق كتطبيق صفحة واحدة: "لا"
   - تجاهل البناء: "نعم"

7. انشر الموقع:
```
firebase deploy
```

بعد الانتهاء من هذه الخطوات، سيتم نشر موقعك على عنوان URL خاص بـ Firebase Hosting، وستتمكن من الوصول إلى لوحة الإدارة من خلال `/admin.html`.

## اختبار النظام

1. قم بزيارة موقعك عبر عنوان Firebase Hosting الذي تم تزويدك به
2. جرب إنشاء طلب جديد من الصفحة الرئيسية
3. سجل الدخول إلى لوحة الإدارة باستخدام بيانات اعتماد المسؤول التي أنشأتها
4. تحقق من إمكانية رؤية الطلب وتحديث حالته 