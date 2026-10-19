import { NextRequest } from "next/server";
import { authenticateRequest } from "@/lib/api/auth/server";
import { lockedInService } from "@/lib/api/locked-in";
import { jsonResponse, errorResponse } from "@/lib/api/response";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userID = await authenticateRequest(req);
    const token = req.headers.get("authorization")!.replace("Bearer ", "");

    const task = await lockedInService.getByID(userID, token, id);
    return jsonResponse(task, 200);
  } catch (err) {
    return errorResponse(err);
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userID = await authenticateRequest(req);
    const token = req.headers.get("authorization")!.replace("Bearer ", "");

    const body = await req.json();
    const updated = await lockedInService.update(userID, token, id, body);
    return jsonResponse(updated, 200);
  } catch (err) {
    return errorResponse(err);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return PATCH(req, { params });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userID = await authenticateRequest(req);
    const token = req.headers.get("authorization")!.replace("Bearer ", "");

    await lockedInService.delete(userID, token, id);
    return jsonResponse({ success: true, message: "Task deleted successfully" }, 200);
  } catch (err) {
    return errorResponse(err);
  }
}
