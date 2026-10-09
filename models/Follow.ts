import { Schema, model, models } from "mongoose";

const FollowSchema = new Schema(
    {
        follower_id: {
            type: String,
            required: true,
            index: true,
        },
        following_id: {
            type: String,
            required: true,
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

// Unique compound index prevents duplicate follow relationships
FollowSchema.index({ follower_id: 1, following_id: 1 }, { unique: true });
// Optimized for fetching all followers of a user
FollowSchema.index({ following_id: 1, createdAt: -1 });
// Optimized for fetching all users a person follows
FollowSchema.index({ follower_id: 1, createdAt: -1 });

const Follow = models.Follow || model("Follow", FollowSchema);

export default Follow;
