# موقع فستان لوتس | Lotus Dress

موقع هبوط احترافي وأنيق لبيع فستان لوتس للسيدات في مصر، مع نظام إدارة طلبات متكامل.

## نظرة عامة

يتكون المشروع من:

- صفحة هبوط أنيقة (index.html) للعملاء بتصميم متوافق مع الجوال بالكامل وباللغة العربية
- لوحة تحكم للإدارة (admin.html) لإدارة الطلبات ومتابعتها
- دعم كامل للدفع عند الاستلام (COD)
- تسعير ديناميكي وعروض خاصة للطلبات المتعددة
- تكامل مع Firebase للتخزين وإدارة المستخدمين والاستضافة

## الميزات الرئيسية

### صفحة الهبوط (للعملاء)

- تصميم راقي يركز على الجوال أولاً (RTL للغة العربية)
- عرض جذاب لمنتج فستان لوتس بألوانه المختلفة (أسود، بيج، أحمر)
- تسعير ديناميكي مع خصومات خاصة على الكميات الكبيرة:
  - 1 فستان: 770 جنيه مصري
  - 2 فستان: 1399 جنيه مصري
  - 3 فساتين: 1900 جنيه مصري + شحن مجاني
- نموذج طلب سهل الاستخدام مع اختيار اللون والمقاس والكمية
- تأكيد طلب فوري مع توجيه العميل للخطوة التالية

### لوحة التحكم (للإدارة)

- نظام تسجيل دخول آمن
- عرض جميع الطلبات مع تفاصيلها
- إمكانية تحديث حالة الطلب (جديد، قيد المعالجة، تم الشحن، تم التسليم، ملغي)
- عرض تفاصيل كاملة لكل طلب
- واجهة سهلة الاستخدام لإدارة عملية البيع

## متطلبات التشغيل

- استضافة ويب (يفضل Firebase Hosting)
- حساب Firebase (للاستفادة من Firestore وAuthentication)

## بدء الاستخدام

1. قم بقراءة ملف [firebase-setup.md](firebase-setup.md) للحصول على تعليمات إعداد Firebase
2. قم بتثبيت اعتماديات المشروع:
   ```
   npm install
   ```
3. قم بإنشاء مستخدم مسؤول للوحة التحكم:
   ```
   npm run create-admin admin@example.com StrongPassword123
   ```
4. قم بنشر الموقع على Firebase Hosting:
   ```
   npm run deploy
   ```

## الملفات الرئيسية

- `index.html` - صفحة الهبوط للعملاء
- `admin.html` - لوحة تحكم الإدارة
- `public/images/` - مجلد الصور المستخدمة في الموقع
- `firebase-setup.md` - دليل إعداد Firebase
- `firebase.json` - إعدادات Firebase Hosting
- `firestore.rules` - قواعد أمان Firestore
- `firestore.indexes.json` - فهارس Firestore
- `deploy.sh` - سكريبت النشر
- `create-admin.js` - سكريبت إنشاء مستخدم مسؤول

## النشر على Firebase

لنشر الموقع على Firebase Hosting، اتبع الخطوات التالية:

1. تأكد من تثبيت Node.js و npm على جهازك
2. قم بتثبيت Firebase CLI عالمياً:
   ```
   npm install -g firebase-tools
   ```
3. قم بتسجيل الدخول إلى Firebase:
   ```
   firebase login
   ```
4. استخدم سكريبت النشر المتوفر:
   ```
   npm run deploy
   ```
   أو:
   ```
   ./deploy.sh
   ```
5. بعد اكتمال النشر، سيكون موقعك متاحاً على الرابط التالي:
   ```
   https://loutus-higab.web.app
   ```

## إنشاء مستخدم مسؤول

لإنشاء مستخدم مسؤول للوصول إلى لوحة التحكم:

1. تأكد من تثبيت اعتماديات المشروع:
   ```
   npm install
   ```
2. قم بتشغيل سكريبت إنشاء المستخدم مع تحديد البريد الإلكتروني وكلمة المرور:
   ```
   npm run create-admin admin@example.com StrongPassword123
   ```
   أو:
   ```
   node create-admin.js admin@example.com StrongPassword123
   ```
