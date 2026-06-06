import { connectDB } from "@/lib/mongodb";
import { NewsletterSubscriber } from "@/models/NewsletterSubscriber";
import { newsletterSchema } from "@/validators/contact";
import { auth } from "@/lib/auth";
import { errorResponse, successResponse, validationErrorResponse } from "@/utils/api";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return errorResponse("Unauthorized", 401);
    }

    await connectDB();
    const subscribers = await NewsletterSubscriber.find().sort({ subscribedAt: -1 }).lean();

    return successResponse(
      subscribers.map((subscriber) => ({
        _id: subscriber._id.toString(),
        email: subscriber.email,
        subscribedAt: subscriber.subscribedAt,
      })),
    );
  } catch (error) {
    console.error("GET /api/newsletter:", error);
    return errorResponse("Failed to fetch subscribers", 500);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = newsletterSchema.safeParse(body);
    if (!parsed.success) return validationErrorResponse(parsed.error);

    await connectDB();

    const existing = await NewsletterSubscriber.findOne({ email: parsed.data.email });
    if (existing) {
      return successResponse({ message: "Already subscribed" });
    }

    await NewsletterSubscriber.create({ email: parsed.data.email });
    return successResponse({ message: "Successfully subscribed" }, 201);
  } catch (error) {
    console.error("POST /api/newsletter:", error);
    return errorResponse("Failed to subscribe", 500);
  }
}
