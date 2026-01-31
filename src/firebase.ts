import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDe241_eRgp3d51MEkBFRTutys7PXDJlVU",
    authDomain: "presupuestos-dlkom.firebaseapp.com",
    projectId: "presupuestos-dlkom",
    storageBucket: "presupuestos-dlkom.firebasestorage.app",
    messagingSenderId: "168092950302",
    appId: "1:168092950302:web:d1c7eed51f4e16d739730f",
    measurementId: "G-D6B1DFTN0L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

export default app;
