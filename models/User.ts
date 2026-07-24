import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
    {
        username: {
            type: String,
            unique: true,
            trim: true,
            lowercase: true,
            index: true,
        },

        name: {
            type: String,
            trim: true,
        },

        email: {
            type: String,
            unique: true,
            lowercase: true,
            trim: true,
            sparse: true,
            index: true,
        },

        password: {
            type: String,
        },

        googleId: {
            type: String,
            unique: true,
            sparse: true,
        },

        githubId: {
            type: String,
            unique: true,
            sparse: true,
        },

        discordId: {
            type: String,
            unique: true,
            sparse: true,
        },

        avatar: {
            type: String,
        },

        points: {
            type: Number,
            default: 0,
            min: 0,
        },

        ratingCount: {
            type: Number,
            default: 0,
        },

        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },

        description: {
            type: String,
            trim: true,
            maxlength: 300,
        },

        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
    },
    {
        timestamps: true,
    }
);

const User = models.User || model("User", UserSchema);

export default User;