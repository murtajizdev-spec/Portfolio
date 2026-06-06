import { connectDB } from "@/lib/mongodb";
import { Project } from "@/models/Project";
import { getProjects } from "@/services/project.service";
import { projectSchema } from "@/validators/project";
import { errorResponse, successResponse, validationErrorResponse } from "@/utils/api";
import { auth } from "@/lib/auth";
import { generateSlug } from "@/utils/slug";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const session = await auth();
    const isAdmin = session?.user?.role === "ADMIN";

    const result = await getProjects({
      page: Number(searchParams.get("page")) || 1,
      limit: Number(searchParams.get("limit")) || 9,
      search: searchParams.get("search") || undefined,
      category: searchParams.get("category") || undefined,
      technology: searchParams.get("technology") || undefined,
      featured: searchParams.get("featured") === "true" ? true : undefined,
      published: isAdmin ? undefined : true,
    });

    return successResponse(result);
  } catch (error) {
    console.error("GET /api/projects:", error);
    return errorResponse("Failed to fetch projects", 500);
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return errorResponse("Unauthorized", 401);
    }

    const body = await req.json();
    const parsed = projectSchema.safeParse(body);
    if (!parsed.success) return validationErrorResponse(parsed.error);

    await connectDB();

    const slug = parsed.data.slug || generateSlug(parsed.data.title);
    const existing = await Project.findOne({ slug });
    if (existing) {
      return errorResponse("A project with this slug already exists", 409);
    }

    const project = await Project.create({
      ...parsed.data,
      slug,
      githubUrl: parsed.data.githubUrl || undefined,
      liveUrl: parsed.data.liveUrl || undefined,
    });

    return successResponse(project, 201);
  } catch (error) {
    console.error("POST /api/projects:", error);
    return errorResponse("Failed to create project", 500);
  }
}
