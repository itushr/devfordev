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

const StatsSchema = new Schema(
    {
        flames: {
            type: Number,
            default: 0,
            min: 0,
        },

        likes: {
            type: Number,
            default: 0,
            min: 0,
        },

        comments: {
            type: Number,
            default: 0,
            min: 0,
        },

        impressions: {
            type: Number,
            default: 0,
            min: 0,
        },

        bookmarks: {
            type: Number,
            default: 0,
            min: 0,
        },

        shares: {
            type: Number,
            default: 0,
            min: 0,
        },
    },
    { _id: false }
);

const PostSchema = new Schema(
    {
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

        points: {
            type: Number,
            default: 10,
            min: 0,
        },

        data: {
            type: [DataSchema],
            required: true,
            validate: {
                validator: (value: unknown[]) => value.length > 0,
                message: "Post data cannot be empty",
            },
        },

        stats: {
            type: StatsSchema,
            default: () => ({}),
        },
    },
    {
        timestamps: true,
    }
);

const Post = models.Post || model("Post", PostSchema);

export default Post;