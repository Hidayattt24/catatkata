import { LockedInTaskRecord, ListLockedInResult } from "./types";
import { CreateLockedInDTO, UpdateLockedInDTO, ListLockedInQuery } from "./dto";
import { getSupabaseServerClient } from "@/lib/supabase";
import { DBError, NotFoundError } from "../errors";

export interface LockedInRepository {
  create(userID: string, token: string, input: CreateLockedInDTO): Promise<LockedInTaskRecord>;
  getByID(userID: string, token: string, id: string): Promise<LockedInTaskRecord>;
  list(userID: string, token: string, query: ListLockedInQuery): Promise<ListLockedInResult>;
  update(userID: string, token: string, id: string, input: UpdateLockedInDTO): Promise<LockedInTaskRecord>;
  delete(userID: string, token: string, id: string): Promise<void>;
}

export class SupabaseLockedInRepository implements LockedInRepository {
  async create(userID: string, token: string, input: CreateLockedInDTO): Promise<LockedInTaskRecord> {
    const supabase = getSupabaseServerClient(token);

    const payload: Record<string, unknown> = {
      user_id: userID,
      text: input.text,
      duration_minutes: input.duration_minutes ?? null,
    };

    if (input.date) {
      payload.date = input.date;
    }

    const { data, error } = await supabase
      .from("locked_in_tasks")
      .insert(payload)
      .select()
      .single();

    if (error) {
      throw new DBError(`Failed to create locked_in task: ${error.message}`);
    }

    return data as LockedInTaskRecord;
  }

  async getByID(userID: string, token: string, id: string): Promise<LockedInTaskRecord> {
    const supabase = getSupabaseServerClient(token);

    const { data, error } = await supabase
      .from("locked_in_tasks")
      .select("*")
      .eq("id", id)
      .eq("user_id", userID)
      .single();

    if (error || !data) {
      throw new NotFoundError("LockedIn task not found");
    }

    return data as LockedInTaskRecord;
  }

  async list(userID: string, token: string, query: ListLockedInQuery): Promise<ListLockedInResult> {
    const supabase = getSupabaseServerClient(token);
    const { startDate, endDate, date, limit = 100 } = query;

    let qb = supabase
      .from("locked_in_tasks")
      .select("*", { count: "exact" })
      .eq("user_id", userID)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (date) {
      qb = qb.eq("date", date);
    } else {
      if (startDate) {
        qb = qb.gte("date", startDate);
      }
      if (endDate) {
        qb = qb.lte("date", endDate);
      }
    }

    const { data, error, count } = await qb;

    if (error) {
      throw new DBError(`Failed to fetch locked_in tasks: ${error.message}`);
    }

    return {
      data: (data || []) as LockedInTaskRecord[],
      total: count || (data ? data.length : 0),
    };
  }

  async update(userID: string, token: string, id: string, input: UpdateLockedInDTO): Promise<LockedInTaskRecord> {
    const supabase = getSupabaseServerClient(token);

    const payload: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (input.text !== undefined) payload.text = input.text;
    if (input.completed !== undefined) {
      payload.completed = input.completed;
      payload.completed_at = input.completed_at ?? (input.completed ? new Date().toISOString() : null);
    }
    if (input.duration_minutes !== undefined) payload.duration_minutes = input.duration_minutes;

    const { data, error } = await supabase
      .from("locked_in_tasks")
      .update(payload)
      .eq("id", id)
      .eq("user_id", userID)
      .select()
      .single();

    if (error) {
      throw new DBError(`Failed to update locked_in task: ${error.message}`);
    }

    return data as LockedInTaskRecord;
  }

  async delete(userID: string, token: string, id: string): Promise<void> {
    const supabase = getSupabaseServerClient(token);

    const { error } = await supabase
      .from("locked_in_tasks")
      .delete()
      .eq("id", id)
      .eq("user_id", userID);

    if (error) {
      throw new DBError(`Failed to delete locked_in task: ${error.message}`);
    }
  }
}
