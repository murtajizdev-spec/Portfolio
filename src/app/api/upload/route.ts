import { auth } from "@/lib/auth";
import { uploadImage } from "@/lib/cloudinary";
import { errorResponse, successResponse, unauthorizedResponse } from "@/utils/api";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return unauthorizedResponse();
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return errorResponse("No file provided");
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    const result = await uploadImage(base64);
    return successResponse(result, 201);
  } catch (error) {
    console.error("POST /api/upload:", error);
    return errorResponse("Failed to upload image", 500);
  }
}
