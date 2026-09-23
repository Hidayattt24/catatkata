import { Vocabulary, PaginatedVocabularies } from "./types";
import { CreateVocabularyDTO, UpdateVocabularyDTO, ListVocabularyQuery } from "./dto";
import { getSupabaseServerClient } from "@/lib/supabase";
import { DBError, NotFoundError } from "../errors";

export interface VocabularyRepository {
  create(userID: string, token: string, input: CreateVocabularyDTO): Promise<Vocabulary>;
  getByID(userID: string, token: string, id: string): Promise<Vocabulary>;
  list(userID: string, token: string, query: ListVocabularyQuery): Promise<PaginatedVocabularies>;
  update(userID: string, token: string, id: string, input: UpdateVocabularyDTO): Promise<Vocabulary>;
  updateFavorite(userID: string, token: string, id: string, isFavorite: boolean): Promise<void>;
  updateStatus(userID: string, token: string, id: string, status: string): Promise<void>;
  delete(userID: string, token: string, id: string): Promise<void>;
}

export class SupabaseVocabularyRepository implements VocabularyRepository {
  async create(userID: string, token: string, input: CreateVocabularyDTO): Promise<Vocabulary> {
    const supabase = getSupabaseServerClient(token);

    const { data, error } = await supabase
      .from("vocabularies")
      .insert({
        user_id: userID,
        indonesian: input.indonesian,
        english: input.english,
        part_of_speech: input.part_of_speech || null,
        example_sentence: input.example_sentence || null,
        note: input.note || null,
        is_favorite: input.is_favorite ?? false,
        status: input.status || "learning",
      })
      .select()
      .single();

    if (error) {
      throw new DBError(`Failed to create vocabulary: ${error.message}`);
    }

    return data as Vocabulary;
  }

  async getByID(userID: string, token: string, id: string): Promise<Vocabulary> {
    const supabase = getSupabaseServerClient(token);

    const { data, error } = await supabase
      .from("vocabularies")
      .select("*")
      .eq("id", id)
      .eq("user_id", userID)
      .single();

    if (error || !data) {
      throw new NotFoundError("Vocabulary not found");
    }

    return data as Vocabulary;
  }

  async list(userID: string, token: string, options: ListVocabularyQuery): Promise<PaginatedVocabularies> {
    const supabase = getSupabaseServerClient(token);
    const { q, status, favorite, page = 1, limit = 20 } = options;

    let queryBuilder = supabase
      .from("vocabularies")
      .select("*", { count: "exact" })
      .eq("user_id", userID)
      .order("created_at", { ascending: false });

    if (q) {
      const qLower = q.toLowerCase();
      queryBuilder = queryBuilder.or(
        `indonesian.ilike.%${qLower}%,english.ilike.%${qLower}%,example_sentence.ilike.%${qLower}%`
      );
    }

    if (status && status !== "all" && status !== "favorite") {
      queryBuilder = queryBuilder.eq("status", status);
    }

    if (favorite || status === "favorite") {
      queryBuilder = queryBuilder.eq("is_favorite", true);
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;
    queryBuilder = queryBuilder.range(from, to);

    const { data, count, error } = await queryBuilder;

    if (error) {
      throw new DBError(`Failed to list vocabularies: ${error.message}`);
    }

    return {
      data: (data || []) as Vocabulary[],
      meta: {
        page,
        limit,
        total: count || (data || []).length,
      },
    };
  }

  async update(userID: string, token: string, id: string, input: UpdateVocabularyDTO): Promise<Vocabulary> {
    const supabase = getSupabaseServerClient(token);

    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (input.indonesian !== undefined) updateData.indonesian = input.indonesian;
    if (input.english !== undefined) updateData.english = input.english;
    if (input.part_of_speech !== undefined) updateData.part_of_speech = input.part_of_speech || null;
    if (input.example_sentence !== undefined) updateData.example_sentence = input.example_sentence || null;
    if (input.note !== undefined) updateData.note = input.note || null;
    if (input.is_favorite !== undefined) updateData.is_favorite = input.is_favorite;
    if (input.status !== undefined) updateData.status = input.status;

    const { data, error } = await supabase
      .from("vocabularies")
      .update(updateData)
      .eq("id", id)
      .eq("user_id", userID)
      .select()
      .single();

    if (error || !data) {
      throw new DBError(`Failed to update vocabulary: ${error?.message || "Not found"}`);
    }

    return data as Vocabulary;
  }

  async updateFavorite(userID: string, token: string, id: string, isFavorite: boolean): Promise<void> {
    const supabase = getSupabaseServerClient(token);

    const { error } = await supabase
      .from("vocabularies")
      .update({ is_favorite: isFavorite, updated_at: new Date().toISOString() })
      .eq("id", id)
      .eq("user_id", userID);

    if (error) {
      throw new DBError(`Failed to update favorite status: ${error.message}`);
    }
  }

  async updateStatus(userID: string, token: string, id: string, status: string): Promise<void> {
    const supabase = getSupabaseServerClient(token);

    const { error } = await supabase
      .from("vocabularies")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id)
      .eq("user_id", userID);

    if (error) {
      throw new DBError(`Failed to update learning status: ${error.message}`);
    }
  }

  async delete(userID: string, token: string, id: string): Promise<void> {
    const supabase = getSupabaseServerClient(token);

    const { error } = await supabase
      .from("vocabularies")
      .delete()
      .eq("id", id)
      .eq("user_id", userID);

    if (error) {
      throw new DBError(`Failed to delete vocabulary: ${error.message}`);
    }
  }
}
