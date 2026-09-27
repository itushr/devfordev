import { useState } from "react";
import { CodeBlockEditable } from "../ui/code-block-editable";

export function CodeBlock({ files }: { files: Array<{ name: string; content: string }> }) {
    const [activeIdx, setActiveIdx] = useState(0);
    const activeFile = files[activeIdx] ?? files[0];
    if (!files || files.length === 0) return null;

    return (
        <div className="overflow-hidden rounded-md border mt-2">
            {files.length > 1 ? (
                <div className="flex w-full overflow-x-auto scrollbar-hide bg-card text-xs text-foreground/50 border-b">
                    {files.map((file, idx) => (
                        <button
                            key={idx}
                            type="button"
                            onClick={() => setActiveIdx(idx)}
                            className={`px-3 py-2 cursor-pointer font-mono ${
                                activeIdx === idx
                                    ? "text-foreground border-b-2 border-pink-500 font-semibold"
                                    : "hover:text-foreground"
                            }`}
                        >
                            {file.name}
                        </button>
                    ))}
                </div>
            ) : (
                <div className="bg-card text-xs text-foreground/60 border-b px-3 py-1.5 font-mono">
                    {activeFile.name}
                </div>
            )}
            <CodeBlockEditable
                code={activeFile.content}
                language="js"
                readOnly={true}
            />
        </div>
    );
}