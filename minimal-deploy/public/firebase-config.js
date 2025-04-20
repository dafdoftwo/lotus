// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCUq7yBq_gu_W5O6SLTUO2upQUFNa0blL8",
  authDomain: "loutus-higab.firebaseapp.com",
  projectId: "loutus-higab",
  storageBucket: "loutus-higab.appspot.com",
  messagingSenderId: "971174136438",
  appId: "1:971174136438:web:a513b9b212260c34d52d57",
  measurementId: "G-6EHG240K0E"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Analytics if available
if (firebase.analytics) {
  const analytics = firebase.analytics();
} 