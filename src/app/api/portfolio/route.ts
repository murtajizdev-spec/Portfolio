import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { PortfolioConfig } from "@/models/PortfolioConfig";
import { portfolioConfigSchema } from "@/validators/portfolio";
import { errorResponse, successResponse, validationErrorResponse } from "@/utils/api";
import { siteConfig } from "@/lib/site-config";
import { normalizePortfolioConfig } from "@/services/portfolio.service";

export async function GET() {
  try {
    await connectDB();

    let config = await PortfolioConfig.findOne().lean();
    if (!config) {
      const created = await PortfolioConfig.create({
        author: siteConfig.author,
        homepage: siteConfig.homepage,
        experience: siteConfig.experience,
        education: siteConfig.education,
        certifications: siteConfig.certifications,
        skills: siteConfig.skills,
      });
      config = created.toObject();
    }

    return successResponse(normalizePortfolioConfig(config as any));
  } catch (error) {
    console.error("GET /api/portfolio:", error);
    return errorResponse("Failed to fetch portfolio configuration", 500);
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return errorResponse("Unauthorized", 401);
    }

    const body = await req.json();
    const parsed = portfolioConfigSchema.safeParse(body);
    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    await connectDB();
    const config = await PortfolioConfig.findOneAndUpdate(
      {},
      parsed.data,
      {
        returnDocument: "after",
        upsert: true,
        runValidators: true,
      },
    ).lean();

    if (!config) {
      return errorResponse("Failed to save portfolio configuration", 500);
    }

    return successResponse(normalizePortfolioConfig(config as any));
  } catch (error) {
    console.error("PUT /api/portfolio:", error);
    return errorResponse("Failed to update portfolio configuration", 500);
  }
}