3. ستظهر رسالة تأكيد إنشاء المستخدم بنجاح
4. يمكنك الآن تسجيل الدخول إلى لوحة التحكم باستخدام بيانات الاعتماد هذه

## الاستخدام

### للعملاء
1. تصفح صفحة المنتج واقرأ التفاصيل
2. حدد اللون والمقاس والكمية المطلوبة
3. أدخل بيانات التوصيل
4. اضغط على زر "تأكيد الطلب الآن"

### للإدارة
1. انتقل إلى صفحة `/admin.html` أو `/admin`
2. سجل الدخول باستخدام بيانات اعتماد المسؤول
3. استعرض جميع الطلبات وقم بإدارتها
4. حدّث حالة الطلبات حسب تقدم عملية الشحن والتسليم

## التخصيص

يمكنك تخصيص الموقع بسهولة عن طريق:

- تحديث الصور في مجلد `public/images/`
- تعديل أنماط CSS المضمنة في `index.html` و `admin.html`
- تحديث النصوص والأوصاف حسب احتياجاتك

## الترخيص

جميع الحقوق محفوظة © 2025 لوتس 

# HELDEN/Lotus E-commerce Website

This project is an e-commerce website for HELDEN, featuring the Lotus dress product. The website includes product showcases, an interactive size calculator, color selection, and a complete ordering system with an admin dashboard.

## Features

- Responsive design for all devices
- Product showcase with color options
- Interactive size calculator
- Order form with multi-product support
- Discount section for multiple dress purchases
- Admin dashboard for order management

## Admin Dashboard

The admin dashboard allows you to:

- View and manage all orders
- Filter orders by status, date, and search terms
- Update order statuses (pending, processing, shipped, delivered, etc.)
- View detailed order information and products
- Export orders to CSV format
- View statistics on total orders, revenue, and more

## Setup Instructions

### 1. Firebase Setup

The project uses Firebase for authentication and database. To set it up:

1. Create a Firebase project at [firebase.google.com](https://firebase.google.com)
2. Enable Firestore Database
3. Set up Authentication with Email/Password method
4. Create at least one admin user in Firebase Authentication
5. Get your Firebase configuration (apiKey, authDomain, etc.)

### 2. Update Firebase Configuration

Replace the placeholder Firebase configuration in the following files:

- `public/js/admin.js` (line 2-9)
- `public/login.html` (line 180-187)

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 3. Firestore Database Structure

Create the following collections in your Firestore database:

- `orders` - This will store all order information

Each order document in the `orders` collection should have the following structure:

```javascript
{
  id: "ORDER_ID", // Automatically generated by Firestore
  customerName: "Customer Name",
  phone: "Phone Number",
  city: "City Name",
  address: "Full Address",
  orderDate: Timestamp, // Firebase Timestamp
  status: "pending", // One of: pending, processing, shipped, delivered, cancelled, returned
  totalAmount: 770, // Number
  paymentMethod: "الدفع عند الاستلام",
  items: [
    {
      name: "فستان لوتس",
      color: "أسود",
      size: "L",
      quantity: 1,
      price: 770,
      image: "img/product/black.jpg" // Path to product image
    }
  ],
  notes: "Any customer notes" // Optional
}
```

### 4. Deployment

1. Deploy the website to a hosting service of your choice (Firebase Hosting recommended)
2. Set up security rules in Firebase to protect your data

### 5. Accessing the Admin Panel

1. Navigate to `/login.html` to access the admin login page
2. Log in with your admin credentials created in Firebase Authentication
3. You will be redirected to the admin dashboard at `/admin.html`

## Security Considerations

- Add Firebase security rules to protect your data
- Only allow authenticated admins to access the orders collection
- Set appropriate CORS settings for your hosting environment

## File Structure

- `public/` - Main directory for all public files
  - `admin.html` - Admin dashboard HTML
  - `login.html` - Admin login page
  - `js/`
    - `admin.js` - Admin dashboard functionality
  - `css/`
    - `admin.css` - Admin dashboard styling
  - `partials/` - Website section partials
    - `_color-showcase.html` - Color selection section
    - `_order-form.html` - Order form
    - `_size-chart.html` - Size calculator
    - `_discount-section.html` - Discount options

## Support

For any issues or questions, please open an issue in this repository or contact the developer. 