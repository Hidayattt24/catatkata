import { NextResponse } from "next/server";
import { AppError } from "./errors";

export function jsonResponse<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function errorResponse(err: unknown) {
  if (err instanceof AppError) {
    return NextResponse.json(
      {
        error: {
          code: err.code,
          message: err.message,
        },
      },
      { status: err.statusCode }
    );
  }

  const message = err instanceof Error ? err.message : "Internal Server Error";
  return NextResponse.json(
    {
      error: {
        code: "INTERNAL_ERROR",
        message,
      },
    },
    { status: 500 }
  );
}
