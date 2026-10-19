import { NextRequest } from "next/server";
import { authenticateRequest } from "@/lib/api/auth/server";
import { lockedInService } from "@/lib/api/locked-in";
import { jsonResponse, errorResponse } from "@/lib/api/response";

export async function GET(req: NextRequest) {
  try {
    const userID = await authenticateRequest(req);
    const token = req.headers.get("authorization")!.replace("Bearer ", "");

    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get("startDate") || undefined;
    const endDate = searchParams.get("endDate") || undefined;
    const date = searchParams.get("date") || undefined;
    const limit = parseInt(searchParams.get("limit") || "100", 10);

    const result = await lockedInService.list(userID, token, {
      startDate,
      endDate,
      date,
      limit,
    });

    return jsonResponse(result, 200);
  } catch (err) {
    return errorResponse(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const userID = await authenticateRequest(req);
    const token = req.headers.get("authorization")!.replace("Bearer ", "");

    const body = await req.json();
    const created = await lockedInService.create(userID, token, body);

    return jsonResponse(created, 201);
  } catch (err) {
    return errorResponse(err);
  }
}
