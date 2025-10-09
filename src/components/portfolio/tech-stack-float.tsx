"use client";

import { motion } from "framer-motion";
import { Code2 } from "lucide-react";

interface Skill {
  id: string;
  name: string;
  category: string;
}

interface TechStackFloatProps {
  skills: Skill[];
}

export function TechStackFloat({ skills }: TechStackFloatProps) {
  const displaySkills = skills.slice(0, 20);
  const duplicatedSkills = [...displaySkills, ...displaySkills];

  return (
    <section className="py-20 overflow-hidden bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <Code2 className="inline-block mr-3 mb-2" />
            Tech Stack
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Technologies and tools I work with
          </p>
        </motion.div>
      </div>

      {/* Marquee Effect */}
      <div className="relative flex overflow-hidden">
        {/* Fade Edges */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />

        {/* Scrolling Content */}
        <motion.div
          className="flex gap-6"
          animate={{
            x: [0, -1920],
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
          {duplicatedSkills.map((skill, index) => (
            <motion.div
              key={`${skill.id}-${index}`}
              whileHover={{ scale: 1.1, y: -5 }}
              className="flex-shrink-0 group"
            >
              <div className="px-8 py-4 bg-background rounded-2xl border-2 border-border hover:border-primary transition-all duration-300 shadow-lg hover:shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                  <span className="text-lg font-semibold whitespace-nowrap">
                    {skill.name}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 text-center">
                  {skill.category}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Second Row - Reverse Direction */}
      <div className="relative flex overflow-hidden mt-6">
        <motion.div
          className="flex gap-6"
          animate={{
            x: [-1920, 0],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 25,
              ease: "linear",
            },
          }}
        >
          {duplicatedSkills.reverse().map((skill, index) => (
            <motion.div
              key={`${skill.id}-reverse-${index}`}
              whileHover={{ scale: 1.1, y: -5 }}
              className="flex-shrink-0"
            >
              <div className="px-6 py-3 bg-primary/10 rounded-xl border border-primary/20 hover:border-primary transition-all duration-300">
                <span className="text-base font-medium whitespace-nowrap text-primary">
                  {skill.name}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
