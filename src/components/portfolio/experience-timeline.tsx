"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, Calendar, MapPin } from "lucide-react";
import { format } from "date-fns";

interface Experience {
  id: string;
  position: string;
  company: string;
  location?: string;
  startDate?: any;
  endDate?: any;
  current?: boolean;
  description?: string;
  responsibilities?: string[];
}

interface ExperienceTimelineProps {
  experiences: Experience[];
}

export function ExperienceTimeline({ experiences }: ExperienceTimelineProps) {
  if (experiences.length === 0) return null;

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/20">
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
            <Briefcase className="inline-block mr-3 mb-2" />
            Experience & Journey
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            My professional journey and the roles that shaped my career
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-transparent" />

          {/* Timeline Items */}
          <div className="space-y-12">
            {experiences.slice(0, 6).map((exp, index) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative flex items-center ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Timeline Dot */}
                <div className="absolute left-8 md:left-1/2 transform -translate-x-1/2 z-10">
                  <motion.div
                    whileHover={{ scale: 1.2 }}
                    className="w-4 h-4 rounded-full bg-primary ring-4 ring-background shadow-lg"
                  />
                </div>

                {/* Content Card */}
                <div className="flex-1 ml-20 md:ml-0 md:w-5/12">
                  <Card className="border-2 border-border hover:border-primary transition-all duration-300 group overflow-hidden">
                    {/* Animated Background on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <CardContent className="p-6 relative">
                      {/* Date Badge */}
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {exp.startDate && format(new Date(exp.startDate), 'MMM yyyy')} - 
                          {exp.current ? ' Present' : exp.endDate ? ` ${format(new Date(exp.endDate), 'MMM yyyy')}` : ' Present'}
                        </span>
                        {exp.current && (
                          <Badge variant="default" className="ml-2 animate-pulse">
                            Current
                          </Badge>
                        )}
                      </div>

                      {/* Position & Company */}
                      <h3 className="text-xl md:text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                        {exp.position}
                      </h3>
                      <p className="text-lg font-semibold text-primary mb-3">
                        {exp.company}
                      </p>

                      {/* Location */}
                      {exp.location && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                          <MapPin className="h-4 w-4" />
                          <span>{exp.location}</span>
                        </div>
                      )}

                      {/* Description */}
                      {exp.description && (
                        <p className="text-muted-foreground mb-4 leading-relaxed">
                          {exp.description}
                        </p>
                      )}

                      {/* Responsibilities Tags */}
                      {exp.responsibilities && exp.responsibilities.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {exp.responsibilities.slice(0, 6).map((responsibility: any, idx: number) => (
                            <Badge 
                              key={`${exp.id}-resp-${idx}`}
                              variant="secondary"
                              className="text-xs hover:bg-primary hover:text-primary-foreground transition-colors cursor-default"
                            >
                              {responsibility}
                            </Badge>
                          ))}
                          {exp.responsibilities.length > 6 && (
                            <Badge variant="secondary" className="text-xs">
                              +{exp.responsibilities.length - 6}
                            </Badge>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Empty Space for alternating layout */}
                <div className="hidden md:block md:w-5/12" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Experience Count Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-primary/10 border-2 border-primary/20 rounded-full">
            <Briefcase className="h-5 w-5 text-primary" />
            <span className="text-lg font-semibold">
              {experiences.length}+ Years of Experience
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
