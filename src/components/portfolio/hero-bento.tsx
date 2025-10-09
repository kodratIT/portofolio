"use client";

import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  Github, 
  Linkedin, 
  Mail, 
  MapPin, 
  Briefcase,
  Code2,
  Sparkles,
  Download,
  Calendar,
  Award
} from "lucide-react";

interface HeroBentoProps {
  profile: {
    displayName: string;
    bio?: string;
    avatar?: string;
    email?: string;
    github?: string;
    linkedin?: string;
    location?: string;
  };
  latestPosition?: string;
  stats?: {
    yearsExperience?: number;
    projectsCompleted?: number;
    technologiesCount?: number;
  };
}

// Animated Counter Component
function AnimatedCounter({ end, duration = 2 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [end, duration]);

  return <span>{count}</span>;
}

export function HeroBento({ profile, latestPosition, stats }: HeroBentoProps) {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const cardVariants = {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    hover: { scale: 1.02, y: -4 },
  };

  return (
    <section className="relative min-h-screen flex items-center py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
      <div className="absolute inset-0 bg-grid-white/[0.02]" />
      
      {/* Floating Gradient Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        {/* Bento Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[minmax(120px,auto)]">
          
          {/* CARD 1: Large Photo - Spans 2x3 */}
          <motion.div
            variants={cardVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            transition={{ duration: 0.4, delay: 0.1 }}
            onMouseEnter={() => setHoveredCard('photo')}
            onMouseLeave={() => setHoveredCard(null)}
            className="md:col-span-1 lg:col-span-2 md:row-span-3 relative group overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-border hover:border-primary/50 transition-colors"
          >
            {/* Photo Background */}
            <div className="absolute inset-0">
              {profile.avatar ? (
                <Image
                  src={profile.avatar}
                  alt={profile.displayName}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <span className="text-9xl font-bold text-primary/50">
                    {profile.displayName.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent opacity-90 group-hover:opacity-95 transition-opacity" />

            {/* Content Overlay */}
            <div className="relative h-full p-6 sm:p-8 flex flex-col justify-end">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Badge className="mb-4 bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2" />
                  Available for Work
                </Badge>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-2 text-foreground">
                  {profile.displayName}
                </h1>
                
                {latestPosition && (
                  <div className="flex items-center gap-2 text-xl text-primary font-semibold">
                    <Briefcase className="w-5 h-5" />
                    {latestPosition}
                  </div>
                )}

                {profile.location && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                    <MapPin className="w-4 h-4" />
                    {profile.location}
                  </div>
                )}
              </motion.div>
            </div>

            {/* Hover Shine Effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </div>
          </motion.div>

          {/* CARD 2: Years Experience - Small Square */}
          <motion.div
            variants={cardVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            transition={{ duration: 0.4, delay: 0.2 }}
            className="md:col-span-1 md:row-span-1 relative group overflow-hidden rounded-3xl bg-card border-2 border-border hover:border-primary/50 transition-all p-6"
          >
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Calendar className="w-7 h-7 text-primary" />
              </div>
              <div className="text-4xl font-bold text-primary mb-1">
                {stats?.yearsExperience && <AnimatedCounter end={stats.yearsExperience} />}+
              </div>
              <div className="text-sm text-muted-foreground font-medium">Years Experience</div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.div>

          {/* CARD 3: Projects Count - Small Square */}
          <motion.div
            variants={cardVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            transition={{ duration: 0.4, delay: 0.25 }}
            className="md:col-span-1 md:row-span-1 relative group overflow-hidden rounded-3xl bg-card border-2 border-border hover:border-primary/50 transition-all p-6"
          >
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Sparkles className="w-7 h-7 text-primary" />
              </div>
              <div className="text-4xl font-bold text-primary mb-1">
                {stats?.projectsCompleted && <AnimatedCounter end={stats.projectsCompleted} />}+
              </div>
              <div className="text-sm text-muted-foreground font-medium">Projects Done</div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.div>

          {/* CARD 4: Technologies - Small Square */}
          <motion.div
            variants={cardVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            transition={{ duration: 0.4, delay: 0.3 }}
            className="md:col-span-1 md:row-span-1 relative group overflow-hidden rounded-3xl bg-card border-2 border-border hover:border-primary/50 transition-all p-6"
          >
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Code2 className="w-7 h-7 text-primary" />
              </div>
              <div className="text-4xl font-bold text-primary mb-1">
                {stats?.technologiesCount && <AnimatedCounter end={stats.technologiesCount} />}+
              </div>
              <div className="text-sm text-muted-foreground font-medium">Technologies</div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.div>

          {/* CARD 5: CTA Button - Small Square */}
          <motion.div
            variants={cardVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            transition={{ duration: 0.4, delay: 0.35 }}
            className="md:col-span-1 md:row-span-1 relative group overflow-hidden rounded-3xl bg-primary/10 border-2 border-primary/30 hover:border-primary transition-all p-6"
          >
            <Link href="#projects" className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform inline-block">
                  View Work
                </div>
                <ArrowRight className="w-6 h-6 text-primary mx-auto group-hover:translate-x-2 transition-transform" />
              </div>
            </Link>
          </motion.div>

          {/* CARD 6: Bio Text - Wide Rectangle */}
          <motion.div
            variants={cardVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            transition={{ duration: 0.4, delay: 0.4 }}
            className="md:col-span-2 md:row-span-2 relative group overflow-hidden rounded-3xl bg-card border-2 border-border hover:border-primary/50 transition-all p-6 sm:p-8"
          >
            <div className="h-full flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Award className="w-6 h-6 text-primary" />
                  About Me
                </h3>
                {profile.bio && (
                  <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                    {profile.bio}
                  </p>
                )}
              </div>

              {/* Social Links */}
              <div className="flex flex-wrap gap-3">
                {profile.github && (
                  <motion.a
                    href={profile.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted hover:bg-primary/10 transition-colors"
                  >
                    <Github className="w-5 h-5" />
                    <span className="text-sm font-medium">GitHub</span>
                  </motion.a>
                )}
                {profile.linkedin && (
                  <motion.a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted hover:bg-primary/10 transition-colors"
                  >
                    <Linkedin className="w-5 h-5" />
                    <span className="text-sm font-medium">LinkedIn</span>
                  </motion.a>
                )}
                {profile.email && (
                  <motion.a
                    href={`mailto:${profile.email}`}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted hover:bg-primary/10 transition-colors"
                  >
                    <Mail className="w-5 h-5" />
                    <span className="text-sm font-medium">Email</span>
                  </motion.a>
                )}
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </motion.div>

          {/* CARD 7: Contact CTA - Wide Rectangle */}
          <motion.div
            variants={cardVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            transition={{ duration: 0.4, delay: 0.45 }}
            className="md:col-span-2 lg:col-span-2 md:row-span-1 relative group overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary/80 border-2 border-primary hover:shadow-2xl hover:shadow-primary/20 transition-all p-6"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 h-full">
              <div className="text-center sm:text-left">
                <h3 className="text-2xl font-bold text-primary-foreground mb-2">
                  Let's Work Together
                </h3>
                <p className="text-primary-foreground/80">
                  Ready to bring your ideas to life?
                </p>
              </div>
              
              <div className="flex gap-3">
                {profile.email && (
                  <Link href={`mailto:${profile.email}`}>
                    <Button 
                      size="lg" 
                      variant="secondary"
                      className="group/btn"
                    >
                      <Mail className="mr-2 h-5 w-5 group-hover/btn:rotate-12 transition-transform" />
                      Contact Me
                    </Button>
                  </Link>
                )}
                <Button 
                  size="lg" 
                  variant="outline"
                  className="bg-white/10 border-white/20 text-primary-foreground hover:bg-white/20"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download CV
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
