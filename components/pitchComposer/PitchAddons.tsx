import { uploadFile } from "@/lib/client/uploadFile";
import { useComposerCodeStore } from "@/store/composerCode";
import { useComposerPoll } from "@/store/composerPole";
import { useUploadStore } from "@/store/upload";
import {
    CodeXml,
    Command,
    CornerDownLeft,
    HatGlasses,
    Image,
    LayoutList,
    Link,
    List,
    SlidersHorizontal,
} from "lucide-react";
import { useRef } from "react";

const PitchAddons = () => {
    const { addImage, updateProgress } = useUploadStore();
    const { addFile, setActiveFile } = useComposerCodeStore();
    const { enablePoll } = useComposerPoll();

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
            const newImage = {
                id: crypto.randomUUID(),
                preview: imagePreviewUrl,
                progress: 10,
                url: ''
            }
            addImage(newImage);

            //upload to server
            try {
                const result = await uploadFile(file, (progress) => {
                    console.log(progress);
                    updateProgress(newImage.id, progress);
                });

                console.log("R2 key:", result.key);
            } catch (error) {
                console.error(error);
            }
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
                    onClick={() => {
                        const newFile = {
                            id: crypto.randomUUID(),
                            name: "1.jsx",
                            content: ""
                        }
                        addFile(newFile);
                        setActiveFile(newFile.id);
                    }}
                />

                {/* <Link
                    size={14}
                    className="hover:text-pink-500 cursor-pointer"
                /> */}

                <LayoutList
                    size={15}
                    className="hover:text-pink-500 cursor-pointer"
                    onClick={() => enablePoll()}
                />

                {/* <HatGlasses
                    size={16}
                    className="hover:text-pink-500 cursor-pointer"
                />

                <SlidersHorizontal
                    size={15}
                    className="hover:text-pink-500 cursor-pointer"
                /> */}
            </div>

            <div className="flex gap-1 border rounded-sm px-2 py-1 hover:text-pink-500 cursor-pointer opacity-50">
                <Command size={12} />
                <CornerDownLeft size={13} />
            </div>
        </div>
    );
};

export default PitchAddons;