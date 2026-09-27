import { Schema, model, models } from "mongoose";

const PostLikeSchema = new Schema(
    {
        post_id: {
            type: Schema.Types.ObjectId,
            ref: "Post",
            required: true,
        },

        user_id: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

PostLikeSchema.index(
    { post_id: 1, user_id: 1 },
    { unique: true }
);

const PostLike = models.PostLike || model("PostLike", PostLikeSchema);

export default PostLike;
