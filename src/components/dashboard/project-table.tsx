"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pencil, Trash2, Star, Eye, EyeOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import type { IProject } from "@/types";

interface ProjectTableProps {
  projects: IProject[];
}

export function ProjectTable({ projects: initialProjects }: ProjectTableProps) {
  const router = useRouter();
  const [projects, setProjects] = useState(initialProjects);
  const [deleting, setDeleting] = useState<string | null>(null);

  const toggleField = async (id: string, field: "published" | "featured", value: boolean) => {
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      });
      if (!res.ok) throw new Error("Failed to update");
      setProjects((prev) =>
        prev.map((p) => (p._id === id ? { ...p, [field]: value } : p)),
      );
      toast.success(`Project ${field === "published" ? (value ? "published" : "unpublished") : value ? "featured" : "unfeatured"}`);
      router.refresh();
    } catch {
      toast.error("Failed to update project");
    }
  };

  const deleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setProjects((prev) => prev.filter((p) => p._id !== id));
      toast.success("Project deleted");
      router.refresh();
    } catch {
      toast.error("Failed to delete project");
    } finally {
      setDeleting(null);
    }
  };

  if (projects.length === 0) {
    return (
      <EmptyState
        title="No projects yet"
        description="Create your first project to get started."
        action={
          <Link href="/admin/projects/new">
            <Button>Create Project</Button>
          </Link>
        }
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-muted">
            <th className="pb-3 pr-4 font-medium">Project</th>
            <th className="pb-3 pr-4 font-medium hidden sm:table-cell">Category</th>
            <th className="pb-3 pr-4 font-medium hidden md:table-cell">Status</th>
            <th className="pb-3 pr-4 font-medium hidden lg:table-cell">Views</th>
            <th className="pb-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project._id} className="border-b border-border">
              <td className="py-4 pr-4">
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-14 rounded overflow-hidden shrink-0">
                    {project.thumbnail ? (
                      <Image src={project.thumbnail} alt="" fill className="object-cover" sizes="56px" />
                    ) : (
                      <div className="h-full w-full bg-foreground/5" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{project.title}</p>
                    <p className="text-xs text-muted truncate max-w-[200px]">{project.slug}</p>
                  </div>
                </div>
              </td>
              <td className="py-4 pr-4 hidden sm:table-cell">
                <Badge variant="outline">{project.category}</Badge>
              </td>
              <td className="py-4 pr-4 hidden md:table-cell">
                <div className="flex gap-1">
                  <Badge variant={project.published ? "accent" : "default"}>
                    {project.published ? "Published" : "Draft"}
                  </Badge>
                  {project.featured && <Badge variant="accent">Featured</Badge>}
                </div>
              </td>
              <td className="py-4 pr-4 hidden lg:table-cell text-muted">{project.views}</td>
              <td className="py-4">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleField(project._id, "published", !project.published)}
                    title={project.published ? "Unpublish" : "Publish"}
                  >
                    {project.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleField(project._id, "featured", !project.featured)}
                    title={project.featured ? "Unfeature" : "Feature"}
                  >
                    <Star className={`h-4 w-4 ${project.featured ? "fill-accent text-accent" : ""}`} />
                  </Button>
                  <Link href={`/admin/projects/${project._id}/edit`}>
                    <Button variant="ghost" size="sm">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteProject(project._id)}
                    loading={deleting === project._id}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
