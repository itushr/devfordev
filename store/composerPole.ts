import { create } from "zustand";

type ComposerPollState = {
    pollEnabled: boolean;
    options: string[];
    enablePoll: () => void;
    disablePoll: () => void;
    setOptions: (options: string[]) => void;
    updateOption: (index: number, value: string) => void;
    addOption: () => void;
    removeOption: (index: number) => void;
};

export const useComposerPoll = create<ComposerPollState>((set) => ({
    pollEnabled: false,

    options: ["", ""],

    enablePoll: () => set({ pollEnabled: true }),

    disablePoll: () => set({ pollEnabled: false }),

    setOptions: (options) => set({ options }),

    updateOption: (index, value) =>
        set((state) => ({
            options: state.options.map((option, i) =>
                i === index ? value : option
            ),
        })),

    addOption: () =>
        set((state) => {
            if (state.options.length >= 5) {
                return state;
            }

            return {
                options: [...state.options, ""],
            };
        }),

    removeOption: (index) =>
        set((state) => {
            if (state.options.length <= 2) {
                return state;
            }

            return {
                options: state.options.filter((_, i) => i !== index),
            };
        }),
}));