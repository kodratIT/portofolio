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
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
}

export interface Skill {
  id?: string;
  userId: string;
  name: string;
  category: string;
  level: number;
  icon?: string;
  order: number;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
}

export interface Experience {
  id?: string;
  userId: string;
  company: string;
  position: string;
  description: string;
  startDate: Timestamp | Date;
  endDate?: Timestamp | Date;
  current: boolean;
  location: string;
  technologies: string[];
  order: number;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
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
