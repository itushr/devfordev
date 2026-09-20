import { uploadFile } from "@/lib/uploadFile";
import { useComposerCodeStore } from "@/store/composerCode";
import { useUploadStore } from "@/store/upload";
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
    setHasPole
}: {
    data: any;
    setHasPole: Dispatch<React.SetStateAction<boolean>>;
}) => {
    const { addImage } = useUploadStore();
    const { addFile } = useComposerCodeStore();

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const files = Array.from(e.target.files || []);

        const imageFiles = files.filter(file =>
            file.type.startsWith("image/")
        );

        imageFiles.forEach(async (file) => {
            const imagePreviewUrl = URL.createObjectURL(file);
            addImage({
                id: crypto.randomUUID(),
                preview: imagePreviewUrl,
                progress: 10
            });

            //upload to cloud
            // try {
            //     const result = await uploadFile(file, (progress) => {
            //         console.log(progress);
            //     });

            //     console.log("R2 key:", result.key);
            // } catch (error) {
            //     console.error(error);
            // }
        });

        e.target.value = "";
    };

    return (
        <div className="border-t mt-3 pt-2 flex justify-between items-center text-foreground/80">
            <div className="flex gap-3">
                <Image
                    size={15}
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
                    size={17}
                    className="hover:text-pink-500 cursor-pointer"
                    onClick={() => addFile({
                        id: crypto.randomUUID(),
                        name: "x.jsx",
                        content: ""
                    })}
                />

                <Link
                    size={14}
                    className="hover:text-pink-500 cursor-pointer"
                />

                <List
                    size={15}
                    className="hover:text-pink-500 cursor-pointer"
                    onClick={() => setHasPole(prev => !prev)}
                />

                <HatGlasses
                    size={16}
                    className="hover:text-pink-500 cursor-pointer"
                />

                <SlidersHorizontal
                    size={15}
                    className="hover:text-pink-500 cursor-pointer"
                />
            </div>

            <div className="flex gap-1 border rounded-sm px-2 py-1 hover:text-pink-500 cursor-pointer opacity-50">
                <Command size={12} />
                <CornerDownLeft size={13} />
            </div>
        </div>
    );
};

export default PitchAddons;