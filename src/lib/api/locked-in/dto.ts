export interface CreateLockedInDTO {
  text: string;
  date?: string;
  duration_minutes?: number | null;
}

export interface UpdateLockedInDTO {
  text?: string;
  completed?: boolean;
  completed_at?: string | null;
  duration_minutes?: number | null;
}

export interface ListLockedInQuery {
  startDate?: string;
  endDate?: string;
  date?: string;
  limit?: number;
}
