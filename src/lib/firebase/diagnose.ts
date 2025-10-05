import { auth, db, storage } from "./config";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { ref, uploadString, getDownloadURL, deleteObject } from "firebase/storage";

export async function diagnoseFirebase() {
  console.log("🔍 Starting Firebase Diagnostics...\n");
  
  const results = {
    auth: { status: "unknown", message: "" },
    firestore: { status: "unknown", message: "" },
    storage: { status: "unknown", message: "" },
  };

  // Test Authentication
  try {
    if (auth.currentUser) {
      results.auth.status = "success";
      results.auth.message = `✅ Auth: Connected (User: ${auth.currentUser.email})`;
    } else {
      results.auth.status = "warning";
      results.auth.message = "⚠️ Auth: Connected but no user logged in";
    }
    console.log(results.auth.message);
  } catch (error: any) {
    results.auth.status = "error";
    results.auth.message = `❌ Auth: ${error.message}`;
    console.error(results.auth.message);
  }

  // Test Firestore
  try {
    const testCollection = collection(db, "test");
    const testDoc = await addDoc(testCollection, {
      test: true,
      timestamp: new Date(),
    });
    
    await deleteDoc(testDoc);
    
    results.firestore.status = "success";
    results.firestore.message = "✅ Firestore: Connected and writable";
    console.log(results.firestore.message);
  } catch (error: any) {
    results.firestore.status = "error";
    
    if (error.code === "permission-denied") {
      results.firestore.message = "❌ Firestore: Permission denied. Check security rules.";
      console.error(results.firestore.message);
      console.error("🔗 Fix: https://console.firebase.google.com/project/portofolio-ecd0d/firestore/rules");
    } else if (error.code === "unavailable") {
      results.firestore.message = "❌ Firestore: Not enabled. Please create database.";
      console.error(results.firestore.message);
      console.error("🔗 Fix: https://console.firebase.google.com/project/portofolio-ecd0d/firestore");
    } else {
      results.firestore.message = `❌ Firestore: ${error.message}`;
      console.error(results.firestore.message);
      console.error("Full error:", error);
    }
  }

  // Test Storage
  try {
    const testRef = ref(storage, `test/${Date.now()}.txt`);
    await uploadString(testRef, "test");
    await getDownloadURL(testRef);
    await deleteObject(testRef);
    
    results.storage.status = "success";
    results.storage.message = "✅ Storage: Connected and writable";
    console.log(results.storage.message);
  } catch (error: any) {
    results.storage.status = "error";
    
    if (error.code === "storage/unauthorized") {
      results.storage.message = "❌ Storage: Permission denied. Check security rules.";
      console.error(results.storage.message);
      console.error("🔗 Fix: https://console.firebase.google.com/project/portofolio-ecd0d/storage/rules");
    } else if (error.code === "storage/unauthenticated") {
      results.storage.message = "⚠️ Storage: Not authenticated (normal if not logged in)";
      console.warn(results.storage.message);
    } else {
      results.storage.message = `❌ Storage: ${error.message}`;
      console.error(results.storage.message);
      console.error("Full error:", error);
    }
  }

  console.log("\n📊 Diagnostic Summary:");
  console.log(results);
  
  return results;
}

export function printFirebaseSetupGuide() {
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                   🔥 FIREBASE SETUP GUIDE                     ║
╚═══════════════════════════════════════════════════════════════╝

If you see errors above, follow these steps:

📍 Step 1: Enable Authentication
   URL: https://console.firebase.google.com/project/portofolio-ecd0d/authentication/providers
   Action: Enable Email/Password

📍 Step 2: Create Firestore Database
   URL: https://console.firebase.google.com/project/portofolio-ecd0d/firestore
   Action: Create database in TEST MODE

📍 Step 3: Enable Storage
   URL: https://console.firebase.google.com/project/portofolio-ecd0d/storage
   Action: Get started with default rules

📖 Detailed Guide: See FIREBASE_ENABLE_SERVICES.md
`);
}
