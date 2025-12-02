
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  User as FirebaseUser
} from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyC5hFB3ICxzyMrlvtnQl-n-2Dkr2RFsmqc",
  authDomain: "fir-9b1f8.firebaseapp.com",
  projectId: "fir-9b1f8",
  storageBucket: "fir-9b1f8.firebasestorage.app",
  messagingSenderId: "539772525700",
  appId: "1:539772525700:web:25b5a686877ddbf6d176d1",
  measurementId: "G-7FWY3QB5MY"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app); 
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
};

export const registerWithEmail = async (name: string, email: string, pass: string) => {
    try {
        const result = await createUserWithEmailAndPassword(auth, email, pass);
        await updateProfile(result.user, {
            displayName: name,
            photoURL: `https://ui-avatars.com/api/?name=${name}&background=random`
        });
        return result.user;
    } catch (error) {
        throw error;
    }
}

export const loginWithEmail = async (email: string, pass: string) => {
    try {
        const result = await signInWithEmailAndPassword(auth, email, pass);
        return result.user;
    } catch (error) {
        throw error;
    }
}

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out", error);
  }
};
