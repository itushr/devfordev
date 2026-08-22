"use client";

import React, { useLayoutEffect, useMemo, useRef, useState } from "react";

export type Relation = "following" | "follower" | "mutual";

export interface NetworkNode {
    id: string;
    name: string;
    username: string;
    avatar: string;
    level: number;
    x?: number;
    y?: number;
    relation?: Relation;
    followers?: number;
    following?: number;
    online?: boolean;
}

export interface NetworkEdge {
    source: string;
    target: string;
    relation: Relation;
}

interface SocialNetProps {
    nodes: NetworkNode[];
    edges: NetworkEdge[];
    selected: string;
    onSelectNode?: (id: string) => void;
}

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

const LAYER_RADIUS_STEP = 100;

function curvedPath(source: NetworkNode, target: NetworkNode) {
    const sx = source.x ?? 0;
    const sy = source.y ?? 0;
    const tx = target.x ?? 0;
    const ty = target.y ?? 0;

    const dx = tx - sx;
    const dy = ty - sy;

    const cx = (sx + tx) / 2 - dy * 0.08;
    const cy = (sy + ty) / 2 + dx * 0.08;

    return `M ${sx} ${sy} Q ${cx} ${cy} ${tx} ${ty}`;
}

function computeRadialLayout(
    inputNodes: NetworkNode[],
    inputEdges: NetworkEdge[]
): { calculatedNodes: NetworkNode[]; bounds: { x: number; y: number; width: number; height: number } } {
    if (!inputNodes.length) {
        return { calculatedNodes: [], bounds: { x: 0, y: 0, width: 100, height: 100 } };
    }

    const nodeMap = new Map<string, NetworkNode>(
        inputNodes.map((n) => [n.id, { ...n }])
    );

    const root = inputNodes.find((n) => n.level === 0) || inputNodes[0];
    const rootNode = nodeMap.get(root.id)!;
    rootNode.x = 0;
    rootNode.y = 0;

    const treeChildren = new Map<string, string[]>();
    const visited = new Set<string>([root.id]);
    const queue: string[] = [root.id];

    while (queue.length > 0) {
        const parentId = queue.shift()!;
        const childrenIds: string[] = [];

        inputEdges.forEach((e) => {
            let childId: string | null = null;
            if (e.source === parentId && !visited.has(e.target)) {
                childId = e.target;
            } else if (e.target === parentId && !visited.has(e.source)) {
                childId = e.source;
            }

            if (childId) {
                visited.add(childId);
                childrenIds.push(childId);
                queue.push(childId);
            }
        });

        treeChildren.set(parentId, childrenIds);
    }

    const orphanChildren: string[] = [];
    inputNodes.forEach((n) => {
        if (!visited.has(n.id)) {
            visited.add(n.id);
            orphanChildren.push(n.id);
        }
    });
    if (orphanChildren.length > 0) {
        treeChildren.set(root.id, [...(treeChildren.get(root.id) || []), ...orphanChildren]);
    }

    function getSubtreeLeafCount(id: string): number {
        const kids = treeChildren.get(id) || [];
        if (kids.length === 0) return 1;
        return kids.reduce((sum, kidId) => sum + getSubtreeLeafCount(kidId), 0);
    }

    function assignPositions(
        id: string,
        depth: number,
        startAngle: number,
        endAngle: number
    ) {
        const current = nodeMap.get(id);
        if (!current) return;

        if (depth > 0) {
            const angle = (startAngle + endAngle) / 2;
            const radius = depth * LAYER_RADIUS_STEP;
            current.x = radius * Math.cos(angle);
            current.y = radius * Math.sin(angle);
        }

        const kids = treeChildren.get(id) || [];
        if (kids.length > 0) {
            const totalLeaves = kids.reduce(
                (sum, kidId) => sum + getSubtreeLeafCount(kidId),
                0
            );
            let currentAngle = startAngle;
            const wedgeSpan = endAngle - startAngle;

            kids.forEach((kidId) => {
                const kidLeaves = getSubtreeLeafCount(kidId);
                const kidWedge = (kidLeaves / totalLeaves) * wedgeSpan;
                const kidStart = currentAngle;
                const kidEnd = currentAngle + kidWedge;

                assignPositions(kidId, depth + 1, kidStart, kidEnd);
                currentAngle = kidEnd;
            });
        }
    }

    assignPositions(root.id, 0, 0, 2 * Math.PI);

    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    const calculatedNodes = Array.from(nodeMap.values());

    calculatedNodes.forEach((n) => {
        const nx = n.x ?? 0;
        const ny = n.y ?? 0;
        minX = Math.min(minX, nx);
        maxX = Math.max(maxX, nx);
        minY = Math.min(minY, ny);
        maxY = Math.max(maxY, ny);
    });

    const padding = 100;
    const x = minX - padding;
    const y = minY - padding;
    const width = maxX - minX + padding * 2;
    const height = maxY - minY + padding * 2;

    return {
        calculatedNodes,
        bounds: { x, y, width, height },
    };
}

