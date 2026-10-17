import { SOFTMAX_TEMPERATURE, SCORE_JITTER, SERVED_PENALTY } from "./config";

export interface ScoredItem {
    id: string;
    score: number;
    authorId?: string;
}

/**
 * Apply temperature-scaled softmax to convert scores → probabilities:
 *
 *   P(p_i) = exp(S_i / τ) / Σ exp(S_j / τ)
 *
 * Uses the log-sum-exp trick for numerical stability.
 */
function softmax(scores: number[], temperature: number): number[] {
    const safeTemp = Math.max(0.01, temperature);
    const scaled = scores.map((s) => s / safeTemp);
    const maxVal = Math.max(...scaled);
    const exps = scaled.map((s) => Math.exp(s - maxVal));
    const sumExp = exps.reduce((a, b) => a + b, 0);

    if (sumExp === 0 || !isFinite(sumExp)) {
        // Uniform fallback in extreme edge case
        return scores.map(() => 1 / scores.length);
    }

    return exps.map((e) => e / sumExp);
}

/**
 * Sample `k` items without replacement using weighted probabilities.
 * Applies author diversity dampening so the feed is never dominated
 * by a single author.
 */
function weightedSampleWithoutReplacement<T extends ScoredItem>(
    items: T[],
    initialProbabilities: number[],
    k: number
): T[] {
    const probs = [...initialProbabilities];
    const pool = [...items];
    const result: T[] = [];
    const authorCounts = new Map<string, number>();

    for (let i = 0; i < k && pool.length > 0; i++) {
        const total = probs.reduce((a, b) => a + b, 0);
        if (total <= 0) {
            // If all probabilities depleted, take remaining items in order
            result.push(...pool.slice(0, k - result.length));
            break;
        }

        let threshold = Math.random() * total;
        let chosen = pool.length - 1;

        for (let j = 0; j < pool.length; j++) {
            threshold -= probs[j];
            if (threshold <= 0) {
                chosen = j;
                break;
            }
        }

        const chosenItem = pool[chosen];
        result.push(chosenItem);

        // Track author representation for diversity
        const authorId = chosenItem.authorId;
        if (authorId) {
            const count = (authorCounts.get(authorId) ?? 0) + 1;
            authorCounts.set(authorId, count);

            // Dampen remaining posts from the same author to preserve author diversity
            for (let j = 0; j < pool.length; j++) {
                if (j !== chosen && pool[j].authorId === authorId) {
                    probs[j] *= 0.35; // Diversity discount
                }
            }
        }

        pool.splice(chosen, 1);
        probs.splice(chosen, 1);
    }

    return result;
}

/**
 * Probabilistic ranking pipeline according to Sections 4 & 6:
 *
 * 1. Add small per-request score jitter to break deterministic ordering.
 * 2. Apply penalty to recently served posts (reducing probability, not deleting).
 * 3. Convert scores to probabilities via temperature-scaled softmax.
 * 4. Sample without replacement with author diversity preservation.
 */
export function rankPosts<T extends ScoredItem>(
    items: T[],
    {
        limit,
        recentlyServedIds = new Set<string>(),
        temperature = SOFTMAX_TEMPERATURE,
        jitter = SCORE_JITTER,
        servedPenalty = SERVED_PENALTY,
    }: {
        limit: number;
        recentlyServedIds?: Set<string>;
        temperature?: number;
        jitter?: number;
        servedPenalty?: number;
    }
): T[] {
    if (items.length === 0) return [];

    // Jitter + penalty for recently served items
    const adjusted = items.map((item) => ({
        ...item,
        score:
            item.score +
            (Math.random() * 2 - 1) * jitter -
            (recentlyServedIds.has(item.id) ? servedPenalty : 0),
    }));

    const scores = adjusted.map((a) => a.score);
    const probs = softmax(scores, temperature);

    return weightedSampleWithoutReplacement(adjusted, probs, limit) as T[];
}
