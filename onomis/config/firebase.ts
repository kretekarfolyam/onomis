// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCSulrU44Uv7nx0mQwwp71IHTZdwBEObo0",
  authDomain: "onomis-d3fe2.firebaseapp.com",
  projectId: "onomis-d3fe2",
  storageBucket: "onomis-d3fe2.firebasestorage.app",
  messagingSenderId: "5036321159",
  appId: "1:5036321159:web:46ab256a7bfd844e52cb22",
  measurementId: "G-CDHZ9S9KP4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
});

export const firestore = getFirestore(app);