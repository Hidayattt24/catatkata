import { NextRequest } from "next/server";
import { authenticateRequest } from "@/lib/api/auth/server";
import { vocabularyService } from "@/lib/api/vocabulary";
import { jsonResponse, errorResponse } from "@/lib/api/response";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userID = await authenticateRequest(req);
    const token = req.headers.get("authorization")!.replace("Bearer ", "");

    const body = await req.json();
    await vocabularyService.updateStatus(userID, token, id, body.status);

    return jsonResponse({ success: true, status: body.status }, 200);
  } catch (err) {
    return errorResponse(err);
  }
}
