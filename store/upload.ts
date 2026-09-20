import { create } from "zustand";

type ImageItem = {
    id: string;
    preview: string;
    progress: number;
};

type UploadState = {
    images: ImageItem[];
    addImage: (image: ImageItem) => void;
    updateProgress: (id: string, progress: number) => void;
    removeImage: (id: string) => void;
};

export const useUploadStore = create<UploadState>((set) => ({
    images: [],

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

    removeImage: (id) =>
        set((state) => ({
            images: state.images.filter((image) => image.id !== id),
        })),
}));