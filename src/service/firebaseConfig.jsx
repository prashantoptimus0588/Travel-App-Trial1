// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAWrTbAMkd6jAkhgDSge1tB8ZHWxKXS2Fk",
  authDomain: "trip-planner-f78bd.firebaseapp.com",
  projectId: "trip-planner-f78bd",
  storageBucket: "trip-planner-f78bd.firebasestorage.app",
  messagingSenderId: "773419477522",
  appId: "1:773419477522:web:bd967241376a13a4ab06cb",
  measurementId: "G-PEL6P9R2QJ"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db= getFirestore(app);
// const analytics = getAnalytics(app);