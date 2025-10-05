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
    const docRef = await addDoc(collection(db, PROJECTS_COLLECTION), {
      ...projectData,
      userId,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    console.log("✅ Project created:", docRef.id);
    return docRef.id;
  } catch (error: any) {
    console.error("❌ Error creating project:", error);
    throw error;
  }
};

export const getProjects = async (userId: string): Promise<Project[]> => {
  try {
    const q = query(
      collection(db, PROJECTS_COLLECTION),
      where("userId", "==", userId),
      orderBy("order", "asc")
    );
    const querySnapshot = await getDocs(q);
    const projects: Project[] = [];
    
    querySnapshot.forEach((doc) => {
      projects.push({
        id: doc.id,
        ...doc.data(),
      } as Project);
    });
    
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
