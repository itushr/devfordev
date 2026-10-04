import { PostDataBlock } from "@/components/pitchCard/PitchCard";

export type CommentItemType = {
    _id: string;
    post_id: string;
    parent_id?: string | null;
    author_id: string;
    author_name: string;
    author_username: string;
    author_avatar?: string;
    content: string;
    data?: PostDataBlock[];
    points: number;
    pointsAwarded: boolean;
    likes: number;
    repliesCount: number;
    replyToUsername?: string;
    likedByMe?: boolean;
    createdAt?: string;
    updatedAt?: string;
};
