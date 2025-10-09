"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useState } from "react";
import { Code2, Zap, TrendingUp, Award, Grid3X3, List } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getTechIcon } from "@/lib/config/tech-icons";

interface Skill {
  id: string;
  name: string;
  category: string;
  level?: number; // 1-5 proficiency level
}

interface TechStackUltraProps {
  skills: Skill[];
}

// Category color mapping
const categoryColors: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  "Frontend": { bg: "from-blue-500/20 to-cyan-500/20", border: "border-blue-500/30", text: "text-blue-500", glow: "group-hover:shadow-blue-500/50" },
  "Backend": { bg: "from-green-500/20 to-emerald-500/20", border: "border-green-500/30", text: "text-green-500", glow: "group-hover:shadow-green-500/50" },
  "Database": { bg: "from-purple-500/20 to-pink-500/20", border: "border-purple-500/30", text: "text-purple-500", glow: "group-hover:shadow-purple-500/50" },
  "DevOps": { bg: "from-orange-500/20 to-red-500/20", border: "border-orange-500/30", text: "text-orange-500", glow: "group-hover:shadow-orange-500/50" },
  "Mobile": { bg: "from-indigo-500/20 to-blue-500/20", border: "border-indigo-500/30", text: "text-indigo-500", glow: "group-hover:shadow-indigo-500/50" },
  "Tools": { bg: "from-gray-500/20 to-slate-500/20", border: "border-gray-500/30", text: "text-gray-500", glow: "group-hover:shadow-gray-500/50" },
  "Design": { bg: "from-pink-500/20 to-rose-500/20", border: "border-pink-500/30", text: "text-pink-500", glow: "group-hover:shadow-pink-500/50" },
};

