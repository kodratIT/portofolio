import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import { db } from "./config";
import { Experience } from "@/lib/types";

const EXPERIENCES_COLLECTION = "experiences";

export const createExperience = async (
  userId: string,
  experienceData: Omit<Experience, "id" | "userId" | "createdAt" | "updatedAt">
): Promise<string> => {
  try {
    console.log("🔄 Creating experience with data:", { userId, experienceData });
    
    const dataToSave = {
      ...experienceData,
      userId,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
    
    const docRef = await addDoc(collection(db, EXPERIENCES_COLLECTION), dataToSave);
    
    console.log("✅ Experience created successfully:", docRef.id);
    return docRef.id;
  } catch (error: any) {
    console.error("❌ Error creating experience:", error);
    throw error;
  }
};

export const getExperiences = async (userId: string): Promise<Experience[]> => {
  try {
    const q = query(
      collection(db, EXPERIENCES_COLLECTION),
      where("userId", "==", userId)
    );
    const querySnapshot = await getDocs(q);
    const experiences: Experience[] = [];
    
    querySnapshot.forEach((doc) => {
      experiences.push({
        id: doc.id,
        ...doc.data(),
      } as Experience);
    });
    
    // Sort by start date (most recent first)
    experiences.sort((a, b) => {
      // Current positions first
      if (a.current && !b.current) return -1;
      if (!a.current && b.current) return 1;
      
      // Then by start date (newest first)
      const aDate = a.startDate?.toMillis() || 0;
      const bDate = b.startDate?.toMillis() || 0;
      return bDate - aDate;
    });
    
    console.log(`✅ Fetched ${experiences.length} experiences`);
    return experiences;
  } catch (error: any) {
    console.error("❌ Error fetching experiences:", error);
    throw error;
  }
};

export const getExperience = async (experienceId: string): Promise<Experience | null> => {
  try {
    const docRef = doc(db, EXPERIENCES_COLLECTION, experienceId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as Experience;
    }
    return null;
  } catch (error: any) {
    console.error("❌ Error fetching experience:", error);
    throw error;
  }
};

export const updateExperience = async (
  experienceId: string,
  experienceData: Partial<Experience>
): Promise<void> => {
  try {
    const docRef = doc(db, EXPERIENCES_COLLECTION, experienceId);
    await updateDoc(docRef, {
      ...experienceData,
      updatedAt: Timestamp.now(),
    });
    console.log("✅ Experience updated:", experienceId);
  } catch (error: any) {
    console.error("❌ Error updating experience:", error);
    throw error;
  }
};

export const deleteExperience = async (experienceId: string): Promise<void> => {
  try {
    const docRef = doc(db, EXPERIENCES_COLLECTION, experienceId);
    await deleteDoc(docRef);
    console.log("✅ Experience deleted:", experienceId);
  } catch (error: any) {
    console.error("❌ Error deleting experience:", error);
    throw error;
  }
};
