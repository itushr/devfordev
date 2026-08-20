"use client";

import Separator from "@/components/Separator";
import React, { useMemo, useState } from "react";

type Relation = "following" | "follower" | "mutual";

interface NetworkNode {
    id: string;
    name: string;
    username: string;
    avatar: string;
    x: number;
    y: number;
    relation?: Relation;
    followers?: number;
    following?: number;
    online?: boolean;
}

interface NetworkEdge {
    source: string;
    target: string;
    relation: Relation;
}

const nodes: NetworkNode[] = [
    {
        id: "you",
        name: "Tushar",
        username: "tushar",
        avatar: "https://i.pravatar.cc/150?img=12",
        x: 500,
        y: 300,
        followers: 1280,
        following: 342,
        online: true,
    },
    {
        id: "alex",
        name: "Alex Morgan",
        username: "alexm",
        avatar: "https://i.pravatar.cc/150?img=11",
        x: 250,
        y: 130,
        relation: "mutual",
        followers: 842,
        following: 221,
        online: true,
    },
    {
        id: "sarah",
        name: "Sarah Chen",
        username: "sarahc",
        avatar: "https://i.pravatar.cc/150?img=32",
        x: 760,
        y: 130,
        relation: "following",
        followers: 2140,
        following: 410,
    },
    {
        id: "james",
        name: "James Wilson",
        username: "jamesw",
        avatar: "https://i.pravatar.cc/150?img=13",
        x: 820,
        y: 370,
        relation: "follower",
        followers: 520,
        following: 187,
        online: true,
    },
    {
        id: "mia",
        name: "Mia Rodriguez",
        username: "miar",
        avatar: "https://i.pravatar.cc/150?img=47",
        x: 620,
        y: 520,
        relation: "mutual",
        followers: 1200,
        following: 301,
    },
    {
        id: "daniel",
        name: "Daniel Kim",
        username: "danielk",
        avatar: "https://i.pravatar.cc/150?img=68",
        x: 300,
        y: 500,
        relation: "following",
        followers: 730,
        following: 198,
    },
    {
        id: "emma",
        name: "Emma Davis",
        username: "emmad",
        avatar: "https://i.pravatar.cc/150?img=44",
        x: 130,
        y: 330,
        relation: "follower",
        followers: 390,
        following: 120,
    },
    {
        id: "noah",
        name: "Noah Brown",
        username: "noahb",
        avatar: "https://i.pravatar.cc/150?img=56",
        x: 420,
        y: 80,
        relation: "mutual",
        followers: 980,
        following: 267,
    },
];

const edges: NetworkEdge[] = [
    { source: "you", target: "alex", relation: "mutual" },
    { source: "you", target: "sarah", relation: "following" },
    { source: "you", target: "james", relation: "follower" },
    { source: "you", target: "mia", relation: "mutual" },
    { source: "you", target: "daniel", relation: "following" },
    { source: "you", target: "emma", relation: "follower" },
    { source: "you", target: "noah", relation: "mutual" },

    // Secondary connections
    { source: "alex", target: "noah", relation: "mutual" },
    { source: "sarah", target: "james", relation: "following" },
    { source: "daniel", target: "emma", relation: "follower" },
];

const relationConfig: Record<
    Relation,
    {
        label: string;
        line: string;
        badge: string;
    }
> = {
    mutual: {
        label: "Mutual",
        line: "stroke-foreground/30",
        badge: "bg-foreground/10 text-foreground",
    },
    following: {
        label: "Following",
        line: "stroke-blue-500/40",
        badge: "bg-blue-500/10 text-blue-500",
    },
    follower: {
        label: "Follower",
        line: "stroke-emerald-500/40",
        badge: "bg-emerald-500/10 text-emerald-500",
    },
};

function getNode(id: string) {
    return nodes.find((node) => node.id === id)!;
}

function curvedPath(
    source: NetworkNode,
    target: NetworkNode
) {
    const dx = target.x - source.x;
    const dy = target.y - source.y;

    const distance = Math.sqrt(dx * dx + dy * dy);

    const curve = Math.min(distance * 0.22, 80);

    const cx =
        (source.x + target.x) / 2 -
        dy * 0.08;

    const cy =
        (source.y + target.y) / 2 +
        dx * 0.08;

    return `
        M ${source.x} ${source.y}
        Q ${cx} ${cy}
        ${target.x} ${target.y}
    `;
}

