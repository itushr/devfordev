"use client";

import { useMemo, useState, useEffect } from "react";
import Separator from "@/components/Separator";
import SocialNet from "./SocialNet";
import { useAuthStore } from "@/store/auth";
import { useNetworkStore } from "@/store/network";

export default function NetworkPage() {
    const { authUser } = useAuthStore();
    const { nodes, edges, rootId, loading, fetchNetwork } = useNetworkStore();
    const [selected, setSelected] = useState<string>("");

    useEffect(() => {
        if (!authUser?.id) return;
        fetchNetwork(authUser.id);
    }, [authUser?.id, fetchNetwork]);

    // Sync selected to rootId when graph loads
    useEffect(() => {
        if (rootId) setSelected(rootId);
    }, [rootId]);

    const selectedNode = useMemo(
        () => nodes.find((node) => node.id === selected),
        [selected, nodes]
    );

    if (loading && nodes.length === 0) {
        return (
            <div className="w-full h-full flex flex-col relative overflow-hidden">
                <div className="flex-1 flex items-center justify-center min-h-125">
                    <div className="flex gap-1.5">
                        {[0, 1, 2].map((i) => (
                            <span
                                key={i}
                                className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-pulse"
                                style={{ animationDelay: `${i * 150}ms` }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (!authUser || nodes.length === 0) {
        return (
            <div className="w-full h-full flex flex-col relative overflow-hidden">
                <div className="flex-1 flex items-center justify-center min-h-125">
                    <p className="text-xs text-muted-foreground text-center px-4">
                        {authUser
                            ? "No connections yet. Follow someone to see your network."
                            : "Sign in to view your network."}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full flex flex-col relative overflow-hidden">
            <SocialNet
                nodes={nodes}
                edges={edges}
                selected={selected}
                onSelectNode={(id) => setSelected(id)}
            />

            <Separator />
            {selectedNode && (
                <div className="bottom-5 z-20 flex items-center gap-3 px-4 py-5">
                    <img
                        src={selectedNode.avatar}
                        alt={selectedNode.name}
                        className="h-10 w-10 rounded-full object-cover"
                    />

                    <div>
                        <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold">{selectedNode.name}</p>
                        </div>

                        <p className="text-xs text-muted-foreground">
                            @{selectedNode.username}
                        </p>
                    </div>

                    <div className="ml-auto flex gap-4 border-l pl-4">
                        <Stat label="followers" value={selectedNode.followers} />
                        <Stat label="following" value={selectedNode.following} />
                    </div>
                </div>
            )}
        </div>
    );
}

function Stat({ label, value }: { label: string; value?: number }) {
    return (
        <div>
            <p className="text-sm font-semibold">{value?.toLocaleString() ?? "—"}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
        </div>
    );
}