import {
  collection,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "./config";
import { UserProfile, Project, Skill, Experience, BlogPost } from "@/lib/types";

export const getPublicUserProfile = async (
  userId: string
): Promise<UserProfile | null> => {
  try {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        uid: docSnap.id,
        ...docSnap.data(),
      } as UserProfile;
    }
    return null;
  } catch (error) {
    console.error("Error fetching public user profile:", error);
    throw error;
  }
};

export const getPublicProjects = async (
  userId?: string,
  featuredOnly = false
): Promise<Project[]> => {
  try {
    let q = query(collection(db, "projects"));

    if (featuredOnly) {
      q = query(q, where("featured", "==", true));
    }

    const querySnapshot = await getDocs(q);
    const projects: Project[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      projects.push({
        id: doc.id,
        ...data,
        // Convert Timestamps to ISO strings
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : data.updatedAt,
      } as Project);
    });

    projects.sort((a, b) => a.order - b.order);
    return projects;
  } catch (error) {
    console.error("Error fetching public projects:", error);
    throw error;
  }
};

export const getPublicProject = async (
  projectId: string
): Promise<Project | null> => {
  try {
    const docRef = doc(db, "projects", projectId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as Project;
    }
    return null;
  } catch (error) {
    console.error("Error fetching public project:", error);
    throw error;
  }
};

export const getPublicSkills = async (userId?: string): Promise<Skill[]> => {
  try {
    const q = query(collection(db, "skills"));

    const querySnapshot = await getDocs(q);
    const skills: Skill[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      skills.push({
        id: doc.id,
        ...data,
        // Convert Timestamps to ISO strings
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : data.updatedAt,
      } as Skill);
    });

    skills.sort((a, b) => a.order - b.order);
    return skills;
  } catch (error) {
    console.error("Error fetching public skills:", error);
    throw error;
  }
};

export const getPublicExperiences = async (
  userId?: string
): Promise<Experience[]> => {
  try {
    const q = query(collection(db, "experiences"));

    const querySnapshot = await getDocs(q);
    const experiences: Experience[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      experiences.push({
        id: doc.id,
        ...data,
        // Convert Timestamps to ISO strings
        startDate: data.startDate?.toDate ? data.startDate.toDate().toISOString() : data.startDate,
        endDate: data.endDate?.toDate ? data.endDate.toDate().toISOString() : data.endDate,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : data.updatedAt,
      } as Experience);
    });

    experiences.sort((a, b) => a.order - b.order);
    return experiences;
  } catch (error) {
    console.error("Error fetching public experiences:", error);
    throw error;
  }
};

export const getPublicBlogPosts = async (
  userId?: string,
  featuredOnly = false,
  limitCount?: number
): Promise<BlogPost[]> => {
  try {
    let q = query(
      collection(db, "blog"),
      where("published", "==", true)
    );

    if (featuredOnly) {
      q = query(q, where("featured", "==", true));
    }

    if (limitCount) {
      q = query(q, limit(limitCount));
    }

    const querySnapshot = await getDocs(q);
    const posts: BlogPost[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      posts.push({
        id: doc.id,
        ...data,
        // Convert Timestamps to ISO strings
        publishedAt: data.publishedAt?.toDate ? data.publishedAt.toDate().toISOString() : data.publishedAt,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : data.updatedAt,
      } as BlogPost);
    });

    posts.sort((a, b) => {
      const dateA = a.publishedAt ? new Date(a.publishedAt as string).getTime() : 0;
      const dateB = b.publishedAt ? new Date(b.publishedAt as string).getTime() : 0;
      return dateB - dateA;
    });

    return posts;
  } catch (error) {
    console.error("Error fetching public blog posts:", error);
    throw error;
  }
};

export const getPublicBlogPost = async (
  slug: string
): Promise<BlogPost | null> => {
  try {
    const q = query(
      collection(db, "blog"),
      where("slug", "==", slug),
      where("published", "==", true),
      limit(1)
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        // Convert Timestamps to ISO strings
        publishedAt: data.publishedAt?.toDate ? data.publishedAt.toDate().toISOString() : data.publishedAt,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : data.updatedAt,
      } as BlogPost;
    }

    return null;
  } catch (error) {
    console.error("Error fetching public blog post:", error);
    throw error;
  }
};

export const getPublicBlogPostsByCategory = async (
  userId?: string,
  category?: string
): Promise<BlogPost[]> => {
  try {
    let q = query(
      collection(db, "blog"),
      where("published", "==", true)
    );

    if (category) {
      q = query(q, where("category", "==", category));
    }

    const querySnapshot = await getDocs(q);
    const posts: BlogPost[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      posts.push({
        id: doc.id,
        ...data,
        // Convert Timestamps to ISO strings
        publishedAt: data.publishedAt?.toDate ? data.publishedAt.toDate().toISOString() : data.publishedAt,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : data.updatedAt,
      } as BlogPost);
    });

    posts.sort((a, b) => {
      const dateA = a.publishedAt ? new Date(a.publishedAt as string).getTime() : 0;
      const dateB = b.publishedAt ? new Date(b.publishedAt as string).getTime() : 0;
      return dateB - dateA;
    });

    return posts;
  } catch (error) {
    console.error("Error fetching blog posts by category:", error);
    throw error;
  }
};
