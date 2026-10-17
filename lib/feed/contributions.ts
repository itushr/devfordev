import mongoose from "mongoose";
import Contribution from "@/models/Contribution";
import { RECENT_WINDOW_MS } from "./config";

export interface UserContributionMetrics {
    totalGiven: number;
    totalReceived: number;
    recentGiven: number;
    recentReceived: number;
    bestReceived: number;
    goodReceived: number;
}

export interface PairMetrics {
    /** Total value A → B (A contributed to B's posts) */
    aToB: number;
    /** Total value B → A */
    bToA: number;
}

// ---------------------------------------------------------------------------
// In-memory TTL caches to avoid repeated DB aggregation on feed requests
// ---------------------------------------------------------------------------
const METRICS_TTL_MS = 60 * 1000; // 60 seconds
const metricsCache = new Map<string, { data: UserContributionMetrics; expiresAt: number }>();

const PAIR_TTL_MS = 60 * 1000;
const pairCache = new Map<string, { data: PairMetrics; expiresAt: number }>();

let topContributorsCache: { ids: string[]; expiresAt: number } | null = null;
const TOP_CONTRIBUTORS_TTL_MS = 180 * 1000; // 3 minutes

/** Invalidate cache entries when a new rating is given or revoked. */
export function invalidateContributionCache(contributorId?: string, recipientId?: string) {
    if (contributorId) metricsCache.delete(contributorId);
    if (recipientId) metricsCache.delete(recipientId);
    if (contributorId && recipientId) {
        pairCache.delete(`${contributorId}:${recipientId}`);
        pairCache.delete(`${recipientId}:${contributorId}`);
    }
    topContributorsCache = null;
}

function emptyMetrics(): UserContributionMetrics {
    return {
        totalGiven: 0,
        totalReceived: 0,
        recentGiven: 0,
        recentReceived: 0,
        bestReceived: 0,
        goodReceived: 0,
    };
}

/**
 * Get contribution metrics for a single user (with 60s in-memory cache).
 * Uses two targeted index-friendly aggregations (contributor_id + recipient_id).
 */
export async function getUserContributionMetrics(
    userId: string
): Promise<UserContributionMetrics> {
    const now = Date.now();
    const cached = metricsCache.get(userId);
    if (cached && cached.expiresAt > now) {
        return cached.data;
    }

    const since = new Date(now - RECENT_WINDOW_MS);
    const uid = new mongoose.Types.ObjectId(userId);

    const [givenResult, receivedResult] = await Promise.all([
        Contribution.aggregate([
            { $match: { contributor_id: uid } },
            {
                $group: {
                    _id: null,
                    totalGiven: { $sum: "$value" },
                    recentGiven: {
                        $sum: {
                            $cond: [{ $gte: ["$createdAt", since] }, "$value", 0],
                        },
                    },
                },
            },
        ]),
        Contribution.aggregate([
            { $match: { recipient_id: uid } },
            {
                $group: {
                    _id: null,
                    totalReceived: { $sum: "$value" },
                    recentReceived: {
                        $sum: {
                            $cond: [{ $gte: ["$createdAt", since] }, "$value", 0],
                        },
                    },
                    bestReceived: {
                        $sum: {
                            $cond: [{ $eq: ["$rating", "best"] }, 1, 0],
                        },
                    },
                    goodReceived: {
                        $sum: {
                            $cond: [{ $eq: ["$rating", "good"] }, 1, 0],
                        },
                    },
                },
            },
        ]),
    ]);

    const metrics: UserContributionMetrics = {
        totalGiven: givenResult[0]?.totalGiven ?? 0,
        totalReceived: receivedResult[0]?.totalReceived ?? 0,
        recentGiven: givenResult[0]?.recentGiven ?? 0,
        recentReceived: receivedResult[0]?.recentReceived ?? 0,
        bestReceived: receivedResult[0]?.bestReceived ?? 0,
        goodReceived: receivedResult[0]?.goodReceived ?? 0,
    };

    metricsCache.set(userId, { data: metrics, expiresAt: now + METRICS_TTL_MS });
    return metrics;
}

/**
 * Batch-fetch contribution metrics for multiple users in two aggregations.
 * Leverages cached user metrics and only queries missing IDs.
 * Returns a Map keyed by user-id string.
 */
