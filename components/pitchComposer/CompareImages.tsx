import ImagePreview from "./ImagePreview";
import {
    ImageSlider,
    ImageLayer,
    Divider,
} from "@/components/ui/image-comparison";
import { useUploadStore } from "@/store/upload";
import { Split, SquareSplitHorizontal } from "lucide-react";

export default function CompareImages() {
    const { images, compare, setCompare } = useUploadStore();

    if (!compare) {
        return (
            <div>
                <ImagePreview image={images[0]} />
                <div className="flex justify-center my-2">
                    <div
                        className="w-fit aspect-square rounded-full px-2 border text-sm cursor-pointer relative flex items-center hover:bg-card"
                        onClick={() => setCompare(true)}
                    >
                        <div className="w-10 h-5 -left-10 -top-2 border-l border-b absolute rounded-bl-md"></div>
                        <SquareSplitHorizontal size={15} />
                        <div className="w-10 h-5 -right-10 -bottom-1 border-r border-t absolute rounded-tr-md"></div>
                    </div>
                </div>
                <ImagePreview image={images[1]} />
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

            <div
                className="absolute top-2 right-2 w-fit aspect-square rounded-full bg-background px-2 py-1 border text-sm cursor-pointer flex items-center hover:bg-card"
                onClick={() => setCompare(false)}
            >
                <Split size={15} />
            </div>
        </div>
    )
}
