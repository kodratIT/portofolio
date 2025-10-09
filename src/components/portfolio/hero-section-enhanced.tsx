"use client";

import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, ArrowDown, Github, Linkedin, Mail, MapPin, Sparkles, Zap } from "lucide-react";
import { Spotlight } from "@/components/ui/aceternity/spotlight";

interface HeroSectionEnhancedProps {
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
function AnimatedCounter({ end, duration = 2, suffix = "" }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
      
      setCount(Math.floor(progress * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return <span>{count}{suffix}</span>;
}

// Floating Particle Component
function FloatingParticle({ delay, duration, x, y }: { delay: number; duration: number; x: string; y: string }) {
  return (
    <motion.div
      className="absolute w-2 h-2 bg-primary/30 rounded-full"
      style={{ left: x, top: y }}
      animate={{
        y: [0, -30, 0],
        opacity: [0.3, 0.8, 0.3],
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
    />
  );
}

export function HeroSectionEnhanced({ profile, latestPosition, stats }: HeroSectionEnhancedProps) {
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  // Parallax mouse effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const xSpring = useSpring(mouseX, springConfig);
  const ySpring = useSpring(mouseY, springConfig);

  const rotateX = useTransform(ySpring, [-0.5, 0.5], [5, -5]);
  const rotateY = useTransform(xSpring, [-0.5, 0.5], [-5, 5]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set((e.clientX - centerX) / rect.width);
    mouseY.set((e.clientY - centerY) / rect.height);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const roles = [
    latestPosition || "Full Stack Developer",
    "UI/UX Designer",
    "Problem Solver",
    "Tech Enthusiast",
  ];

  useEffect(() => {
    const handleTyping = () => {
      const currentIndex = loopNum % roles.length;
      const fullText = roles[currentIndex];

      setText(
        isDeleting
          ? fullText.substring(0, text.length - 1)
          : fullText.substring(0, text.length + 1)
      );

      setTypingSpeed(isDeleting ? 50 : 150);

      if (!isDeleting && text === fullText) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && text === "") {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, roles, typingSpeed]);

  const defaultStats = {
    yearsExperience: stats?.yearsExperience || 3,
    projectsCompleted: stats?.projectsCompleted || 50,
    technologiesCount: stats?.technologiesCount || 25,
  };

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Spotlight Effect */}
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <FloatingParticle delay={0} duration={4} x="10%" y="20%" />
        <FloatingParticle delay={0.5} duration={5} x="80%" y="30%" />
        <FloatingParticle delay={1} duration={4.5} x="15%" y="70%" />
        <FloatingParticle delay={1.5} duration={5.5} x="85%" y="60%" />
        <FloatingParticle delay={2} duration={4} x="50%" y="15%" />
        <FloatingParticle delay={0.8} duration={5} x="25%" y="50%" />
        <FloatingParticle delay={1.8} duration={4.5} x="70%" y="80%" />
        <FloatingParticle delay={2.3} duration={5} x="40%" y="90%" />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        {/* Floating Badges */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="absolute top-10 right-10 hidden lg:flex flex-col gap-3"
        >
          <Badge className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20 px-4 py-2 backdrop-blur-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2" />
            Available for Hire
          </Badge>
          {profile.location && (
            <Badge variant="secondary" className="backdrop-blur-sm px-4 py-2">
              <MapPin className="w-3 h-3 mr-2" />
              {profile.location}
            </Badge>
          )}
          <Badge variant="outline" className="backdrop-blur-sm px-4 py-2">
            <Zap className="w-3 h-3 mr-2" />
            Quick Response
          </Badge>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Greeting */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="text-lg md:text-xl text-muted-foreground font-medium inline-flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Hello, I&apos;m
              </span>
            </motion.div>

            {/* Name */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight"
            >
              <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                {profile.displayName}
              </span>
            </motion.h1>

            {/* Animated Role */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="h-20 flex items-center"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground">
                I&apos;m a{" "}
                <span className="text-primary">
                  {text}
                  <span className="animate-pulse">|</span>
                </span>
              </h2>
            </motion.div>

            {/* Bio */}
            {profile.bio && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl"
              >
                {profile.bio}
              </motion.p>
            )}

            {/* Stats Counter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="grid grid-cols-3 gap-6 py-6"
            >
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary">
                  <AnimatedCounter end={defaultStats.yearsExperience} suffix="+" />
                </div>
                <p className="text-sm text-muted-foreground mt-1">Years Exp</p>
              </div>
              <div className="text-center border-x border-border">
                <div className="text-3xl md:text-4xl font-bold text-primary">
                  <AnimatedCounter end={defaultStats.projectsCompleted} suffix="+" />
                </div>
                <p className="text-sm text-muted-foreground mt-1">Projects</p>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary">
                  <AnimatedCounter end={defaultStats.technologiesCount} suffix="+" />
                </div>
                <p className="text-sm text-muted-foreground mt-1">Technologies</p>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <Link href="#projects">
                <Button size="lg" className="text-lg px-8 py-6 group">
                  View My Work
                  <ArrowDown className="ml-2 h-5 w-5 group-hover:translate-y-1 transition-transform" />
                </Button>
              </Link>
              {profile.email && (
                <Link href={`mailto:${profile.email}`}>
                  <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                    <Download className="mr-2 h-5 w-5" />
                    Download CV
                  </Button>
                </Link>
              )}
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex gap-4"
            >
              {profile.github && (
                <motion.a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 rounded-full border border-border hover:border-primary hover:bg-primary/10 transition-all"
                >
                  <Github className="h-6 w-6" />
                </motion.a>
              )}
              {profile.linkedin && (
                <motion.a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 rounded-full border border-border hover:border-primary hover:bg-primary/10 transition-all"
                >
                  <Linkedin className="h-6 w-6" />
                </motion.a>
              )}
              {profile.email && (
                <motion.a
                  href={`mailto:${profile.email}`}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 rounded-full border border-border hover:border-primary hover:bg-primary/10 transition-all"
                >
                  <Mail className="h-6 w-6" />
                </motion.a>
              )}
            </motion.div>
          </motion.div>

          {/* Right Content - Avatar with Parallax */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="relative group">
              {/* Glowing Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/50 to-primary/30 rounded-full blur-3xl group-hover:blur-2xl transition-all duration-300" />
              
              {/* Avatar Container with Parallax */}
              <motion.div
                style={{
                  rotateX,
                  rotateY,
                  transformStyle: "preserve-3d",
                }}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/50 to-transparent rounded-full animate-spin-slow opacity-75" />
                <div className="absolute inset-2 rounded-full overflow-hidden border-4 border-background shadow-2xl">
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
                      <span className="text-8xl font-bold text-primary/50">
                        {profile.displayName.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-muted-foreground cursor-pointer"
        >
          <span className="text-sm font-medium">Scroll Down</span>
          <ArrowDown className="h-5 w-5" />
        </motion.div>
      </motion.div>
    </section>
  );
}
