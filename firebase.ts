
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  User as FirebaseUser,
  onAuthStateChanged
} from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC5hFB3ICxzyMrlvtnQl-n-2Dkr2RFsmqc",
  authDomain: "fir-9b1f8.firebaseapp.com",
  projectId: "fir-9b1f8",
  storageBucket: "fir-9b1f8.firebasestorage.app",
  messagingSenderId: "539772525700",
  appId: "1:539772525700:web:25b5a686877ddbf6d176d1",
  measurementId: "G-7FWY3QB5MY"
};

// ----------------------------------------------------------------------
// ROBUST INITIALIZATION (Prevents White Screen on deployment)
// ----------------------------------------------------------------------
let app;
let auth: any;
let googleProvider: GoogleAuthProvider;
let isMockMode = false;

try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
} catch (e) {
    console.warn("Firebase Initialization Failed - Switching to Mock Mode", e);
    isMockMode = true;
    
    // Create a robust mock auth object to keep the app running
    auth = {
        currentUser: null,
        signOut: async () => { auth.currentUser = null; },
    };
}

export { auth, googleProvider };

// Wrapper for Auth State Listener
export const onAuthStateChange = (callback: (user: FirebaseUser | null) => void) => {
    if (isMockMode) {
        // In mock mode, just return null immediately
        callback(null);
        return () => {};
    }
    
    try {
        return onAuthStateChanged(auth, callback);
    } catch (e) {
        console.warn("Auth Listener Error", e);
        callback(null);
        return () => {};
    }
}

export const signInWithGoogle = async () => {
  if (isMockMode) {
      alert("Demo Mode: Simulating Google Login");
      const mockUser = { uid: 'demo-123', displayName: 'Demo User', photoURL: 'https://ui-avatars.com/api/?name=Demo', email: 'demo@wtconnect.com' };
      return mockUser as any;
  }
  
  if (!auth) throw new Error("Authentication unavailable");
  
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
};

export const registerWithEmail = async (name: string, email: string, pass: string) => {
    if (isMockMode) {
        alert("Demo Mode: Account Created");
        return { uid: 'new-123', displayName: name, email, photoURL: `https://ui-avatars.com/api/?name=${name}` };
    }

    if (!auth) throw new Error("Authentication unavailable");
    try {
        const result = await createUserWithEmailAndPassword(auth, email, pass);
        if (result.user) {
            await updateProfile(result.user, {
                displayName: name,
                photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
            });
        }
        return result.user;
    } catch (error) {
        throw error;
    }
}

export const loginWithEmail = async (email: string, pass: string) => {
    if (isMockMode) {
        alert("Demo Mode: Signed In");
        return { uid: 'demo-123', displayName: 'Demo User', email };
    }

    if (!auth) throw new Error("Authentication unavailable");
    try {
        const result = await signInWithEmailAndPassword(auth, email, pass);
        return result.user;
    } catch (error) {
        throw error;
    }
}

export const logout = async () => {
  if (isMockMode) {
      window.location.reload(); // Simple reload to clear state in demo
      return;
  }
  
  if (!auth) return;
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out", error);
  }
};