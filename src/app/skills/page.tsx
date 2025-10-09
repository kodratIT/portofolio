"use client";

import { useState, useEffect } from "react";
import { Skill } from "@/lib/types";
import { getPublicSkills } from "@/lib/firebase/public";
import { PORTFOLIO_CONFIG } from "@/lib/config/portfolio";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Spotlight } from "@/components/ui/aceternity/spotlight";
import { Code2, Database, Cloud, Wrench, Palette, MoreHorizontal } from "lucide-react";

export default function SkillsShowcasePage() {
  const userId = PORTFOLIO_CONFIG.ownerId;

  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setLoading(true);
        const data = await getPublicSkills(userId);
        setSkills(data);
      } catch (error) {
        console.error("Error fetching skills:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  const categories = Object.keys(skillsByCategory);

  const getCategoryIcon = (category: string) => {
    const iconMap: Record<string, any> = {
      Frontend: Palette,
      Backend: Code2,
      Database: Database,
      DevOps: Cloud,
      Tools: Wrench,
    };
    return iconMap[category] || MoreHorizontal;
  };

  const getLevelLabel = (level: number) => {
    const labels = ["Beginner", "Intermediate", "Advanced", "Expert", "Master"];
    return labels[level - 1] || "Unknown";
  };

  const getLevelColor = (level: number) => {
    const colors = [
      "bg-red-500",
      "bg-orange-500",
      "bg-yellow-500",
      "bg-green-500",
      "bg-blue-500",
    ];
    return colors[level - 1] || "bg-gray-500";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-b from-background via-background to-muted/50">
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Skills & Technologies</h1>
            <p className="text-muted-foreground text-lg">
              Technologies and tools I work with. From frontend to backend, databases to DevOps.
            </p>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {skills.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground text-lg">No skills available yet.</p>
              </div>
            ) : (
              <Tabs defaultValue={categories[0]} className="w-full">
                <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 mb-8">
                  {categories.map((category) => {
                    const Icon = getCategoryIcon(category);
                    return (
                      <TabsTrigger key={category} value={category} className="gap-2">
                        <Icon className="h-4 w-4" />
                        <span className="hidden sm:inline">{category}</span>
                      </TabsTrigger>
                    );
                  })}
                </TabsList>

                {categories.map((category) => (
                  <TabsContent key={category} value={category} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {skillsByCategory[category].map((skill, index) => (
                        <Card
                          key={skill.id}
                          style={{
                            animationDelay: `${index * 0.1}s`,
                          }}
                          className="animate-in fade-in slide-in-from-bottom-4 duration-500 hover:shadow-lg transition-all"
                        >
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="font-bold text-xl">{skill.name}</h3>
                              <Badge variant="secondary">{getLevelLabel(skill.level)}</Badge>
                            </div>

                            {/* Progress Bar */}
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm text-muted-foreground">
                                <span>Proficiency</span>
                                <span>{skill.level}/5</span>
                              </div>
                              <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all duration-1000 ease-out ${getLevelColor(
                                    skill.level
                                  )}`}
                                  style={{
                                    width: `${(skill.level / 5) * 100}%`,
                                    animationDelay: `${index * 0.1}s`,
                                  }}
                                />
                              </div>

                              {/* Level Dots */}
                              <div className="flex gap-1 pt-2">
                                {[1, 2, 3, 4, 5].map((level) => (
                                  <div
                                    key={level}
                                    className={`h-2 flex-1 rounded-full transition-all duration-500 ${
                                      level <= skill.level
                                        ? getLevelColor(skill.level)
                                        : "bg-muted"
                                    }`}
                                    style={{
                                      animationDelay: `${(index * 0.1) + (level * 0.05)}s`,
                                    }}
                                  />
                                ))}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            )}
          </div>
        </div>
      </section>

      {/* Summary Section */}
      {skills.length > 0 && (
        <section className="py-20 bg-muted/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Skill Summary</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl font-bold text-primary mb-2">{skills.length}</div>
                    <div className="text-sm text-muted-foreground">Total Skills</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl font-bold text-primary mb-2">{categories.length}</div>
                    <div className="text-sm text-muted-foreground">Categories</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl font-bold text-primary mb-2">
                      {skills.filter((s) => s.level >= 4).length}
                    </div>
                    <div className="text-sm text-muted-foreground">Expert Level</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl font-bold text-primary mb-2">
                      {Math.round((skills.reduce((acc, s) => acc + s.level, 0) / skills.length) * 10) / 10}
                    </div>
                    <div className="text-sm text-muted-foreground">Avg. Level</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
