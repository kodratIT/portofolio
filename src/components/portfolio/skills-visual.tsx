"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code2, Sparkles } from "lucide-react";

interface Skill {
  id: string;
  name: string;
  category: string;
  level?: number;
}

interface SkillsVisualProps {
  skills: Skill[];
}

export function SkillsVisual({ skills }: SkillsVisualProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const categories = ["all", ...Array.from(new Set(skills.map(s => s.category)))];
  
  const filteredSkills = activeCategory === "all" 
    ? skills 
    : skills.filter(s => s.category === activeCategory);

  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <Sparkles className="inline-block mr-3 mb-2" />
            Skills & Expertise
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A comprehensive overview of my technical skills and proficiencies
          </p>
        </motion.div>

        {/* Category Tabs */}
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
          <TabsList className="grid w-full max-w-3xl mx-auto mb-12" style={{ gridTemplateColumns: `repeat(${Math.min(categories.length, 5)}, 1fr)` }}>
            {categories.map((category) => (
              <TabsTrigger key={category} value={category} className="capitalize">
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeCategory}>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(skillsByCategory).map(([category, categorySkills], categoryIndex) => {
                if (activeCategory !== "all" && activeCategory !== category) return null;
                
                return (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
                  >
                    <Card className="border-2 border-border hover:border-primary transition-all duration-300 h-full group">
                      <CardContent className="p-6">
                        {/* Category Header */}
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                            <Code2 className="h-5 w-5 text-primary" />
                          </div>
                          <h3 className="text-xl font-bold capitalize group-hover:text-primary transition-colors">
                            {category}
                          </h3>
                        </div>

                        {/* Skills List */}
                        <div className="space-y-3">
                          {categorySkills.slice(0, 8).map((skill, index) => (
                            <motion.div
                              key={skill.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.05 }}
                              className="flex items-center justify-between"
                            >
                              <span className="text-sm font-medium">{skill.name}</span>
                              {skill.level && (
                                <div className="flex gap-1">
                                  {[...Array(5)].map((_, i) => (
                                    <div
                                      key={i}
                                      className={`w-2 h-2 rounded-full ${
                                        i < skill.level! / 20
                                          ? "bg-primary"
                                          : "bg-muted"
                                      }`}
                                    />
                                  ))}
                                </div>
                              )}
                            </motion.div>
                          ))}
                          
                          {categorySkills.length > 8 && (
                            <p className="text-xs text-muted-foreground pt-2">
                              +{categorySkills.length - 8} more skills
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16"
        >
          <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20">
            <p className="text-4xl font-bold text-primary mb-2">{skills.length}+</p>
            <p className="text-sm text-muted-foreground">Total Skills</p>
          </div>
          <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20">
            <p className="text-4xl font-bold text-primary mb-2">{Object.keys(skillsByCategory).length}</p>
            <p className="text-sm text-muted-foreground">Categories</p>
          </div>
          <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20">
            <p className="text-4xl font-bold text-primary mb-2">100%</p>
            <p className="text-sm text-muted-foreground">Dedication</p>
          </div>
          <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20">
            <p className="text-4xl font-bold text-primary mb-2">∞</p>
            <p className="text-sm text-muted-foreground">Learning</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
