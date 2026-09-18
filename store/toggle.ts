import { create } from "zustand";

type ToggleState = {
    showPitchComposer: boolean;
    togglePitchComposer: () => Promise<void>;
};

export const useToggleStore = create<ToggleState>((set) => ({
    showPitchComposer: false,

    togglePitchComposer: async () =>
        set((state) => ({ showPitchComposer: !state.showPitchComposer })),
}));