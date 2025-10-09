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
  
  console.log('🏠 [Portfolio Home] Fetching data for userId:', userId);
  
  let userProfile: any = null;
  let projects: any[] = [];
  let skills: any[] = [];
  let experiences: any[] = [];
  let blogPosts: any[] = [];
  
  try {
    [userProfile, projects, skills, experiences, blogPosts] = await Promise.all([
      getPublicUserProfile(userId),
      getPublicProjects(userId, true),
      getPublicSkills(userId),
      getPublicExperiences(userId),
      getPublicBlogPosts(userId, false, 3),
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

  // Create default profile if none exists
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

      <div className="relative min-h-screen bg-background">
      {/* Setup Notice Banner */}
      {!userProfile && (
        <div className="bg-primary/10 border-b border-primary/20 py-3 px-4 text-center">
          <p className="text-sm">
            👋 Setup your profile to personalize this portfolio.{' '}
            <Link href="/dashboard" className="underline font-semibold hover:text-primary">
              Go to Dashboard
            </Link>
          </p>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
        <div className="absolute inset-0 bg-grid-white/[0.02]" />
        
        <div className="relative z-10 max-w-6xl mx-auto w-full py-20">
          <div className="text-center space-y-6">
            {/* Greeting */}
            <div className="inline-block">
              <span className="text-lg md:text-xl text-muted-foreground">
                👋 Hi, I&apos;m
              </span>
            </div>

            {/* Name */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                {profile.displayName}
              </span>
            </h1>

            {/* Title/Position */}
            {latestExperience && (
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-primary">
                I&apos;m a {latestExperience.position}
              </h2>
            )}

            {/* Bio */}
            {profile.bio && (
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                {profile.bio}
              </p>
            )}

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <Link href="#projects">
                <Button size="lg" className="min-w-[160px]">
                  View My Work
                </Button>
              </Link>
              {profile.email && (
                <Link href={`mailto:${profile.email}`}>
                  <Button size="lg" variant="outline" className="min-w-[160px]">
                    <Download className="mr-2 h-4 w-4" />
                    Download CV
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-muted-foreground/20 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-muted-foreground/40 rounded-full mt-2" />
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      {skills.length > 0 && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
              {skills.slice(0, 12).map((skill: any) => (
                <div
                  key={skill.id}
                  className="group relative px-6 py-3 bg-background rounded-full border border-border hover:border-primary transition-all duration-300 hover:shadow-lg"
                >
                  <span className="text-sm md:text-base font-medium">
                    {skill.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* About Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">
            About Me
          </h2>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Bio */}
            <div className="space-y-6">
              {profile.bio && (
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {profile.bio}
                </p>
              )}
              {latestExperience && (
                <p className="text-muted-foreground">
                  Currently working as <span className="text-foreground font-semibold">{latestExperience.position}</span>
                  {latestExperience.company && (
                    <> at <span className="text-foreground font-semibold">{latestExperience.company}</span></>
                  )}
                </p>
              )}
            </div>

            {/* Profile Card */}
            <Card className="border-2">
              <CardContent className="p-6 space-y-6">
                {/* Avatar & Name */}
                <div className="flex items-center gap-4">
                  {profile.avatar && (
                    <div className="relative w-20 h-20 rounded-full overflow-hidden ring-4 ring-primary/10">
                      <Image
                        src={profile.avatar}
                        alt={profile.displayName}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <h3 className="text-2xl font-bold">{profile.displayName}</h3>
                    {latestExperience && (
                      <p className="text-muted-foreground">{latestExperience.position}</p>
                    )}
                  </div>
                </div>

                {/* Info */}
                <div className="space-y-3">
                  {profile.location && (
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <MapPin className="h-5 w-5" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                  {experiences.length > 0 && (
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Briefcase className="h-5 w-5" />
                      <span>{experiences.length}+ Years</span>
                    </div>
                  )}
                  {profile.email && (
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Mail className="h-5 w-5" />
                      <span className="text-sm break-all">{profile.email}</span>
                    </div>
                  )}
                </div>

                {/* Download CV Button */}
                {profile.email && (
                  <Link href={`mailto:${profile.email}`}>
                    <Button className="w-full">
                      <Download className="mr-2 h-4 w-4" />
                      Download CV
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Experience & Education */}
      {experiences.length > 0 && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">
              💼 Experience
            </h2>

            <div className="space-y-8">
              {experiences.slice(0, 4).map((exp) => (
                <Card key={exp.id} className="border-l-4 border-l-primary">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                      <div>
                        <h3 className="text-xl font-bold">{exp.position}</h3>
                        <p className="text-lg text-primary font-semibold">{exp.company}</p>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {exp.startDate && format(new Date(exp.startDate), 'MMM yyyy')} - 
                          {exp.current ? ' Present' : exp.endDate ? ` ${format(new Date(exp.endDate), 'MMM yyyy')}` : ' Present'}
                        </span>
                      </div>
                    </div>
                    
                    {exp.description && (
                      <p className="text-muted-foreground mb-4">{exp.description}</p>
                    )}

                    {exp.location && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                        <MapPin className="h-4 w-4" />
                        <span>{exp.location}</span>
                      </div>
                    )}

                    {exp.skills && exp.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {exp.skills.map((skill: any) => (
                          <Badge key={skill} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {experiences.length > 4 && (
              <div className="text-center mt-12">
                <Link href="/experience">
                  <Button variant="outline" size="lg">
                    View All Experience
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                Featured Projects
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Here are some of my recent projects that showcase my skills in web development and design.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProjects.map((project) => (
                <Card key={project.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className="relative aspect-video overflow-hidden bg-muted">
                    {project.thumbnail ? (
                      <Image
                        src={project.thumbnail}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-gradient-to-br from-primary/20 to-primary/5">
                        <Code2 className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                    {project.featured && (
                      <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">
                        Featured
                      </div>
                    )}
                  </div>

                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.slice(0, 3).map((tech: any) => (
                        <Badge key={tech} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                      {project.technologies.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{project.technologies.length - 3}
                        </Badge>
                      )}
                    </div>

                    <div className="flex gap-2">
                      {project.liveUrl && (
                        <Button size="sm" variant="outline" asChild className="flex-1">
                          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Live
                          </a>
                        </Button>
                      )}
                      {project.githubUrl && (
                        <Button size="sm" variant="outline" asChild className="flex-1">
                          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                            <Github className="h-4 w-4 mr-2" />
                            Code
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/projects">
                <Button size="lg" variant="outline">
                  View All Projects ({projects.length})
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Let&apos;s Connect
          </h2>
          <p className="text-lg text-muted-foreground mb-12">
            Ready to bring your ideas to life? I&apos;m always open to discussing new opportunities and collaborations.
          </p>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {profile.email && (
              <a
                href={`mailto:${profile.email}`}
                className="group p-6 bg-background rounded-lg border border-border hover:border-primary transition-all duration-300 hover:shadow-lg"
              >
                <Mail className="h-8 w-8 mx-auto mb-3 text-primary" />
                <p className="font-semibold mb-1">Email</p>
                <p className="text-sm text-muted-foreground break-all">{profile.email.split('@')[0]}</p>
              </a>
            )}
            {profile.linkedin && (
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-6 bg-background rounded-lg border border-border hover:border-primary transition-all duration-300 hover:shadow-lg"
              >
                <Linkedin className="h-8 w-8 mx-auto mb-3 text-primary" />
                <p className="font-semibold mb-1">LinkedIn</p>
                <p className="text-sm text-muted-foreground">Connect</p>
              </a>
            )}
            {profile.github && (
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-6 bg-background rounded-lg border border-border hover:border-primary transition-all duration-300 hover:shadow-lg"
              >
                <Github className="h-8 w-8 mx-auto mb-3 text-primary" />
                <p className="font-semibold mb-1">GitHub</p>
                <p className="text-sm text-muted-foreground">Follow</p>
              </a>
            )}
            {profile.twitter && (
              <a
                href={profile.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-6 bg-background rounded-lg border border-border hover:border-primary transition-all duration-300 hover:shadow-lg"
              >
                <Twitter className="h-8 w-8 mx-auto mb-3 text-primary" />
                <p className="font-semibold mb-1">Twitter</p>
                <p className="text-sm text-muted-foreground">Follow</p>
              </a>
            )}
          </div>

          <p className="mt-12 text-muted-foreground">
            Available for freelance work or full-time positions
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
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
  );
}
