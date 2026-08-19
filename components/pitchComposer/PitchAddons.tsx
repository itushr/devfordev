import { CodeXml, Command, CornerDownLeft, HatGlasses, Image, Link, List, SlidersHorizontal } from "lucide-react";

const PitchAddons = ({ setCodeBlocks }: {
    setCodeBlocks: any
}) => {
    return (
        <div className="border-t mt-5 py-2 flex justify-between items-center text-foreground/80">
            <div className="flex gap-3">
                <Image
                    size={18}
                    className="hover:text-pink-500 cursor-pointer"
                />

                <CodeXml
                    size={18}
                    className="hover:text-pink-500 cursor-pointer"
                    onClick={() => setCodeBlocks((codeBlocks: any) => [...codeBlocks, ""])}
                />

                <Link
                    size={15}
                    className="hover:text-pink-500 cursor-pointer"
                />

                <List
                    size={18}
                    className="hover:text-pink-500 cursor-pointer"
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
}

export default PitchAddons;