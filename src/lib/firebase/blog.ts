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
import { BlogPost } from "@/lib/types";

const BLOG_COLLECTION = "blog";

export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .trim();
};

export const createBlogPost = async (
  userId: string,
  blogData: Omit<BlogPost, "id" | "userId" | "createdAt" | "updatedAt">
): Promise<string> => {
  try {
    console.log("🔄 Creating blog post with data:", { userId, blogData });
    
    const dataToSave = {
      ...blogData,
      userId,
      slug: blogData.slug || generateSlug(blogData.title),
      publishedAt: blogData.published ? Timestamp.now() : null,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
    
    const docRef = await addDoc(collection(db, BLOG_COLLECTION), dataToSave);
    
    console.log("✅ Blog post created successfully:", docRef.id);
    return docRef.id;
  } catch (error: any) {
    console.error("❌ Error creating blog post:", error);
    throw error;
  }
};

export const getBlogPosts = async (userId: string): Promise<BlogPost[]> => {
  try {
    const q = query(
      collection(db, BLOG_COLLECTION),
      where("userId", "==", userId)
    );
    const querySnapshot = await getDocs(q);
    const posts: BlogPost[] = [];
    
    querySnapshot.forEach((doc) => {
      posts.push({
        id: doc.id,
        ...doc.data(),
      } as BlogPost);
    });
    
    // Sort: Published first, then by created date (newest first)
    posts.sort((a, b) => {
      // Featured posts first
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      
      // Then by created date
      const aDate = a.createdAt?.toMillis() || 0;
      const bDate = b.createdAt?.toMillis() || 0;
      return bDate - aDate;
    });
    
    console.log(`✅ Fetched ${posts.length} blog posts`);
    return posts;
  } catch (error: any) {
    console.error("❌ Error fetching blog posts:", error);
    throw error;
  }
};

export const getBlogPost = async (postId: string): Promise<BlogPost | null> => {
  try {
    const docRef = doc(db, BLOG_COLLECTION, postId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as BlogPost;
    }
    return null;
  } catch (error: any) {
    console.error("❌ Error fetching blog post:", error);
    throw error;
  }
};

export const updateBlogPost = async (
  postId: string,
  blogData: Partial<BlogPost>
): Promise<void> => {
  try {
    const docRef = doc(db, BLOG_COLLECTION, postId);
    
    const updateData: any = {
      ...blogData,
      updatedAt: Timestamp.now(),
    };
    
    // Update publishedAt when publishing
    if (blogData.published !== undefined) {
      if (blogData.published) {
        // Get current post to check if it was already published
        const currentPost = await getDoc(docRef);
        if (currentPost.exists() && !currentPost.data().published) {
          updateData.publishedAt = Timestamp.now();
        }
      } else {
        updateData.publishedAt = null;
      }
    }
    
    await updateDoc(docRef, updateData);
    console.log("✅ Blog post updated:", postId);
  } catch (error: any) {
    console.error("❌ Error updating blog post:", error);
    throw error;
  }
};

export const deleteBlogPost = async (postId: string): Promise<void> => {
  try {
    const docRef = doc(db, BLOG_COLLECTION, postId);
    await deleteDoc(docRef);
    console.log("✅ Blog post deleted:", postId);
  } catch (error: any) {
    console.error("❌ Error deleting blog post:", error);
    throw error;
  }
};

export const togglePublished = async (postId: string, published: boolean): Promise<void> => {
  try {
    await updateBlogPost(postId, { published });
    console.log(`✅ Blog post ${published ? 'published' : 'unpublished'}:`, postId);
  } catch (error: any) {
    console.error("❌ Error toggling published status:", error);
    throw error;
  }
};

export const toggleFeatured = async (postId: string, featured: boolean): Promise<void> => {
  try {
    await updateBlogPost(postId, { featured });
    console.log(`✅ Blog post ${featured ? 'featured' : 'unfeatured'}:`, postId);
  } catch (error: any) {
    console.error("❌ Error toggling featured status:", error);
    throw error;
  }
};
