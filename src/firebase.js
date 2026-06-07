import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDHWO1DUYE7DC_4t0dP0d8WEdayCPQU3Z8",
  authDomain: "hostel-managment-6ee43.firebaseapp.com",
  projectId: "hostel-managment-6ee43",
  storageBucket: "hostel-managment-6ee43.firebasestorage.app",
  messagingSenderId: "969079428602",
  appId: "1:969079428602:web:96d007b8b2ed50f3f74043",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
