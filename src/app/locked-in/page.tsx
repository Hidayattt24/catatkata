"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLockedIn } from "@/hooks/useLockedIn";
import { AuthLoadingScreen } from "@/components/molecules/AuthLoadingScreen";
import { AuthTemplate } from "@/components/templates/AuthTemplate";
import { AppLayout } from "@/components/templates/AppLayout";
import { StreakTracker } from "@/components/molecules/StreakTracker";
import { LockedInSection } from "@/components/organisms/LockedInSection";
import { LockedInHistory } from "@/components/organisms/LockedInHistory";
import { ConfirmDialog } from "@/components/molecules/ConfirmDialog";
import { Toast } from "@/components/atoms/Toast";
import { Fire, ClockCounterClockwise } from "@phosphor-icons/react";

export default function LockedInPage() {
  const {
    isLoadingAuth,
    isAuthenticated,
    userEmail,
    accessToken,
    handleLoginWithGoogle,
    handleLogout,
  } = useAuth();

  const {
    todayTasks,
    streakState,
    historyGroups,
    allTimeStats,
    addTask,
    updateTaskDuration,
    toggleTask,
    deleteTask,
  } = useLockedIn(accessToken, userEmail);

  const [activeTab, setActiveTab] = useState<"today" | "history">("today");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const deletingTask =
    historyGroups.flatMap((g) => g.tasks).find((t) => t.id === deletingId) ||
    todayTasks.find((t) => t.id === deletingId);

  const handleConfirmDelete = async () => {
    if (deletingId) {
      await deleteTask(deletingId);
      setDeletingId(null);
      setToastMessage("Target berhasil dihapus");
    }
  };

  if (isLoadingAuth) return <AuthLoadingScreen />;
  if (!isAuthenticated) return <AuthTemplate onLoginWithGoogle={handleLoginWithGoogle} />;

  return (
    <AppLayout
      userEmail={userEmail}
      onLogout={handleLogout}
      onAddClick={() => {}}
      isAddDisabled={true}
    >
      <div className="flex flex-col gap-5">
        {/* Segmented 3D Navigation Tab (Hari Ini vs Riwayat) */}
        <div className="flex items-center gap-1.5 p-1 rounded-[16px] border-2 border-border bg-surface">
          <button
            type="button"
            onClick={() => setActiveTab("today")}
            className={`flex-1 py-2.5 rounded-[12px] font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all select-none ${
              activeTab === "today"
                ? "bg-white text-charcoal border-2 border-b-4 border-border shadow-xs active:translate-y-[1px]"
                : "text-gray hover:text-charcoal"
            }`}
          >
            <Fire
              size={18}
              weight="fill"
              className={streakState.isFireActive ? "text-orange-500" : "text-gray-faded"}
            />
            <span>Hari Ini</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("history")}
            className={`flex-1 py-2.5 rounded-[12px] font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all select-none ${
              activeTab === "history"
                ? "bg-white text-charcoal border-2 border-b-4 border-border shadow-xs active:translate-y-[1px]"
                : "text-gray hover:text-charcoal"
            }`}
          >
            <ClockCounterClockwise size={18} weight="bold" />
            <span>Riwayat Catatan</span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "today" ? (
          <div className="flex flex-col gap-6 animate-in fade-in duration-200">
            {/* Lottie Fire & 7-Day Streak Tracker */}
            <StreakTracker streakState={streakState} />

            {/* Productive Todolist with Pencil Strike Animation & Optional Timer */}
            <LockedInSection
              tasks={todayTasks}
              onAdd={addTask}
              onToggle={toggleTask}
              onDelete={(id) => setDeletingId(id)}
              onUpdateDuration={updateTaskDuration}
            />
          </div>
        ) : (
          <LockedInHistory
            historyGroups={historyGroups}
            allTimeStats={allTimeStats}
            onToggle={toggleTask}
            onDelete={(id) => setDeletingId(id)}
            onUpdateDuration={updateTaskDuration}
          />
        )}
      </div>

      {/* Confirmation Dialog before Deleting Task */}
      <ConfirmDialog
        isOpen={!!deletingId}
        title="Hapus Target?"
        message={
          deletingTask
            ? `Apakah kamu yakin ingin menghapus "${deletingTask.text}"? Tindakan ini tidak dapat dibatalkan.`
            : "Apakah kamu yakin ingin menghapus target ini? Tindakan ini tidak dapat dibatalkan."
        }
        confirmLabel="Hapus"
        cancelLabel="Batal"
        isDestructive
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingId(null)}
      />

      {/* Floating Success Notification Toast */}
      <Toast
        message={toastMessage}
        onClose={() => setToastMessage(null)}
        duration={3000}
      />
    </AppLayout>
  );
}
