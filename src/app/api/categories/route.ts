import { getCategories, getTechnologies } from "@/services/project.service";
import { errorResponse, successResponse } from "@/utils/api";

export async function GET() {
  try {
    const [categories, technologies] = await Promise.all([
      getCategories(),
      getTechnologies(),
    ]);
    return successResponse({ categories, technologies });
  } catch (error) {
    console.error("GET /api/categories:", error);
    return errorResponse("Failed to fetch categories", 500);
  }
}
