import type { ReactNode } from "react";

export type TrendingTag = {
    name: string;
    count: number;
};

type TrendingTagsProps = {
    className?: string;
    renderTag?: (tag: TrendingTag) => ReactNode;
};

const tags: TrendingTag[] = [
    { name: "react", count: 432 },
    { name: "nextjs", count: 432 },
    { name: "typescript", count: 432 },
    { name: "programming", count: 432 },
    { name: "express", count: 432 },
    { name: "gitngithub", count: 432 },
];

export default function TrendingTags({
    className = "",
    renderTag,
}: TrendingTagsProps) {
    return (
        <div className={`flex flex-wrap gap-x-2 gap-y-0 mt-3 ${className}`}>
            {tags.map((tag) =>
                renderTag ? (
                    <div key={tag.name}>{renderTag(tag)}</div>
                ) : (
                    <TrendingTag key={tag.name} {...tag} />
                )
            )}
        </div>
    );
}

function TrendingTag({ name, count }: TrendingTag) {
    return (
        <div className="flex items-center gap-x-1 group cursor-pointer">
            <div className="text-blue-500 group-hover:underline">
                #{name}
            </div>

            <div className="text-xs text-foreground/70 group-hover:underline">
                ({count})
            </div>
        </div>
    );
}