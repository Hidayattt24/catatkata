import { useState, useMemo, useEffect } from "react";
import {
  Vocabulary,
  CreateVocabularyInput,
  LearningStatus,
} from "@/types/vocabulary";
import * as api from "@/services/api";

export function useVocabularies(accessToken: string | null) {
  const [vocabularies, setVocabularies] = useState<Vocabulary[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    if (accessToken) {
      api
        .fetchVocabularies(accessToken, searchQuery, filterStatus)
        .then((res) => {
          if (res.data) setVocabularies(res.data);
        })
        .catch((err) => {
          console.warn("Failed to fetch real-time vocabularies from API:", err);
        });
    } else {
      setVocabularies([]);
    }
  }, [accessToken, searchQuery, filterStatus]);

  const counts = useMemo(
    () => ({
      all: vocabularies.length,
      favorite: vocabularies.filter((v) => v.is_favorite).length,
      learning: vocabularies.filter((v) => v.status === "learning").length,
      reviewing: vocabularies.filter((v) => v.status === "reviewing").length,
      mastered: vocabularies.filter((v) => v.status === "mastered").length,
    }),
    [vocabularies]
  );

  const filteredVocabularies = useMemo(() => {
    return vocabularies.filter((item) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        item.indonesian.toLowerCase().includes(q) ||
        item.english.toLowerCase().includes(q) ||
        (item.example_sentence && item.example_sentence.toLowerCase().includes(q));

      const matchesStatus =
        filterStatus === "all"
          ? true
          : filterStatus === "favorite"
          ? item.is_favorite
          : item.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [vocabularies, searchQuery, filterStatus]);

  const createOrUpdate = async (
    data: CreateVocabularyInput,
    editingVocab: Vocabulary | null,
    selectedVocab: Vocabulary | null,
    setSelectedVocab: (v: Vocabulary | null) => void
  ) => {
    if (editingVocab) {
      if (accessToken) {
        try {
          const updated = await api.updateVocabulary(accessToken, editingVocab.id, data);
          setVocabularies((prev) =>
            prev.map((item) => (item.id === updated.id ? updated : item))
          );
          if (selectedVocab?.id === editingVocab.id) {
            setSelectedVocab(updated);
          }
        } catch (err) {
          console.error("Failed to update vocabulary via API:", err);
        }
      }
    } else if (accessToken) {
      try {
        const created = await api.createVocabulary(accessToken, data);
        setVocabularies((prev) => [created, ...prev]);
      } catch (err) {
        console.error("Failed to create vocabulary via API:", err);
      }
    }
  };

  const toggleFavorite = async (
    id: string,
    selectedVocab: Vocabulary | null,
    setSelectedVocab: (updater: (prev: Vocabulary | null) => Vocabulary | null) => void,
    e?: React.MouseEvent
  ) => {
    if (e) e.stopPropagation();
    const target = vocabularies.find((v) => v.id === id);
    if (!target) return;
    const nextFav = !target.is_favorite;

    if (accessToken) {
      try {
        await api.updateVocabularyFavorite(accessToken, id, nextFav);
        setVocabularies((prev) =>
          prev.map((item) => (item.id === id ? { ...item, is_favorite: nextFav } : item))
        );
        if (selectedVocab?.id === id) {
          setSelectedVocab((prev) => (prev ? { ...prev, is_favorite: nextFav } : null));
        }
      } catch (err) {
        console.error("Failed to update favorite status via API:", err);
      }
    }
  };

  const changeStatus = async (
    id: string,
    newStatus: LearningStatus,
    selectedVocab: Vocabulary | null,
    setSelectedVocab: (updater: (prev: Vocabulary | null) => Vocabulary | null) => void
  ) => {
    if (accessToken) {
      try {
        await api.updateVocabularyStatus(accessToken, id, newStatus);
        setVocabularies((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
        );
        if (selectedVocab?.id === id) {
          setSelectedVocab((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
      } catch (err) {
        console.error("Failed to update learning status via API:", err);
      }
    }
  };

  const deleteVocabulary = async (
    id: string,
    selectedVocab: Vocabulary | null,
    setSelectedVocab: (v: Vocabulary | null) => void
  ) => {
    if (accessToken) {
      try {
        await api.deleteVocabulary(accessToken, id);
        setVocabularies((prev) => prev.filter((item) => item.id !== id));
        if (selectedVocab?.id === id) setSelectedVocab(null);
      } catch (err) {
        console.error("Failed to delete vocabulary via API:", err);
      }
    }
  };

  return {
    vocabularies,
    filteredVocabularies,
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    counts,
    createOrUpdate,
    toggleFavorite,
    changeStatus,
    deleteVocabulary,
  };
}
