// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, OAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_FIREBASE_KEY,
  authDomain: "crewroomz-58c7a.firebaseapp.com",
  projectId: "crewroomz-58c7a",
  storageBucket: "crewroomz-58c7a.firebasestorage.app",
  messagingSenderId: "279969384309",
  appId: "1:279969384309:web:581d661e31be2de3a4b53c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const appleProvider = new OAuthProvider("apple.com");
export const db = getFirestore(app);
// export const firestore = getFirestore(app);
// export const storage = getStorage(app);

export default app;
