import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  type User
} from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDLmbmp7JnBgZYO1zwxJfzu5AFpyjLJiWw",
  authDomain: "gen-lang-client-0297464303.firebaseapp.com",
  projectId: "gen-lang-client-0297464303",
  storageBucket: "gen-lang-client-0297464303.firebasestorage.app",
  messagingSenderId: "783720413426",
  appId: "1:783720413426:web:6aadb14b891156e6adf86b"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app, "ai-studio-horizoneaitravel-5b60529a-f9ce-40ea-ace7-6a4c4c55cdc8");

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

/**
 * Saves or updates user details in Firestore upon successful login/registration.
 */
export async function saveUserProfile(user: User, providerId: string) {
  try {
    const userRef = doc(db, "users", user.uid);
    let userSnap;
    try {
      userSnap = await getDoc(userRef);
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, `users/${user.uid}`);
      return;
    }
    
    const userData = {
      uid: user.uid,
      displayName: user.displayName || "User",
      email: user.email || "",
      photoURL: user.photoURL || "",
      providerId: providerId,
      lastLogin: new Date().toISOString(),
    };

    if (!userSnap.exists()) {
      // Create new user profile
      try {
        await setDoc(userRef, {
          ...userData,
          createdAt: new Date().toISOString(),
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `users/${user.uid}`);
      }
    } else {
      // Update existing
      try {
        await setDoc(userRef, userData, { merge: true });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `users/${user.uid}`);
      }
    }
  } catch (err) {
    console.error("Error saving user profile to Firestore:", err);
    throw err;
  }
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export {
  app,
  auth,
  db,
  googleProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile
};
export type { User };
