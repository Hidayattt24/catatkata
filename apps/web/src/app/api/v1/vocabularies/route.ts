import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    const supabase = getSupabaseServerClient(token);
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Unauthorized request" } },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";
    const status = searchParams.get("status") || "";
    const favorite = searchParams.get("favorite");

    let query = supabase
      .from("vocabularies")
      .select("*", { count: "exact" })
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (q) {
      query = query.or(
        `indonesian.ilike.%${q}%,english.ilike.%${q}%,example_sentence.ilike.%${q}%`
      );
    }

    if (status && status !== "all" && status !== "favorite") {
      query = query.eq("status", status);
    }

    if (favorite === "true" || status === "favorite") {
      query = query.eq("is_favorite", true);
    }

    const { data, count, error } = await query;

    if (error) {
      return NextResponse.json(
        { error: { code: "DB_ERROR", message: error.message } },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: data || [],
      meta: {
        page: 1,
        limit: (data || []).length,
        total: count || (data || []).length,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message } },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    const supabase = getSupabaseServerClient(token);
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Unauthorized request" } },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      indonesian,
      english,
      part_of_speech,
      example_sentence,
      note,
      is_favorite = false,
      status = "learning",
    } = body;

    if (!indonesian?.trim() || !english?.trim()) {
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "Indonesian and English words are required",
          },
        },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("vocabularies")
      .insert({
        user_id: user.id,
        indonesian: indonesian.trim(),
        english: english.trim(),
        part_of_speech: part_of_speech || null,
        example_sentence: example_sentence?.trim() || null,
        note: note?.trim() || null,
        is_favorite: Boolean(is_favorite),
        status: status || "learning",
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: { code: "DB_ERROR", message: error.message } },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message } },
      { status: 500 }
    );
  }
}
