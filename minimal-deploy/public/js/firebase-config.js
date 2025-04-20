// تكوين Firebase للموقع
const firebaseConfig = {
  apiKey: "AIzaSyCUq7yBq_gu_W5O6SLTUO2upQUFNa0blL8",
  authDomain: "loutus-higab.firebaseapp.com",
  projectId: "loutus-higab",
  storageBucket: "loutus-higab.firebasestorage.app",
  messagingSenderId: "971174136438",
  appId: "1:971174136438:web:a513b9b212260c34d52d57",
  measurementId: "G-6EHG240K0E"
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