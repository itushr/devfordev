import { z } from "zod";
import { postDataSchema } from "./post";

export const createCommentSchema = z
    .object({
        content: z.string().trim().max(10000).optional(),
        data: z.array(postDataSchema).max(10).optional(),
        replyToUsername: z.string().trim().optional(),
    })
    .refine(
        (val) =>
            (Boolean(val.content) && val.content!.trim().length > 0) ||
            (Boolean(val.data) && val.data!.length > 0),
        { message: "Comment cannot be empty" }
    );

export type CreateCommentInput = z.infer<typeof createCommentSchema>;
