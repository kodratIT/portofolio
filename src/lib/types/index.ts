import { Timestamp } from "firebase/firestore";

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
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
}

export interface Project {
  id?: string;
  userId: string;
  title: string;
  description: string;
  longDescription: string;
  images: string[];
  thumbnail: string;
  technologies: string[];
  category: string;
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  order: number;
  createdAt: Timestamp | Date | string;
  updatedAt: Timestamp | Date | string;
}

export interface Skill {
  id?: string;
  userId: string;
  name: string;
  category: string;
  level: number;
  icon?: string;
  order: number;
  createdAt: Timestamp | Date | string;
  updatedAt: Timestamp | Date | string;
}

export interface Experience {
  id?: string;
  userId: string;
  company: string;
  position: string;
  description: string;
  responsibilities: string[];
  companyLogo?: string;
  startDate?: Timestamp | string;
  endDate?: Timestamp | string;
  current: boolean;
  location?: string;
  order: number;
  createdAt?: Timestamp | string;
  updatedAt?: Timestamp | string;
}

export type SkillCategory =
  | "Frontend"
  | "Backend"
  | "DevOps"
  | "Database"
  | "Tools"
  | "Other";

export type ProjectCategory =
  | "Web Application"
  | "Mobile Application"
  | "Desktop Application"
  | "API/Backend"
  | "Library/Package"
  | "Other";

export type BlogCategory = "Technology" | "Tutorial" | "Personal" | "Review" | "News" | "Other";

export interface BlogPost {
  id?: string;
  userId: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  category: BlogCategory;
  tags: string[];
  published: boolean;
  publishedAt?: Timestamp | string;
  featured: boolean;
  viewCount: number;
  order: number;
  createdAt?: Timestamp | string;
  updatedAt?: Timestamp | string;
}
