import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,
      isCheckingAuth: true,

      loginSuccess: (userData) => {
        set({
          user: {
            _id: userData._id,
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            phoneNumber: userData.phoneNumber,
            role: userData.role,
            profileImage: userData.profileImage || "",
          },
          isLoggedIn: true,
        });
      },

      logout: () => {
        set({ user: null, isLoggedIn: false });
      },

      checkAuth: async () => {
        try {
          const res = await fetch("http://localhost:7777/api/user/profile", {
            credentials: "include",
          });
          if (!res.ok) throw new Error("Unauthorized");

          const user = await res.json();

          set({
            user: {
              _id: user._id,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              phoneNumber: user.phoneNumber,
              role: user.role,
              profileImage: user.profileImage || "",
            },
            isLoggedIn: true,
          });
        } catch {
          set({ user: null, isLoggedIn: false });
        } finally {
          set({ isCheckingAuth: false });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isLoggedIn: state.isLoggedIn,
      }),
    }
  )
);
