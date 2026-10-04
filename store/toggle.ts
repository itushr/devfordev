import { create } from "zustand";

export type ReplyTarget = {
    postId: string;
    username: string;
} | null;

type ToggleState = {
    showPitchComposer: boolean;
    replyTarget: ReplyTarget;
    togglePitchComposer: () => Promise<void>;
    openComposerWithReply: (target: { postId: string; username: string }) => void;
    clearReplyTarget: () => void;
};

export const useToggleStore = create<ToggleState>((set) => ({
    showPitchComposer: false,
    replyTarget: null,

    togglePitchComposer: async () =>
        set((state) => ({
            showPitchComposer: !state.showPitchComposer,
            replyTarget: state.showPitchComposer ? null : state.replyTarget,
        })),

    openComposerWithReply: (target) =>
        set({
            showPitchComposer: true,
            replyTarget: target,
        }),

    clearReplyTarget: () =>
        set({
            replyTarget: null,
        }),
}));