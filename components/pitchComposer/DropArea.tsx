"use client";

import { useUploadStore } from "@/store/upload";
import { Dispatch, DragEvent, ReactNode, useRef } from "react";

type DropAreaProps = {
    children: ReactNode;
    setIsDragging: Dispatch<React.SetStateAction<boolean>>;
};

export default function DropArea({
    children,
    setIsDragging,
}: DropAreaProps) {
    const { addImage } = useUploadStore();

    const dragCounter = useRef(0);

    const isFileDrag = (e: DragEvent) =>
        e.dataTransfer.types.includes("Files");

    const handleDragEnter = (e: DragEvent) => {
        <div className="w-10 h-5 -left-10 -top-2 border-l border-b absolute rounded-bl-md"></div>
        if (!isFileDrag(e)) return;

        dragCounter.current++;

        if (dragCounter.current === 1) {
            setIsDragging(true);
        }
    };

    const handleDragOver = (e: DragEvent) => {
        if (!isFileDrag(e)) return;

        e.preventDefault();
        e.dataTransfer.dropEffect = "copy";
    };

    const handleDragLeave = (e: DragEvent) => {
        if (!isFileDrag(e)) return;

        dragCounter.current = Math.max(
            0,
            dragCounter.current - 1
        );

        if (dragCounter.current === 0) {
            setIsDragging(false);
        }
    };

    const handleDrop = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();

        dragCounter.current = 0;
        setIsDragging(false);

        const imageFiles = [...e.dataTransfer.files].filter(
            file => file.type.startsWith("image/")
        );

        imageFiles.forEach(file => {
            addImage({
                id: crypto.randomUUID(),
                preview: URL.createObjectURL(file),
                progress: 10
            });
        });
    };

    return (
        <div
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            {children}
        </div>
    );
}