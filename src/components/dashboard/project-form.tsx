"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { projectSchema, type ProjectInput } from "@/validators/project";
import { generateSlug } from "@/utils/slug";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/dashboard/image-upload";
import { RichTextEditor } from "@/components/dashboard/rich-text-editor";
import type { IProject } from "@/types";

interface ProjectFormProps {
  project?: IProject;
}

export function ProjectForm({ project }: ProjectFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [techInput, setTechInput] = useState("");
  const [featureInput, setFeatureInput] = useState("");

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProjectInput>({
    resolver: zodResolver(projectSchema),
    defaultValues: project
      ? {
          title: project.title,
          slug: project.slug,
          shortDescription: project.shortDescription,
          fullDescription: project.fullDescription,
          category: project.category,
          technologies: project.technologies,
          thumbnail: project.thumbnail,
          gallery: project.gallery,
          githubUrl: project.githubUrl || "",
          liveUrl: project.liveUrl || "",
          features: project.features,
          challenges: project.challenges || "",
          solutions: project.solutions || "",
          featured: project.featured,
          published: project.published,
        }
      : {
          title: "",
          slug: "",
          shortDescription: "",
          fullDescription: "",
          category: "",
          technologies: [],
          thumbnail: "",
          gallery: [],
          githubUrl: "",
          liveUrl: "",
          features: [],
          challenges: "",
          solutions: "",
          featured: false,
          published: false,
        },
  });

  const title = watch("title");
  const technologies = watch("technologies") || [];
  const features = watch("features") || [];

  const onSubmit = async (data: ProjectInput) => {
    setLoading(true);
    try {
      const url = project ? `/api/projects/${project._id}` : "/api/projects";
      const method = project ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          slug: data.slug || generateSlug(data.title),
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to save project");

      toast.success(project ? "Project updated!" : "Project created!");
      router.push("/admin/projects");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const addTech = () => {
    if (techInput.trim() && !technologies.includes(techInput.trim())) {
      setValue("technologies", [...technologies, techInput.trim()]);
      setTechInput("");
    }
  };

  const addFeature = () => {
    if (featureInput.trim() && !features.includes(featureInput.trim())) {
      setValue("features", [...features, featureInput.trim()]);
      setFeatureInput("");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-3xl">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Title"
          id="title"
          error={errors.title?.message}
          {...register("title")}
          onBlur={() => {
            if (!watch("slug") && title) {
              setValue("slug", generateSlug(title));
            }
          }}
        />
        <Input label="Slug" id="slug" error={errors.slug?.message} {...register("slug")} />
      </div>

      <Input
        label="Short Description"
        id="shortDescription"
        error={errors.shortDescription?.message}
        {...register("shortDescription")}
      />

      <Input label="Category" id="category" error={errors.category?.message} {...register("category")} />

      <div>
        <label className="block text-sm font-medium mb-1.5">Full Description</label>
        <Controller
          name="fullDescription"
          control={control}
          render={({ field }) => (
            <RichTextEditor
              content={field.value || ""}
              onChange={field.onChange}
              placeholder="Describe your project in detail..."
            />
          )}
        />
        {errors.fullDescription && (
          <p className="text-xs text-red-500 mt-1">{errors.fullDescription.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">Technologies</label>
        <div className="flex gap-2 mb-2">
          <Input
            id="tech-input"
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            placeholder="Add technology..."
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTech())}
          />
          <Button type="button" variant="outline" onClick={addTech}>
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {technologies.map((tech) => (
            <span
              key={tech}
              className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-3 py-1 text-xs text-accent"
            >
              {tech}
              <button
                type="button"
                onClick={() => setValue("technologies", technologies.filter((t) => t !== tech))}
                className="hover:text-red-500"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        {errors.technologies && (
          <p className="text-xs text-red-500 mt-1">{errors.technologies.message}</p>
        )}
      </div>

      <Controller
        name="thumbnail"
        control={control}
        render={({ field }) => (
          <ImageUpload
            label="Thumbnail"
            images={field.value ? [field.value] : []}
            onChange={(imgs) => field.onChange(imgs[0] || "")}
            multiple={false}
          />
        )}
      />
      {errors.thumbnail && <p className="text-xs text-red-500">{errors.thumbnail.message}</p>}

      <Controller
        name="gallery"
        control={control}
        render={({ field }) => (
          <ImageUpload label="Gallery" images={field.value || []} onChange={field.onChange} />
        )}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="GitHub URL" id="githubUrl" error={errors.githubUrl?.message} {...register("githubUrl")} />
        <Input label="Live URL" id="liveUrl" error={errors.liveUrl?.message} {...register("liveUrl")} />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">Features</label>
        <div className="flex gap-2 mb-2">
          <Input
            id="feature-input"
            value={featureInput}
            onChange={(e) => setFeatureInput(e.target.value)}
            placeholder="Add feature..."
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
          />
          <Button type="button" variant="outline" onClick={addFeature}>
            Add
          </Button>
        </div>
        <ul className="space-y-1">
          {features.map((feature) => (
            <li key={feature} className="flex items-center justify-between text-sm py-1">
              {feature}
              <button
                type="button"
                onClick={() => setValue("features", features.filter((f) => f !== feature))}
                className="text-red-500 text-xs"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">Challenges</label>
        <Controller
          name="challenges"
          control={control}
          render={({ field }) => (
            <RichTextEditor content={field.value || ""} onChange={field.onChange} placeholder="Describe challenges..." />
          )}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">Solutions</label>
        <Controller
          name="solutions"
          control={control}
          render={({ field }) => (
            <RichTextEditor content={field.value || ""} onChange={field.onChange} placeholder="Describe solutions..." />
          )}
        />
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...register("featured")} className="rounded" />
          Featured
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...register("published")} className="rounded" />
          Published
        </label>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" loading={loading}>
          {project ? "Update Project" : "Create Project"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
