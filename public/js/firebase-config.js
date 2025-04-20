// تكوين Firebase للموقع
const firebaseConfig = {
  apiKey: "AIzaSyBI4SZZk8PVOD5ZWoQ6mqkApgsoWpi7BP0",
  authDomain: "lotus-hijab.firebaseapp.com",
  projectId: "lotus-hijab",
  storageBucket: "lotus-hijab.firebasestorage.app",
  messagingSenderId: "348905479609",
  appId: "1:348905479609:web:1a20f7e91443fca6f72a68",
  measurementId: "G-5B23X7QRYT"
};

// تهيئة Firebase
firebase.initializeApp(firebaseConfig);

// تصدير الخدمات التي نحتاجها
const db = firebase.firestore();
const storage = firebase.storage();
const auth = firebase.auth();
const analytics = firebase.analytics();

// للاستخدام في أماكن أخرى من التطبيق
window.db = db;
window.storage = storage;
window.auth = auth;
window.analytics = analytics;

// Initialize Analytics if available
if (firebase.analytics) {
  firebase.analytics();
} 