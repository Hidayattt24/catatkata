"use client";

import { useState } from "react";
import { Verb, CreateVerbInput } from "@/types/verb";
import { AuthTemplate } from "@/components/templates/AuthTemplate";
import { AppLayout } from "@/components/templates/AppLayout";
import { SearchInput } from "@/components/molecules/SearchInput";
import { WordCounter } from "@/components/molecules/WordCounter";
import { AuthLoadingScreen } from "@/components/molecules/AuthLoadingScreen";
import { VerbGrid } from "@/components/organisms/VerbGrid";
import { VerbForm } from "@/components/organisms/VerbForm";
import { VerbDetail } from "@/components/organisms/VerbDetail";
import { ConfirmDialog } from "@/components/molecules/ConfirmDialog";
import { useVerbs } from "@/hooks/useVerbs";
import { useAuth } from "@/hooks/useAuth";

export default function VerbsPage() {
  const {
    isLoadingAuth,
    isAuthenticated,
    userEmail,
    accessToken,
    handleLoginWithGoogle,
    handleLogout,
  } = useAuth();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedVerb, setSelectedVerb] = useState<Verb | null>(null);
  const [editingVerb, setEditingVerb] = useState<Verb | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const {
    verbs,
    filteredVerbs,
    searchQuery,
    setSearchQuery,
    createOrUpdate,
    deleteVerb,
  } = useVerbs(accessToken);

  const handleSave = async (data: CreateVerbInput) => {
    await createOrUpdate(data, editingVerb, selectedVerb, setSelectedVerb);
    setIsFormOpen(false);
    setEditingVerb(null);
  };

  const handleDelete = async () => {
    if (deletingId) {
      await deleteVerb(deletingId, selectedVerb, setSelectedVerb);
      setDeletingId(null);
    }
  };

  if (isLoadingAuth) return <AuthLoadingScreen />;
  if (!isAuthenticated) return <AuthTemplate onLoginWithGoogle={handleLoginWithGoogle} />;

  const isAnyModalOpen = Boolean(selectedVerb || isFormOpen || deletingId);

  return (
    <AppLayout
      userEmail={userEmail}
      onLogout={handleLogout}
      onAddClick={() => {
        setEditingVerb(null);
        setIsFormOpen(true);
      }}
      isAddDisabled={isAnyModalOpen}
      addAriaLabel="Add verb"
    >
      <div className="flex flex-col gap-5">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search arti, V1, V2, V3, V-ing..."
        />
        <WordCounter
          count={filteredVerbs.length}
          singular="verb"
          plural="verbs"
        />
        <VerbGrid
          verbs={filteredVerbs}
          totalCount={verbs.length}
          onSelectVerb={setSelectedVerb}
          onAddNew={() => {
            setEditingVerb(null);
            setIsFormOpen(true);
          }}
        />
      </div>

      <VerbForm
        key={isFormOpen ? (editingVerb?.id ?? "create") : "closed"}
        isOpen={isFormOpen}
        initialData={editingVerb}
        onSave={handleSave}
        onClose={() => {
          setIsFormOpen(false);
          setEditingVerb(null);
        }}
      />

      <VerbDetail
        verb={selectedVerb}
        onClose={() => setSelectedVerb(null)}
        onEdit={() => {
          setEditingVerb(selectedVerb);
          setSelectedVerb(null);
          setIsFormOpen(true);
        }}
        onDelete={() => {
          if (selectedVerb) setDeletingId(selectedVerb.id);
        }}
      />

      <ConfirmDialog
        isOpen={!!deletingId}
        title="Delete verb?"
        message={
          selectedVerb
            ? `Are you sure you want to delete "${selectedVerb.indonesian}"? This action cannot be undone.`
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
