import { NextRequest } from "next/server";
import { authenticateRequest } from "@/lib/api/auth/server";
import { verbService } from "@/lib/api/verb";
import { jsonResponse, errorResponse } from "@/lib/api/response";

export async function GET(req: NextRequest) {
  try {
    const userID = await authenticateRequest(req);
    const token = req.headers.get("authorization")!.replace("Bearer ", "");

    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || undefined;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    const result = await verbService.list(userID, token, {
      q,
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
    const created = await verbService.create(userID, token, body);

    return jsonResponse(created, 201);
  } catch (err) {
    return errorResponse(err);
  }
}
