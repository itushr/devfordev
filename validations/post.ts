import { z } from "zod";

const textDataSchema = z.object({
    type: z.literal("text"),
    text: z
        .string()
        .trim()
        .min(1, "Text cannot be empty")
        .max(10000, "Text is too long"),
});

const imagesDataSchema = z
    .object({
        type: z.literal("images"),

        urls: z
            .array(
                z
                    .string()
                    .trim()
                    .min(1, "Image URL cannot be empty")
            )
            .min(1, "At least one image is required")
            .max(10, "Maximum 10 images are allowed"),

        compare: z.boolean().default(false),
    })
    .superRefine((data, ctx) => {
        if (data.compare && data.urls.length !== 2) {
            ctx.addIssue({
                code: "custom",
                path: ["compare"],
                message: "Compare can only be enabled when exactly 2 images are provided",
            });
        }
    });

const fileSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "File name is required")
        .max(255, "File name is too long"),

    content: z
        .string()
        .max(1000000, "File content is too large"),
});

const codeDataSchema = z.object({
    type: z.literal("code"),

    files: z
        .array(fileSchema)
        .min(1, "At least one file is required")
        .max(20, "Maximum 20 files are allowed"),
});

const pollDataSchema = z.object({
    type: z.literal("poll"),

    options: z
        .array(
            z
                .string()
                .trim()
                .min(1, "Poll option cannot be empty")
                .max(200, "Poll option is too long")
        )
        .min(2, "A poll must have at least 2 options")
        .max(10, "Maximum 10 poll options are allowed"),
});

export const postDataSchema = z.discriminatedUnion("type", [
    textDataSchema,
    imagesDataSchema,
    codeDataSchema,
    pollDataSchema,
]);

export const createPostSchema = z.object({
    data: z
        .array(postDataSchema)
        .min(1, "Post data cannot be empty")
        .max(20, "A post can contain at most 20 data blocks"),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type PostData = z.infer<typeof postDataSchema>;