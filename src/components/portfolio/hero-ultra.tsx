"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useState, useEffect } from "react";
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
  Zap,
  Award,
  Star,
  TrendingUp
} from "lucide-react";

interface HeroUltraProps {
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

// Animated Counter with smooth count-up
function AnimatedCounter({ end, duration = 2, suffix = "" }: { end: number; duration?: number; suffix?: string }) {
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

  return <span>{count}{suffix}</span>;
}

// Floating skill bubble
function FloatingSkillBubble({ skill, delay, x, y }: { skill: string; delay: number; x: string; y: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5 }}
      className="absolute"
      style={{ left: x, top: y }}
    >
      <motion.div
        animate={{ 
          y: [0, -15, 0],
          rotate: [0, 5, 0, -5, 0]
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: delay 
        }}
        className="px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-primary/10 backdrop-blur-md border border-primary/30 text-xs font-medium shadow-lg hover:scale-110 transition-transform cursor-default"
      >
        {skill}
      </motion.div>
    </motion.div>
  );
}

export function HeroUltra({ profile, latestPosition, stats }: HeroUltraProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Mouse tracking for interactive effects
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 300, damping: 30 };
  const xSpring = useSpring(mouseX, springConfig);
  const ySpring = useSpring(mouseY, springConfig);

  const rotateX = useTransform(ySpring, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(xSpring, [-0.5, 0.5], [-8, 8]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set((e.clientX - centerX) / rect.width);
    mouseY.set((e.clientY - centerY) / rect.height);
  };

  const skills = ["React", "TypeScript", "Node.js", "Next.js", "TailwindCSS"];

  return (
    <section className="relative min-h-screen flex items-center py-20 overflow-hidden">
      {/* Animated Mesh Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-purple-500/5 to-background" />
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{
          background: [
            "radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%)",
            "radial-gradient(circle at 80% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%)",
            "radial-gradient(circle at 50% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%)",
            "radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%)",
          ],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-grid-white/[0.02]" />

      {/* Glow Orbs */}
      <div className="absolute top-20 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 -right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* LEFT COLUMN - Content */}
          <div className="lg:col-span-7 space-y-8">
            {/* Status Badge with Glow */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Badge className="relative bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30 px-5 py-2 text-sm backdrop-blur-md">
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-green-500/20 rounded-full blur-md"
                />
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2" />
                <Zap className="w-3 h-3 mr-1" />
                Available for opportunities
              </Badge>
            </motion.div>

            {/* Main Heading with Gradient Animation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-2 text-lg text-muted-foreground"
              >
                <Sparkles className="w-5 h-5 text-primary" />
                <span>Hi, I'm</span>
              </motion.div>

              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tight">
                <motion.span
                  className="block bg-gradient-to-r from-foreground via-primary to-purple-600 bg-clip-text text-transparent"
                  animate={{
                    backgroundPosition: ["0%", "100%", "0%"],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  style={{
                    backgroundSize: "200% 200%",
                  }}
                >
                  {profile.displayName}
                </motion.span>
              </h1>
              
              {latestPosition && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center gap-3 text-2xl sm:text-3xl font-semibold"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center backdrop-blur-sm">
                    <Briefcase className="w-6 h-6 text-primary" />
                  </div>
                  <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                    {latestPosition}
                  </span>
                </motion.div>
              )}
            </motion.div>

            {/* Bio with Glassmorphism */}
            {profile.bio && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="p-6 rounded-2xl bg-background/40 backdrop-blur-md border border-border/50 shadow-lg"
              >
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {profile.bio}
                </p>
              </motion.div>
            )}

            {/* Stats with Animated Counters & Glow */}
            {stats && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="grid grid-cols-3 gap-4"
              >
                {[
                  { icon: TrendingUp, value: stats.yearsExperience, label: "Years", color: "from-blue-500 to-cyan-500" },
                  { icon: Star, value: stats.projectsCompleted, label: "Projects", color: "from-purple-500 to-pink-500" },
                  { icon: Code2, value: stats.technologiesCount, label: "Tech", color: "from-orange-500 to-red-500" },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="relative group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-20 rounded-xl blur-xl transition-opacity" />
                    <div className="relative p-4 rounded-xl bg-background/60 backdrop-blur-md border border-border/50 text-center">
                      <stat.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                      <div className="text-3xl font-bold text-foreground">
                        <AnimatedCounter end={stat.value || 0} />+
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* CTA Buttons with Glow */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-wrap gap-4"
            >
              <Link href="#projects">
                <Button size="lg" className="relative text-base px-8 group overflow-hidden">
                  <span className="relative z-10 flex items-center">
                    View My Work
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
              </Link>
              {profile.email && (
                <Link href={`mailto:${profile.email}`}>
                  <Button size="lg" variant="outline" className="text-base px-8 backdrop-blur-md border-primary/30 hover:bg-primary/10">
                    <Mail className="mr-2 h-5 w-5" />
                    Get in Touch
                  </Button>
                </Link>
              )}
            </motion.div>

            {/* Social Links with Glow Effects */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex items-center gap-4"
            >
              {profile.location && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground px-4 py-2 rounded-full bg-background/40 backdrop-blur-md border border-border/50">
                  <MapPin className="w-4 h-4" />
                  {profile.location}
                </div>
              )}
              
              <div className="flex gap-3">
                {profile.github && (
                  <motion.a
                    href={profile.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative group"
                  >
                    <div className="absolute inset-0 bg-primary/50 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative w-12 h-12 rounded-xl bg-background/60 backdrop-blur-md border border-border/50 hover:border-primary/50 flex items-center justify-center transition-colors">
                      <Github className="w-5 h-5" />
                    </div>
                  </motion.a>
                )}
                {profile.linkedin && (
                  <motion.a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative group"
                  >
                    <div className="absolute inset-0 bg-blue-500/50 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative w-12 h-12 rounded-xl bg-background/60 backdrop-blur-md border border-border/50 hover:border-blue-500/50 flex items-center justify-center transition-colors">
                      <Linkedin className="w-5 h-5" />
                    </div>
                  </motion.a>
                )}
                {profile.email && (
                  <motion.a
                    href={`mailto:${profile.email}`}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative group"
                  >
                    <div className="absolute inset-0 bg-purple-500/50 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative w-12 h-12 rounded-xl bg-background/60 backdrop-blur-md border border-border/50 hover:border-purple-500/50 flex items-center justify-center transition-colors">
                      <Mail className="w-5 h-5" />
                    </div>
                  </motion.a>
                )}
              </div>
            </motion.div>
          </div>

          {/* RIGHT COLUMN - Ultra Interactive Photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="lg:col-span-5 flex justify-center lg:justify-end relative"
          >
            {/* Floating Skill Bubbles */}
            <div className="absolute inset-0 hidden lg:block">
              {skills.map((skill, index) => (
                <FloatingSkillBubble
                  key={skill}
                  skill={skill}
                  delay={1 + index * 0.2}
                  x={`${[10, 75, 20, 80, 45][index]}%`}
                  y={`${[15, 25, 65, 75, 90][index]}%`}
                />
              ))}
            </div>

            <motion.div
              drag
              dragElastic={0.1}
              dragConstraints={{ left: -50, right: 50, top: -50, bottom: 50 }}
              whileHover={{ scale: 1.02 }}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
              }}
              className="relative cursor-grab active:cursor-grabbing group"
            >
              {/* Neon Glow Ring */}
              <motion.div
                animate={{
                  opacity: isHovered ? 0.8 : 0.4,
                  scale: isHovered ? 1.1 : 1,
                }}
                className="absolute -inset-8 bg-gradient-to-r from-primary via-purple-500 to-pink-500 rounded-3xl blur-3xl"
              />

              {/* Glass Card Container */}
              <div className="relative w-80 h-96 sm:w-96 sm:h-[28rem]">
                {/* Animated Border */}
                <motion.div
                  className="absolute inset-0 rounded-3xl"
                  animate={{
                    background: [
                      "linear-gradient(0deg, rgba(120, 119, 198, 0.5) 0%, rgba(147, 51, 234, 0.5) 100%)",
                      "linear-gradient(90deg, rgba(120, 119, 198, 0.5) 0%, rgba(147, 51, 234, 0.5) 100%)",
                      "linear-gradient(180deg, rgba(120, 119, 198, 0.5) 0%, rgba(147, 51, 234, 0.5) 100%)",
                      "linear-gradient(270deg, rgba(120, 119, 198, 0.5) 0%, rgba(147, 51, 234, 0.5) 100%)",
                      "linear-gradient(360deg, rgba(120, 119, 198, 0.5) 0%, rgba(147, 51, 234, 0.5) 100%)",
                    ],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  style={{ padding: 3 }}
                >
                  <div className="w-full h-full bg-background rounded-3xl" />
                </motion.div>

                {/* Main Photo Card */}
                <motion.div
                  className="relative h-full rounded-3xl overflow-hidden backdrop-blur-md bg-background/80 border-4 border-primary/30 shadow-2xl"
                  style={{ transform: "translateZ(30px)" }}
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
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center">
                      <span className="text-9xl font-bold text-primary/50">
                        {profile.displayName.charAt(0)}
                      </span>
                    </div>
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

                  {/* Interactive Badge */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.2 }}
                    className="absolute top-4 right-4 px-4 py-2 rounded-full bg-background/80 backdrop-blur-md border border-primary/30 text-xs font-medium flex items-center gap-1"
                  >
                    <Award className="w-3 h-3 text-primary" />
                    Drag Me!
                  </motion.div>

                  {/* Info Panel */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 backdrop-blur-xl bg-background/90">
                    <motion.h3 
                      className="text-2xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent mb-1"
                    >
                      {profile.displayName}
                    </motion.h3>
                    {latestPosition && (
                      <p className="text-sm text-primary font-medium flex items-center gap-1">
                        <Briefcase className="w-3 h-3" />
                        {latestPosition}
                      </p>
                    )}
                  </div>
                </motion.div>

                {/* Corner Accent Glows */}
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-primary/30 rounded-full blur-2xl" />
                <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-purple-500/30 rounded-full blur-2xl" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
