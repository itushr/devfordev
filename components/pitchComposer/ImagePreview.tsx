type ImagePreviewProps = {
    src: string;
};

export default function ImagePreview({ src }: ImagePreviewProps) {
    return (
        <div className="w-full bg-card mt-3 rounded-md overflow-hidden">
            <img
                src={src}
                alt="Attached image"
                className="w-full rounded-md"
            />
        </div>
    );
}