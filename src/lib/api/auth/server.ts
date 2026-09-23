import { NextRequest } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase";
import { UnauthorizedError } from "../errors";

export async function authenticateRequest(req: NextRequest): Promise<string> {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    throw new UnauthorizedError("Missing authorization header");
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0].toLowerCase() !== "bearer") {
    throw new UnauthorizedError("Invalid authorization header format");
  }

  const token = parts[1];
  const supabase = getSupabaseServerClient(token);
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) {
    throw new UnauthorizedError("Invalid or expired access token");
  }

  return user.id;
}
