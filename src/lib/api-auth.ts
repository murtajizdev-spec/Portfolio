import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function withAuth(
  handler: (req: Request, context?: unknown) => Promise<Response>,
) {
  return async (req: Request, context?: unknown) => {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return handler(req, context);
  };
}
