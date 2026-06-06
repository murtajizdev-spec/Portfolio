import { getDashboardStats } from "@/services/project.service";
import { auth } from "@/lib/auth";
import { errorResponse, successResponse, unauthorizedResponse } from "@/utils/api";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return unauthorizedResponse();
    }

    const stats = await getDashboardStats();
    return successResponse(stats);
  } catch (error) {
    console.error("GET /api/dashboard/stats:", error);
    return errorResponse("Failed to fetch dashboard stats", 500);
  }
}
