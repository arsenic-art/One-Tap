import { create } from "zustand";
import { persist } from "zustand/middleware";
const API_BASE = import.meta.env.VITE_API_BASE_LINK + "/api";
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
          isCheckingAuth: false,
        });
      },

      logout: async () => {
        try {
          await fetch(`${API_BASE}/mechanic/logout`, {
            method: "POST",
            credentials: "include",
          });
        } catch (err) {
          console.error("Logout API failed", err);
        } finally {
          set({ user: null, isLoggedIn: false, isCheckingAuth: false });
          localStorage.removeItem("auth-storage");
        }
      },

      checkAuth: async () => {
        try {
          const res = await fetch(`${API_BASE}/user/profile`, {
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

export const useMechanicAuthStore = create(
  persist(
    (set) => ({
      mechanic: null,
      isLoggedIn: false,
      isCheckingAuth: true,

      loginSuccess: (mechanicData) => {
        set({
          mechanic: {
            _id: mechanicData._id,
            firstName: mechanicData.firstName,
            lastName: mechanicData.lastName,
            email: mechanicData.email,
            phoneNumber: mechanicData.phoneNumber,
            role: mechanicData.role,
            profileImage: mechanicData.profileImage || "",
          },
          isLoggedIn: true,
          isCheckingAuth: false,
        });
      },

      logout: async () => {
        try {
          await fetch(`${API_BASE}/mechanic/logout`, {
            method: "POST",
            credentials: "include",
          });
        } catch (err) {
          console.error("Mechanic logout API failed", err);
        } finally {
          set({ mechanic: null, isLoggedIn: false, isCheckingAuth: false });
          localStorage.removeItem("mechanic-auth-storage");
        }
      },

      checkAuth: async () => {
        try {
          const res = await fetch(`${API_BASE}/mechanic/profile`, {
            credentials: "include",
          });
          if (!res.ok) throw new Error("Unauthorized");

          const mechanic = await res.json();

          set({
            mechanic: {
              _id: mechanic._id,
              firstName: mechanic.firstName,
              lastName: mechanic.lastName,
              email: mechanic.email,
              phoneNumber: mechanic.phoneNumber,
              role: mechanic.role,
              profileImage: mechanic.profileImage || "",
            },
            isLoggedIn: true,
          });
        } catch {
          set({ mechanic: null, isLoggedIn: false });
        } finally {
          set({ isCheckingAuth: false });
        }
      },

      updateProfile: (updates) => {
        set((state) => ({
          mechanic: state.mechanic ? { ...state.mechanic, ...updates } : null,
        }));
      },
    }),
    {
      name: "mechanic-auth-storage",
      partialize: (state) => ({
        mechanic: state.mechanic,
        isLoggedIn: state.isLoggedIn,
      }),
    }
  )
);
