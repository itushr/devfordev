import { create } from "zustand";
import { PostItem } from "@/components/pitchCard/PitchCard";

type FeedState = {
    posts: PostItem[];
    loading: boolean;
    error: string | null;
    initialized: boolean;
    fetchPosts: () => Promise<void>;
    prependPost: (post: PostItem) => void;
    reset: () => void;
};

export const useFeedStore = create<FeedState>((set, get) => ({
    posts: [],
    loading: false,
    error: null,
    initialized: false,

    fetchPosts: async () => {
        // Skip if already loaded
        if (get().initialized && get().posts.length > 0) return;

        set({ loading: true, error: null });
        try {
            const res = await fetch("/api/post?limit=25");
            if (!res.ok) throw new Error("Failed to load recent posts");
            const data = await res.json();
            const items: PostItem[] = Array.isArray(data) ? data : data.posts ?? [];
            set({ posts: items, initialized: true });
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Failed to load posts";
            set({ error: message });
        } finally {
            set({ loading: false });
        }
    },

    prependPost: (post: PostItem) => {
        set((state) => ({
            posts: [post, ...state.posts.filter((p) => p._id !== post._id)],
        }));
    },

    reset: () => set({ posts: [], loading: false, error: null, initialized: false }),
}));
