import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import Follow from "@/models/Follow";
import UserInteraction from "@/models/UserInteraction";
import User from "@/models/User";

function getAuthUserId(req: NextRequest): string | null {
    const fromHeader = req.headers.get("user_id");
    if (fromHeader) return fromHeader;
    const token = req.cookies.get("token")?.value;
    if (token) {
        try {
            const payload = verifyToken(token);
            return payload?.id ?? null;
        } catch {
            return null;
        }
    }
    return null;
}

/**
 * GET /api/users/[userId]/network?depth=3&limit=100
 *
 * Returns a user network graph by BFS traversal over follow + interaction edges.
 * depth: max hops from root (default 3, max 4)
 * limit: max nodes in response (default 100, max 200)
 *
 * Response:
 * {
 *   nodes: NetworkNode[],
 *   edges: NetworkEdge[],
 *   meta: { rootId, depth, totalNodes, totalEdges }
 * }
 *
 * Edge types:
 *   "following"  – root directly follows target
 *   "follower"   – target follows root
 *   "mutual"     – both follow each other
 *   "interaction" – actor interacted with target's content (likes/comments)
 */
export async function GET(
    req: NextRequest,
    props: { params: Promise<{ userId: string }> }
) {
    try {
        const { userId } = await props.params;
        const { searchParams } = new URL(req.url);

        const depthParam = parseInt(searchParams.get("depth") ?? "3", 10);
        const limitParam = parseInt(searchParams.get("limit") ?? "100", 10);

        const maxDepth = Math.min(Math.max(depthParam, 1), 4);
        const maxNodes = Math.min(Math.max(limitParam, 10), 200);

        await connectDB();

        // Verify root user
        const rootUser = await User.findById(userId)
            .select("_id name username avatar")
            .lean() as any;
        if (!rootUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const rootId = rootUser._id.toString();

        // BFS traversal
        // Track discovered nodes: Map<userId, { depth, discoveredFrom, edgeType }>
        type EdgeInfo = {
            source: string;
            target: string;
            type: "follow" | "interaction";
        };

        const discovered = new Map<string, number>(); // userId -> depth
        discovered.set(rootId, 0);

        const edgesSet = new Map<string, EdgeInfo>(); // key -> edge
        const queue: Array<{ id: string; depth: number }> = [{ id: rootId, depth: 0 }];

        while (queue.length > 0 && discovered.size < maxNodes) {
            const batch = queue.splice(0, queue.length); // process whole level

            const currentDepth = batch[0].depth;
            if (currentDepth >= maxDepth) break;

            const batchIds = batch.map((b) => b.id);

            // Fetch outgoing follows: batchIds are followers
            const [outgoingFollows, incomingFollows, interactionEdges] = await Promise.all([
                Follow.find({ follower_id: { $in: batchIds } })
                    .select("follower_id following_id")
                    .lean(),
                Follow.find({ following_id: { $in: batchIds } })
                    .select("follower_id following_id")
                    .lean(),
                UserInteraction.find({
                    actor_id: { $in: batchIds },
                    $or: [
                        { likes_count: { $gt: 0 } },
                        { comments_count: { $gt: 0 } },
                    ],
                })
                    .select("actor_id target_id")
                    .lean(),
            ]);

            const newNodes: Array<{ id: string; depth: number }> = [];

            // Process follow edges
            for (const follow of outgoingFollows as any[]) {
                const sourceId = follow.follower_id.toString();
                const targetId = follow.following_id.toString();
                const edgeKey = `follow:${sourceId}->${targetId}`;

                if (!edgesSet.has(edgeKey)) {
                    edgesSet.set(edgeKey, { source: sourceId, target: targetId, type: "follow" });
                }

                if (!discovered.has(targetId) && discovered.size < maxNodes) {
                    discovered.set(targetId, currentDepth + 1);
                    newNodes.push({ id: targetId, depth: currentDepth + 1 });
                }
            }

            for (const follow of incomingFollows as any[]) {
                const sourceId = follow.follower_id.toString();
                const targetId = follow.following_id.toString();
                // targetId is in our batch (being followed)
                const edgeKey = `follow:${sourceId}->${targetId}`;
                if (!edgesSet.has(edgeKey)) {
                    edgesSet.set(edgeKey, { source: sourceId, target: targetId, type: "follow" });
                }
                if (!discovered.has(sourceId) && discovered.size < maxNodes) {
                    discovered.set(sourceId, currentDepth + 1);
                    newNodes.push({ id: sourceId, depth: currentDepth + 1 });
                }
            }

            // Process interaction edges
            for (const interaction of interactionEdges as any[]) {
                const actorId = interaction.actor_id.toString();
                const targetId = interaction.target_id.toString();
                if (actorId === targetId) continue;

                const edgeKey = `interaction:${actorId}->${targetId}`;
                if (!edgesSet.has(edgeKey)) {
                    edgesSet.set(edgeKey, { source: actorId, target: targetId, type: "interaction" });
                }

                if (!discovered.has(targetId) && discovered.size < maxNodes) {
                    discovered.set(targetId, currentDepth + 1);
                    newNodes.push({ id: targetId, depth: currentDepth + 1 });
                }
            }

            queue.push(...newNodes);
        }

        // Batch fetch all user profiles
        const allUserIds = Array.from(discovered.keys());
        const users = await User.find({ _id: { $in: allUserIds } })
            .select("_id name username avatar")
            .lean() as any[];

        const userMap = new Map(users.map((u: any) => [u._id.toString(), u]));

        // Build deduplicated follow sets for relation classification
        // from root's perspective only (for direct edges to/from root)
        const rootFollowingSet = new Set<string>();
        const rootFollowerSet = new Set<string>();

        const allFollowEdges = Array.from(edgesSet.values()).filter((e) => e.type === "follow");
        for (const edge of allFollowEdges) {
            if (edge.source === rootId) rootFollowingSet.add(edge.target);
            if (edge.target === rootId) rootFollowerSet.add(edge.source);
        }

        // Classify relation for each non-root node (from root's perspective)
        function classifyRelation(nodeId: string): "following" | "follower" | "mutual" | "interaction" {
            const iFollowThem = rootFollowingSet.has(nodeId);
            const theyFollowMe = rootFollowerSet.has(nodeId);
            if (iFollowThem && theyFollowMe) return "mutual";
            if (iFollowThem) return "following";
            if (theyFollowMe) return "follower";
            return "interaction";
        }

        const nodes = allUserIds.map((id) => {
            const user = userMap.get(id);
            if (!user) return null;
            const depth = discovered.get(id) ?? 0;
            return {
                id,
                name: user.name ?? "",
                username: user.username ?? "",
                avatar: user.avatar ?? "",
                level: depth,
                relation: id === rootId ? undefined : classifyRelation(id),
            };
        }).filter(Boolean);

        // Build edge list — classify edge relation type for SocialNet
        const edges = Array.from(edgesSet.values())
            .filter((e) => discovered.has(e.source) && discovered.has(e.target))
            .map((e) => {
                let relation: "following" | "follower" | "mutual" | "interaction";
                if (e.type === "interaction") {
                    relation = "interaction";
                } else {
                    // follow edge
                    const srcIsRoot = e.source === rootId;
                    const tgtIsRoot = e.target === rootId;
                    if (srcIsRoot) relation = "following";
                    else if (tgtIsRoot) relation = "follower";
                    else relation = "following"; // non-root follow edge, use "following"
                }
                return { source: e.source, target: e.target, relation };
            });

        return NextResponse.json({
            nodes,
            edges,
            meta: {
                rootId,
                depth: maxDepth,
                totalNodes: nodes.length,
                totalEdges: edges.length,
            },
        });
    } catch (error) {
        console.error("Error: @route GET /api/users/[userId]/network", error);
        return NextResponse.json(
            { error: "Failed to fetch network graph" },
            { status: 500 }
        );
    }
}
