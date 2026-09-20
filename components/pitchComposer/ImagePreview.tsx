import { X } from "lucide-react";
import { Progress } from "../ui/progress";
import { useUploadStore } from "@/store/upload";

type ImagePreviewProps = {
    image: {
        id: string;
        preview: string;
        progress: number;
    };
};

export default function ImagePreview({ image }: ImagePreviewProps) {
    const { removeImage } = useUploadStore();

    return (
        <div className="w-full bg-card rounded-md overflow-hidden relative">
            <img
                src={image.preview}
                alt="attached image"
                className="w-full rounded-md"
            />
            <Progress value={image.progress} />
            <div
                className="absolute top-2 right-2 w-fit aspect-square rounded-full bg-background px-2 py-1 border text-sm cursor-pointer flex items-center hover:bg-card"
                onClick={() => removeImage(image.id)}
            >
                <X size={15} />
            </div>
        </div>
    );
}