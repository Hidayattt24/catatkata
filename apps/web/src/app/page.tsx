"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Vocabulary,
  CreateVocabularyInput,
  LearningStatus,
} from "@/types/vocabulary";
import { AuthTemplate } from "@/components/templates/AuthTemplate";
import { AppLayout } from "@/components/templates/AppLayout";
import { SearchInput } from "@/components/molecules/SearchInput";
import { VocabularyCard } from "@/components/organisms/VocabularyCard";
import { VocabularyForm } from "@/components/organisms/VocabularyForm";
import { VocabularyDetail } from "@/components/organisms/VocabularyDetail";
import { ConfirmDialog } from "@/components/molecules/ConfirmDialog";
import { EmptyState } from "@/components/molecules/EmptyState";
import { supabase } from "@/lib/supabase";
import * as api from "@/services/api";

export default function Home() {
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const [vocabularies, setVocabularies] = useState<Vocabulary[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedVocab, setSelectedVocab] = useState<Vocabulary | null>(null);
  const [editingVocab, setEditingVocab] = useState<Vocabulary | null>(null);

  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Initialize Supabase Auth Session listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsAuthenticated(true);
        setUserEmail(session.user.email || "learner@catatkata.app");
        setAccessToken(session.access_token);
      } else {
        setIsAuthenticated(false);
      }
      setIsLoadingAuth(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setIsAuthenticated(true);
        setUserEmail(session.user.email || "learner@catatkata.app");
        setAccessToken(session.access_token);
      } else {
        setIsAuthenticated(false);
        setAccessToken(null);
      }
      setIsLoadingAuth(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch list real-time from API Routes when token or filter changes
  useEffect(() => {
    if (accessToken) {
      api
        .fetchVocabularies(accessToken, searchQuery, filterStatus)
        .then((res) => {
          if (res.data) {
            setVocabularies(res.data);
          }
        })
        .catch((err) => {
          console.warn("Failed to fetch real-time vocabularies from API:", err);
        });
    } else {
      setVocabularies([]);
    }
  }, [accessToken, searchQuery, filterStatus]);

  // Compute counts for filter pills
  const counts = useMemo(() => {
    return {
      all: vocabularies.length,
      favorite: vocabularies.filter((v) => v.is_favorite).length,
      learning: vocabularies.filter((v) => v.status === "learning").length,
      reviewing: vocabularies.filter((v) => v.status === "reviewing").length,
      mastered: vocabularies.filter((v) => v.status === "mastered").length,
    };
  }, [vocabularies]);

  const filteredVocabularies = useMemo(() => {
    return vocabularies.filter((item) => {
      const matchesSearch =
        item.indonesian.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.english.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.example_sentence &&
          item.example_sentence
            .toLowerCase()
            .includes(searchQuery.toLowerCase()));

      const matchesStatus =
        filterStatus === "all"
          ? true
          : filterStatus === "favorite"
          ? item.is_favorite
          : item.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [vocabularies, searchQuery, filterStatus]);

  const handleLoginWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: typeof window !== "undefined" ? window.location.origin : "",
        },
      });
      if (error) {
        setIsAuthenticated(true);
        setUserEmail("learner@catatkata.app");
      }
    } catch {
      setIsAuthenticated(true);
      setUserEmail("learner@catatkata.app");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setAccessToken(null);
  };

  if (isLoadingAuth) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-[#ffffff]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#e5e5e5] border-t-[#58cc02]" />
          <span className="text-sm font-bold text-[#58cc02] font-feather uppercase tracking-wider">
            Loading CatatKata...
          </span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthTemplate onLoginWithGoogle={handleLoginWithGoogle} />;
  }

  const handleCreateOrUpdate = async (data: CreateVocabularyInput) => {
    if (editingVocab) {
      if (accessToken) {
        try {
          const updated = await api.updateVocabulary(accessToken, editingVocab.id, data);
          setVocabularies((prev) =>
            prev.map((item) => (item.id === updated.id ? updated : item))
          );
          if (selectedVocab && selectedVocab.id === editingVocab.id) {
            setSelectedVocab(updated);
          }
        } catch (err) {
          console.error("Failed to update vocabulary via API:", err);
        }
      }
    } else {
      if (accessToken) {
        try {
          const created = await api.createVocabulary(accessToken, data);
          setVocabularies((prev) => [created, ...prev]);
        } catch (err) {
          console.error("Failed to create vocabulary via API:", err);
        }
      }
    }

    setIsFormOpen(false);
    setEditingVocab(null);
  };

  const handleToggleFavorite = async (id: string) => {
    const target = vocabularies.find((v) => v.id === id);
    if (!target) return;
    const nextFav = !target.is_favorite;

    if (accessToken) {
      try {
        await api.updateVocabularyFavorite(accessToken, id, nextFav);
        setVocabularies((prev) =>
          prev.map((item) =>
            item.id === id
              ? { ...item, is_favorite: nextFav, updated_at: new Date().toISOString() }
              : item
          )
        );

        if (selectedVocab && selectedVocab.id === id) {
          setSelectedVocab((prev) =>
            prev ? { ...prev, is_favorite: nextFav } : null
          );
        }
      } catch (err) {
        console.error("Failed to update favorite status via API:", err);
      }
    }
  };

  const handleChangeStatus = async (id: string, newStatus: LearningStatus) => {
    if (accessToken) {
      try {
        await api.updateVocabularyStatus(accessToken, id, newStatus);
        setVocabularies((prev) =>
          prev.map((item) =>
            item.id === id
              ? { ...item, status: newStatus, updated_at: new Date().toISOString() }
              : item
          )
        );

        if (selectedVocab && selectedVocab.id === id) {
          setSelectedVocab((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
      } catch (err) {
        console.error("Failed to update learning status via API:", err);
      }
    }
  };

  const handleDelete = async () => {
    if (deletingId) {
      if (accessToken) {
        try {
          await api.deleteVocabulary(accessToken, deletingId);
          setVocabularies((prev) => prev.filter((item) => item.id !== deletingId));
          if (selectedVocab?.id === deletingId) {
            setSelectedVocab(null);
          }
        } catch (err) {
          console.error("Failed to delete vocabulary via API:", err);
        }
      }
      setDeletingId(null);
    }
  };

  const handleOpenEditFromDetail = () => {
    if (selectedVocab) {
      setEditingVocab(selectedVocab);
      setSelectedVocab(null);
      setIsFormOpen(true);
    }
  };

  const filterOptions = [
    { key: "all", label: "All", count: counts.all },
    { key: "favorite", label: "Favorites", count: counts.favorite },
    { key: "learning", label: "Learning", count: counts.learning },
    { key: "reviewing", label: "Reviewing", count: counts.reviewing },
    { key: "mastered", label: "Mastered", count: counts.mastered },
  ];

  const isAnyModalOpen = Boolean(selectedVocab || isFormOpen || deletingId);

  return (
    <AppLayout
      userEmail={userEmail}
      onLogout={handleLogout}
      onAddClick={() => {
        setEditingVocab(null);
        setIsFormOpen(true);
      }}
      isAddDisabled={isAnyModalOpen}
    >
      <div className="flex flex-col gap-5">
        <SearchInput value={searchQuery} onChange={setSearchQuery} />

        {/* Mobile-First Scrollable Filter Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 pt-0.5 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
          {filterOptions.map((opt) => {
            const isActive = filterStatus === opt.key;
            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => setFilterStatus(opt.key)}
                className={`flex-shrink-0 flex items-center gap-1.5 h-9 px-3.5 rounded-[12px] text-xs font-extrabold uppercase tracking-wider border-2 border-b-4 transition-all ${
                  isActive
                    ? "bg-[#58cc02] text-white border-[#58cc02] border-b-[#46a302]"
                    : "bg-white text-[#777777] border-[#e5e5e5] border-b-[#e5e5e5] hover:border-[#afafaf] hover:text-[#4b4b4b]"
                }`}
              >
                <span>{opt.label}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] font-black ${
                    isActive
                      ? "bg-white/30 text-white"
                      : "bg-[#f0f0f0] text-[#777777]"
                  }`}
                >
                  {opt.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Word Count Header */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-extrabold text-[#4b4b4b] uppercase tracking-wider">
              {filteredVocabularies.length}{" "}
              {filteredVocabularies.length === 1 ? "word" : "words"}
            </span>
            {filterStatus !== "all" && (
              <span className="text-xs font-bold text-[#58cc02] bg-[#d7ffb8] px-2 py-0.5 rounded-[8px] uppercase tracking-wider">
                In {filterStatus}
              </span>
            )}
          </div>
        </div>

        {filteredVocabularies.length === 0 ? (
          <EmptyState
            type={vocabularies.length === 0 ? "no-data" : "no-result"}
            onAddClick={() => {
              setEditingVocab(null);
              setIsFormOpen(true);
            }}
          />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {filteredVocabularies.map((item) => (
              <VocabularyCard
                key={item.id}
                vocabulary={item}
                onClick={() => setSelectedVocab(item)}
                onToggleFavorite={(e) => {
                  e.stopPropagation();
                  handleToggleFavorite(item.id);
                }}
              />
            ))}
          </div>
        )}
      </div>

      <VocabularyForm
        isOpen={isFormOpen}
        initialData={editingVocab}
        onSave={handleCreateOrUpdate}
        onClose={() => {
          setIsFormOpen(false);
          setEditingVocab(null);
        }}
      />

      <VocabularyDetail
        vocabulary={selectedVocab}
        onClose={() => setSelectedVocab(null)}
        onEdit={handleOpenEditFromDetail}
        onDelete={() => {
          if (selectedVocab) {
            setDeletingId(selectedVocab.id);
          }
        }}
        onToggleFavorite={() => {
          if (selectedVocab) {
            handleToggleFavorite(selectedVocab.id);
          }
        }}
        onChangeStatus={(status) => {
          if (selectedVocab) {
            handleChangeStatus(selectedVocab.id, status);
          }
        }}
      />

      <ConfirmDialog
        isOpen={!!deletingId}
        title="Delete vocabulary?"
        message={
          selectedVocab
            ? `Are you sure you want to delete "${selectedVocab.english}"? This action cannot be undone.`
            : "This action cannot be undone."
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        isDestructive
        onConfirm={handleDelete}
        onCancel={() => setDeletingId(null)}
      />
    </AppLayout>
  );
}
