import { create } from 'zustand';
import type { Task } from '@/types';

interface TasksState {
  tasks: Task[];
  activeTaskId: string | null;
  hydrate: () => Promise<void>;
  addTask: (title: string) => void;
  toggleTask: (id: string) => void;
  removeTask: (id: string) => void;
  setActiveTask: (id: string | null) => void;
}

function persist(tasks: Task[]): void {
  window.glance?.store.set('tasks', tasks);
}

export const useTasksStore = create<TasksState>((set, get) => ({
  tasks: [],
  activeTaskId: null,

  hydrate: async () => {
    if (!window.glance) return;
    const tasks = (await window.glance.store.get<Task[]>('tasks')) ?? [];
    set({ tasks, activeTaskId: tasks.find((t) => !t.done)?.id ?? null });
  },

  addTask: (title) => {
    const task: Task = { id: crypto.randomUUID(), title, done: false, createdAt: Date.now(), dueAt: null };
    const tasks = [...get().tasks, task];
    set({ tasks });
    persist(tasks);
  },

  toggleTask: (id) => {
    const tasks = get().tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
    set({ tasks });
    persist(tasks);
  },

  removeTask: (id) => {
    const tasks = get().tasks.filter((t) => t.id !== id);
    set({ tasks, activeTaskId: get().activeTaskId === id ? null : get().activeTaskId });
    persist(tasks);
  },

  setActiveTask: (id) => set({ activeTaskId: id }),
}));
