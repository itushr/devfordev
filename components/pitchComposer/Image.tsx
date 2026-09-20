import { useUploadStore } from "@/store/upload";
import CompareImages from "./CompareImages";
import ImagePreview from "./ImagePreview";

export default function Image() {
    const { images } = useUploadStore();

    if(images.length < 1) {
        return <></>;
    }

    return (
        <div className="space-y-3">
            {images.length == 2 ? (
                <CompareImages />
            ) : (images.map((image, i) => (
                <ImagePreview key={i} image={image} />
            )))}
        </div>
    )
}
