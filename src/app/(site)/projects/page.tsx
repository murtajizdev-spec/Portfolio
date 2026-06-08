export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { generateSEO } from "@/lib/seo";
import { getProjects, getCategories, getTechnologies } from "@/services/project.service";
import { ProjectsGrid } from "@/components/portfolio/projects-grid";
import { ProjectCardSkeleton } from "@/components/ui/skeleton";
import type { IProject, PaginatedResponse } from "@/types";

export const metadata = generateSEO({
  title: "Projects",
  description: "Browse my portfolio of web development projects.",
  path: "/projects",
});

const emptyData: PaginatedResponse<IProject> = {
  data: [],
  pagination: { page: 1, limit: 9, total: 0, totalPages: 0 },
};

export default async function ProjectsPage() {
  let initialData = emptyData;
  let categories: string[] = [];
  let technologies: string[] = [];

  try {
    [initialData, categories, technologies] = await Promise.all([
      getProjects({ published: true, limit: 9 }),
      getCategories(),
      getTechnologies(),
    ]);
  } catch {
    // DB not connected yet
  }

  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Projects</h1>
          <p className="mt-4 text-muted max-w-2xl">
            A collection of projects showcasing my work in full-stack development, UI design,
            and problem-solving.
          </p>
        </div>

        <Suspense
          fallback={
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProjectCardSkeleton key={i} />
              ))}
            </div>
          }
        >
          <ProjectsGrid
            initialData={initialData}
            categories={categories}
            technologies={technologies}
          />
        </Suspense>
      </div>
    </div>
  );
}
