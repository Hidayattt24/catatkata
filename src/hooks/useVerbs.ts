import { useState, useMemo, useEffect } from "react";
import { Verb, CreateVerbInput } from "@/types/verb";
import * as api from "@/services/api";

export function useVerbs(accessToken: string | null) {
  const [verbs, setVerbs] = useState<Verb[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!accessToken) return;

    let cancelled = false;
    api
      .fetchVerbs(accessToken, searchQuery)
      .then((res) => {
        if (!cancelled && res.data) setVerbs(res.data);
      })
      .catch((err) => {
        console.warn("Failed to fetch verbs from API:", err);
      });

    return () => {
      cancelled = true;
    };
  }, [accessToken, searchQuery]);

  const filteredVerbs = useMemo(() => {
    const q = searchQuery.toLowerCase();
    if (!q) return verbs;
    return verbs.filter(
      (item) =>
        item.indonesian.toLowerCase().includes(q) ||
        item.v1.toLowerCase().includes(q) ||
        item.v2.toLowerCase().includes(q) ||
        item.v3.toLowerCase().includes(q) ||
        item.ving.toLowerCase().includes(q)
    );
  }, [verbs, searchQuery]);

  const createOrUpdate = async (
    data: CreateVerbInput,
    editingVerb: Verb | null,
    selectedVerb: Verb | null,
    setSelectedVerb: (v: Verb | null) => void
  ) => {
    if (editingVerb) {
      if (accessToken) {
        try {
          const updated = await api.updateVerb(accessToken, editingVerb.id, data);
          setVerbs((prev) =>
            prev.map((item) => (item.id === updated.id ? updated : item))
          );
          if (selectedVerb?.id === editingVerb.id) {
            setSelectedVerb(updated);
          }
        } catch (err) {
          console.error("Failed to update verb via API:", err);
        }
      }
    } else if (accessToken) {
      try {
        const created = await api.createVerb(accessToken, data);
        setVerbs((prev) => [created, ...prev]);
      } catch (err) {
        console.error("Failed to create verb via API:", err);
      }
    }
  };

  const deleteVerb = async (
    id: string,
    selectedVerb: Verb | null,
    setSelectedVerb: (v: Verb | null) => void
  ) => {
    if (accessToken) {
      try {
        await api.deleteVerb(accessToken, id);
        setVerbs((prev) => prev.filter((item) => item.id !== id));
        if (selectedVerb?.id === id) setSelectedVerb(null);
      } catch (err) {
        console.error("Failed to delete verb via API:", err);
      }
    }
  };

  return {
    verbs,
    filteredVerbs,
    searchQuery,
    setSearchQuery,
    createOrUpdate,
    deleteVerb,
  };
}
