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

export interface MetaResponse {
  page: number;
  limit: number;
  total: number;
}

export interface PaginatedVerbs {
  data: Verb[];
  meta: MetaResponse;
}
