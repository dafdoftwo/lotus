const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } = require('firebase/auth');

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCUq7yBq_gu_W5O6SLTUO2upQUFNa0blL8",
  authDomain: "loutus-higab.firebaseapp.com",
  projectId: "loutus-higab",
  storageBucket: "loutus-higab.firebasestorage.app",
  messagingSenderId: "971174136438",
  appId: "1:971174136438:web:a513b9b212260c34d52d57",
  measurementId: "G-6EHG240K0E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Admin user details
const email = 'senatorever@gmail.com';
const password = 'ABMabm2122@@';
const displayName = 'Lotus Admin';
// User UID: RdIYWmYaCsV5jXbFybJBmWXVvFp2 (already exists)

// Sign in with existing credentials
signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    const user = userCredential.user;
    console.log('Successfully authenticated existing admin user:', user.uid);
    
    // Update profile with display name if needed
    return updateProfile(user, {
      displayName: displayName
    });
  })
  .then(() => {
    console.log('Admin user profile updated successfully');
    console.log('You can now log in with:');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error authenticating admin user:', error.code, error.message);
    
    if (error.code === 'auth/user-not-found') {
      // If user doesn't exist, create it
      console.log('User not found, creating new admin user...');
      
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          console.log('Admin user created successfully:', user.uid);
          
          // Update profile with display name
          return updateProfile(user, {
            displayName: displayName
          });
        })
        .then(() => {
          console.log('Admin user profile updated successfully');
          console.log('You can now log in with:');
          console.log(`Email: ${email}`);
          console.log(`Password: ${password}`);
          process.exit(0);
        })
        .catch((createError) => {
          console.error('Error creating admin user:', createError.code, createError.message);
          process.exit(1);
        });
    } else {
      process.exit(1);
    }
  }); 