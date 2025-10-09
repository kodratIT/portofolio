import Link from "next/link";
import {
  getPublicUserProfile,
  getPublicProjects,
  getPublicSkills,
  getPublicExperiences,
  getPublicBlogPosts,
} from "@/lib/firebase/public";
import { PORTFOLIO_CONFIG } from "@/lib/config/portfolio";
import { Button } from "@/components/ui/button";
import { BackgroundEffects } from "@/components/portfolio/background-effects";
import { HeroSection } from "@/components/portfolio/hero-section";
import { TechStackFloat } from "@/components/portfolio/tech-stack-float";
import { SkillsVisual } from "@/components/portfolio/skills-visual";
import { ProjectsBento } from "@/components/portfolio/projects-bento";
import { ExperienceTimeline } from "@/components/portfolio/experience-timeline";
import { ContactSection } from "@/components/portfolio/contact-section";

export default async function Home() {
  const userId = PORTFOLIO_CONFIG.ownerId;
  
  console.log('🏠 [Portfolio Home] Fetching data...');
  
  let userProfile: any = null;
  let projects: any[] = [];
  let skills: any[] = [];
  let experiences: any[] = [];
  let blogPosts: any[] = [];
  
  try {
    [userProfile, projects, skills, experiences, blogPosts] = await Promise.all([
      getPublicUserProfile(userId),
      getPublicProjects(),
      getPublicSkills(),
      getPublicExperiences(),
      getPublicBlogPosts(undefined, false, 3),
    ]);
    
    console.log('📊 [Portfolio Home] Data fetched:', {
      hasProfile: !!userProfile,
      projectsCount: projects.length,
      skillsCount: skills.length,
      experiencesCount: experiences.length,
      postsCount: blogPosts.length,
    });
  } catch (error) {
    console.error('❌ [Portfolio Home] Error fetching data:', error);
    userProfile = null;
    projects = [];
    skills = [];
    experiences = [];
    blogPosts = [];
  }

  const defaultProfile = {
    displayName: 'Your Name',
    bio: 'Welcome to my portfolio. I am a passionate developer building amazing things.',
    email: '',
    location: '',
    avatar: '',
    github: '',
    linkedin: '',
    twitter: '',
    website: '',
  };

  const profile = userProfile || defaultProfile;
  const latestExperience = experiences[0];

  return (
    <>
      {/* Background Effects */}
      <BackgroundEffects />

      <div className="relative min-h-screen">
        {/* Setup Notice Banner */}
        {!userProfile && (
          <div className="bg-primary/10 border-b border-primary/20 py-3 px-4 text-center relative z-20">
            <p className="text-sm">
              👋 Setup your profile to personalize this portfolio.{' '}
              <Link href="/dashboard" className="underline font-semibold hover:text-primary">
                Go to Dashboard
              </Link>
            </p>
          </div>
        )}

        {/* Hero Section */}
        <HeroSection 
          profile={profile} 
          latestPosition={latestExperience?.position}
        />

        {/* Tech Stack Float */}
        {skills.length > 0 && (
          <TechStackFloat skills={skills} />
        )}

        {/* Skills Visual */}
        {skills.length > 0 && (
          <SkillsVisual skills={skills} />
        )}

        {/* Experience Timeline */}
        {experiences.length > 0 && (
          <ExperienceTimeline experiences={experiences} />
        )}

        {/* Featured Projects */}
        {projects.length > 0 && (
          <ProjectsBento projects={projects} />
        )}

        {/* Contact Section */}
        <ContactSection profile={profile} />

        {/* Footer */}
        <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t relative z-10 bg-background">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} {profile.displayName}. All rights reserved.
            </p>
            <div className="flex gap-4">
              <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Dashboard
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
