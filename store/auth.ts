import { create } from "zustand";

export type AuthUser = {
    id: string;
    name: string;
    username: string;
    avatar?: string;
};

type AuthState = {
    authUser: AuthUser | null;
    checkingAuth: boolean;

    checkAuth: () => Promise<void>;
    logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
    authUser: null,
    checkingAuth: true,

    checkAuth: async () => {
        try {
            set({ checkingAuth: true });

            const res = await fetch("/api/auth/check", {
                method: "GET",
                credentials: "include",
            });

            if (!res.ok) {
                set({ authUser: null });
                return;
            }

            const data = await res.json();

            set({
                authUser: data.payload,
            });
        } catch (error) {
            console.error("Authentication failed:", error);
            set({ authUser: null });
        } finally {
            set({ checkingAuth: false });
        }
    },

    logout: async () => {
        try {
            await fetch("/api/auth/logout", {
                method: "POST",
                credentials: "include",
            });
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            set({ authUser: null });
        }
    },
}));