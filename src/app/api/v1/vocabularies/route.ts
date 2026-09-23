import { NextRequest } from "next/server";
import { authenticateRequest } from "@/lib/api/auth/server";
import { vocabularyService } from "@/lib/api/vocabulary";
import { jsonResponse, errorResponse } from "@/lib/api/response";

export async function GET(req: NextRequest) {
  try {
    const userID = await authenticateRequest(req);
    const token = req.headers.get("authorization")!.replace("Bearer ", "");

    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || undefined;
    const status = searchParams.get("status") || undefined;
    const favoriteParam = searchParams.get("favorite");
    const favorite = favoriteParam ? favoriteParam === "true" || favoriteParam === "1" : undefined;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    const result = await vocabularyService.list(userID, token, {
      q,
      status,
      favorite,
      page,
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
    const created = await vocabularyService.create(userID, token, body);

    return jsonResponse(created, 201);
  } catch (err) {
    return errorResponse(err);
  }
}
