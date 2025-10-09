import { IconType } from "react-icons";
import {
  SiReact,
  SiNextdotjs,
  SiVuedotjs,
  SiAngular,
  SiJavascript,
  SiTypescript,
  SiHtml5,
  SiCss3,
  SiTailwindcss,
  SiNodedotjs,
  SiPython,
  SiPhp,
  SiGo,
  SiRust,
  SiMongodb,
  SiPostgresql,
  SiMysql,
  SiRedis,
  SiFirebase,
  SiDocker,
  SiKubernetes,
  SiGit,
  SiGithub,
  SiFigma,
  SiVercel,
  SiNetlify,
} from "react-icons/si";

import { Code2 } from "lucide-react";

// Simplified icon mapping with only verified icons
export const techIcons: Record<string, { icon: IconType; color: string }> = {
  // Frontend
  "React": { icon: SiReact, color: "#61DAFB" },
  "React.js": { icon: SiReact, color: "#61DAFB" },
  "ReactJS": { icon: SiReact, color: "#61DAFB" },
  "React Native": { icon: SiReact, color: "#61DAFB" },
  "Next.js": { icon: SiNextdotjs, color: "#000000" },
  "Next": { icon: SiNextdotjs, color: "#000000" },
  "NextJS": { icon: SiNextdotjs, color: "#000000" },
  "Vue": { icon: SiVuedotjs, color: "#4FC08D" },
  "Vue.js": { icon: SiVuedotjs, color: "#4FC08D" },
  "VueJS": { icon: SiVuedotjs, color: "#4FC08D" },
  "Angular": { icon: SiAngular, color: "#DD0031" },
  "JavaScript": { icon: SiJavascript, color: "#F7DF1E" },
  "JS": { icon: SiJavascript, color: "#F7DF1E" },
  "TypeScript": { icon: SiTypescript, color: "#3178C6" },
  "TS": { icon: SiTypescript, color: "#3178C6" },
  "HTML": { icon: SiHtml5, color: "#E34F26" },
  "HTML5": { icon: SiHtml5, color: "#E34F26" },
  "CSS": { icon: SiCss3, color: "#1572B6" },
  "CSS3": { icon: SiCss3, color: "#1572B6" },
  "Tailwind": { icon: SiTailwindcss, color: "#06B6D4" },
  "TailwindCSS": { icon: SiTailwindcss, color: "#06B6D4" },
  "Tailwind CSS": { icon: SiTailwindcss, color: "#06B6D4" },
  
  // Backend
  "Node": { icon: SiNodedotjs, color: "#339933" },
  "Node.js": { icon: SiNodedotjs, color: "#339933" },
  "NodeJS": { icon: SiNodedotjs, color: "#339933" },
  "Python": { icon: SiPython, color: "#3776AB" },
  "PHP": { icon: SiPhp, color: "#777BB4" },
  "Go": { icon: SiGo, color: "#00ADD8" },
  "Golang": { icon: SiGo, color: "#00ADD8" },
  "Rust": { icon: SiRust, color: "#000000" },
  
  // Database
  "MongoDB": { icon: SiMongodb, color: "#47A248" },
  "PostgreSQL": { icon: SiPostgresql, color: "#4169E1" },
  "Postgres": { icon: SiPostgresql, color: "#4169E1" },
  "MySQL": { icon: SiMysql, color: "#4479A1" },
  "Redis": { icon: SiRedis, color: "#DC382D" },
  "Firebase": { icon: SiFirebase, color: "#FFCA28" },
  
  // DevOps
  "Docker": { icon: SiDocker, color: "#2496ED" },
  "Kubernetes": { icon: SiKubernetes, color: "#326CE5" },
  "K8s": { icon: SiKubernetes, color: "#326CE5" },
  "Vercel": { icon: SiVercel, color: "#000000" },
  "Netlify": { icon: SiNetlify, color: "#00C7B7" },
  
  // Tools
  "Git": { icon: SiGit, color: "#F05032" },
  "GitHub": { icon: SiGithub, color: "#181717" },
  
  // Design
  "Figma": { icon: SiFigma, color: "#F24E1E" },
};

// Fallback icon for unknown technologies
export const getFallbackIcon = () => Code2;

// Get icon and color for a technology
export function getTechIcon(techName: string): { icon: IconType; color: string } {
  const techData = techIcons[techName];
  if (techData) return techData;
  
  // Try case-insensitive match
  const techDataCaseInsensitive = Object.entries(techIcons).find(
    ([key]) => key.toLowerCase() === techName.toLowerCase()
  );
  
  if (techDataCaseInsensitive) return techDataCaseInsensitive[1];
  
  // Return fallback
  return { icon: getFallbackIcon(), color: "#888888" };
}