// 3D Card with tilt effect
function TechCard({ skill, index, view }: { skill: Skill; index: number; view: "grid" | "marquee" }) {
  const [isHovered, setIsHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [5, -5]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-5, 5]);

  const categoryStyle = categoryColors[skill.category] || categoryColors["Tools"];
  const { icon: TechIcon, color: iconColor } = getTechIcon(skill.name);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set((e.clientX - centerX) / rect.width);
    mouseY.set((e.clientY - centerY) / rect.height);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: view === "grid" ? index * 0.05 : 0, duration: 0.5 }}
      whileHover={{ scale: 1.05, z: 50 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={view === "grid" ? {
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      } : {}}
      className={`group relative cursor-pointer ${view === "grid" ? "" : "flex-shrink-0"}`}
    >
      {/* Glow Effect */}
      <motion.div
        animate={{
          opacity: isHovered ? 0.6 : 0,
          scale: isHovered ? 1.2 : 1,
        }}
        className={`absolute -inset-2 bg-gradient-to-r ${categoryStyle.bg} rounded-2xl blur-xl transition-all duration-300`}
      />

      {/* Card Content */}
      <div
        className={`relative px-6 py-5 rounded-xl backdrop-blur-md bg-background/60 border-2 ${categoryStyle.border} ${categoryStyle.glow} shadow-lg transition-all duration-300`}
        style={view === "grid" ? { transform: "translateZ(30px)" } : {}}
      >
        {/* Category Badge */}
        <div className="flex items-center justify-between mb-3">
          <Badge 
            variant="outline" 
            className={`text-xs ${categoryStyle.text} border-current backdrop-blur-sm bg-background/50`}
          >
            {skill.category}
          </Badge>
          {skill.level && (
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                  className={`w-1.5 h-1.5 rounded-full ${
                    i < skill.level! ? categoryStyle.text.replace('text-', 'bg-') : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Tech Icon & Name */}
        <div className="flex flex-col items-center gap-3 text-center">
          {/* Icon Container with Glow */}
          <motion.div
            animate={{
              rotate: isHovered ? [0, -10, 10, 0] : 0,
              scale: isHovered ? 1.1 : 1,
            }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            {/* Icon Glow Background */}
            <motion.div
              animate={{
                opacity: isHovered ? 0.4 : 0.2,
                scale: isHovered ? 1.3 : 1,
              }}
              className="absolute inset-0 rounded-2xl blur-xl"
              style={{ backgroundColor: iconColor }}
            />
            
            {/* Icon */}
            <div 
              className="relative w-16 h-16 flex items-center justify-center rounded-2xl backdrop-blur-sm bg-background/40 border border-border/50"
            >
              <TechIcon 
                className="w-10 h-10" 
                style={{ color: iconColor }}
              />
            </div>
          </motion.div>

          {/* Skill Name */}
          <h3 className="text-lg font-semibold whitespace-nowrap">
            {skill.name}
          </h3>
        </div>

        {/* Hover Shine Effect */}
        <motion.div
          animate={{
            x: isHovered ? 300 : -100,
          }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none"
          style={{ transform: "skewX(-20deg)" }}
        />
      </div>
    </motion.div>
  );
}

export function TechStackUltra({ skills }: TechStackUltraProps) {
  const [view, setView] = useState<"grid" | "marquee">("grid");

  // Group skills by category
  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  const categories = Object.keys(skillsByCategory);
  const totalSkills = skills.length;

  // For marquee view
  const displaySkills = skills.slice(0, 30);
  const duplicatedSkills = [...displaySkills, ...displaySkills, ...displaySkills];

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      <div className="absolute inset-0 bg-grid-white/[0.02]" />
      
      {/* Gradient Orbs */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          {/* Title Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 backdrop-blur-md mb-6"
          >
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Technology Arsenal</span>
          </motion.div>

          {/* Main Heading */}
          <h2 className="text-5xl md:text-7xl font-bold mb-6">
            <motion.span
              className="inline-block bg-gradient-to-r from-foreground via-primary to-purple-600 bg-clip-text text-transparent"
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
              Tech Stack
            </motion.span>
          </h2>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            A comprehensive collection of technologies and tools I use to build exceptional digital experiences
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              className="px-6 py-3 rounded-xl bg-background/60 backdrop-blur-md border border-primary/30"
            >
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-primary" />
                <span className="text-2xl font-bold">{totalSkills}</span>
                <span className="text-sm text-muted-foreground">Technologies</span>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              className="px-6 py-3 rounded-xl bg-background/60 backdrop-blur-md border border-purple-500/30"
            >
              <div className="flex items-center gap-2">
                <Grid3X3 className="w-5 h-5 text-purple-500" />
                <span className="text-2xl font-bold">{categories.length}</span>
                <span className="text-sm text-muted-foreground">Categories</span>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              className="px-6 py-3 rounded-xl bg-background/60 backdrop-blur-md border border-green-500/30"
            >
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-green-500" />
                <span className="text-2xl font-bold">
                  {skills.filter(s => (s.level || 0) >= 4).length}
                </span>
                <span className="text-sm text-muted-foreground">Expert Level</span>
              </div>
            </motion.div>
          </div>

          {/* View Toggle */}
          <div className="inline-flex items-center gap-2 p-1 rounded-xl bg-background/60 backdrop-blur-md border border-border/50">
            <Button
              variant={view === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setView("grid")}
              className="gap-2"
            >
              <Grid3X3 className="w-4 h-4" />
              Grid View
            </Button>
            <Button
              variant={view === "marquee" ? "default" : "ghost"}
              size="sm"
              onClick={() => setView("marquee")}
              className="gap-2"
            >
              <List className="w-4 h-4" />
              Marquee View
            </Button>
          </div>
        </motion.div>

        {/* Content */}
        {view === "grid" ? (
          // Grid View - Grouped by Category
          <div className="space-y-16">
            {categories.map((category, catIndex) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: catIndex * 0.1, duration: 0.6 }}
              >
                {/* Category Header */}
                <div className="flex items-center gap-3 mb-8">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${categoryColors[category]?.bg || categoryColors["Tools"].bg} backdrop-blur-md border ${categoryColors[category]?.border || categoryColors["Tools"].border} flex items-center justify-center`}>
                    <TrendingUp className={`w-6 h-6 ${categoryColors[category]?.text || categoryColors["Tools"].text}`} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{category}</h3>
                    <p className="text-sm text-muted-foreground">
                      {skillsByCategory[category].length} technologies
                    </p>
                  </div>
                </div>

                {/* Skills Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {skillsByCategory[category].map((skill, index) => (
                    <TechCard key={skill.id} skill={skill} index={index} view="grid" />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          // Marquee View - Continuous Scroll
          <div className="space-y-8">
            {/* First Row - Left to Right */}
            <div className="relative flex overflow-hidden">
              {/* Fade Edges */}
              <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
              <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />

              <motion.div
                className="flex gap-6"
                animate={{
                  x: [0, -2400],
                }}
                transition={{
                  x: {
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 40,
                    ease: "linear",
                  },
                }}
              >
                {duplicatedSkills.map((skill, index) => (
                  <TechCard key={`marquee-1-${skill.id}-${index}`} skill={skill} index={index} view="marquee" />
                ))}
              </motion.div>
            </div>

            {/* Second Row - Right to Left */}
            <div className="relative flex overflow-hidden">
              <motion.div
                className="flex gap-6"
                animate={{
                  x: [-2400, 0],
                }}
                transition={{
                  x: {
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 35,
                    ease: "linear",
                  },
                }}
              >
                {[...duplicatedSkills].reverse().map((skill, index) => (
                  <TechCard key={`marquee-2-${skill.id}-${index}`} skill={skill} index={index} view="marquee" />
                ))}
              </motion.div>
            </div>

            {/* Third Row - Left to Right (Faster) */}
            <div className="relative flex overflow-hidden">
              <motion.div
                className="flex gap-6"
                animate={{
                  x: [0, -2400],
                }}
                transition={{
                  x: {
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 30,
                    ease: "linear",
                  },
                }}
              >
                {duplicatedSkills.slice(0, 20).map((skill, index) => (
                  <TechCard key={`marquee-3-${skill.id}-${index}`} skill={skill} index={index} view="marquee" />
                ))}
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
