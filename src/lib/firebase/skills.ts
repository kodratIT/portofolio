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
import { Skill } from "@/lib/types";

const SKILLS_COLLECTION = "skills";

export const createSkill = async (
  userId: string,
  skillData: Omit<Skill, "id" | "userId" | "createdAt" | "updatedAt">
): Promise<string> => {
  try {
    console.log("🔄 Creating skill with data:", { userId, skillData });
    
    const dataToSave = {
      ...skillData,
      userId,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
    
    const docRef = await addDoc(collection(db, SKILLS_COLLECTION), dataToSave);
    
    console.log("✅ Skill created successfully:", docRef.id);
    return docRef.id;
  } catch (error: any) {
    console.error("❌ Error creating skill:", error);
    throw error;
  }
};

export const getSkills = async (userId: string): Promise<Skill[]> => {
  try {
    const q = query(
      collection(db, SKILLS_COLLECTION),
      where("userId", "==", userId)
    );
    const querySnapshot = await getDocs(q);
    const skills: Skill[] = [];
    
    querySnapshot.forEach((doc) => {
      skills.push({
        id: doc.id,
        ...doc.data(),
      } as Skill);
    });
    
    // Sort by category, then by order
    skills.sort((a, b) => {
      if (a.category !== b.category) {
        return a.category.localeCompare(b.category);
      }
      return a.order - b.order;
    });
    
    console.log(`✅ Fetched ${skills.length} skills`);
    return skills;
  } catch (error: any) {
    console.error("❌ Error fetching skills:", error);
    throw error;
  }
};

export const getSkill = async (skillId: string): Promise<Skill | null> => {
  try {
    const docRef = doc(db, SKILLS_COLLECTION, skillId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as Skill;
    }
    return null;
  } catch (error: any) {
    console.error("❌ Error fetching skill:", error);
    throw error;
  }
};

export const updateSkill = async (
  skillId: string,
  skillData: Partial<Skill>
): Promise<void> => {
  try {
    const docRef = doc(db, SKILLS_COLLECTION, skillId);
    await updateDoc(docRef, {
      ...skillData,
      updatedAt: Timestamp.now(),
    });
    console.log("✅ Skill updated:", skillId);
  } catch (error: any) {
    console.error("❌ Error updating skill:", error);
    throw error;
  }
};

export const deleteSkill = async (skillId: string): Promise<void> => {
  try {
    const docRef = doc(db, SKILLS_COLLECTION, skillId);
    await deleteDoc(docRef);
    console.log("✅ Skill deleted:", skillId);
  } catch (error: any) {
    console.error("❌ Error deleting skill:", error);
    throw error;
  }
};

export const getSkillsByCategory = async (userId: string): Promise<Record<string, Skill[]>> => {
  try {
    const skills = await getSkills(userId);
    const grouped: Record<string, Skill[]> = {};
    
    skills.forEach((skill) => {
      if (!grouped[skill.category]) {
        grouped[skill.category] = [];
      }
      grouped[skill.category].push(skill);
    });
    
    return grouped;
  } catch (error: any) {
    console.error("❌ Error grouping skills:", error);
    throw error;
  }
};
