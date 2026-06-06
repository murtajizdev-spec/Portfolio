"use client";

import Link from "next/link";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { GitHubIcon } from "@/components/ui/social-icons";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { IProject } from "@/types";

interface ProjectCardProps {
  project: IProject;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-accent/5">
      <Link href={`/projects/${project.slug}`}>
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={project.thumbnail}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {project.featured && (
            <span className="absolute top-3 left-3">
              <Badge variant="accent">Featured</Badge>
            </span>
          )}
        </div>
      </Link>
      <CardContent className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/projects/${project.slug}`}>
            <h3 className="font-semibold group-hover:text-accent transition-colors">
              {project.title}
            </h3>
          </Link>
          <Badge variant="outline">{project.category}</Badge>
        </div>
        <p className="text-sm text-muted line-clamp-2">{project.shortDescription}</p>
        <div className="flex flex-wrap gap-1.5">
          {project.technologies.slice(0, 4).map((tech) => (
            <Badge key={tech} variant="default">
              {tech}
            </Badge>
          ))}
          {project.technologies.length > 4 && (
            <Badge variant="default">+{project.technologies.length - 4}</Badge>
          )}
        </div>
        <div className="flex gap-2 pt-1">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted hover:text-foreground transition-colors"
              aria-label="GitHub"
              onClick={(e) => e.stopPropagation()}
            >
              <GitHubIcon className="h-4 w-4" />
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted hover:text-foreground transition-colors"
              aria-label="Live demo"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
