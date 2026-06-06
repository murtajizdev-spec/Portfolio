import { ProjectForm } from "@/components/dashboard/project-form";

export default function NewProjectPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Create Project</h1>
        <p className="text-muted text-sm mt-1">Add a new project to your portfolio</p>
      </div>
      <ProjectForm />
    </div>
  );
}
