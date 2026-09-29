export interface Verb {
  id: string;
  user_id: string;
  indonesian: string;
  v1: string;
  v2: string;
  v3: string;
  ving: string;
  created_at: string;
  updated_at: string;
}

export type CreateVerbInput = Omit<
  Verb,
  "id" | "user_id" | "created_at" | "updated_at"
>;

export type UpdateVerbInput = Partial<CreateVerbInput>;
