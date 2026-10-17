import { create } from "zustand";
import { PostItem } from "@/components/pitchCard/PitchCard";

export type FeedMode = "foryou" | "recent";

type FeedState = {
    mode: FeedMode;
    posts: PostItem[];
    loading: boolean;
    error: string | null;
    initialized: boolean;

    // "for you" session state
    servedIds: string[];
    hasMore: boolean;

    // "recent" cursor
    nextCursor: string | null;

    setMode: (mode: FeedMode) => void;
    fetchPosts: () => Promise<void>;
    fetchMore: () => Promise<void>;
    prependPost: (post: PostItem) => void;
    reset: () => void;
};

const initialState = {
    mode: "foryou" as FeedMode,
    posts: [],
    loading: false,
    error: null,
    initialized: false,
    servedIds: [],
    hasMore: true,
    nextCursor: null,
};

export const useFeedStore = create<FeedState>((set, get) => ({
    ...initialState,

    setMode: (mode: FeedMode) => {
        if (get().mode === mode) return;
        set({ ...initialState, mode });
        // Auto-fetch after mode switch
        get().fetchPosts();
    },

    fetchPosts: async () => {
        if (get().initialized && get().posts.length > 0) return;
        const { mode } = get();

        set({ loading: true, error: null });
        try {
            const url = buildFeedUrl(mode, { servedIds: [], cursor: null });
            const res = await fetch(url);
            if (!res.ok) throw new Error("Failed to load posts");
            const data = await res.json();

            set({
                posts: data.posts ?? [],
                initialized: true,
                servedIds: data.servedIds ?? [],
                hasMore: data.hasMore ?? false,
                nextCursor: data.nextCursor ?? null,
            });
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Failed to load posts";
            set({ error: message });
        } finally {
            set({ loading: false });
        }
    },

    fetchMore: async () => {
        const { mode, loading, hasMore, servedIds, nextCursor, posts } = get();
        if (loading || !hasMore) return;

        set({ loading: true, error: null });
        try {
            const url = buildFeedUrl(mode, { servedIds, cursor: nextCursor });
            const res = await fetch(url);
            if (!res.ok) throw new Error("Failed to load more posts");
            const data = await res.json();

            const newPosts: PostItem[] = data.posts ?? [];
            const existingIds = new Set(posts.map((p) => p._id));
            const deduplicated = newPosts.filter((p) => !existingIds.has(p._id));

            set((state) => ({
                posts: [...state.posts, ...deduplicated],
                servedIds: mode === "foryou"
                    ? [...state.servedIds, ...(data.servedIds ?? [])]
                    : state.servedIds,
                nextCursor: data.nextCursor ?? null,
                hasMore: data.hasMore ?? false,
            }));
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Failed to load more posts";
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

    reset: () => set({ ...initialState }),
}));

function buildFeedUrl(
    mode: FeedMode,
    { servedIds, cursor }: { servedIds: string[]; cursor: string | null }
): string {
    const params = new URLSearchParams();
    params.set("mode", mode);
    params.set("limit", "20");

    if (mode === "foryou" && servedIds.length > 0) {
        // Keep last 200 served IDs to avoid query-string explosion
        params.set("served", servedIds.slice(-200).join(","));
    }

    if (mode === "recent" && cursor) {
        params.set("cursor", cursor);
    }

    return `/api/feed?${params.toString()}`;
}
