import {
  Vocabulary,
  CreateVocabularyInput,
  UpdateVocabularyInput,
  LearningStatus,
} from "@/types/vocabulary";
import { Verb, CreateVerbInput, UpdateVerbInput } from "@/types/verb";
import { LockedInTask } from "@/types/lockedIn";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "/api/v1";

export async function fetchVocabularies(
  accessToken: string,
  query?: string,
  status?: string,
  favorite?: boolean
): Promise<{ data: Vocabulary[]; total: number }> {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (status && status !== "all" && status !== "favorite") {
    params.set("status", status);
  }
  if (favorite || status === "favorite") {
    params.set("favorite", "true");
  }

  const res = await fetch(`${API_BASE_URL}/vocabularies?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`API Error: ${res.statusText}`);
  }

  const json = await res.json();
  return {
    data: json.data || [],
    total: json.meta?.total || (json.data ? json.data.length : 0),
  };
}

export async function createVocabulary(
  accessToken: string,
  input: CreateVocabularyInput
): Promise<Vocabulary> {
  const res = await fetch(`${API_BASE_URL}/vocabularies`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    throw new Error(`Failed to create vocabulary: ${res.statusText}`);
  }

  return res.json();
}

export async function updateVocabulary(
  accessToken: string,
  id: string,
  input: UpdateVocabularyInput
): Promise<Vocabulary> {
  const res = await fetch(`${API_BASE_URL}/vocabularies/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    throw new Error(`Failed to update vocabulary: ${res.statusText}`);
  }

  return res.json();
}

export async function updateVocabularyFavorite(
  accessToken: string,
  id: string,
  isFavorite: boolean
): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/vocabularies/${id}/favorite`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ is_favorite: isFavorite }),
  });

  if (!res.ok) {
    throw new Error(`Failed to update favorite status: ${res.statusText}`);
  }
}

export async function updateVocabularyStatus(
  accessToken: string,
  id: string,
  status: LearningStatus
): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/vocabularies/${id}/status`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    throw new Error(`Failed to update learning status: ${res.statusText}`);
  }
}

export async function deleteVocabulary(
  accessToken: string,
  id: string
): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/vocabularies/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to delete vocabulary: ${res.statusText}`);
  }
}

export async function fetchVerbs(
  accessToken: string,
  query?: string
): Promise<{ data: Verb[]; total: number }> {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  params.set("limit", "100");

  const res = await fetch(`${API_BASE_URL}/verbs?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`API Error: ${res.statusText}`);
  }

  const json = await res.json();
  return {
    data: json.data || [],
    total: json.meta?.total || (json.data ? json.data.length : 0),
  };
}

export async function createVerb(
  accessToken: string,
  input: CreateVerbInput
): Promise<Verb> {
  const res = await fetch(`${API_BASE_URL}/verbs`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    throw new Error(`Failed to create verb: ${res.statusText}`);
  }

  return res.json();
}

export async function updateVerb(
  accessToken: string,
  id: string,
  input: UpdateVerbInput
): Promise<Verb> {
  const res = await fetch(`${API_BASE_URL}/verbs/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    throw new Error(`Failed to update verb: ${res.statusText}`);
  }

  return res.json();
}

export async function deleteVerb(
  accessToken: string,
  id: string
): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/verbs/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to delete verb: ${res.statusText}`);
  }
}

interface LockedInRecordRaw {
  id: string;
  text: string;
  completed: boolean;
  completed_at: string | null;
  date: string;
  duration_minutes: number | null;
  created_at: string;
}

function mapLockedInRecord(r: LockedInRecordRaw): LockedInTask {
  return {
    id: r.id,
    text: r.text,
    completed: r.completed,
    completedAt: r.completed_at || null,
    date: r.date,
    durationMinutes: r.duration_minutes ?? null,
    createdAt: r.created_at,
  };
}

export async function fetchLockedInTasks(
  accessToken: string,
  query?: { startDate?: string; endDate?: string; date?: string }
): Promise<LockedInTask[]> {
  const params = new URLSearchParams();
  if (query?.startDate) params.set("startDate", query.startDate);
  if (query?.endDate) params.set("endDate", query.endDate);
  if (query?.date) params.set("date", query.date);
  params.set("limit", "100");

  const res = await fetch(`${API_BASE_URL}/locked-in?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`API Error: ${res.statusText}`);
  }

  const json = await res.json();
  const records = (json.data || []) as LockedInRecordRaw[];
  return records.map(mapLockedInRecord);
}

export async function createLockedInTask(
  accessToken: string,
  input: { text: string; date?: string; durationMinutes?: number | null }
): Promise<LockedInTask> {
  const res = await fetch(`${API_BASE_URL}/locked-in`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: input.text,
      date: input.date,
      duration_minutes: input.durationMinutes ?? null,
    }),
  });

  if (!res.ok) {
    throw new Error(`Failed to create locked-in task: ${res.statusText}`);
  }

  const raw = await res.json();
  return mapLockedInRecord(raw);
}

export async function updateLockedInTask(
  accessToken: string,
  id: string,
  input: { text?: string; completed?: boolean; durationMinutes?: number | null }
): Promise<LockedInTask> {
  const payload: Record<string, unknown> = {};
  if (input.text !== undefined) payload.text = input.text;
  if (input.completed !== undefined) payload.completed = input.completed;
  if (input.durationMinutes !== undefined) payload.duration_minutes = input.durationMinutes;

  const res = await fetch(`${API_BASE_URL}/locked-in/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Failed to update locked-in task: ${res.statusText}`);
  }

  const raw = await res.json();
  return mapLockedInRecord(raw);
}

export async function deleteLockedInTask(
  accessToken: string,
  id: string
): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/locked-in/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to delete locked-in task: ${res.statusText}`);
  }
}
