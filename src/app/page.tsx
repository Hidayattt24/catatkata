"use client";

import { useState } from "react";
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
import { useVocabularies } from "@/hooks/useVocabularies";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const {
    isLoadingAuth,
    isAuthenticated,
    userEmail,
    accessToken,
    handleLoginWithGoogle,
    handleLogout,
  } = useAuth();

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
