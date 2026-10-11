"use client";

import SocialNet from "@/app/profile/(rightpanel)/SocialNet";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/auth";
import { useNetworkStore } from "@/store/network";

const NetworkGraph = () => {
    const { authUser } = useAuthStore();
    const { nodes, edges, rootId, loading, fetchNetwork } = useNetworkStore();
    const [selected, setSelected] = useState<string>("");

    useEffect(() => {
        if (!authUser?.id) return;
        fetchNetwork(authUser.id);
    }, [authUser?.id, fetchNetwork]);

    // Sync selected node to rootId when graph loads
    useEffect(() => {
        if (rootId) setSelected(rootId);
    }, [rootId]);

    if (loading && nodes.length === 0) {
        return (
            <div className="h-80 flex items-center justify-center">
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
        );
    }

    if (!authUser || nodes.length === 0) {
        return (
            <div className="h-80 flex items-center justify-center">
                <p className="text-xs text-muted-foreground">
                    {authUser
                        ? "No connections yet. Follow someone to see your network."
                        : "Sign in to view your network."}
                </p>
            </div>
        );
    }

    return (
        <div className="h-100">
            <SocialNet
                nodes={nodes}
                edges={edges}
                selected={selected}
                onSelectNode={(id) => setSelected(id)}
            />
        </div>
    );
};

export default NetworkGraph;