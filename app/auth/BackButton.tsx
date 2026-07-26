"use client";

import { ArrowBigLeft, ChevronLeftCircleIcon, ChevronsLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BackButton() {
    const router = useRouter();

    const handleClick = () => {
        if (window.history.length > 1) {
            router.back();
        } else {
            router.push("/");
        }
    };

    return (
        <button onClick={handleClick} className="w-fit cursor-pointer flex gap-2 items-center pl-2 pr-4 py-2">
            <ChevronsLeftIcon className="size-5" />
            Back
        </button>
    );
}