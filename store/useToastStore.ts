import { create } from "zustand";

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: "cyan" | "success" | "error";
  durationMs?: number;
}

interface ToastStore {
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, "id">) => string;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: ({ title, description, type = "cyan", durationMs = 2500 }) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newToast: ToastMessage = { id, title, description, type, durationMs };

    set((state) => ({
      // Keep up to 3 toasts max to prevent screen clutter
      toasts: [...state.toasts.slice(-2), newToast],
    }));

    // Auto-dismiss strictly after 2.5s (2500ms)
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, durationMs);

    return id;
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));

/**
 * Global helper function to trigger toast from anywhere
 */
export function toast(title: string, description?: string) {
  useToastStore.getState().addToast({
    title,
    description,
    type: "cyan",
    durationMs: 2500,
  });
}
