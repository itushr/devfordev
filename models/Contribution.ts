import { Schema, model, models } from "mongoose";

/**
 * Contribution tracks value given from a comment author (contributor)
 * to a post author (recipient) via a rating on a specific comment.
 * One record per comment — updated in-place if rating changes.
 */
const ContributionSchema = new Schema(
    {
        contributor_id: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        recipient_id: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        post_id: {
            type: Schema.Types.ObjectId,
            ref: "Post",
            required: true,
            index: true,
        },

        comment_id: {
            type: Schema.Types.ObjectId,
            ref: "Comment",
            required: true,
        },

        rating: {
            type: String,
            enum: ["bad", "good", "best"],
            required: true,
        },

        value: {
            type: Number,
            required: true,
            min: 0,
        },
    },
    {
        timestamps: true,
    }
);

// One rating per comment — enforces upsert semantics
ContributionSchema.index({ comment_id: 1 }, { unique: true });

// For calculating metrics per contributor
ContributionSchema.index({ contributor_id: 1, createdAt: -1 });

// For calculating metrics per recipient
ContributionSchema.index({ recipient_id: 1, createdAt: -1 });

// For pairwise exchange queries
ContributionSchema.index({ contributor_id: 1, recipient_id: 1, createdAt: -1 });

const Contribution =
    models.Contribution || model("Contribution", ContributionSchema);

export default Contribution;
