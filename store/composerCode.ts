import { create } from "zustand";

type FileItem = {
    id: string,
    name: string;
    content: string;
};

type ComposerCodeState = {
    files: FileItem[];
    activeFile: FileItem["id"] | null;
    setActiveFile: (id: string | null) => void;
    addFile: (file: FileItem) => void;
    editFile: (id: string, content: string) => void;
    removeFile: (id: string) => void;
};

const initialFile: FileItem = {
    id: crypto.randomUUID(),
    name: "1.jsx",
    content: `function MyComponent(props) {
    return (
        <div>
            <h1>Hello, {props.name}!</h1>
            <p>This is an example React component.</p>
        </div>
    );
}`,
};

export const useComposerCodeStore = create<ComposerCodeState>((set) => ({
    files: [initialFile],

    activeFile: initialFile.id,

    setActiveFile: (id) =>
        set({ activeFile: id }),

    addFile: (file) =>
        set((state) => ({
            files: [...state.files, file],
        })),

    editFile: (id, content) =>
        set((state) => ({
            files: state.files.map((file) =>
                file.id === id
                    ? { ...file, content }
                    : file
            ),
        })),

    removeFile: (id) =>
        set((state) => ({
            files: state.files.filter((file) => file.id !== id),
        })),
}));