"use client";

import { motion, useMotionValue, useSpring, useTransform, PanInfo } from "framer-motion";
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
  AlertTriangle,
  Zap
} from "lucide-react";

interface HeroIdCardProps {
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

export function HeroIdCard({ profile, latestPosition, stats }: HeroIdCardProps) {
  const [isBroken, setIsBroken] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [tension, setTension] = useState(0);
  const [showWarning, setShowWarning] = useState(false);

  // Motion values for card position
  const cardX = useMotionValue(0);
  const cardY = useMotionValue(0);

  // Spring physics for smooth movement
  const springConfig = { stiffness: 100, damping: 15, mass: 0.8 };
  const x = useSpring(cardX, springConfig);
  const y = useSpring(cardY, springConfig);

  // Elastic deformation based on drag
  const scaleX = useTransform(x, [-150, 0, 150], [1.15, 1, 1.15]);
  const scaleY = useTransform(y, [-150, 0, 150], [1.15, 1, 1.15]);
  const skewX = useTransform(x, [-150, 150], [8, -8]);
  const skewY = useTransform(y, [-150, 150], [5, -5]);
  const rotate = useTransform(x, [-150, 150], [-10, 10]);
  
  // Lanyard height and opacity
  const lanyardHeight = useTransform(y, [0, 150], [280, 350]);
  const lanyardOpacity = useTransform(y, [-50, 0, 150], [0.7, 1, 0.3]);

  // Calculate drag distance for tension
  useEffect(() => {
    const unsubscribe = x.on("change", (latestX) => {
      const latestY = y.get();
      const distance = Math.sqrt(latestX ** 2 + latestY ** 2);
      setTension(distance);
      
      // Show warning at 80% of break point
      setShowWarning(distance > 120);
      
      // Break lanyard if stretched too far
      if (distance > 180 && !isBroken) {
        setIsBroken(true);
        // Play break sound if available
        const audio = new Audio('/sounds/snap.mp3');
        audio.catch(() => {}); // Ignore if sound file doesn't exist
      }
    });
    return unsubscribe;
  }, [x, y, isBroken]);

  // Idle wobble animation
  useEffect(() => {
    if (!isDragging && !isBroken) {
      const wobble = setInterval(() => {
        const wobbleAmount = 3;
        cardX.set(Math.random() * wobbleAmount - wobbleAmount / 2);
        cardY.set(Math.random() * wobbleAmount - wobbleAmount / 2);
      }, 3000);
      return () => clearInterval(wobble);
    }
  }, [isDragging, isBroken, cardX, cardY]);

  // Reset broken state
  const handleReset = () => {
    setIsBroken(false);
    cardX.set(0);
    cardY.set(0);
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false);
    
    if (!isBroken) {
      // Bounce back to center
      cardX.set(0);
      cardY.set(0);
    } else {
      // If broken, fall down
      cardY.set(500);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center py-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
      <div className="absolute inset-0 bg-grid-white/[0.02]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT COLUMN - Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 space-y-6 pt-20"
          >
            {/* Status Badge */}
            <Badge className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20 px-4 py-1.5">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2" />
              Available for opportunities
            </Badge>

            {/* Main Heading */}
            <div className="space-y-4">
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
            </div>

            {/* Bio */}
            {profile.bio && (
              <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
                {profile.bio}
              </p>
            )}

            {/* Stats Row */}
            {stats && (
              <div className="flex flex-wrap gap-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">{stats.yearsExperience}+</div>
                    <div className="text-sm text-muted-foreground">Years</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">{stats.projectsCompleted}+</div>
                    <div className="text-sm text-muted-foreground">Projects</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Code2 className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">{stats.technologiesCount}+</div>
                    <div className="text-sm text-muted-foreground">Tech</div>
                  </div>
                </div>
              </div>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
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
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4 pt-2">
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
                    className="w-10 h-10 rounded-lg bg-muted hover:bg-primary/10 flex items-center justify-center transition-colors"
                  >
                    <Linkedin className="w-5 h-5" />
                  </motion.a>
                )}
                {profile.email && (
                  <motion.a
                    href={`mailto:${profile.email}`}
                    whileHover={{ scale: 1.1, y: -2 }}
                    className="w-10 h-10 rounded-lg bg-muted hover:bg-primary/10 flex items-center justify-center transition-colors"
                  >
                    <Mail className="w-5 h-5" />
                  </motion.a>
                )}
              </div>
            </div>
          </motion.div>

          {/* RIGHT COLUMN - ID Card with Lanyard */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end relative h-[600px]">
            {/* Anchor Point */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-20">
              <motion.div 
                className="w-16 h-8 bg-gradient-to-b from-primary to-primary/80 rounded-b-2xl shadow-lg"
                animate={!isBroken && !isDragging ? { rotate: [0, 2, -2, 0] } : {}}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex gap-3">
                  {/* Lanyard strings */}
                  {!isBroken && (
                    <>
                      {/* Left string */}
                      <motion.div
                        className="w-1 bg-gradient-to-b from-primary via-primary/80 to-primary/60"
                        style={{
                          height: lanyardHeight,
                          opacity: lanyardOpacity,
                        }}
                      />
                      {/* Right string */}
                      <motion.div
                        className="w-1 bg-gradient-to-b from-primary via-primary/80 to-primary/60"
                        style={{
                          height: lanyardHeight,
                          opacity: lanyardOpacity,
                        }}
                      />
                    </>
                  )}
                  
                  {/* Broken strings animation */}
                  {isBroken && (
                    <>
                      <motion.div
                        className="w-1 h-32 bg-gradient-to-b from-primary to-transparent"
                        animate={{ rotate: [-10, -30], y: [0, 20] }}
                        transition={{ duration: 0.5 }}
                      />
                      <motion.div
                        className="w-1 h-32 bg-gradient-to-b from-primary to-transparent"
                        animate={{ rotate: [10, 30], y: [0, 20] }}
                        transition={{ duration: 0.5 }}
                      />
                    </>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Tension Indicator */}
            {showWarning && !isBroken && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute top-20 left-1/2 transform -translate-x-1/2 z-30"
              >
                <Badge className="bg-red-500/20 text-red-600 border-red-500/30 animate-pulse">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Careful! It might break!
                </Badge>
              </motion.div>
            )}

            {/* ID Card */}
            <motion.div
              drag={!isBroken}
              dragConstraints={{ left: -150, right: 150, top: -50, bottom: 150 }}
              dragElastic={0.2}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              style={{
                x,
                y,
                scaleX,
                scaleY,
                skewX,
                skewY,
                rotate,
              }}
              className={`absolute top-32 ${!isBroken ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-none'}`}
            >
              {/* Card Clip */}
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-20 h-8 bg-gradient-to-b from-muted to-card rounded-t-xl border-2 border-border z-10" />

              {/* Main Card */}
              <motion.div
                className="relative w-80 h-96 sm:w-96 sm:h-[28rem] rounded-2xl overflow-hidden border-4 border-border bg-card shadow-2xl"
                animate={isBroken ? { rotate: [0, -180, -360], y: [0, 600], opacity: [1, 0] } : {}}
                transition={{ duration: 1.5, ease: "easeIn" }}
              >
                {/* Photo */}
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
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />

                {/* Drag Hint */}
                {!isDragging && !isBroken && (
                  <motion.div
                    animate={{ y: [0, 5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1"
                  >
                    <Zap className="w-3 h-3" />
                    Drag me!
                  </motion.div>
                )}

                {/* Card Info */}
                <div className="absolute bottom-0 left-0 right-0 p-6 backdrop-blur-md bg-background/70">
                  <h3 className="text-2xl font-bold text-foreground mb-1">
                    {profile.displayName}
                  </h3>
                  {latestPosition && (
                    <p className="text-sm text-primary font-medium">
                      {latestPosition}
                    </p>
                  )}
                  {profile.location && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                      <MapPin className="w-3 h-3" />
                      {profile.location}
                    </div>
                  )}
                </div>

                {/* Tension Blur Effect */}
                {tension > 100 && (
                  <div 
                    className="absolute inset-0 backdrop-blur-sm pointer-events-none"
                    style={{ opacity: Math.min((tension - 100) / 80, 0.5) }}
                  />
                )}
              </motion.div>
            </motion.div>

            {/* Broken Message & Reset */}
            {isBroken && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-30"
              >
                <div className="bg-background/90 backdrop-blur-sm border-2 border-border rounded-2xl p-6 shadow-2xl">
                  <div className="text-6xl mb-4">💥</div>
                  <h3 className="text-2xl font-bold mb-2">Oops! Lanyard Broke!</h3>
                  <p className="text-muted-foreground mb-4">You pulled too hard!</p>
                  <Button onClick={handleReset} size="lg">
                    <Zap className="mr-2 h-5 w-5" />
                    Fix It!
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
