import { create } from 'zustand';
import { User } from '@app-types/index';
import { STORAGE_KEYS } from '@constants/index';

interface AuthStore {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setIsLoading: (loading: boolean) => void;
  logout: () => void;
  initialize: () => void;
}

export const useStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,

  setUser: (user) => {
    set({ user, isAuthenticated: !!user || !!localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN), isLoading: false });
    if (user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  },

  setToken: (token) => {
    set({ token, isAuthenticated: !!token, isLoading: false });
    if (token) {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    } else {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    }
  },

  setIsLoading: (loading) => set({ isLoading: loading }),

  logout: () => {
    set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  },

  initialize: () => {
    if (typeof window === 'undefined') return;
    
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    const user = localStorage.getItem(STORAGE_KEYS.USER);

    if (token && user) {
      try {
        set({
          token,
          user: JSON.parse(user),
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem(STORAGE_KEYS.USER);
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        set({ isAuthenticated: false, token: null, user: null, isLoading: false });
      }
    } else {
      set({ isAuthenticated: false, token: null, user: null, isLoading: false });
    }
  },
}));