export default function Network() {
    const [selected, setSelected] = useState<string>("you");
    const [hovered, setHovered] = useState<string | null>(null);

    const selectedNode = useMemo(
        () => getNode(selected),
        [selected]
    );

    const connectedNodes = useMemo(() => {
        if (!selected) return new Set<string>();

        const result = new Set<string>();

        edges.forEach((edge) => {
            if (edge.source === selected) {
                result.add(edge.target);
            }

            if (edge.target === selected) {
                result.add(edge.source);
            }
        });

        return result;
    }, [selected]);

    return (
        <div className="w-full h-full flex flex-col relative overflow-hidden">
            {/* Legend */}
            <div className="px-5">
                <div className="z-20 mt-5 hidden rounded-xl border bg-background/80 px-5 py-2 backdrop-blur sm:block">
                    <div className="flex items-center justify-between gap-4 text-[11px] text-muted-foreground">
                        <Legend
                            className="bg-foreground/40"
                            label="Mutual"
                        />

                        <Legend
                            className="bg-blue-500/60"
                            label="Following"
                        />

                        <Legend
                            className="bg-emerald-500/60"
                            label="Follower"
                        />
                    </div>
                </div>
            </div>

            {/* Graph */}
            <div className="relative flex-1 w-full">
                <svg
                    viewBox="0 0 1000 600"
                    className="absolute inset-0 h-full w-full"
                    preserveAspectRatio="xMidYMid meet"
                >
                    <defs>
                        <filter
                            id="network-glow"
                            x="-100%"
                            y="-100%"
                            width="300%"
                            height="300%"
                        >
                            <feGaussianBlur
                                stdDeviation="3"
                                result="blur"
                            />

                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* Connection lines */}
                    <g>
                        {edges.map((edge, index) => {
                            const source = getNode(edge.source);
                            const target = getNode(edge.target);

                            const active =
                                selected === edge.source ||
                                selected === edge.target;

                            const faded =
                                selected !== "you" &&
                                !active;

                            return (
                                <path
                                    key={`${edge.source}-${edge.target}-${index}`}
                                    d={curvedPath(
                                        source,
                                        target
                                    )}
                                    fill="none"
                                    strokeWidth={
                                        active ? 2.5 : 1.5
                                    }
                                    strokeDasharray={
                                        edge.relation ===
                                            "following"
                                            ? "6 8"
                                            : undefined
                                    }
                                    className={`
                                        ${relationConfig[
                                            edge.relation
                                        ].line}
                                        transition-all
                                        duration-300
                                        ${faded
                                            ? "opacity-10"
                                            : "opacity-100"
                                        }
                                    `}
                                >
                                    {active && (
                                        <animate
                                            attributeName="stroke-dashoffset"
                                            from="0"
                                            to="-28"
                                            dur="1.5s"
                                            repeatCount="indefinite"
                                        />
                                    )}
                                </path>
                            );
                        })}
                    </g>

                    {/* Nodes */}
                    <g>
                        {nodes.map((node) => {
                            const isSelected =
                                selected === node.id;

                            const isHovered =
                                hovered === node.id;

                            const isConnected =
                                connectedNodes.has(node.id);

                            const faded =
                                selected !== "you" &&
                                !isSelected &&
                                !isConnected;

                            const radius = isSelected
                                ? 48
                                : 32;

                            return (
                                <g
                                    key={node.id}
                                    className={`
                                        cursor-pointer
                                        transition-opacity
                                        duration-300
                                        ${faded
                                            ? "opacity-20"
                                            : "opacity-100"
                                        }
                                    `}
                                    onClick={() =>
                                        setSelected(node.id)
                                    }
                                    onMouseEnter={() =>
                                        setHovered(node.id)
                                    }
                                    onMouseLeave={() =>
                                        setHovered(null)
                                    }
                                >
                                    {/* Glow */}
                                    {(isSelected ||
                                        isHovered) && (
                                            <circle
                                                cx={node.x}
                                                cy={node.y}
                                                r={radius + 10}
                                                className="fill-foreground/5"
                                                filter="url(#network-glow)"
                                            />
                                        )}

                                    {/* Outer ring */}
                                    <circle
                                        cx={node.x}
                                        cy={node.y}
                                        r={radius + 4}
                                        className={`
                                            fill-background
                                            stroke-border
                                            transition-all
                                            duration-300
                                            ${isSelected
                                                ? "stroke-foreground"
                                                : "stroke-border"
                                            }
                                        `}
                                        strokeWidth={
                                            isSelected
                                                ? 2
                                                : 1
                                        }
                                    />

                                    {/* Avatar */}
                                    <clipPath
                                        id={`avatar-${node.id}`}
                                    >
                                        <circle
                                            cx={node.x}
                                            cy={node.y}
                                            r={radius}
                                        />
                                    </clipPath>

                                    <image
                                        href={node.avatar}
                                        x={
                                            node.x - radius
                                        }
                                        y={
                                            node.y - radius
                                        }
                                        width={radius * 2}
                                        height={radius * 2}
                                        preserveAspectRatio="xMidYMid slice"
                                        clipPath={`url(#avatar-${node.id})`}
                                    />

                                    {/* Online indicator */}
                                    {node.online && (
                                        <>
                                            <circle
                                                cx={
                                                    node.x +
                                                    radius *
                                                    0.7
                                                }
                                                cy={
                                                    node.y +
                                                    radius *
                                                    0.7
                                                }
                                                r="7"
                                                className="fill-background"
                                            />

                                            <circle
                                                cx={
                                                    node.x +
                                                    radius *
                                                    0.7
                                                }
                                                cy={
                                                    node.y +
                                                    radius *
                                                    0.7
                                                }
                                                r="4"
                                                className="fill-emerald-500"
                                            />
                                        </>
                                    )}

                                    {/* Center badge */}
                                    {isSelected && (
                                        <circle
                                            cx={node.x}
                                            cy={
                                                node.y -
                                                radius -
                                                8
                                            }
                                            r="5"
                                            className="fill-foreground"
                                        />
                                    )}

                                    {/* Label */}
                                    <foreignObject
                                        x={node.x - 80}
                                        y={
                                            node.y +
                                            radius +
                                            12
                                        }
                                        width="160"
                                        height="65"
                                        className="pointer-events-none overflow-visible"
                                    >
                                        <div className="flex flex-col items-center">
                                            <span className="max-w-37.5 truncate text-xs font-semibold">
                                                {node.name}
                                            </span>

                                            <span className="mt-0.5 text-[10px] text-muted-foreground">
                                                @{node.username}
                                            </span>

                                            {node.relation && (
                                                <span
                                                    className={`
                                                        mt-1
                                                        rounded-full
                                                        px-2
                                                        py-0.5
                                                        text-[9px]
                                                        font-medium
                                                        ${relationConfig[
                                                            node
                                                                .relation
                                                        ]
                                                            .badge
                                                        }
                                                    `}
                                                >
                                                    {
                                                        relationConfig[
                                                            node
                                                                .relation
                                                        ]
                                                            .label
                                                    }
                                                </span>
                                            )}
                                        </div>
                                    </foreignObject>
                                </g>
                            );
                        })}
                    </g>
                </svg>
            </div>

            {/* Selected user panel */}
            <Separator />
            {selectedNode && (
                <div className="bottom-5 z-20 flex items-center gap-3 px-4 py-5">
                    <img
                        src={selectedNode.avatar}
                        alt={selectedNode.name}
                        className="h-10 w-10 rounded-full object-cover"
                    />

                    <div>
                        <p className="text-xs font-semibold">
                            {selectedNode.name}
                        </p>

                        <p className="text-[11px] text-muted-foreground">
                            @{selectedNode.username}
                        </p>
                    </div>

                    <div className="ml-3 flex gap-4 border-l pl-4">
                        <Stat
                            label="Followers"
                            value={
                                selectedNode.followers
                            }
                        />

                        <Stat
                            label="Following"
                            value={
                                selectedNode.following
                            }
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

function Stat({
    label,
    value,
}: {
    label: string;
    value?: number;
}) {
    return (
        <div>
            <p className="text-xs font-semibold">
                {value?.toLocaleString() ?? "0"}
            </p>

            <p className="text-[9px] text-muted-foreground">
                {label}
            </p>
        </div>
    );
}

function Legend({
    className,
    label,
}: {
    className: string;
    label: string;
}) {
    return (
        <div className="flex items-center gap-1.5">
            <span
                className={`h-1.5 w-5 rounded-full ${className}`}
            />
            {label}
        </div>
    );
}

function NetworkIcon() {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="5" cy="12" r="2.5" />
            <circle cx="19" cy="5" r="2.5" />
            <circle cx="19" cy="19" r="2.5" />

            <path d="M7.3 11L16.7 6" />
            <path d="M7.3 13L16.7 18" />
        </svg>
    );
}