import PostLike from "@/models/PostLike";
import Follow from "@/models/Follow";
import { fetchCandidates, attachLikeStatus, CandidatePost } from "./candidates";
import {
    getUserContributionMetrics,
    batchGetContributionMetrics,
    getPairMetricsBatch,
    UserContributionMetrics,
} from "./contributions";
import { scorePost } from "./scoring";
import { rankPosts } from "./ranking";
import {
    DEFAULT_FEED_LIMIT,
    MAX_FEED_LIMIT,
    CANDIDATE_POOL_SIZE,
    SERVED_HISTORY_SIZE,
} from "./config";

export interface FeedPost {
    _id: string;
    author_id: string;
    author_name: string;
    author_username: string;
    author_avatar?: string;
    slug?: string;
    data: unknown[];
    stats?: Record<string, number>;
    likedByMe: boolean;
    createdAt: string;
    updatedAt?: string;
}

export interface FeedResult {
    posts: FeedPost[];
    /**
     * Opaque cursor — the client sends this back on the next request
     * to exclude already-served posts.
     */
    sessionId: string;
    servedIds: string[];
    hasMore: boolean;
}

/**
 * Strip internal scoring metadata before returning to the client.
 */
function toFeedPost(c: CandidatePost): FeedPost {
    const { _recencyScore, _authorId, ...rest } = c as any;
    return rest as FeedPost;
}

/**
 * Generate a "For You" feed for a viewer.
 *
 * @param viewerId    - Authenticated user ID, or null for guest.
 * @param options.limit          - Number of posts to return.
 * @param options.servedPostIds  - Post IDs already shown to this viewer in this session.
 */
export async function generateFeed(
    viewerId: string | null,
    {
        limit = DEFAULT_FEED_LIMIT,
        servedPostIds = [],
    }: {
        limit?: number;
        servedPostIds?: string[];
    } = {}
): Promise<FeedResult> {
    const safeLimit = Math.min(Math.max(limit, 1), MAX_FEED_LIMIT);
    const servedSet = new Set(servedPostIds.slice(-SERVED_HISTORY_SIZE));

    // ------------------------------------------------------------------
    // 1. Fetch candidate pool
    // ------------------------------------------------------------------
    const candidates = await fetchCandidates(viewerId, {
        poolSize: CANDIDATE_POOL_SIZE,
    });

    if (candidates.length === 0) {
        return {
            posts: [],
            sessionId: generateSessionId(),
            servedIds: [],
            hasMore: false,
        };
    }

    // ------------------------------------------------------------------
    // 2. Gather unique author IDs
    // ------------------------------------------------------------------
    const authorIds = [...new Set(candidates.map((c) => c._authorId))];

    // ------------------------------------------------------------------
    // 3. Fetch scoring context (parallel)
    // ------------------------------------------------------------------
    const [viewerMetrics, authorMetricsMap, pairMetricsMap, followedAuthorIds] =
        await Promise.all([
            viewerId
                ? getUserContributionMetrics(viewerId)
                : Promise.resolve<UserContributionMetrics>({
                      totalGiven: 0,
                      totalReceived: 0,
                      recentGiven: 0,
                      recentReceived: 0,
                      bestReceived: 0,
                      goodReceived: 0,
                  }),
            batchGetContributionMetrics(authorIds),
            viewerId
                ? getPairMetricsBatch(viewerId, authorIds)
                : Promise.resolve(new Map()),
            viewerId
                ? Follow.find({ follower_id: viewerId })
                      .select("following_id")
                      .lean()
                      .then((fs: any[]) =>
                          new Set(fs.map((f) => f.following_id.toString()))
                      )
                : Promise.resolve(new Set<string>()),
        ]);

    // ------------------------------------------------------------------
    // 4. Score each candidate
    // ------------------------------------------------------------------
    const scored = candidates.map((post) => ({
        ...post,
        id: post._id,
        authorId: post._authorId,
        score: scorePost(post, {
            viewerMetrics,
            authorMetrics: authorMetricsMap,
            pairMetrics: pairMetricsMap,
            followedSet: followedAuthorIds,
        }),
    }));

    // ------------------------------------------------------------------
    // 5. Probabilistic ranking
    // ------------------------------------------------------------------
    const ranked = rankPosts(scored, {
        limit: safeLimit,
        recentlyServedIds: servedSet,
    });

    // ------------------------------------------------------------------
    // 6. Attach like status
    // ------------------------------------------------------------------
    let postsWithLikes: CandidatePost[] = ranked;
    if (viewerId && ranked.length > 0) {
        const postIds = ranked.map((p) => p._id);
        const userLikes = await PostLike.find({
            user_id: viewerId,
            post_id: { $in: postIds },
        })
            .select("post_id")
            .lean();
        const likedSet = new Set<string>(
            (userLikes as any[]).map((l) => l.post_id.toString())
        );
        postsWithLikes = attachLikeStatus(ranked, likedSet);
    }

    const resultPosts = postsWithLikes.map(toFeedPost);
    const newServedIds = resultPosts.map((p) => p._id);

    return {
        posts: resultPosts,
        sessionId: generateSessionId(),
        servedIds: newServedIds,
        hasMore: candidates.length >= CANDIDATE_POOL_SIZE,
    };
}

function generateSessionId(): string {
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
