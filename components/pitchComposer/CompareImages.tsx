import { useState } from "react";
import ImagePreview from "./ImagePreview";
import {
    ImageSlider,
    ImageLayer,
    Divider,
} from "@/components/ui/image-comparison";

export default function CompareImages(
    { imagepreviews }: {
        imagepreviews: string[]
    }
) {
    const [isComparing, setIsComparing] = useState<boolean>(false);

    if (!isComparing) {
        return (
            <div>
                <ImagePreview src={imagepreviews[0]} />
                <div className="flex justify-center mt-2">
                    <div className="w-fit px-2 py-1 rounded-md border text-sm cursor-pointer relative" onClick={() => setIsComparing(true)}>
                        <div className="w-10 h-5 -left-10 -top-2 border-l border-b absolute rounded-bl-md"></div>
                        compare
                        <div className="w-10 h-5 -right-10 -bottom-2 border-r border-t absolute rounded-tr-md"></div>
                    </div>
                </div>
                <ImagePreview src={imagepreviews[1]} />
            </div>
        )
    }

    return (
        <div className="relative">
            <ImageSlider className="h-96 w-full overflow-hidden rounded-xl">
                <ImageLayer
                    src={imagepreviews[0]}
                    alt="Before Image"
                    layer="first"
                />
                <ImageLayer
                    src={imagepreviews[1]}
                    alt="After Image"
                    layer="second" />
                <Divider />
            </ImageSlider>

            <div className="absolute bottom-1 right-2 w-fit bg-background px-2 py-1 rounded-md border text-sm cursor-pointer" onClick={() => setIsComparing(false)}>
                separate
            </div>
        </div>
    )
}