export default function SocialNet({
    nodes,
    edges,
    selected,
    onSelectNode,
}: SocialNetProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [hovered, setHovered] = useState<string | null>(null);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [hasInitializedPan, setHasInitializedPan] = useState(false);
    const dragStart = useRef({ x: 0, y: 0 });

    const { calculatedNodes, bounds } = useMemo(
        () => computeRadialLayout(nodes, edges),
        [nodes, edges]
    );

    useLayoutEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const centerRoot = () => {
            const { clientWidth, clientHeight } = container;
            const rootSvgX = -bounds.x;
            const rootSvgY = -bounds.y;

            setPan({
                x: clientWidth / 2 - rootSvgX,
                y: clientHeight / 2 - rootSvgY,
            });
            setHasInitializedPan(true);
        };

        centerRoot();

        const observer = new ResizeObserver(centerRoot);
        observer.observe(container);

        return () => observer.disconnect();
    }, [bounds]);

    const getNode = (id: string) => calculatedNodes.find((node) => node.id === id);

    const handlePointerDown = (e: React.PointerEvent) => {
        if ((e.target as HTMLElement).tagName === "svg" || (e.target as HTMLElement).tagName === "path") {
            setIsDragging(true);
            dragStart.current = {
                x: e.clientX - pan.x,
                y: e.clientY - pan.y,
            };
            (e.target as HTMLElement).setPointerCapture(e.pointerId);
        }
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isDragging) return;
        setPan({
            x: e.clientX - dragStart.current.x,
            y: e.clientY - dragStart.current.y,
        });
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        if (isDragging) {
            setIsDragging(false);
            (e.target as HTMLElement).releasePointerCapture(e.pointerId);
        }
    };

    const handleNodeClick = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (onSelectNode) {
            onSelectNode(id);
        }
    };

    return (
        <div
            ref={containerRef}
            className="relative flex-1 w-full h-full min-h-125 overflow-hidden select-none cursor-grab active:cursor-grabbing opacity-80"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
        >
            <svg
                width={bounds.width}
                height={bounds.height}
                viewBox={`${bounds.x} ${bounds.y} ${bounds.width} ${bounds.height}`}
                style={{
                    transform: `translate(${pan.x}px, ${pan.y}px)`,
                    opacity: hasInitializedPan ? 1 : 0,
                    transition: isDragging ? "none" : "transform 0.1s ease-out, opacity 0.2s ease-in",
                }}
                className="absolute touch-none"
            >
                <defs>
                    <filter
                        id="network-glow"
                        x="-100%"
                        y="-100%"
                        width="300%"
                        height="300%"
                    >
                        <feGaussianBlur stdDeviation="3" result="blur" />
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

                        if (!source || !target) return null;

                        return (
                            <path
                                key={`${edge.source}-${edge.target}-${index}`}
                                d={curvedPath(source, target)}
                                fill="none"
                                strokeWidth={1.5}
                                strokeDasharray={
                                    edge.relation === "following" ? "6 6" : undefined
                                }
                                className={`${relationConfig[edge.relation].line} transition-all duration-300 opacity-60`}
                            />
                        );
                    })}
                </g>

                {/* Nodes */}
                <g>
                    {calculatedNodes.map((node) => {
                        const isSelected = selected === node.id;
                        const isHovered = hovered === node.id;

                        const baseRadius = 20;
                        const radius = isSelected ? baseRadius + 1 : baseRadius;
                        const nx = node.x ?? 0;
                        const ny = node.y ?? 0;

                        return (
                            <g
                                key={node.id}
                                className="cursor-pointer transition-all duration-300 opacity-100"
                                onClick={(e) => handleNodeClick(node.id, e)}
                                onMouseEnter={() => setHovered(node.id)}
                                onMouseLeave={() => setHovered(null)}
                            >
                                {(isSelected || isHovered) && (
                                    <circle
                                        cx={nx}
                                        cy={ny}
                                        r={radius + 8}
                                        className="fill-foreground/10"
                                        filter="url(#network-glow)"
                                    />
                                )}

                                <circle
                                    cx={nx}
                                    cy={ny}
                                    r={radius + 3}
                                    className={`
                                        fill-background transition-all duration-300
                                        ${isSelected ? "stroke-foreground" : "stroke-border"}
                                    `}
                                    strokeWidth={isSelected ? 3 : 1}
                                />

                                <clipPath id={`avatar-${node.id}`}>
                                    <circle cx={nx} cy={ny} r={radius} />
                                </clipPath>

                                <image
                                    href={node.avatar}
                                    x={nx - radius}
                                    y={ny - radius}
                                    width={radius * 2}
                                    height={radius * 2}
                                    preserveAspectRatio="xMidYMid slice"
                                    clipPath={`url(#avatar-${node.id})`}
                                />
                            </g>
                        );
                    })}
                </g>
            </svg>
        </div>
    );
}