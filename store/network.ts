import { create } from "zustand";
import { NetworkNode, NetworkEdge } from "@/app/profile/(rightpanel)/SocialNet";

type NetworkState = {
    nodes: NetworkNode[];
    edges: NetworkEdge[];
    rootId: string;
    loading: boolean;
    initialized: boolean;
    fetchNetwork: (userId: string) => Promise<void>;
    reset: () => void;
};

export const useNetworkStore = create<NetworkState>((set, get) => ({
    nodes: [],
    edges: [],
    rootId: "",
    loading: false,
    initialized: false,

    fetchNetwork: async (userId: string) => {
        // Skip if already loaded for this user
        if (get().initialized && get().rootId === userId) return;

        set({ loading: true });
        try {
            const res = await fetch(`/api/users/${userId}/network?depth=3&limit=100`, {
                credentials: "include",
            });
            const data = await res.json();
            if (data.nodes && data.edges) {
                set({
                    nodes: data.nodes,
                    edges: data.edges,
                    rootId: data.meta?.rootId ?? userId,
                    initialized: true,
                });
            }
        } catch {
            // silently fail — no new infra
        } finally {
            set({ loading: false });
        }
    },

    reset: () =>
        set({ nodes: [], edges: [], rootId: "", loading: false, initialized: false }),
}));
