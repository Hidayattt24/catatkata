export interface CreateVerbDTO {
  indonesian: string;
  v1: string;
  v2: string;
  v3: string;
  ving: string;
}

export interface UpdateVerbDTO {
  indonesian?: string;
  v1?: string;
  v2?: string;
  v3?: string;
  ving?: string;
}

export interface ListVerbQuery {
  q?: string;
  page?: number;
  limit?: number;
}
