"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { ProjectCard } from "@/components/portfolio/project-card";
import { ProjectCardSkeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { IProject, PaginatedResponse } from "@/types";

interface ProjectsGridProps {
  initialData: PaginatedResponse<IProject>;
  categories: string[];
  technologies: string[];
}

export function ProjectsGrid({ initialData, categories, technologies }: ProjectsGridProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);

  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const technology = searchParams.get("technology") || "";

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value) params.set(key, value);
        else params.delete(key);
      });
      if (!updates.page) params.delete("page");
      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams],
  );

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (page > 1) params.set("page", String(page));
        if (search) params.set("search", search);
        if (category) params.set("category", category);
        if (technology) params.set("technology", technology);

        const res = await fetch(`/api/projects?${params.toString()}`);
        const result = await res.json();
        if (res.ok) setData(result);
      } finally {
        setLoading(false);
      }
    };

    if (page !== 1 || search || category || technology) {
      fetchProjects();
    } else {
      setData(initialData);
    }
  }, [page, search, category, technology, initialData]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          <Input
            id="search"
            placeholder="Search projects..."
            defaultValue={search}
            className="pl-10"
            onChange={(e) => {
              const value = e.target.value;
              const timeout = setTimeout(() => updateParams({ search: value, page: "" }), 300);
              return () => clearTimeout(timeout);
            }}
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <select
            value={category}
            onChange={(e) => updateParams({ category: e.target.value, page: "" })}
            className="h-10 rounded-lg border border-border bg-background px-3 text-sm"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <select
            value={technology}
            onChange={(e) => updateParams({ technology: e.target.value, page: "" })}
            className="h-10 rounded-lg border border-border bg-background px-3 text-sm"
          >
            <option value="">All Technologies</option>
            {technologies.map((tech) => (
              <option key={tech} value={tech}>
                {tech}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </div>
      ) : data.data.length === 0 ? (
        <EmptyState
          title="No projects found"
          description="Try adjusting your search or filters."
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.data.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      )}

      {data.pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => updateParams({ page: String(page - 1) })}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <span className="text-sm text-muted">
            Page {page} of {data.pagination.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= data.pagination.totalPages}
            onClick={() => updateParams({ page: String(page + 1) })}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
