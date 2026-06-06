import { connectDB } from "@/lib/mongodb";
import { ContactMessage } from "@/models/ContactMessage";
import { contactSchema } from "@/validators/contact";
import { errorResponse, successResponse, validationErrorResponse } from "@/utils/api";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) return validationErrorResponse(parsed.error);

    await connectDB();
    const message = await ContactMessage.create(parsed.data);

    return successResponse(
      { message: "Message sent successfully", id: message._id.toString() },
      201,
    );
  } catch (error) {
    console.error("POST /api/contact:", error);
    return errorResponse("Failed to send message", 500);
  }
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return errorResponse("Unauthorized", 401);
    }

    await connectDB();
    const messages = await ContactMessage.find().sort({ createdAt: -1 }).lean();

    return successResponse(
      messages.map((m) => ({
        _id: m._id.toString(),
        name: m.name,
        email: m.email,
        subject: m.subject,
        message: m.message,
        read: m.read,
        createdAt: m.createdAt,
      })),
    );
  } catch (error) {
    console.error("GET /api/contact:", error);
    return errorResponse("Failed to fetch messages", 500);
  }
}
