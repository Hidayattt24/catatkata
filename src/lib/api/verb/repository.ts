import { Verb, PaginatedVerbs } from "./types";
import { CreateVerbDTO, UpdateVerbDTO, ListVerbQuery } from "./dto";
import { getSupabaseServerClient } from "@/lib/supabase";
import { DBError, NotFoundError } from "../errors";

export interface VerbRepository {
  create(userID: string, token: string, input: CreateVerbDTO): Promise<Verb>;
  getByID(userID: string, token: string, id: string): Promise<Verb>;
  list(userID: string, token: string, query: ListVerbQuery): Promise<PaginatedVerbs>;
  update(userID: string, token: string, id: string, input: UpdateVerbDTO): Promise<Verb>;
  delete(userID: string, token: string, id: string): Promise<void>;
}

export class SupabaseVerbRepository implements VerbRepository {
  async create(userID: string, token: string, input: CreateVerbDTO): Promise<Verb> {
    const supabase = getSupabaseServerClient(token);

    const { data, error } = await supabase
      .from("verbs")
      .insert({
        user_id: userID,
        indonesian: input.indonesian,
        v1: input.v1,
        v2: input.v2,
        v3: input.v3,
        ving: input.ving,
      })
      .select()
      .single();

    if (error) {
      throw new DBError(`Failed to create verb: ${error.message}`);
    }

    return data as Verb;
  }

  async getByID(userID: string, token: string, id: string): Promise<Verb> {
    const supabase = getSupabaseServerClient(token);

    const { data, error } = await supabase
      .from("verbs")
      .select("*")
      .eq("id", id)
      .eq("user_id", userID)
      .single();

    if (error || !data) {
      throw new NotFoundError("Verb not found");
    }

    return data as Verb;
  }

  async list(userID: string, token: string, options: ListVerbQuery): Promise<PaginatedVerbs> {
    const supabase = getSupabaseServerClient(token);
    const { q, page = 1, limit = 20 } = options;

    let queryBuilder = supabase
      .from("verbs")
      .select("*", { count: "exact" })
      .eq("user_id", userID)
      .order("created_at", { ascending: false });

    if (q) {
      const qLower = q.toLowerCase();
      queryBuilder = queryBuilder.or(
        `indonesian.ilike.%${qLower}%,v1.ilike.%${qLower}%,v2.ilike.%${qLower}%,v3.ilike.%${qLower}%,ving.ilike.%${qLower}%`
      );
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;
    queryBuilder = queryBuilder.range(from, to);

    const { data, count, error } = await queryBuilder;

    if (error) {
      throw new DBError(`Failed to list verbs: ${error.message}`);
    }

    return {
      data: (data || []) as Verb[],
      meta: {
        page,
        limit,
        total: count || (data || []).length,
      },
    };
  }

  async update(userID: string, token: string, id: string, input: UpdateVerbDTO): Promise<Verb> {
    const supabase = getSupabaseServerClient(token);

    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (input.indonesian !== undefined) updateData.indonesian = input.indonesian;
    if (input.v1 !== undefined) updateData.v1 = input.v1;
    if (input.v2 !== undefined) updateData.v2 = input.v2;
    if (input.v3 !== undefined) updateData.v3 = input.v3;
    if (input.ving !== undefined) updateData.ving = input.ving;

    const { data, error } = await supabase
      .from("verbs")
      .update(updateData)
      .eq("id", id)
      .eq("user_id", userID)
      .select()
      .single();

    if (error || !data) {
      throw new DBError(`Failed to update verb: ${error?.message || "Not found"}`);
    }

    return data as Verb;
  }

  async delete(userID: string, token: string, id: string): Promise<void> {
    const supabase = getSupabaseServerClient(token);

    const { error } = await supabase
      .from("verbs")
      .delete()
      .eq("id", id)
      .eq("user_id", userID);

    if (error) {
      throw new DBError(`Failed to delete verb: ${error.message}`);
    }
  }
}
