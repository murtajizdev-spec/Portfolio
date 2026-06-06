import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/portfolio/project-card";
import { EmptyState } from "@/components/ui/empty-state";
import type { IProject } from "@/types";

interface FeaturedProjectsProps {
  projects: IProject[];
}

export function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  return (
    <section className="py-20 border-t border-border">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Featured Projects</h2>
            <p className="mt-2 text-muted">Highlighted work I&apos;m most proud of.</p>
          </div>
          <Link href="/projects" className="hidden sm:block">
            <Button variant="ghost">
              View All
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {projects.length === 0 ? (
          <EmptyState
            title="No featured projects yet"
            description="Check back soon for featured work."
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        )}

        <div className="mt-8 sm:hidden">
          <Link href="/projects">
            <Button variant="outline" className="w-full">
              View All Projects
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
