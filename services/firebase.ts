// @ts-ignore: Suppress "has no exported member" error due to potential type definition mismatch
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// TODO: Replace the following config with your actual Firebase project credentials
// You can find these in your Firebase Console -> Project Settings
const firebaseConfig = {
  apiKey: "AIzaSyBpRkttEC-N9w587bW7phVf5ZwUfyoBlzE",
  authDomain: "d2c-simulator.firebaseapp.com",
  projectId: "d2c-simulator",
  storageBucket: "d2c-simulator.firebasestorage.app",
  messagingSenderId: "398498518727",
  appId: "1:398498518727:web:3a0ceee86cd4d2260dd0e2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Firestore
export const db = getFirestore(app);