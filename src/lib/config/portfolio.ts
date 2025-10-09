/**
 * Portfolio Configuration
 * Single-user portfolio settings
 */

// The owner's user ID - get this from Firebase Auth
// You can get this by logging in and checking the user.uid
export const PORTFOLIO_OWNER_ID = process.env.NEXT_PUBLIC_PORTFOLIO_OWNER_ID || "oHJIQRMOzHdC0TM7lXS0EYbsVQD3";

// Portfolio metadata
export const PORTFOLIO_CONFIG = {
  // Owner ID
  ownerId: PORTFOLIO_OWNER_ID,
  
  // Site metadata (can be overridden by user profile from Firebase)
  siteName: "My Portfolio",
  siteDescription: "Welcome to my portfolio website",
  
  // Social links (fallback if not set in Firebase)
  defaultSocial: {
    github: "",
    linkedin: "",
    twitter: "",
    website: "",
  },
} as const;
