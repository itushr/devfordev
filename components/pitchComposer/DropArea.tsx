"use client";

import { uploadFile } from "@/lib/client/uploadFile";
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
    const { addImage, updateProgress } = useUploadStore();

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

        imageFiles.forEach(async (file) => {
            const imagePreviewUrl = URL.createObjectURL(file);
            const newImage = {
                id: crypto.randomUUID(),
                preview: imagePreviewUrl,
                progress: 10,
                url: ''
            }
            addImage(newImage);

            //upload to server
            try {
                const result = await uploadFile(file, (progress) => {
                    console.log(progress);
                    updateProgress(newImage.id, progress);
                });

                console.log("R2 key:", result.key);
            } catch (error) {
                console.error(error);
            }
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