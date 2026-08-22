"use client";

import { useMemo, useState } from "react";
import Separator from "@/components/Separator";
import SocialNet, { NetworkNode, NetworkEdge, Relation } from "./SocialNet";

export const nodes: NetworkNode[] = [
    // Layer 0: Root
    {
        id: "you",
        name: "Tushar",
        username: "tushar",
        avatar: "https://i.pravatar.cc/150?img=12",
        level: 0,
        followers: 1280,
        following: 342,
        online: true,
    },

    // Layer 1: Direct Connections
    {
        id: "alex",
        name: "Alex Morgan",
        username: "alexm",
        avatar: "https://i.pravatar.cc/150?img=11",
        level: 1,
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
        level: 1,
        relation: "following",
        followers: 2140,
        following: 410,
    },
    {
        id: "james",
        name: "James Wilson",
        username: "jamesw",
        avatar: "https://i.pravatar.cc/150?img=13",
        level: 1,
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
        level: 1,
        relation: "mutual",
        followers: 1200,
        following: 301,
    },
    {
        id: "daniel",
        name: "Daniel Kim",
        username: "danielk",
        avatar: "https://i.pravatar.cc/150?img=68",
        level: 1,
        relation: "following",
        followers: 730,
        following: 198,
    },

    // Layer 2
    {
        id: "sophia",
        name: "Sophia Taylor",
        username: "sophiat",
        avatar: "https://i.pravatar.cc/150?img=25",
        level: 2,
        relation: "mutual",
        followers: 430,
        following: 150,
    },
    {
        id: "liam",
        name: "Liam Johnson",
        username: "liamj",
        avatar: "https://i.pravatar.cc/150?img=60",
        level: 2,
        relation: "following",
        followers: 610,
        following: 205,
    },
    {
        id: "olivia",
        name: "Olivia Martinez",
        username: "oliviam",
        avatar: "https://i.pravatar.cc/150?img=49",
        level: 2,
        relation: "follower",
        followers: 1100,
        following: 390,
        online: true,
    },
    {
        id: "lucas",
        name: "Lucas Gray",
        username: "lucasg",
        avatar: "https://i.pravatar.cc/150?img=53",
        level: 2,
        relation: "following",
        followers: 290,
        following: 88,
    },
    {
        id: "ethan",
        name: "Ethan Wright",
        username: "ethanw",
        avatar: "https://i.pravatar.cc/150?img=15",
        level: 2,
        relation: "follower",
        followers: 950,
        following: 310,
    },
    {
        id: "zoe",
        name: "Zoe Lee",
        username: "zoel",
        avatar: "https://i.pravatar.cc/150?img=36",
        level: 2,
        relation: "mutual",
        followers: 870,
        following: 240,
        online: true,
    },
    {
        id: "chloe",
        name: "Chloe Adams",
        username: "chloea",
        avatar: "https://i.pravatar.cc/150?img=20",
        level: 2,
        relation: "follower",
        followers: 320,
        following: 110,
    },

    // Layer 3
    {
        id: "noah",
        name: "Noah Scott",
        username: "noahs",
        avatar: "https://i.pravatar.cc/150?img=33",
        level: 3,
        relation: "mutual",
        followers: 510,
        following: 190,
    },
    {
        id: "ava",
        name: "Ava White",
        username: "avaw",
        avatar: "https://i.pravatar.cc/150?img=44",
        level: 3,
        relation: "following",
        followers: 1340,
        following: 280,
        online: true,
    },
    {
        id: "mason",
        name: "Mason Harris",
        username: "masonh",
        avatar: "https://i.pravatar.cc/150?img=57",
        level: 3,
        relation: "follower",
        followers: 670,
        following: 140,
    },
    {
        id: "isabella",
        name: "Isabella King",
        username: "isabellak",
        avatar: "https://i.pravatar.cc/150?img=29",
        level: 3,
        relation: "mutual",
        followers: 980,
        following: 310,
    },
    {
        id: "william",
        name: "William Green",
        username: "williamg",
        avatar: "https://i.pravatar.cc/150?img=52",
        level: 3,
        relation: "following",
        followers: 410,
        following: 120,
    },

    // Layer 4
    {
        id: "charlotte",
        name: "Charlotte Baker",
        username: "charlotteb",
        avatar: "https://i.pravatar.cc/150?img=45",
        level: 4,
        relation: "mutual",
        followers: 890,
        following: 230,
        online: true,
    },
    {
        id: "benjamin",
        name: "Benjamin Clark",
        username: "benjaminc",
        avatar: "https://i.pravatar.cc/150?img=59",
        level: 4,
        relation: "following",
        followers: 1560,
        following: 400,
    },
    {
        id: "amelia",
        name: "Amelia Nelson",
        username: "amelian",
        avatar: "https://i.pravatar.cc/150?img=38",
        level: 4,
        relation: "follower",
        followers: 340,
        following: 95,
    },
    {
        id: "henry",
        name: "Henry Carter",
        username: "henryc",
        avatar: "https://i.pravatar.cc/150?img=64",
        level: 4,
        relation: "following",
        followers: 720,
        following: 210,
    },

    // Layer 5
    {
        id: "evelyn",
        name: "Evelyn Mitchell",
        username: "evelynm",
        avatar: "https://i.pravatar.cc/150?img=23",
        level: 5,
        relation: "mutual",
        followers: 1120,
        following: 310,
        online: true,
    },
    {
        id: "sebastian",
        name: "Sebastian Perez",
        username: "sebastianp",
        avatar: "https://i.pravatar.cc/150?img=65",
        level: 5,
        relation: "following",
        followers: 450,
        following: 130,
    },
    {
        id: "harper",
        name: "Harper Roberts",
        username: "harperr",
        avatar: "https://i.pravatar.cc/150?img=27",
        level: 5,
        relation: "follower",
        followers: 630,
        following: 175,
    },
];