export async function batchGetContributionMetrics(
    userIds: string[]
): Promise<Map<string, UserContributionMetrics>> {
    if (userIds.length === 0) return new Map();

    const now = Date.now();
    const map = new Map<string, UserContributionMetrics>();
    const missingIds: string[] = [];

    for (const id of userIds) {
        const cached = metricsCache.get(id);
        if (cached && cached.expiresAt > now) {
            map.set(id, cached.data);
        } else {
            missingIds.push(id);
        }
    }

    if (missingIds.length === 0) {
        return map;
    }

    const since = new Date(now - RECENT_WINDOW_MS);
    const oids = missingIds.map((id) => new mongoose.Types.ObjectId(id));

    const [givenResults, receivedResults] = await Promise.all([
        Contribution.aggregate([
            { $match: { contributor_id: { $in: oids } } },
            {
                $group: {
                    _id: "$contributor_id",
                    totalGiven: { $sum: "$value" },
                    recentGiven: {
                        $sum: {
                            $cond: [{ $gte: ["$createdAt", since] }, "$value", 0],
                        },
                    },
                },
            },
        ]),
        Contribution.aggregate([
            { $match: { recipient_id: { $in: oids } } },
            {
                $group: {
                    _id: "$recipient_id",
                    totalReceived: { $sum: "$value" },
                    recentReceived: {
                        $sum: {
                            $cond: [{ $gte: ["$createdAt", since] }, "$value", 0],
                        },
                    },
                    bestReceived: {
                        $sum: {
                            $cond: [{ $eq: ["$rating", "best"] }, 1, 0],
                        },
                    },
                    goodReceived: {
                        $sum: {
                            $cond: [{ $eq: ["$rating", "good"] }, 1, 0],
                        },
                    },
                },
            },
        ]),
    ]);

    for (const id of missingIds) {
        map.set(id, emptyMetrics());
    }

    for (const r of givenResults) {
        const id = r._id.toString();
        const existing = map.get(id) ?? emptyMetrics();
        existing.totalGiven = r.totalGiven;
        existing.recentGiven = r.recentGiven;
        map.set(id, existing);
    }

    for (const r of receivedResults) {
        const id = r._id.toString();
        const existing = map.get(id) ?? emptyMetrics();
        existing.totalReceived = r.totalReceived;
        existing.recentReceived = r.recentReceived;
        existing.bestReceived = r.bestReceived;
        existing.goodReceived = r.goodReceived;
        map.set(id, existing);
    }

    for (const id of missingIds) {
        const data = map.get(id)!;
        metricsCache.set(id, { data, expiresAt: now + METRICS_TTL_MS });
    }

    return map;
}

/**
 * Get the pairwise contribution exchange between viewer Y and a set of post authors.
 * Leverages in-memory caching to avoid database queries when cached.
 */
export async function getPairMetricsBatch(
    viewerId: string,
    authorIds: string[]
): Promise<Map<string, PairMetrics>> {
    if (authorIds.length === 0) return new Map();

    const now = Date.now();
    const map = new Map<string, PairMetrics>();
    const missingAuthorIds: string[] = [];

    for (const aid of authorIds) {
        const cacheKey = `${viewerId}:${aid}`;
        const cached = pairCache.get(cacheKey);
        if (cached && cached.expiresAt > now) {
            map.set(aid, cached.data);
        } else {
            missingAuthorIds.push(aid);
        }
    }

    if (missingAuthorIds.length === 0) {
        return map;
    }

    const yid = new mongoose.Types.ObjectId(viewerId);
    const aids = missingAuthorIds.map((id) => new mongoose.Types.ObjectId(id));

    // Y → authors (Y contributed to author posts) and authors → Y
    const [yToAuthors, authorsToY] = await Promise.all([
        Contribution.aggregate([
            {
                $match: {
                    contributor_id: yid,
                    recipient_id: { $in: aids },
                },
            },
            {
                $group: {
                    _id: "$recipient_id",
                    value: { $sum: "$value" },
                },
            },
        ]),
        Contribution.aggregate([
            {
                $match: {
                    contributor_id: { $in: aids },
                    recipient_id: yid,
                },
            },
            {
                $group: {
                    _id: "$contributor_id",
                    value: { $sum: "$value" },
                },
            },
        ]),
    ]);

    for (const aid of missingAuthorIds) {
        map.set(aid, { aToB: 0, bToA: 0 });
    }

    for (const r of yToAuthors) {
        const id = r._id.toString();
        const existing = map.get(id) ?? { aToB: 0, bToA: 0 };
        existing.aToB = r.value;
        map.set(id, existing);
    }

    for (const r of authorsToY) {
        const id = r._id.toString();
        const existing = map.get(id) ?? { aToB: 0, bToA: 0 };
        existing.bToA = r.value;
        map.set(id, existing);
    }

    for (const aid of missingAuthorIds) {
        const data = map.get(aid)!;
        pairCache.set(`${viewerId}:${aid}`, { data, expiresAt: now + PAIR_TTL_MS });
    }

    return map;
}

/**
 * Top contributors by received value (cached for 3 minutes).
 * Used for candidate pool generation without aggregate on every feed hit.
 */
export async function getTopContributorIds(limit = 30): Promise<string[]> {
    const now = Date.now();
    if (topContributorsCache && topContributorsCache.expiresAt > now) {
        return topContributorsCache.ids;
    }

    const results = await Contribution.aggregate([
        {
            $group: {
                _id: "$recipient_id",
                totalValue: { $sum: "$value" },
            },
        },
        { $sort: { totalValue: -1 } },
        { $limit: limit },
    ]);

    const ids = results.map((r) => r._id.toString());
    topContributorsCache = { ids, expiresAt: now + TOP_CONTRIBUTORS_TTL_MS };
    return ids;
}
