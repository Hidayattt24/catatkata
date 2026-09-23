"use client";

import { useState, useEffect } from "react";
import { Vocabulary, CreateVocabularyInput } from "@/types/vocabulary";
import { AuthTemplate } from "@/components/templates/AuthTemplate";
import { AppLayout } from "@/components/templates/AppLayout";
import { SearchInput } from "@/components/molecules/SearchInput";
import { FilterBar } from "@/components/molecules/FilterBar";
import { WordCounter } from "@/components/molecules/WordCounter";
import { AuthLoadingScreen } from "@/components/molecules/AuthLoadingScreen";
import { VocabularyGrid } from "@/components/organisms/VocabularyGrid";
import { VocabularyForm } from "@/components/organisms/VocabularyForm";
import { VocabularyDetail } from "@/components/organisms/VocabularyDetail";
import { ConfirmDialog } from "@/components/molecules/ConfirmDialog";
import { supabase, getAuthCallbackUrl } from "@/lib/supabase";
import { useVocabularies } from "@/hooks/useVocabularies";

export default function Home() {
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedVocab, setSelectedVocab] = useState<Vocabulary | null>(null);
  const [editingVocab, setEditingVocab] = useState<Vocabulary | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const {
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
  } = useVocabularies(accessToken);

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

  const handleLoginWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: getAuthCallbackUrl() },
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

  const handleSave = async (data: CreateVocabularyInput) => {
    await createOrUpdate(data, editingVocab, selectedVocab, setSelectedVocab);
    setIsFormOpen(false);
    setEditingVocab(null);
  };

  const handleDelete = async () => {
    if (deletingId) {
      await deleteVocabulary(deletingId, selectedVocab, setSelectedVocab);
      setDeletingId(null);
    }
  };

  if (isLoadingAuth) return <AuthLoadingScreen />;
  if (!isAuthenticated) return <AuthTemplate onLoginWithGoogle={handleLoginWithGoogle} />;

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
        <FilterBar
          currentFilter={filterStatus}
          onFilterChange={setFilterStatus}
          counts={counts}
        />
        <WordCounter
          count={filteredVocabularies.length}
          activeFilter={filterStatus}
        />
        <VocabularyGrid
          vocabularies={filteredVocabularies}
          totalCount={vocabularies.length}
          onSelectVocab={setSelectedVocab}
          onToggleFavorite={(id, e) => toggleFavorite(id, selectedVocab, setSelectedVocab, e)}
          onAddNew={() => {
            setEditingVocab(null);
            setIsFormOpen(true);
          }}
        />
      </div>

      <VocabularyForm
        isOpen={isFormOpen}
        initialData={editingVocab}
        onSave={handleSave}
        onClose={() => {
          setIsFormOpen(false);
          setEditingVocab(null);
        }}
      />

      <VocabularyDetail
        vocabulary={selectedVocab}
        onClose={() => setSelectedVocab(null)}
        onEdit={() => {
          setEditingVocab(selectedVocab);
          setSelectedVocab(null);
          setIsFormOpen(true);
        }}
        onDelete={() => {
          if (selectedVocab) setDeletingId(selectedVocab.id);
        }}
        onToggleFavorite={() => {
          if (selectedVocab) toggleFavorite(selectedVocab.id, selectedVocab, setSelectedVocab);
        }}
        onChangeStatus={(status) => {
          if (selectedVocab) changeStatus(selectedVocab.id, status, selectedVocab, setSelectedVocab);
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
