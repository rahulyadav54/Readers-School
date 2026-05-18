import { create } from "zustand";

interface UIState {
  sidebarOpen: boolean;
  activeTab: string;
  themeColor: "indigo" | "violet" | "emerald" | "rose" | "cyan";
  notificationCount: number;
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  setActiveTab: (tab: string) => void;
  setThemeColor: (color: "indigo" | "violet" | "emerald" | "rose" | "cyan") => void;
  setNotificationCount: (count: number) => void;
  incrementNotifications: () => void;
  clearNotifications: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  activeTab: "overview",
  themeColor: "indigo",
  notificationCount: 3, // Starter notifications for students
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  setActiveTab: (activeTab) => set({ activeTab }),
  setThemeColor: (themeColor) => set({ themeColor }),
  setNotificationCount: (notificationCount) => set({ notificationCount }),
  incrementNotifications: () => set((state) => ({ notificationCount: state.notificationCount + 1 })),
  clearNotifications: () => set({ notificationCount: 0 }),
}));
