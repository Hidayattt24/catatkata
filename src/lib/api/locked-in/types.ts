export interface LockedInTaskRecord {
  id: string;
  user_id: string;
  text: string;
  completed: boolean;
  completed_at: string | null;
  date: string;
  duration_minutes: number | null;
  created_at: string;
  updated_at: string;
}

export interface ListLockedInResult {
  data: LockedInTaskRecord[];
  total: number;
}
