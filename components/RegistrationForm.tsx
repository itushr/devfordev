"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Key, Mail, User } from "lucide-react";

import { Button } from "@/components/ui/button";

const registerSchema = z.object({
    name: z
        .string()
        .min(3, "Name must be at least 3 characters")
        .max(50),

    email: z
        .string()
        .email("Enter a valid email"),

    password: z
        .string()
        .min(6, "Password must be at least 6 characters")
        // .regex(/[A-Z]/, "Must contain an uppercase letter")
        // .regex(/[a-z]/, "Must contain a lowercase letter")
        // .regex(/[0-9]/, "Must contain a number"),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegistrationForm() {
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterForm>({
        resolver: zodResolver(registerSchema),
         mode: "onChange",
        reValidateMode: "onChange",
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: RegisterForm) => {
        // working on it
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex w-full flex-col gap-5 mt-5 font-mono"
        >
            {/* Name */}
            <div>
                <label htmlFor="name" className="sr-only">
                    Name
                </label>

                <div className="flex items-center gap-2 border rounded-md overflow-hidden">
                    <div className="flex items-center justify-center border-r px-3 py-3">
                        <User className="size-5" />
                    </div>

                    <input
                        id="name"
                        type="text"
                        placeholder="Your Name"
                        autoComplete="name"
                        className="outline-none w-full"
                        {...register("name")}
                    />
                </div>

                {errors.name && (
                    <p className="mt-1 text-sm text-red-500">
                        {errors.name.message}
                    </p>
                )}
            </div>

            {/* Email */}
            <div>
                <label htmlFor="email" className="sr-only">
                    Email
                </label>

                <div className="flex items-center gap-2 border rounded-md overflow-hidden">
                    <div className="flex items-center justify-center border-r px-3 py-3">
                        <Mail className="size-5" />
                    </div>

                    <input
                        id="email"
                        type="email"
                        placeholder="Email Address"
                        autoComplete="email"
                        className="outline-none w-full"
                        {...register("email")}
                    />
                </div>

                {errors.email && (
                    <p className="mt-1 text-sm text-red-500">
                        {errors.email.message}
                    </p>
                )}
            </div>

            {/* Password */}
            <div>
                <label htmlFor="password" className="sr-only">
                    Password
                </label>

                <div className="flex items-center gap-2 border rounded-md overflow-hidden">
                    <div className="flex items-center justify-center border-r px-3 py-3">
                        <Key className="size-5" />
                    </div>

                    <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        autoComplete="new-password"
                        className="outline-none w-full"
                        {...register("password")}
                    />

                    <button
                        type="button"
                        className="flex items-center justify-center border-l px-3 py-3"
                        aria-label={
                            showPassword
                                ? "Hide password"
                                : "Show password"
                        }
                        onClick={() => setShowPassword((v) => !v)}
                    >
                        {showPassword ? (
                            <EyeOff className="size-4" />
                        ) : (
                            <Eye className="size-4" />
                        )}
                    </button>
                </div>

                {errors.password && (
                    <p className="mt-1 text-sm text-red-500">
                        {errors.password.message}
                    </p>
                )}
            </div>

            <Button
                type="submit"
                className="w-full mt-5"
                disabled={isSubmitting}
            >
                {isSubmitting ? "Creating Account..." : "Sign Up"}
            </Button>
        </form>
    );
}