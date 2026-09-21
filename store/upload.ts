import { create } from "zustand";

export type ImageItem = {
    id: string;
    file: File;
    progress: number;
    url: string;
};

type UploadState = {
    images: ImageItem[];
    addImage: (image: ImageItem) => void;
    updateProgress: (id: string, progress: number) => void;
    updateUrl: (id: string, url: string) => void;
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

    updateUrl: (id, url) =>
        set((state) => ({
            images: state.images.map((image) =>
                image.id === id
                    ? { ...image, url }
                    : image
            ),
        })),

    removeImage: (id) =>
        set((state) => ({
            images: state.images.filter((image) => image.id !== id),
        })),
}));