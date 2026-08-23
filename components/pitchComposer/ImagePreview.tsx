import { Progress } from "../ui/progress";

type ImagePreviewProps = {
    src: string;
};

export default function ImagePreview({ src }: ImagePreviewProps) {
    return (
        <div className="w-full bg-card rounded-md overflow-hidden">
            <img
                src={src}
                alt="attached image"
                className="w-full rounded-md"
            />
            <Progress value={70} />
        </div>
    );
}