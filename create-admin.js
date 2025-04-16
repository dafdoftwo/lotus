/**
 * Script to create an admin user in Firebase Authentication
 * Run with: node create-admin.js <email> <password>
 */

const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword } = require('firebase/auth');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDYU9lSIWN9MUREXrhkMr-hXPGgBc5upfw",
  authDomain: "lotus-48d81.firebaseapp.com",
  projectId: "lotus-48d81",
  storageBucket: "lotus-48d81.firebasestorage.app",
  messagingSenderId: "584959487002",
  appId: "1:584959487002:web:7f6663e0f7855519aab5a3",
  measurementId: "G-VZTR3BVL2M"
};

// Parse command line arguments
const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.error('Usage: node create-admin.js <email> <password>');
  process.exit(1);
}

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Initialize Firebase client SDK
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Create user
createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // User created successfully
    const user = userCredential.user;
    console.log(`✅ Admin user created successfully: ${user.email}`);
    console.log(`UID: ${user.uid}`);
    
    // Set custom claims to make the user an admin
    return admin.auth().setCustomUserClaims(user.uid, { admin: true })
      .then(() => {
        console.log('✅ Admin privileges granted');
        console.log('\nYou can now log in to the admin panel at:');
        console.log('https://lotus-48d81.web.app/admin');
        process.exit(0);
      });
  })
  .catch((error) => {
    console.error('❌ Error creating admin user:');
    console.error(`Code: ${error.code}`);
    console.error(`Message: ${error.message}`);
    process.exit(1);
  }); 