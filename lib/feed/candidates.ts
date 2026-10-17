import Post from "@/models/Post";
import Follow from "@/models/Follow";
import { CANDIDATE_POOL_SIZE, RECENCY_HALF_LIFE_HOURS } from "./config";
import { getTopContributorIds } from "./contributions";

export interface CandidatePost {
    _id: string;
    author_id: string;
    author_name: string;
    author_username: string;
    author_avatar?: string;
    slug?: string;
    data: unknown[];
    stats?: Record<string, number>;
    createdAt: string;
    updatedAt?: string;
    likedByMe?: boolean;
    // Feed-internal metadata
    _recencyScore: number;
    _authorId: string;
    _isFollowed?: boolean;
}

/**
 * Build the candidate pool according to Section 5:
 * 1. Posts by followed users.
 * 2. Posts by other users with strong contribution records.
 * 3. Posts from previously undiscovered / recent authors.
 *
 * Excludes viewer's own posts.
 * Applies a time-decay factor so recent posts receive higher priority
 * without making older valuable posts completely invisible.
 */
export async function fetchCandidates(
    viewerId: string | null,
    {
        excludePostIds = [],
        poolSize = CANDIDATE_POOL_SIZE,
    }: {
        excludePostIds?: string[];
        poolSize?: number;
    } = {}
): Promise<CandidatePost[]> {
    const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30-day window
    const excludeSet = new Set(excludePostIds);

    // 1. Followed authors
    let followedAuthorIds: string[] = [];
    if (viewerId) {
        const follows = await Follow.find({ follower_id: viewerId })
            .select("following_id")
            .lean();
        followedAuthorIds = (follows as any[]).map((f) => f.following_id.toString());
    }
    const followedSet = new Set(followedAuthorIds);

    // 2. Top contributors by contribution value
    const topContributorIds = await getTopContributorIds(40);

    // Common filter excluding viewer's own posts
    const baseFilter: Record<string, unknown> = {
        createdAt: { $gte: cutoff },
    };
    if (viewerId) {
        baseFilter.author_id = { $ne: viewerId };
    }

    // Parallel fetch across the 3 candidate sources:
    const queries: Promise<any[]>[] = [];

    // Source 1: Followed users' posts (up to 60)
    if (followedAuthorIds.length > 0) {
        queries.push(
            Post.find({
                ...baseFilter,
                author_id: { $in: followedAuthorIds },
            })
                .sort({ createdAt: -1 })
                .limit(60)
                .lean()
        );
    } else {
        queries.push(Promise.resolve([]));
    }

    // Source 2: Strong contributor posts (up to 60)
    const filteredTopContributors = topContributorIds.filter(
        (id) => id !== viewerId && !followedSet.has(id)
    );
    if (filteredTopContributors.length > 0) {
        queries.push(
            Post.find({
                ...baseFilter,
                author_id: { $in: filteredTopContributors },
            })
                .sort({ createdAt: -1 })
                .limit(60)
                .lean()
        );
    } else {
        queries.push(Promise.resolve([]));
    }

    // Source 3: Recent & discovery posts from other authors (up to 80)
    queries.push(
        Post.find(baseFilter)
            .sort({ createdAt: -1 })
            .limit(80)
            .lean()
    );

    const [followedPosts, contributorPosts, recentPosts] = await Promise.all(queries);

    // Merge and deduplicate by post ID
    const mergedMap = new Map<string, any>();
    for (const post of [...followedPosts, ...contributorPosts, ...recentPosts]) {
        const id = post._id.toString();
        if (!excludeSet.has(id) && !mergedMap.has(id)) {
            mergedMap.set(id, post);
            if (mergedMap.size >= poolSize) break;
        }
    }

    const halfLifeMs = RECENCY_HALF_LIFE_HOURS * 60 * 60 * 1000;

    const candidates: CandidatePost[] = Array.from(mergedMap.values()).map((p) => {
        const ageMs = Date.now() - new Date(p.createdAt).getTime();
        // Exponential decay: score = exp(-ln2 * age / halfLife)
        const recencyScore = Math.exp(-Math.LN2 * (ageMs / halfLifeMs));

        return {
            _id: p._id.toString(),
            author_id: p.author_id?.toString() ?? "",
            author_name: p.author_name ?? "",
            author_username: p.author_username ?? "",
            author_avatar: p.author_avatar,
            slug: p.slug,
            data: p.data ?? [],
            stats: p.stats ?? {},
            createdAt: p.createdAt?.toISOString?.() ?? "",
            updatedAt: p.updatedAt?.toISOString?.() ?? "",
            _recencyScore: recencyScore,
            _authorId: p.author_id?.toString() ?? "",
            _isFollowed: followedSet.has(p.author_id?.toString() ?? ""),
        };
    });

    return candidates;
}

/** Attach like status for the viewer to a list of posts using a Set. */
export function attachLikeStatus(
    candidates: CandidatePost[],
    likedPostIds: Set<string>
): CandidatePost[] {
    return candidates.map((c) => ({
        ...c,
        likedByMe: likedPostIds.has(c._id),
    }));
}
