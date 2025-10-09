"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useState } from "react";
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
  Sparkles
} from "lucide-react";

interface HeroProfessionalProps {
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

export function HeroProfessional({ profile, latestPosition, stats }: HeroProfessionalProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Mouse tracking for tilt effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Rotation values with spring physics
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), {
    stiffness: 300,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), {
    stiffness: 300,
    damping: 30,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set((e.clientX - centerX) / rect.width);
    mouseY.set((e.clientY - centerY) / rect.height);
  };

  return (
    <section className="relative min-h-screen flex items-center py-20 overflow-hidden">
      {/* Subtle Grid Background */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
      
      {/* Gradient Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse delay-700" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* LEFT COLUMN - Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 space-y-6"
          >
            {/* Status Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2"
            >
              <Badge className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20 px-4 py-1.5">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2" />
                Available for opportunities
              </Badge>
            </motion.div>

            {/* Main Heading */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
                <span className="block text-foreground">Hi, I'm</span>
                <span className="block bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                  {profile.displayName}
                </span>
              </h1>
              
              {latestPosition && (
                <div className="flex items-center gap-3 text-2xl sm:text-3xl font-semibold text-muted-foreground">
                  <Briefcase className="w-6 h-6 text-primary" />
                  {latestPosition}
                </div>
              )}
            </motion.div>

            {/* Bio */}
            {profile.bio && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-lg text-muted-foreground leading-relaxed max-w-2xl"
              >
                {profile.bio}
              </motion.p>
            )}

            {/* Stats Row */}
            {stats && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap gap-6 py-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">
                      {stats.yearsExperience}+
                    </div>
                    <div className="text-sm text-muted-foreground">Years Exp</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">
                      {stats.projectsCompleted}+
                    </div>
                    <div className="text-sm text-muted-foreground">Projects</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Code2 className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">
                      {stats.technologiesCount}+
                    </div>
                    <div className="text-sm text-muted-foreground">Technologies</div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-4 pt-4"
            >
              <Link href="#projects">
                <Button size="lg" className="text-base px-8 group">
                  View My Work
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              {profile.email && (
                <Link href={`mailto:${profile.email}`}>
                  <Button size="lg" variant="outline" className="text-base px-8">
                    <Mail className="mr-2 h-5 w-5" />
                    Get in Touch
                  </Button>
                </Link>
              )}
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex items-center gap-4 pt-2"
            >
              {profile.location && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  {profile.location}
                </div>
              )}
              
              <div className="flex gap-3 ml-auto">
                {profile.github && (
                  <motion.a
                    href={profile.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 rounded-lg bg-muted hover:bg-primary/10 flex items-center justify-center transition-colors"
                  >
                    <Github className="w-5 h-5" />
                  </motion.a>
                )}
                {profile.linkedin && (
                  <motion.a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 rounded-lg bg-muted hover:bg-primary/10 flex items-center justify-center transition-colors"
                  >
                    <Linkedin className="w-5 h-5" />
                  </motion.a>
                )}
                {profile.email && (
                  <motion.a
                    href={`mailto:${profile.email}`}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 rounded-lg bg-muted hover:bg-primary/10 flex items-center justify-center transition-colors"
                  >
                    <Mail className="w-5 h-5" />
                  </motion.a>
                )}
              </div>
            </motion.div>
          </motion.div>

          {/* RIGHT COLUMN - Interactive Photo Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="lg:col-span-5 flex justify-center lg:justify-end"
          >
            <motion.div
              drag
              dragElastic={0.1}
              dragConstraints={{ left: -50, right: 50, top: -50, bottom: 50 }}
              whileHover={{ scale: 1.02 }}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => {
                setIsHovered(false);
                mouseX.set(0);
                mouseY.set(0);
              }}
              style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
              }}
              className="relative cursor-grab active:cursor-grabbing"
            >
              {/* Card Container */}
              <div className="relative w-80 h-96 sm:w-96 sm:h-[28rem]">
                {/* Glowing Background */}
                <motion.div
                  animate={{
                    opacity: isHovered ? 0.6 : 0.3,
                  }}
                  className="absolute -inset-4 bg-gradient-to-br from-primary/40 to-primary/10 rounded-3xl blur-2xl"
                />

                {/* Main Card */}
                <motion.div
                  className="relative h-full rounded-2xl overflow-hidden border-2 border-border bg-card shadow-2xl"
                  style={{
                    transform: "translateZ(20px)",
                  }}
                >
                  {/* Image */}
                  {profile.avatar ? (
                    <Image
                      src={profile.avatar}
                      alt={profile.displayName}
                      fill
                      className="object-cover"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      <span className="text-9xl font-bold text-primary/50">
                        {profile.displayName.charAt(0)}
                      </span>
                    </div>
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />

                  {/* Name Tag at Bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 backdrop-blur-sm bg-background/60">
                    <h3 className="text-2xl font-bold text-foreground">
                      {profile.displayName}
                    </h3>
                    {latestPosition && (
                      <p className="text-sm text-primary font-medium mt-1">
                        {latestPosition}
                      </p>
                    )}
                  </div>

                  {/* Drag Hint */}
                  <motion.div
                    initial={{ opacity: 1 }}
                    animate={{ opacity: isHovered ? 0 : 1 }}
                    className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-medium"
                  >
                    🖐️ Drag me!
                  </motion.div>
                </motion.div>

                {/* Corner Accent */}
                <div className="absolute -top-2 -right-2 w-20 h-20 bg-primary/20 rounded-full blur-xl" />
                <div className="absolute -bottom-2 -left-2 w-20 h-20 bg-primary/10 rounded-full blur-xl" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
