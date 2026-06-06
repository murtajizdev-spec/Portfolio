import { connectDB } from "@/lib/mongodb";
import { Project } from "@/models/Project";
import type { IProject, PaginatedResponse } from "@/types";

interface ProjectQueryOptions {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  technology?: string;
  featured?: boolean;
  published?: boolean;
}

function serializeProject(doc: Record<string, unknown> | { toObject?: () => Record<string, unknown> }): IProject {
  const raw =
    typeof (doc as { toObject?: () => Record<string, unknown> }).toObject === "function"
      ? (doc as { toObject: () => Record<string, unknown> }).toObject()
      : (doc as Record<string, unknown>);
  return {
    _id: String(raw._id),
    title: raw.title as string,
    slug: raw.slug as string,
    shortDescription: raw.shortDescription as string,
    fullDescription: raw.fullDescription as string,
    category: raw.category as string,
    technologies: raw.technologies as string[],
    thumbnail: raw.thumbnail as string,
    gallery: (raw.gallery as string[]) || [],
    githubUrl: raw.githubUrl as string | undefined,
    liveUrl: raw.liveUrl as string | undefined,
    features: (raw.features as string[]) || [],
    challenges: raw.challenges as string | undefined,
    solutions: raw.solutions as string | undefined,
    featured: raw.featured as boolean,
    published: raw.published as boolean,
    views: (raw.views as number) || 0,
    createdAt: raw.createdAt as Date,
    updatedAt: raw.updatedAt as Date,
  };
}

export async function getProjects(
  options: ProjectQueryOptions = {},
): Promise<PaginatedResponse<IProject>> {
  await connectDB();

  const page = Math.max(1, options.page || 1);
  const limit = Math.min(50, Math.max(1, options.limit || 9));
  const skip = (page - 1) * limit;

  const filter: Record<string, unknown> = {};

  if (options.published !== undefined) filter.published = options.published;
  if (options.featured !== undefined) filter.featured = options.featured;
  if (options.category) filter.category = options.category;
  if (options.technology) filter.technologies = options.technology;

  if (options.search) {
    filter.$text = { $search: options.search };
  }

  const [projects, total] = await Promise.all([
    Project.find(filter)
      .sort(options.search ? { score: { $meta: "textScore" } } : { createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Project.countDocuments(filter),
  ]);

  return {
    data: projects.map((p) => serializeProject(p)),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getProjectBySlug(slug: string, incrementViews = false): Promise<IProject | null> {
  await connectDB();

  if (incrementViews) {
    const project = await Project.findOneAndUpdate(
      { slug, published: true },
      { $inc: { views: 1 } },
      { returnDocument: "after" },
    ).lean();
    return project ? serializeProject(project) : null;
  }

  const project = await Project.findOne({ slug, published: true }).lean();
  return project ? serializeProject(project) : null;
}

export async function getProjectById(id: string): Promise<IProject | null> {
  await connectDB();
  const project = await Project.findById(id).lean();
  return project ? serializeProject(project) : null;
}

export async function getFeaturedProjects(limit = 3): Promise<IProject[]> {
  await connectDB();
  const projects = await Project.find({ published: true, featured: true })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
  return projects.map((p) => serializeProject(p));
}

export async function getCategories(): Promise<string[]> {
  await connectDB();
  return Project.distinct("category", { published: true });
}

export async function getTechnologies(): Promise<string[]> {
  await connectDB();
  const projects = await Project.find({ published: true }).select("technologies").lean();
  const techSet = new Set<string>();
  projects.forEach((p) => p.technologies.forEach((t) => techSet.add(t)));
  return Array.from(techSet).sort();
}

export async function getDashboardStats() {
  await connectDB();

  const [totalProjects, featuredProjects, categories, recentProjects, viewsAgg, unreadMessages, subscribersCount] =
    await Promise.all([
      Project.countDocuments(),
      Project.countDocuments({ featured: true }),
      Project.distinct("category"),
      Project.find().sort({ createdAt: -1 }).limit(5).lean(),
      Project.aggregate([{ $group: { _id: null, total: { $sum: "$views" } } }]),
      (await import("@/models/ContactMessage")).ContactMessage.countDocuments({ read: false }),
      (await import("@/models/NewsletterSubscriber")).NewsletterSubscriber.countDocuments(),
    ]);

  return {
    totalProjects,
    featuredProjects,
    categoriesCount: categories.length,
    recentProjects: recentProjects.map((p) => serializeProject(p)),
    totalViews: viewsAgg[0]?.total || 0,
    unreadMessages,
    subscribersCount,
  };
}

export { serializeProject };
