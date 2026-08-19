import {
    CodeXml,
    Command,
    CornerDownLeft,
    HatGlasses,
    Image,
    Link,
    List,
    SlidersHorizontal,
} from "lucide-react";
import { Dispatch, useRef } from "react";

const PitchAddons = ({
    data,
    setHasCode,
    setHasPole,
    setImageCount,
}: {
    data: any;
    setHasCode: Dispatch<React.SetStateAction<boolean>>;
    setHasPole: Dispatch<React.SetStateAction<boolean>>;
    setImageCount: Dispatch<React.SetStateAction<number>>;
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const files = Array.from(e.target.files || []);

        const imageFiles = files.filter(file =>
            file.type.startsWith("image/")
        );

        imageFiles.forEach(file => {
            const imagePreviewUrl = URL.createObjectURL(file);
            data.current.imagepreviews.push(imagePreviewUrl);
        });

        if (imageFiles.length > 0) {
            setImageCount(prev => prev + imageFiles.length);
        }

        e.target.value = "";
    };

    return (
        <div className="border-t mt-5 py-2 flex justify-between items-center text-foreground/80">
            <div className="flex gap-3">
                <Image
                    size={18}
                    className="hover:text-pink-500 cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                />

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    hidden
                    onChange={handleImageUpload}
                />

                <CodeXml
                    size={18}
                    className="hover:text-pink-500 cursor-pointer"
                    onClick={() => setHasCode(prev => !prev)}
                />

                <Link
                    size={15}
                    className="hover:text-pink-500 cursor-pointer"
                />

                <List
                    size={18}
                    className="hover:text-pink-500 cursor-pointer"
                    onClick={() => setHasPole(prev => !prev)}
                />

                <HatGlasses
                    size={18}
                    className="hover:text-pink-500 cursor-pointer"
                />

                <SlidersHorizontal
                    size={18}
                    className="hover:text-pink-500 cursor-pointer"
                />
            </div>

            <div className="flex gap-1 border rounded-sm px-2 py-1 hover:text-pink-500 cursor-pointer">
                <Command size={14} />
                <CornerDownLeft size={14} />
            </div>
        </div>
    );
};

export default PitchAddons;