export const edges: NetworkEdge[] = [
    // // Layer 0 -> Layer 1
    { source: "you", target: "alex", relation: "mutual" },
    { source: "you", target: "sarah", relation: "following" },
    { source: "you", target: "james", relation: "follower" },
    { source: "you", target: "mia", relation: "mutual" },
    { source: "you", target: "daniel", relation: "following" },

    // Layer 1 -> Layer 2
    { source: "alex", target: "sophia", relation: "mutual" },
    { source: "alex", target: "liam", relation: "following" },
    { source: "sarah", target: "olivia", relation: "follower" },
    { source: "sarah", target: "lucas", relation: "following" },
    { source: "james", target: "lucas", relation: "mutual" },
    { source: "james", target: "ethan", relation: "following" },
    { source: "mia", target: "ethan", relation: "mutual" },
    { source: "mia", target: "zoe", relation: "follower" },
    { source: "daniel", target: "zoe", relation: "following" },
    { source: "daniel", target: "chloe", relation: "follower" },

    // // Layer 2 -> Layer 3
    { source: "sophia", target: "noah", relation: "mutual" },
    { source: "liam", target: "ava", relation: "following" },
    { source: "olivia", target: "mason", relation: "follower" },
    { source: "ethan", target: "isabella", relation: "mutual" },
    { source: "chloe", target: "william", relation: "following" },

    // Layer 3 -> Layer 4
    { source: "noah", target: "charlotte", relation: "mutual" },
    { source: "ava", target: "benjamin", relation: "following" },
    { source: "mason", target: "amelia", relation: "follower" },
    { source: "isabella", target: "henry", relation: "following" },

    // Layer 4 -> Layer 5
    { source: "charlotte", target: "evelyn", relation: "mutual" },
    { source: "benjamin", target: "sebastian", relation: "following" },
    { source: "henry", target: "harper", relation: "follower" },
];

export default function NetworkPage() {
    const [selected, setSelected] = useState<string>("you");

    const selectedNode = useMemo(
        () => nodes.find((node) => node.id === selected),
        [selected]
    );

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
            <p className="text-sm font-semibold">{value?.toLocaleString() ?? "0"}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
        </div>
    );
}