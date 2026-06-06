import Link from "next/link";
import { getProjects } from "@/services/project.service";
import { ProjectTable } from "@/components/dashboard/project-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default async function AdminProjectsPage() {
  let projects: Awaited<ReturnType<typeof getProjects>>["data"] = [];
  try {
    const result = await getProjects({ limit: 100 });
    projects = result.data;
  } catch {
    // DB not connected
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-muted text-sm mt-1">Manage your portfolio projects</p>
        </div>
        <Link href="/admin/projects/new">
          <Button>
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </Link>
      </div>

      <div className="glass rounded-xl p-6">
        <ProjectTable projects={projects} />
      </div>
    </div>
  );
}
