import { create } from 'zustand';
import { User, Profile, Post, Notification } from '@/types';

interface AppStore {
  // Auth State
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;

  // Profile State
  profiles: Profile[];
  currentProfile: Profile | null;
  setProfiles: (profiles: Profile[]) => void;
  setCurrentProfile: (profile: Profile) => void;

  // Posts State
  posts: Post[];
  setPosts: (posts: Post[]) => void;
  addPost: (post: Post) => void;

  // Notifications
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;

  // UI State
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  showNotifications: boolean;
  setShowNotifications: (show: boolean) => void;
}

export const useAppStore = create<AppStore>((set, get) => ({
  // Auth
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  logout: () => {
    set({ user: null, isAuthenticated: false, profiles: [], currentProfile: null });
    localStorage.removeItem('user');
  },

  // Profiles
  profiles: [],
  currentProfile: null,
  setProfiles: (profiles) => set({ profiles }),
  setCurrentProfile: (profile) => set({ currentProfile: profile }),

  // Posts
  posts: [],
  setPosts: (posts) => set({ posts }),
  addPost: (post) => set({ posts: [...get().posts, post] }),

  // Notifications
  notifications: [],
  unreadCount: 0,
  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    })),
  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    })),

  // UI
  isDarkMode: false,
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  showNotifications: false,
  setShowNotifications: (show) => set({ showNotifications: show }),
}));
