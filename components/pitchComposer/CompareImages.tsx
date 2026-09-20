import { useState } from "react";
import ImagePreview from "./ImagePreview";
import {
    ImageSlider,
    ImageLayer,
    Divider,
} from "@/components/ui/image-comparison";
import { useUploadStore } from "@/store/upload";
import { Split, SquareSplitHorizontal } from "lucide-react";

export default function CompareImages() {
    const [isComparing, setIsComparing] = useState<boolean>(false);
    const { images } = useUploadStore();

    if (!isComparing) {
        return (
            <div>
                <ImagePreview src={images[0].preview} />
                <div className="flex justify-center my-2">
                    <div className="w-fit px-2 py-1 rounded-md border text-sm cursor-pointer relative" onClick={() => setIsComparing(true)}>
                        <div className="w-10 h-5 -left-10 -top-2 border-l border-b absolute rounded-bl-md"></div>
                        <SquareSplitHorizontal size={15} />
                        <div className="w-10 h-5 -right-10 -bottom-2 border-r border-t absolute rounded-tr-md"></div>
                    </div>
                </div>
                <ImagePreview src={images[1].preview} />
            </div>
        )
    }

    return (
        <div className="relative">
            <ImageSlider className="h-96 w-full overflow-hidden rounded-xl bg-card">
                <ImageLayer
                    src={images[0].preview}
                    alt="Before"
                    layer="first"
                />
                <ImageLayer
                    src={images[1].preview}
                    alt="After"
                    layer="second" />
                <Divider />
            </ImageSlider>

            <div className="absolute bottom-1 right-2 w-fit bg-background px-2 py-1 rounded-md border text-sm cursor-pointer" onClick={() => setIsComparing(false)}>
                <Split size={15} />
            </div>
        </div>
    )
}
