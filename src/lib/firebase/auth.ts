import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User,
  GoogleAuthProvider,
  signInWithPopup,
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

export const loginWithGoogle = async (): Promise<User> => {
  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    console.log("✅ Google Sign-In successful:", user.uid);
    
    // Check if user profile exists in Firestore
    const userDoc = await getDoc(doc(db, "users", user.uid));
    
    if (!userDoc.exists()) {
      // Create user profile if it doesn't exist
      console.log("📝 Creating user profile for new Google user");
      const userProfile: UserProfile = {
        uid: user.uid,
        email: user.email!,
        displayName: user.displayName || user.email!.split('@')[0],
        bio: "",
        avatar: user.photoURL || "",
        location: "",
        website: "",
        github: "",
        linkedin: "",
        twitter: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      await setDoc(doc(db, "users", user.uid), userProfile);
      console.log("✅ User profile created for Google user");
    } else {
      console.log("✅ Existing user profile found");
    }
    
    return user;
  } catch (error: any) {
    console.error("❌ Google Sign-In Error:", error.code, error.message);
    throw error;
  }
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

export const changePassword = async (
  currentPassword: string,
  newPassword: string
): Promise<void> => {
  try {
    const user = auth.currentUser;
    if (!user || !user.email) {
      throw new Error("No authenticated user");
    }

    // Import needed for re-authentication
    const { EmailAuthProvider, reauthenticateWithCredential, updatePassword } = await import("firebase/auth");

    // Re-authenticate user
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);

    // Update password
    await updatePassword(user, newPassword);
    
    console.log("✅ Password changed successfully");
  } catch (error: any) {
    console.error("❌ Error changing password:", error);
    
    if (error.code === "auth/wrong-password") {
      throw new Error("Current password is incorrect");
    } else if (error.code === "auth/weak-password") {
      throw new Error("New password is too weak");
    } else if (error.code === "auth/requires-recent-login") {
      throw new Error("Please log out and log in again before changing password");
    }
    
    throw error;
  }
};
