import { Schema, model, models } from "mongoose";

const CommentLikeSchema = new Schema(
    {
        comment_id: {
            type: Schema.Types.ObjectId,
            ref: "Comment",
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

CommentLikeSchema.index(
    { comment_id: 1, user_id: 1 },
    { unique: true }
);

const CommentLike = models.CommentLike || model("CommentLike", CommentLikeSchema);

export default CommentLike;
