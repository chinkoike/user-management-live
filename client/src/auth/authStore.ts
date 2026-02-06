import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface User {
  id: string;
  email: string;
  role: string;
}

interface AuthState {
  accessToken: string | null;
  user: User | null;

  hydrated: boolean; // ✅ เพิ่ม

  setAuth: (token: string, user: User) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,

      hydrated: false, // ✅ ค่าเริ่มต้น

      setAuth: (token, user) => set({ accessToken: token, user }),

      clearAuth: () => set({ accessToken: null, user: null }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),

      // ✅ สำคัญมาก
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.hydrated = true;
        }
      },
    },
  ),
);
