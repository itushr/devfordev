import { Schema, model, models } from "mongoose";

/**
 * UserInteraction aggregates interaction counts between users.
 * actor_id interacted (liked/commented) on posts owned by target_id.
 * Updated atomically in the same service that mutates the like/comment.
 */
const UserInteractionSchema = new Schema(
    {
        actor_id: {
            type: String,
            required: true,
        },
        target_id: {
            type: String,
            required: true,
        },
        likes_count: {
            type: Number,
            default: 0,
            min: 0,
        },
        comments_count: {
            type: Number,
            default: 0,
            min: 0,
        },
        last_interacted_at: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

// Unique compound index for actor-target pair
UserInteractionSchema.index({ actor_id: 1, target_id: 1 }, { unique: true });
// For querying all users that actor interacted with
UserInteractionSchema.index({ actor_id: 1, last_interacted_at: -1 });
// For querying all users who interacted with target
UserInteractionSchema.index({ target_id: 1, last_interacted_at: -1 });

const UserInteraction =
    models.UserInteraction || model("UserInteraction", UserInteractionSchema);

export default UserInteraction;
