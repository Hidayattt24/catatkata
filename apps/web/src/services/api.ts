import {
  Vocabulary,
  CreateVocabularyInput,
  UpdateVocabularyInput,
  LearningStatus,
} from "@/types/vocabulary";

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
