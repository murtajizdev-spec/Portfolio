import { notFound } from "next/navigation";
import { getProjectById } from "@/services/project.service";
import { ProjectForm } from "@/components/dashboard/project-form";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProjectPage({ params }: PageProps) {
  const { id } = await params;
  let project = null;

  try {
    project = await getProjectById(id);
  } catch {
    // DB not connected
  }

  if (!project) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Edit Project</h1>
        <p className="text-muted text-sm mt-1">Update {project.title}</p>
      </div>
      <ProjectForm project={project} />
    </div>
  );
}
