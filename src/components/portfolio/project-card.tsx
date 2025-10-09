"use client";

import Link from "next/link";
import Image from "next/image";
import { Project } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ExternalLink, Github, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="relative aspect-video overflow-hidden bg-muted">
        {project.thumbnail ? (
          <Image
            src={project.thumbnail}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gradient-to-br from-primary/20 to-primary/5">
            <span className="text-4xl font-bold text-muted-foreground/20">
              {project.title.charAt(0)}
            </span>
          </div>
        )}
        {project.featured && (
          <div className="absolute top-3 right-3 bg-yellow-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full flex items-center gap-1 text-xs font-medium">
            <Star className="h-3 w-3 fill-current" />
            Featured
          </div>
        )}
      </div>

      <CardContent className="p-6">
        <Link href={`/projects/${project.id}`}>
          <h3 className="text-xl font-bold mb-2 hover:text-primary transition-colors line-clamp-1">
            {project.title}
          </h3>
        </Link>
        
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {project.description}
        </p>

        <div className="mb-4">
          <Badge variant="secondary" className="text-xs">
            {project.category}
          </Badge>
        </div>

        <div className="flex flex-wrap gap-2">
          {project.technologies.slice(0, 3).map((tech) => (
            <Badge key={tech} variant="outline" className="text-xs">
              {tech}
            </Badge>
          ))}
          {project.technologies.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{project.technologies.length - 3}
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="px-6 pb-6 pt-0 flex gap-2">
        {project.liveUrl && (
          <Button variant="outline" size="sm" asChild className="flex-1">
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              Live Demo
            </a>
          </Button>
        )}
        {project.githubUrl && (
          <Button variant="outline" size="sm" asChild className="flex-1">
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
              <Github className="h-4 w-4 mr-2" />
              GitHub
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
