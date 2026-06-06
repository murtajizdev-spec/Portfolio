import { z } from "zod";

export const projectSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(120),
  slug: z
    .string()
    .min(3)
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase with hyphens")
    .optional()
    .or(z.literal("")),
  shortDescription: z.string().min(10).max(300),
  fullDescription: z.string().min(20),
  category: z.string().min(2).max(50),
  technologies: z.array(z.string().min(1)).min(1, "Add at least one technology"),
  thumbnail: z.string().url("Thumbnail must be a valid URL"),
  gallery: z.array(z.string().url()),
  githubUrl: z.string().url().optional().or(z.literal("")),
  liveUrl: z.string().url().optional().or(z.literal("")),
  features: z.array(z.string()),
  challenges: z.string().optional(),
  solutions: z.string().optional(),
  featured: z.boolean(),
  published: z.boolean(),
});

export const projectUpdateSchema = projectSchema.partial();

export type ProjectInput = z.infer<typeof projectSchema>;
