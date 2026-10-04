import { Schema, model, models } from "mongoose";

const FileSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        content: {
            type: String,
            required: true,
        },
    },
    { _id: false }
);

const DataSchema = new Schema(
    {
        type: {
            type: String,
            required: true,
            enum: ["text", "images", "code", "poll"],
        },
        text: {
            type: String,
        },
        urls: {
            type: [String],
        },
        compare: {
            type: Boolean,
        },
        files: {
            type: [FileSchema],
        },
        options: {
            type: [String],
        },
    },
    { _id: false }
);

const CommentSchema = new Schema(
    {
        post_id: {
            type: Schema.Types.ObjectId,
            ref: "Post",
            required: true,
            index: true,
        },

        parent_id: {
            type: Schema.Types.ObjectId,
            ref: "Comment",
            default: null,
            index: true,
        },

        author_id: {
            type: String,
            required: true,
            index: true,
        },

        author_name: {
            type: String,
            required: true,
            trim: true,
        },

        author_username: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            index: true,
        },

        author_avatar: {
            type: String,
        },

        content: {
            type: String,
            trim: true,
        },

        data: {
            type: [DataSchema],
            default: [],
        },

        points: {
            type: Number,
            default: 0,
            min: 0,
        },

        pointsAwarded: {
            type: Boolean,
            default: false,
            index: true,
        },

        likes: {
            type: Number,
            default: 0,
            min: 0,
        },

        repliesCount: {
            type: Number,
            default: 0,
            min: 0,
        },

        replyToUsername: {
            type: String,
            trim: true,
            lowercase: true,
        },
    },
    {
        timestamps: true,
    }
);

CommentSchema.index({ post_id: 1, parent_id: 1, createdAt: -1 });
CommentSchema.index({ post_id: 1, createdAt: -1 });
CommentSchema.index({ parent_id: 1, createdAt: 1 });

const Comment = models.Comment || model("Comment", CommentSchema);

export default Comment;
