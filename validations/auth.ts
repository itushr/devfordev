import { z } from "zod";

export const loginSchema = z.object({
    login: z
        .string()
        .trim()
        .min(1, "Email or username is required"),

    password: z
        .string()
        .min(1, "Password is required"),
});

export const registerSchema = z.object({
    name: z
        .string()
        .trim()
        .min(3, "Name must be at least 3 characters")
        .max(50),

    email: z
        .string()
        .trim()
        .toLowerCase()
        .pipe(z.email("Invalid email address")),

    password: z
        .string()
        .min(6, "Password must be at least 6 characters")
        .max(100),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;