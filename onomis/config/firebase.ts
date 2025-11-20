import { initializeApp } from "firebase/app";

import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore, collection } from "firebase/firestore";

// 1. create new project on firebase console
// 2. create a web app and copy the firebseConfigs below
const firebaseConfig = {
  apiKey: "AIzaSyCSulrU44Uv7nx0mQwwp71IHTZdwBEObo0",
  authDomain: "onomis-d3fe2.firebaseapp.com",
  projectId: "onomis-d3fe2",
  storageBucket: "onomis-d3fe2.firebasestorage.app",
  messagingSenderId: "5036321159",
  appId: "1:5036321159:web:46ab256a7bfd844e52cb22"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
// export const auth = initializeAuth(app);

export const firestore = getFirestore(app);

