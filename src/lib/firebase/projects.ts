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
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "./config";
import { Project } from "@/lib/types";

const PROJECTS_COLLECTION = "projects";

export const createProject = async (
  userId: string,
  projectData: Omit<Project, "id" | "userId" | "createdAt" | "updatedAt">
): Promise<string> => {
  try {
    console.log("🔄 Creating project with data:", { userId, projectData });
    
    const dataToSave = {
      ...projectData,
      userId,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
    
    console.log("📝 Data to save:", dataToSave);
    
    const docRef = await addDoc(collection(db, PROJECTS_COLLECTION), dataToSave);
    
    console.log("✅ Project created successfully:", docRef.id);
    return docRef.id;
  } catch (error: any) {
    console.error("❌ Error creating project:", error);
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);
    
    if (error.code === "permission-denied") {
      throw new Error("FIRESTORE_PERMISSION_DENIED: Cannot create project. Please check Firestore rules.");
    } else if (error.code === "unavailable") {
      throw new Error("FIRESTORE_UNAVAILABLE: Firestore is not available. Please check your connection.");
    } else if (error.message?.includes("Missing or insufficient permissions")) {
      throw new Error("FIRESTORE_PERMISSION: Missing permissions to create project. Enable Firestore rules.");
    }
    
    throw error;
  }
};

export const getProjects = async (userId: string): Promise<Project[]> => {
  try {
    // Temporarily remove orderBy to avoid index requirement
    // TODO: Create Firestore index and re-enable orderBy
    // Index URL: https://console.firebase.google.com/v1/r/project/portofolio-ecd0d/firestore/indexes?create_composite=ClFwcm9qZWN0cy9wb3J0b2ZvbGlvLWVjZDBkL2RhdGFiYXNlcy8oZGVmYXVsdCkvY29sbGVjdGlvbkdyb3Vwcy9wcm9qZWN0cy9pbmRleGVzL18QARoKCgZ1c2VySWQQARoJCgVvcmRlchABGgwKCF9fbmFtZV9fEAE
    const q = query(
      collection(db, PROJECTS_COLLECTION),
      where("userId", "==", userId)
      // orderBy("order", "asc") // Disabled until index is created
    );
    const querySnapshot = await getDocs(q);
    const projects: Project[] = [];
    
    querySnapshot.forEach((doc) => {
      projects.push({
        id: doc.id,
        ...doc.data(),
      } as Project);
    });
    
    // Sort in-memory by order field (temporary until Firestore index is created)
    projects.sort((a, b) => a.order - b.order);
    
    console.log(`✅ Fetched ${projects.length} projects`);
    return projects;
  } catch (error: any) {
    console.error("❌ Error fetching projects:", error);
    throw error;
  }
};

export const getProject = async (projectId: string): Promise<Project | null> => {
  try {
    const docRef = doc(db, PROJECTS_COLLECTION, projectId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as Project;
    }
    return null;
  } catch (error: any) {
    console.error("❌ Error fetching project:", error);
    throw error;
  }
};

export const updateProject = async (
  projectId: string,
  projectData: Partial<Project>
): Promise<void> => {
  try {
    const docRef = doc(db, PROJECTS_COLLECTION, projectId);
    await updateDoc(docRef, {
      ...projectData,
      updatedAt: Timestamp.now(),
    });
    console.log("✅ Project updated:", projectId);
  } catch (error: any) {
    console.error("❌ Error updating project:", error);
    throw error;
  }
};

export const deleteProject = async (projectId: string): Promise<void> => {
  try {
    const docRef = doc(db, PROJECTS_COLLECTION, projectId);
    await deleteDoc(docRef);
    console.log("✅ Project deleted:", projectId);
  } catch (error: any) {
    console.error("❌ Error deleting project:", error);
    throw error;
  }
};

export const toggleFeatured = async (
  projectId: string,
  featured: boolean
): Promise<void> => {
  try {
    const docRef = doc(db, PROJECTS_COLLECTION, projectId);
    await updateDoc(docRef, {
      featured,
      updatedAt: Timestamp.now(),
    });
    console.log("✅ Project featured status updated:", projectId);
  } catch (error: any) {
    console.error("❌ Error updating featured status:", error);
    throw error;
  }
};
