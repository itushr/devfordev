import { useState } from "react";
import CompareImages from "./CompareImages";
import ImagePreview from "./ImagePreview";

export default function Image() {
    const [imageUrls, setImageUrls] = useState<string[]>([]);

    return (
        <div>
            {imageUrls.length == 2 ? (
                <CompareImages imageUrls={imageUrls} />
            ) : (imageUrls.length > 0 && imageUrls.map((image, i) => (
                <ImagePreview key={i} src={image} />
            )))}
        </div>
    )
}
