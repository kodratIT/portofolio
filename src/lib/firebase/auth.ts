import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User,
} from "firebase/auth";
import { auth, db } from "./config";
import { doc, setDoc, getDoc } from "firebase/firestore";

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  bio?: string;
  avatar?: string;
  location?: string;
  website?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const registerUser = async (
  email: string,
  password: string,
  displayName: string
): Promise<User> => {
  let user: User;
  
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    user = userCredential.user;
    console.log("✅ User created in Firebase Auth:", user.uid);
  } catch (error: any) {
    console.error("❌ Firebase Auth Error:", error.code, error.message);
    throw error;
  }

  try {
    await updateProfile(user, { displayName });
    console.log("✅ User profile updated");
  } catch (error: any) {
    console.error("⚠️ Profile update error:", error.message);
  }

  const userProfile: UserProfile = {
    uid: user.uid,
    email: user.email!,
    displayName,
    bio: "",
    avatar: "",
    location: "",
    website: "",
    github: "",
    linkedin: "",
    twitter: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  try {
    await setDoc(doc(db, "users", user.uid), userProfile);
    console.log("✅ User profile created in Firestore");
  } catch (error: any) {
    console.error("❌ Firestore Error:", error.code, error.message);
    console.error("Full error:", error);
    
    if (error.code === "permission-denied") {
      throw new Error("FIRESTORE_PERMISSION_DENIED: Please check Firestore rules");
    } else if (error.code === "unavailable") {
      throw new Error("FIRESTORE_UNAVAILABLE: Please enable Firestore Database");
    } else {
      throw new Error(`FIRESTORE_ERROR: ${error.message}`);
    }
  }

  return user;
};

export const loginUser = async (email: string, password: string) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

export const logoutUser = async () => {
  return await signOut(auth);
};

export const resetPassword = async (email: string) => {
  return await sendPasswordResetEmail(auth, email);
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as UserProfile;
  }
  return null;
};

export const updateUserProfile = async (
  uid: string,
  data: Partial<UserProfile>
): Promise<void> => {
  const docRef = doc(db, "users", uid);
  await setDoc(
    docRef,
    {
      ...data,
      updatedAt: new Date(),
    },
    { merge: true }
  );
};
