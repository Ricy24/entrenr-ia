import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyB5NGIG9hqvZKDX9SGrGrm8hs7mIhIS78w",
    authDomain: "retos-e2de4.firebaseapp.com",
    projectId: "retos-e2de4",
    storageBucket: "retos-e2de4.firebasestorage.app",
    messagingSenderId: "378845499060",
    appId: "1:378845499060:web:69b7a63b4e3f0eba9ad1e1",
    measurementId: "G-5J33FQZY7H"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
