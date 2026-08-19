"use client";

import { DragEvent, ReactNode, useRef } from "react";

type DropAreaProps = {
    children: ReactNode;
    data: any;
    setIsDragging: (isDragging: boolean) => void;
    setHasImage: (hasImage: boolean) => void;
};

export default function DropArea({
    children,
    data,
    setIsDragging,
    setHasImage
}: DropAreaProps) {
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

        const image = [...e.dataTransfer.files].find(
            file => file.type.startsWith("image/")
        );

        if (image) {
            data.current.imagepreviews = [...data.current.imagepreviews, URL.createObjectURL(image)]
            setHasImage(true)
        }
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