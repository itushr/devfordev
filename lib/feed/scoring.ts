import { CandidatePost } from "./candidates";
import { UserContributionMetrics, PairMetrics } from "./contributions";
import { FEED_WEIGHTS } from "./config";

interface ScoringContext {
    /** Viewer's own metrics */
    viewerMetrics: UserContributionMetrics;
    /** Per-author metrics keyed by author_id */
    authorMetrics: Map<string, UserContributionMetrics>;
    /** Pairwise metrics between viewer & each author */
    pairMetrics: Map<string, PairMetrics>;
    /** Whether viewer follows each author */
    followedSet: Set<string>;
}

/** Sigmoid clamped to [0,1] — normalises unbounded positive values. */
function sigmoid(x: number, scale = 10): number {
    return 1 / (1 + Math.exp(-x / scale));
}

/**
 * QX — Author's historical contribution quality.
 * Emphasises "best" (rating value 3 + bonus) over "good" (value 1)
 * and incorporates recent contributions. Normalised via sigmoid.
 */
function scoreAuthorQuality(authorMetrics?: UserContributionMetrics): number {
    if (!authorMetrics) return 0;
    const qualityScore =
        authorMetrics.totalReceived +
        authorMetrics.bestReceived * 3 +
        authorMetrics.recentReceived * 1.5;
    return sigmoid(qualityScore, 15);
}

/**
 * GY — Viewer's value-giving behaviour.
 * Encourages users who actively rate and give value to others.
 */
function scoreViewerGiving(viewerMetrics: UserContributionMetrics): number {
    return sigmoid(viewerMetrics.totalGiven + viewerMetrics.recentGiven * 2, 20);
}

/**
 * B(X,Y) — Pairwise contribution balance between X and Y.
 * Rewards mutual value exchange and penalises completely one-sided patterns.
 */
function scorePairBalance(pair?: PairMetrics): number {
    if (!pair) return 0.3; // neutral baseline for unknown pairs
    const total = pair.aToB + pair.bToA;
    if (total === 0) return 0.3;
    // Harmonic-like balance: 1 if perfectly balanced, 0 if completely one-sided
    const balance = (2 * Math.min(pair.aToB, pair.bToA)) / total;
    const magnitude = sigmoid(total, 10);
    return balance * 0.5 + magnitude * 0.5;
}

/**
 * D(X,Y) — Discovery bonus for authors Y has not interacted with much.
 * Decays exponentially as historical exchange increases.
 */
function scoreDiscovery(pair?: PairMetrics): number {
    if (!pair) return 1; // never interacted → full discovery bonus
    const totalInteraction = pair.aToB + pair.bToA;
    return Math.exp(-totalInteraction / 6);
}

/**
 * R(X) — Relationship relevance, including whether Y follows X.
 */
function scoreRelationship(isFollowed: boolean): number {
    return isFollowed ? 1 : 0;
}

/**
 * T(X) — Post recency score (computed via exponential time decay).
 */
function scoreRecency(recencyScore: number): number {
    return Math.max(0, Math.min(1, recencyScore));
}

/**
 * Calculate composite feed score S(X, Y) according to Section 3:
 * S(X,Y) = w1*QX + w2*GY + w3*B(X,Y) + w4*D(X,Y) + w5*R(X) + w6*T(X)
 */
export function scorePost(
    post: CandidatePost,
    ctx: ScoringContext
): number {
    const w = FEED_WEIGHTS;
    const am = ctx.authorMetrics.get(post._authorId);
    const pm = ctx.pairMetrics.get(post._authorId);
    const isFollowed = post._isFollowed ?? ctx.followedSet.has(post._authorId);

    const qx = scoreAuthorQuality(am);
    const gy = scoreViewerGiving(ctx.viewerMetrics);
    const b = scorePairBalance(pm);
    const d = scoreDiscovery(pm);
    const r = scoreRelationship(isFollowed);
    const t = scoreRecency(post._recencyScore);

    return (
        w.authorQuality * qx +
        w.viewerGiving * gy +
        w.pairBalance * b +
        w.discovery * d +
        w.relationship * r +
        w.recency * t
    );
}
