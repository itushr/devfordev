import { create } from "zustand";

export type ImageItem = {
    id: string;
    preview: string;
    progress: number;
    url: string;
};

type UploadState = {
    images: ImageItem[];
    compare: boolean;
    setCompare: (compare: boolean) => void;
    addImage: (image: ImageItem) => void;
    updateProgress: (id: string, progress: number) => void;
    updateUrl: (id: string, url: string) => void;
    removeImage: (id: string) => void;
    clearImages: () => void;
};

export const useUploadStore = create<UploadState>((set) => ({
    images: [],
    compare: false,

    setCompare: (compare) => set({ compare }),

    addImage: (image) =>
        set((state) => ({
            images: [...state.images, image],
        })),

    updateProgress: (id, progress) =>
        set((state) => ({
            images: state.images.map((image) =>
                image.id === id
                    ? { ...image, progress }
                    : image
            ),
        })),

    updateUrl: (id, url) =>
        set((state) => ({
            images: state.images.map((image) =>
                image.id === id
                    ? { ...image, url }
                    : image
            ),
        })),

    removeImage: (id) =>
        set((state) => {
            const nextImages = state.images.filter((image) => image.id !== id);
            return {
                images: nextImages,
                compare: nextImages.length === 2 ? state.compare : false,
            };
        }),

    clearImages: () =>
        set({
            images: [],
            compare: false,
        }),
}));