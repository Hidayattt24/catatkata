import { NextRequest } from "next/server";
import { authenticateRequest } from "@/lib/api/auth/server";
import { vocabularyService } from "@/lib/api/vocabulary";
import { jsonResponse, errorResponse } from "@/lib/api/response";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userID = await authenticateRequest(req);
    const token = req.headers.get("authorization")!.replace("Bearer ", "");

    const vocab = await vocabularyService.getByID(userID, token, id);
    return jsonResponse(vocab, 200);
  } catch (err) {
    return errorResponse(err);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userID = await authenticateRequest(req);
    const token = req.headers.get("authorization")!.replace("Bearer ", "");

    const body = await req.json();
    const updated = await vocabularyService.update(userID, token, id, body);
    return jsonResponse(updated, 200);
  } catch (err) {
    return errorResponse(err);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userID = await authenticateRequest(req);
    const token = req.headers.get("authorization")!.replace("Bearer ", "");

    await vocabularyService.delete(userID, token, id);
    return jsonResponse({ success: true, message: "Vocabulary deleted successfully" }, 200);
  } catch (err) {
    return errorResponse(err);
  }
}
