import { connectDB } from "@/lib/mongodb";
import { ContactMessage } from "@/models/ContactMessage";
import { auth } from "@/lib/auth";
import { errorResponse, successResponse } from "@/utils/api";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return errorResponse("Unauthorized", 401);
    }

    if (!id) {
      return errorResponse("Message ID is required", 400);
    }

    await connectDB();
    const deleted = await ContactMessage.findByIdAndDelete(id);
    if (!deleted) {
      return errorResponse("Message not found", 404);
    }

    return successResponse({ message: "Message deleted" });
  } catch (error) {
    console.error("DELETE /api/contact/[id]:", error);
    return errorResponse("Failed to delete message", 500);
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return errorResponse("Unauthorized", 401);
    }

    if (!id) {
      return errorResponse("Message ID is required", 400);
    }

    const body = await req.json();
    const read = body?.read;
    if (typeof read !== "boolean") {
      return errorResponse("Invalid request body", 400);
    }

    await connectDB();
    const message = await ContactMessage.findByIdAndUpdate(
      id,
      { read },
      { returnDocument: "after" },
    );

    if (!message) {
      return errorResponse("Message not found", 404);
    }

    return successResponse({ message: "Message updated", read: message.read });
  } catch (error) {
    console.error("PATCH /api/contact/[id]:", error);
    return errorResponse("Failed to update message", 500);
  }
}
