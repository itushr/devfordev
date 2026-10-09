import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import Post from "@/models/Post";
import PostLike from "@/models/PostLike";
import UserInteraction from "@/models/UserInteraction";

export async function PUT(
    req: NextRequest,
    props: { params: Promise<{ postId: string }> }
) {
    try {
        const { postId } = await props.params;

        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return NextResponse.json(
                { error: "Invalid post ID" },
                { status: 400 }
            );
        }

        let userId = req.headers.get("user_id");
        if (!userId) {
            const token = req.cookies.get("token")?.value;
            if (token) {
                try {
                    const payload = verifyToken(token);
                    userId = payload?.id;
                } catch {
                    // Invalid token
                }
            }
        }

        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        await connectDB();
        const session = await mongoose.startSession();

        let likesCount = 0;

        try {
            await session.withTransaction(async () => {
                const post = await Post.findById(postId).session(session);
                if (!post) {
                    throw new Error("POST_NOT_FOUND");
                }

                const existingLike = await PostLike.findOne({
                    post_id: postId,
                    user_id: userId,
                }).session(session);

                if (!existingLike) {
                    await PostLike.create(
                        [
                            {
                                post_id: postId,
                                user_id: userId,
                            },
                        ],
                        { session }
                    );

                    const updatedPost = await Post.findByIdAndUpdate(
                        postId,
                        { $inc: { "stats.likes": 1 } },
                        { new: true, session }
                    );

                    likesCount = updatedPost?.stats?.likes ?? (post.stats?.likes ?? 0) + 1;

                    // Update interaction aggregate — only when actor != post author
                    const postAuthorId = post.author_id?.toString();
                    if (postAuthorId && postAuthorId !== userId) {
                        await UserInteraction.findOneAndUpdate(
                            { actor_id: userId, target_id: postAuthorId },
                            {
                                $inc: { likes_count: 1 },
                                $set: { last_interacted_at: new Date() },
                            },
                            { upsert: true, new: true }
                        );
                    }
                } else {
                    likesCount = post.stats?.likes ?? 0;
                }
            });

            return NextResponse.json({
                success: true,
                liked: true,
                likedByMe: true,
                likes: likesCount,
            });
        } catch (error: any) {
            if (error.message === "POST_NOT_FOUND") {
                return NextResponse.json(
                    { error: "Post not found" },
                    { status: 404 }
                );
            }

            if (error.code === 11000) {
                const post = await Post.findById(postId);
                return NextResponse.json({
                    success: true,
                    liked: true,
                    likedByMe: true,
                    likes: post?.stats?.likes ?? 0,
                });
            }

            throw error;
        } finally {
            await session.endSession();
        }
    } catch (error) {
        console.error("Error: @route PUT /api/posts/[postId]/like", error);
        return NextResponse.json(
            { error: "Failed to like post" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: NextRequest,
    props: { params: Promise<{ postId: string }> }
) {
    try {
        const { postId } = await props.params;

        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return NextResponse.json(
                { error: "Invalid post ID" },
                { status: 400 }
            );
        }

        let userId = req.headers.get("user_id");
        if (!userId) {
            const token = req.cookies.get("token")?.value;
            if (token) {
                try {
                    const payload = verifyToken(token);
                    userId = payload?.id;
                } catch {
                    // Invalid token
                }
            }
        }

        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        await connectDB();
        const session = await mongoose.startSession();

        let likesCount = 0;

        try {
            await session.withTransaction(async () => {
                const post = await Post.findById(postId).session(session);
                if (!post) {
                    throw new Error("POST_NOT_FOUND");
                }

                const deleteResult = await PostLike.findOneAndDelete({
                    post_id: postId,
                    user_id: userId,
                }).session(session);

                if (deleteResult) {
                    const updatedPost = await Post.findByIdAndUpdate(
                        postId,
                        { $inc: { "stats.likes": -1 } },
                        { new: true, session }
                    );

                    likesCount = Math.max(0, updatedPost?.stats?.likes ?? 0);

                    // Decrement interaction aggregate — only when actor != post author
                    const postAuthorId = post.author_id?.toString();
                    if (postAuthorId && postAuthorId !== userId) {
                        await UserInteraction.findOneAndUpdate(
                            { actor_id: userId, target_id: postAuthorId },
                            [
                                {
                                    $set: {
                                        likes_count: {
                                            $max: [0, { $subtract: ["$likes_count", 1] }],
                                        },
                                        last_interacted_at: new Date(),
                                    },
                                },
                            ]
                        );
                    }
                } else {
                    likesCount = Math.max(0, post.stats?.likes ?? 0);
                }
            });

            return NextResponse.json({
                success: true,
                liked: false,
                likedByMe: false,
                likes: likesCount,
            });
        } catch (error: any) {
            if (error.message === "POST_NOT_FOUND") {
                return NextResponse.json(
                    { error: "Post not found" },
                    { status: 404 }
                );
            }

            throw error;
        } finally {
            await session.endSession();
        }
    } catch (error) {
        console.error("Error: @route DELETE /api/posts/[postId]/like", error);
        return NextResponse.json(
            { error: "Failed to unlike post" },
            { status: 500 }
        );
    }
}
