import { create } from "zustand";

type ComposerTextState = {
    text: string;
    setText: (text: string) => void;
    clearText: () => void;
};

export const useComposerText = create<ComposerTextState>((set) => ({
    text: "",
    setText: (text) => set({ text }),
    clearText: () => set({ text: "" }),
}));
