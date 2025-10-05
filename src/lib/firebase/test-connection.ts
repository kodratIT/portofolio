import { auth, db, storage } from "./config";
import { signInAnonymously } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { ref, listAll } from "firebase/storage";

export async function testFirebaseConnection() {
  const results = {
    auth: false,
    firestore: false,
    storage: false,
    errors: [] as string[],
  };

  try {
    await signInAnonymously(auth);
    results.auth = true;
    console.log("✅ Firebase Authentication: Connected");
  } catch (error: any) {
    results.errors.push(`Auth Error: ${error.message}`);
    console.error("❌ Firebase Authentication: Failed", error);
  }

  try {
    const usersCollection = collection(db, "users");
    await getDocs(usersCollection);
    results.firestore = true;
    console.log("✅ Firestore Database: Connected");
  } catch (error: any) {
    results.errors.push(`Firestore Error: ${error.message}`);
    console.error("❌ Firestore Database: Failed", error);
  }

  try {
    const storageRef = ref(storage);
    await listAll(storageRef);
    results.storage = true;
    console.log("✅ Firebase Storage: Connected");
  } catch (error: any) {
    results.errors.push(`Storage Error: ${error.message}`);
    console.error("❌ Firebase Storage: Failed", error);
  }

  return results;
}
