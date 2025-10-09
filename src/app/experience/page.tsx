"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Experience } from "@/lib/types";
import { getPublicExperiences } from "@/lib/firebase/public";
import { PORTFOLIO_CONFIG } from "@/lib/config/portfolio";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Spotlight } from "@/components/ui/aceternity/spotlight";
import { BackgroundGradient } from "@/components/ui/aceternity/background-gradient";
import { MapPin, Calendar, Briefcase, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";

export default function ExperienceTimelinePage() {
  const userId = PORTFOLIO_CONFIG.ownerId;

  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        setLoading(true);
        const data = await getPublicExperiences(userId);
        setExperiences(data);
      } catch (error) {
        console.error("Error fetching experiences:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  const formatDate = (date: any) => {
    if (!date) return "";
    const dateObj = typeof date === "object" && "toDate" in date ? date.toDate() : new Date(date);
    return format(dateObj, "MMM yyyy");
  };

  const calculateDuration = (startDate: any, endDate: any, current: boolean) => {
    if (!startDate) return "";
    
    const start = typeof startDate === "object" && "toDate" in startDate 
      ? startDate.toDate() 
      : new Date(startDate);
    
    const end = current 
      ? new Date() 
      : (endDate && typeof endDate === "object" && "toDate" in endDate 
        ? endDate.toDate() 
        : new Date(endDate));

    const months = Math.round(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30)
    );
    
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    if (years > 0 && remainingMonths > 0) {
      return `${years}y ${remainingMonths}m`;
    } else if (years > 0) {
      return `${years}y`;
    } else {
      return `${months}m`;
    }
  };

  const totalExperience = experiences.reduce((total, exp) => {
    if (!exp.startDate) return total;
    
    const start = typeof exp.startDate === "object" && "toDate" in exp.startDate 
      ? exp.startDate.toDate() 
      : new Date(exp.startDate);
    
    const end = exp.current 
      ? new Date() 
      : (exp.endDate && typeof exp.endDate === "object" && "toDate" in exp.endDate 
        ? exp.endDate.toDate() 
        : new Date(exp.endDate));

    const months = Math.round(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30)
    );
    
    return total + months;
  }, 0);

  const totalYears = Math.floor(totalExperience / 12);
  const totalMonths = totalExperience % 12;

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
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Professional Experience</h1>
            <p className="text-muted-foreground text-lg mb-8">
              My professional journey and work experience over the years.
            </p>
            
            {totalExperience > 0 && (
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 rounded-full">
                <Briefcase className="h-5 w-5 text-primary" />
                <span className="text-lg font-semibold">
                  {totalYears > 0 && `${totalYears} Years`}
                  {totalYears > 0 && totalMonths > 0 && " "}
                  {totalMonths > 0 && `${totalMonths} Months`}
                  {" Total Experience"}
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {experiences.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground text-lg">No experience available yet.</p>
              </div>
            ) : (
              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-border" />

                <div className="space-y-12">
                  {experiences.map((exp, index) => (
                    <div
                      key={exp.id}
                      style={{
                        animationDelay: `${index * 0.2}s`,
                      }}
                      className="relative animate-in fade-in slide-in-from-bottom-8 duration-700"
                    >
                      <div
                        className={`flex flex-col md:flex-row gap-8 items-start ${
                          index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                        }`}
                      >
                        {/* Timeline Dot */}
                        <div className="absolute left-8 md:left-1/2 -ml-2 md:-ml-3 mt-6">
                          <div
                            className={`w-4 h-4 md:w-6 md:h-6 rounded-full border-4 border-background ${
                              exp.current
                                ? "bg-primary animate-pulse"
                                : "bg-muted-foreground"
                            }`}
                          />
                        </div>

                        {/* Date Badge (Mobile) */}
                        <div className="md:hidden ml-20 mb-2">
                          <Badge variant={exp.current ? "default" : "secondary"}>
                            <Calendar className="mr-1 h-3 w-3" />
                            {formatDate(exp.startDate)} - {exp.current ? "Present" : formatDate(exp.endDate)}
                          </Badge>
                        </div>

                        {/* Content Card */}
                        <div className={`flex-1 ml-20 md:ml-0 ${index % 2 === 0 ? "md:pr-12" : "md:pl-12"}`}>
                          <BackgroundGradient className="rounded-[22px] p-1">
                            <Card className="border-0">
                              <CardContent className="p-6">
                                <div className="flex items-start justify-between gap-4 mb-4">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <h3 className="text-2xl font-bold">{exp.position}</h3>
                                      {exp.current && (
                                        <Badge variant="default" className="text-xs">
                                          Current
                                        </Badge>
                                      )}
                                    </div>
                                    <p className="text-primary font-semibold text-lg mb-2">
                                      {exp.company}
                                    </p>
                                  </div>
                                  {exp.companyLogo && (
                                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                                      <Image
                                        src={exp.companyLogo}
                                        alt={exp.company}
                                        fill
                                        className="object-contain p-2"
                                      />
                                    </div>
                                  )}
                                </div>

                                <div className="flex flex-wrap gap-3 mb-4 text-sm text-muted-foreground">
                                  {exp.location && (
                                    <div className="flex items-center gap-1">
                                      <MapPin className="h-4 w-4" />
                                      {exp.location}
                                    </div>
                                  )}
                                  {exp.startDate && (
                                    <div className="flex items-center gap-1">
                                      <Calendar className="h-4 w-4" />
                                      {calculateDuration(exp.startDate, exp.endDate, exp.current)}
                                    </div>
                                  )}
                                </div>

                                <p className="text-muted-foreground mb-4 whitespace-pre-wrap">
                                  {exp.description}
                                </p>

                                {/* Responsibilities */}
                                {exp.responsibilities && exp.responsibilities.length > 0 && (
                                  <div className="mb-4">
                                    <h4 className="font-semibold mb-2 text-sm">Key Responsibilities:</h4>
                                    <ul className="space-y-1">
                                      {exp.responsibilities.map((resp, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                                          <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                                          <span>{resp}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          </BackgroundGradient>
                        </div>

                        {/* Date Badge (Desktop) */}
                        <div className="hidden md:flex flex-1 items-center justify-center">
                          <Badge variant={exp.current ? "default" : "secondary"} className="px-4 py-2">
                            <Calendar className="mr-2 h-4 w-4" />
                            <div className="text-center">
                              <div>{formatDate(exp.startDate)} - {exp.current ? "Present" : formatDate(exp.endDate)}</div>
                              <div className="text-xs opacity-80">
                                {calculateDuration(exp.startDate, exp.endDate, exp.current)}
                              </div>
                            </div>
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {experiences.length > 0 && (
        <section className="py-20 bg-muted/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Experience Summary</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl font-bold text-primary mb-2">
                      {experiences.length}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Positions</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl font-bold text-primary mb-2">
                      {new Set(experiences.map(e => e.company)).size}
                    </div>
                    <div className="text-sm text-muted-foreground">Companies</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl font-bold text-primary mb-2">
                      {totalYears}+
                    </div>
                    <div className="text-sm text-muted-foreground">Years Experience</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl font-bold text-primary mb-2">
                      {experiences.filter(e => e.current).length}
                    </div>
                    <div className="text-sm text-muted-foreground">Current Roles</div>
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
