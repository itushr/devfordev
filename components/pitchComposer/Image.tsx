import CompareImages from "./CompareImages";
import ImagePreview from "./ImagePreview";

export default function Image({ imagepreviews }: { imagepreviews: string[] }) {
    return (
        <div className="space-y-3">
            {imagepreviews.length == 2 ? (
                <CompareImages imagepreviews={imagepreviews} />
            ) : (imagepreviews.length > 0 && imagepreviews.map((image, i) => (
                <ImagePreview key={i} src={image} />
            )))}
        </div>
    )
}
