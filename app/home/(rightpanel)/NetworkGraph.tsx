"use client";

import SocialNet from "@/app/profile/(rightpanel)/SocialNet";
import { NetworkNode, NetworkEdge } from "@/app/profile/(rightpanel)/SocialNet";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/auth";

const NetworkGraph = () => {
    const { authUser } = useAuthStore();
    const [nodes, setNodes] = useState<NetworkNode[]>([]);
    const [edges, setEdges] = useState<NetworkEdge[]>([]);
    const [selected, setSelected] = useState<string>("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authUser?.id) {
            setLoading(false);
            return;
        }

        let cancelled = false;
        setLoading(true);

        fetch(`/api/users/${authUser.id}/network?depth=3&limit=100`, {
            credentials: "include",
        })
            .then((r) => r.json())
            .then((data) => {
                if (cancelled) return;
                if (data.nodes && data.edges) {
                    setNodes(data.nodes);
                    setEdges(data.edges);
                    setSelected(data.meta?.rootId ?? authUser.id);
                }
            })
            .catch(() => {
                // silently fail — graph stays empty
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [authUser?.id]);

    if (loading) {
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
                    {authUser ? "No connections yet. Follow someone to see your network." : "Sign in to view your network."}
                </p>
            </div>
        );
    }

    return (
        <div className="h-80 overflow-hidden">
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