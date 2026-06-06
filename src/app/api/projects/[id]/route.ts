import { connectDB } from "@/lib/mongodb";
import { Project } from "@/models/Project";
import { getProjectById, serializeProject } from "@/services/project.service";
import { projectUpdateSchema } from "@/validators/project";
import { auth } from "@/lib/auth";
import {
  errorResponse,
  notFoundResponse,
  successResponse,
  unauthorizedResponse,
  validationErrorResponse,
} from "@/utils/api";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_req: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const project = await getProjectById(id);
    if (!project) return notFoundResponse("Project not found");

    const session = await auth();
    if (!project.published && session?.user?.role !== "ADMIN") {
      return notFoundResponse("Project not found");
    }

    return successResponse(project);
  } catch (error) {
    console.error("GET /api/projects/[id]:", error);
    return errorResponse("Failed to fetch project", 500);
  }
}

export async function PUT(req: Request, context: RouteContext) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return unauthorizedResponse();
    }

    const { id } = await context.params;
    const body = await req.json();
    const parsed = projectUpdateSchema.safeParse(body);
    if (!parsed.success) return validationErrorResponse(parsed.error);

    await connectDB();

    if (parsed.data.slug) {
      const existing = await Project.findOne({ slug: parsed.data.slug, _id: { $ne: id } });
      if (existing) return errorResponse("Slug already in use", 409);
    }

    const project = await Project.findByIdAndUpdate(
      id,
      {
        ...parsed.data,
        githubUrl: parsed.data.githubUrl || undefined,
        liveUrl: parsed.data.liveUrl || undefined,
      },
      { returnDocument: "after", runValidators: true },
    ).lean();

    if (!project) return notFoundResponse("Project not found");
    return successResponse(serializeProject(project));
  } catch (error) {
    console.error("PUT /api/projects/[id]:", error);
    return errorResponse("Failed to update project", 500);
  }
}

export async function DELETE(_req: Request, context: RouteContext) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return unauthorizedResponse();
    }

    const { id } = await context.params;
    await connectDB();
    const project = await Project.findByIdAndDelete(id);
    if (!project) return notFoundResponse("Project not found");

    return successResponse({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/projects/[id]:", error);
    return errorResponse("Failed to delete project", 500);
  }
}

export async function PATCH(req: Request, context: RouteContext) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return unauthorizedResponse();
    }

    const { id } = await context.params;
    const body = await req.json();
    const allowedFields = ["published", "featured"];
    const updates: Record<string, boolean> = {};

    for (const field of allowedFields) {
      if (typeof body[field] === "boolean") {
        updates[field] = body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return errorResponse("No valid fields to update");
    }

    await connectDB();
    const project = await Project.findByIdAndUpdate(id, updates, { returnDocument: "after" }).lean();
    if (!project) return notFoundResponse("Project not found");

    return successResponse(serializeProject(project));
  } catch (error) {
    console.error("PATCH /api/projects/[id]:", error);
    return errorResponse("Failed to update project", 500);
  }
}
