import { NextResponse } from "next/server";
import type { ZodError } from "zod";

export function successResponse<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function errorResponse(message: string, status = 400, details?: unknown) {
  return NextResponse.json({ error: message, details }, { status });
}

export function validationErrorResponse(error: ZodError) {
  return errorResponse("Validation failed", 422, error.flatten().fieldErrors);
}

export function unauthorizedResponse(message = "Unauthorized") {
  return errorResponse(message, 401);
}

export function forbiddenResponse(message = "Forbidden") {
  return errorResponse(message, 403);
}

export function notFoundResponse(message = "Not found") {
  return errorResponse(message, 404);
}
