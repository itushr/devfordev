/**
 * Rating → contribution value mapping.
 * "bad" gives 0 — no boost to feed ranking.
 */
export const RATING_VALUES = {
    bad: 0,
    good: 1,
    best: 3,
} as const;

export type Rating = keyof typeof RATING_VALUES;

/** Feed scoring weights — all tunable. Must sum conceptually in a sensible range. */
export const FEED_WEIGHTS = {
    /** w1 — Author's historical contribution quality (QX) */
    authorQuality: 0.25,
    /** w2 — Viewer's value-giving behaviour (GY) */
    viewerGiving: 0.15,
    /** w3 — Pairwise contribution balance between viewer & author (B) */
    pairBalance: 0.20,
    /** w4 — Discovery bonus for authors viewer hasn't interacted with much (D) */
    discovery: 0.15,
    /** w5 — Relationship relevance, e.g. following (R) */
    relationship: 0.15,
    /** w6 — Recency score (T) */
    recency: 0.10,
} as const;

/**
 * Temperature for softmax sampling.
 * Higher → more random; lower → more deterministic.
 */
export const SOFTMAX_TEMPERATURE = 0.7;

/**
 * Small score jitter magnitude added per request to break identical feeds.
 * Jitter is uniformly sampled in [-SCORE_JITTER, +SCORE_JITTER].
 */
export const SCORE_JITTER = 0.03;

/**
 * Recent time window for contribution metrics (ms).
 * Default: 30 days.
 */
export const RECENT_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;

/** Maximum number of recently-served post IDs tracked per viewer. */
export const SERVED_HISTORY_SIZE = 200;

/** Probability multiplier applied to recently-served posts (0–1). */
export const SERVED_PENALTY = 0.3;

/** How many candidate posts to fetch before probabilistic sampling. */
export const CANDIDATE_POOL_SIZE = 150;

/** Default page size returned to the client. */
export const DEFAULT_FEED_LIMIT = 20;

/** Max posts returned in one request. */
export const MAX_FEED_LIMIT = 50;

/** Recency half-life in hours — post score halves after this many hours. */
export const RECENCY_HALF_LIFE_HOURS = 48;
