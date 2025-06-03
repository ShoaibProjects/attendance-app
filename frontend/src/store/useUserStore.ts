// src/store/useUserStore.ts
import { create } from 'zustand';

interface UserState {
  name: string;
  email: string;
  isLoggedIn: boolean;
  setUser: (name: string, email: string) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  name: '',
  email: '',
  isLoggedIn: false,
  setUser: (name, email) => set({ name, email, isLoggedIn: true }),
  logout: () => set({ name: '', email: '', isLoggedIn: false }),
}));