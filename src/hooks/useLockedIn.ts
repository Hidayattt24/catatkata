"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  LockedInTask,
  StreakState,
  DayStreakInfo,
  HistoryDayGroup,
  AllTimeStats,
} from "@/types/lockedIn";
import * as api from "@/services/api";

const DAY_NAMES = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

export function formatLocalDate(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatHistoryDate(dateStr: string, todayStr: string): string {
  if (dateStr === todayStr) return "Hari Ini";

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (formatLocalDate(yesterday) === dateStr) {
    return "Kemarin";
  }

  const [year, month, day] = dateStr.split("-").map(Number);
  const d = new Date(year, month - 1, day);

  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
    "Jul", "Agu", "Sep", "Okt", "Nov", "Des"
  ];
  const dayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

  return `${dayNames[d.getDay()]}, ${d.getDate()} ${monthNames[d.getMonth()]} ${d.getFullYear()}`;
}

export function useLockedIn(accessToken: string | null, userEmail?: string) {
  const [tasks, setTasks] = useState<LockedInTask[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const storageKey = useMemo(() => {
    const id = userEmail ? userEmail.replace(/[^a-zA-Z0-9]/g, "_") : "guest";
    return `catatkata_lockedin_${id}`;
  }, [userEmail]);

  // Load initial from localStorage for instant display
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setTasks(parsed);
        }
      }
    } catch (err) {
      console.warn("Failed to read locked-in tasks from localStorage:", err);
    } finally {
      setIsLoaded(true);
    }
  }, [storageKey]);

  // Sync from Supabase via API when accessToken is available
  useEffect(() => {
    if (!accessToken) return;

    let cancelled = false;

    api
      .fetchLockedInTasks(accessToken)
      .then((serverTasks) => {
        if (!cancelled && serverTasks) {
          setTasks(serverTasks);
          try {
            localStorage.setItem(storageKey, JSON.stringify(serverTasks));
          } catch {
            // ignore
          }
        }
      })
      .catch((err) => {
        console.warn("Failed to fetch locked_in tasks from API:", err);
      });

    return () => {
      cancelled = true;
    };
  }, [accessToken, storageKey]);

  // Persist to localStorage helper
  const persistLocally = useCallback(
    (newTasks: LockedInTask[]) => {
      setTasks(newTasks);
      try {
        localStorage.setItem(storageKey, JSON.stringify(newTasks));
      } catch (err) {
        console.warn("Failed to save locked-in tasks to localStorage:", err);
      }
    },
    [storageKey]
  );

  const todayStr = useMemo(() => formatLocalDate(), []);

  // Filter tasks for today
  const todayTasks = useMemo(() => {
    return tasks.filter((t) => t.date === todayStr);
  }, [tasks, todayStr]);

  const todayCompletedCount = useMemo(() => {
    return todayTasks.filter((t) => t.completed).length;
  }, [todayTasks]);

  const totalMinutesToday = useMemo(() => {
    return todayTasks.reduce((acc, t) => acc + (t.durationMinutes || 0), 0);
  }, [todayTasks]);

  const isFireActive = todayCompletedCount >= 1;

  // Add task for today (Optimistic UI + Supabase sync)
  const addTask = useCallback(
    async (text: string, durationMinutes?: number | null) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      const tempId = "task_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7);
      const newTask: LockedInTask = {
        id: tempId,
        text: trimmed,
        completed: false,
        completedAt: null,
        date: todayStr,
        createdAt: new Date().toISOString(),
        durationMinutes: durationMinutes && durationMinutes > 0 ? durationMinutes : null,
      };

      // Optimistic update
      persistLocally([newTask, ...tasks]);

      if (accessToken) {
        try {
          const created = await api.createLockedInTask(accessToken, {
            text: trimmed,
            date: todayStr,
            durationMinutes: newTask.durationMinutes,
          });

          // Replace temp id with real server record
          setTasks((prev) => {
            const updated = prev.map((t) => (t.id === tempId ? created : t));
            try {
              localStorage.setItem(storageKey, JSON.stringify(updated));
            } catch {
              // ignore
            }
            return updated;
          });
        } catch (err) {
          console.error("Failed to sync created task to Supabase:", err);
        }
      }
    },
    [tasks, todayStr, accessToken, persistLocally, storageKey]
  );

  // Update task duration (Optimistic UI + Supabase sync)
  const updateTaskDuration = useCallback(
    async (id: string, durationMinutes: number | null) => {
      const validDuration = durationMinutes && durationMinutes > 0 ? durationMinutes : null;
      const updated = tasks.map((t) => {
        if (t.id === id) {
          return {
            ...t,
            durationMinutes: validDuration,
          };
        }
        return t;
      });
      persistLocally(updated);

      if (accessToken && !id.startsWith("task_")) {
        try {
          await api.updateLockedInTask(accessToken, id, {
            durationMinutes: validDuration,
          });
        } catch (err) {
          console.error("Failed to update task duration on Supabase:", err);
        }
      }
    },
    [tasks, accessToken, persistLocally]
  );

  // Toggle task completed (Optimistic UI + Supabase sync)
  const toggleTask = useCallback(
    async (id: string) => {
      let nextCompleted = false;
      const updated = tasks.map((t) => {
        if (t.id === id) {
          nextCompleted = !t.completed;
          return {
            ...t,
            completed: nextCompleted,
            completedAt: nextCompleted ? new Date().toISOString() : null,
          };
        }
        return t;
      });
      persistLocally(updated);

      if (accessToken && !id.startsWith("task_")) {
        try {
          await api.updateLockedInTask(accessToken, id, {
            completed: nextCompleted,
          });
        } catch (err) {
          console.error("Failed to update task completion on Supabase:", err);
        }
      }
    },
    [tasks, accessToken, persistLocally]
  );

  // Delete task (Optimistic UI + Supabase sync)
  const deleteTask = useCallback(
    async (id: string) => {
      const remaining = tasks.filter((t) => t.id !== id);
      persistLocally(remaining);

      if (accessToken && !id.startsWith("task_")) {
        try {
          await api.deleteLockedInTask(accessToken, id);
        } catch (err) {
          console.error("Failed to delete task from Supabase:", err);
        }
      }
    },
    [tasks, accessToken, persistLocally]
  );

  // 7-day window (Current week Monday - Sunday)
  const streakState: StreakState = useMemo(() => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diffToMon = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    const monday = new Date(now);
    monday.setDate(now.getDate() - diffToMon);
    monday.setHours(0, 0, 0, 0);

    const days: DayStreakInfo[] = [];
    let weeklyCompletedDays = 0;

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const dStr = formatLocalDate(d);

      const isCompleted = tasks.some((t) => t.date === dStr && t.completed);
      if (isCompleted) {
        weeklyCompletedDays++;
      }

      const isToday = dStr === todayStr;

      days.push({
        date: dStr,
        dayName: DAY_NAMES[d.getDay()],
        dayNumber: d.getDate(),
        isToday,
        isCompleted,
      });
    }

    let streakCount = 0;
    const checkDate = new Date(now);

    const todayDone = tasks.some((t) => t.date === todayStr && t.completed);
    if (!todayDone) {
      checkDate.setDate(checkDate.getDate() - 1);
    }

    while (true) {
      const cStr = formatLocalDate(checkDate);
      const done = tasks.some((t) => t.date === cStr && t.completed);
      if (done) {
        streakCount++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    return {
      streakCount,
      weeklyCompletedDays,
      isFireActive,
      totalMinutesToday,
      days,
    };
  }, [tasks, todayStr, isFireActive, totalMinutesToday]);

  // Group all tasks by date for the History view
  const historyGroups: HistoryDayGroup[] = useMemo(() => {
    const map = new Map<string, LockedInTask[]>();
    for (const task of tasks) {
      const list = map.get(task.date) || [];
      list.push(task);
      map.set(task.date, list);
    }

    // Sort dates descending (newest dates first)
    const sortedDates = Array.from(map.keys()).sort((a, b) => b.localeCompare(a));

    return sortedDates.map((date) => {
      const dateTasks = map.get(date) || [];
      const completedTasks = dateTasks.filter((t) => t.completed).length;
      const totalMinutes = dateTasks.reduce((acc, t) => acc + (t.durationMinutes || 0), 0);

      return {
        date,
        formattedDate: formatHistoryDate(date, todayStr),
        totalTasks: dateTasks.length,
        completedTasks,
        totalMinutes,
        tasks: dateTasks,
      };
    });
  }, [tasks, todayStr]);

  // Overall all-time summary stats
  const allTimeStats: AllTimeStats = useMemo(() => {
    let totalCompleted = 0;
    let totalMinutes = 0;
    const productiveDaysSet = new Set<string>();

    for (const t of tasks) {
      if (t.completed) {
        totalCompleted++;
        productiveDaysSet.add(t.date);
      }
      if (t.durationMinutes) {
        totalMinutes += t.durationMinutes;
      }
    }

    return {
      totalCompleted,
      totalMinutes,
      productiveDays: productiveDaysSet.size,
    };
  }, [tasks]);

  return {
    isLoaded,
    todayTasks,
    todayCompletedCount,
    totalMinutesToday,
    isFireActive,
    streakState,
    historyGroups,
    allTimeStats,
    addTask,
    updateTaskDuration,
    toggleTask,
    deleteTask,
  };
}
