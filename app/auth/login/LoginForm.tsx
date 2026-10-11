"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Key, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";

import { Button } from "@/components/ui/button";
import InputBox from "@/components/ui/inputBox";

const loginFormSchema = z.object({
    identifier: z
        .string()
        .min(1, "Enter your email or username"),

    password: z
        .string()
        .min(1, "Enter your password"),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export default function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const router = useRouter();
    const { checkAuth } = useAuthStore();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginFormSchema),
        mode: "onSubmit",
        defaultValues: {
            identifier: "",
            password: "",
        },
    });

    const onSubmit = async (data: LoginFormValues) => {
        setServerError(null);
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    login: data.identifier,
                    password: data.password,
                }),
                credentials: "include",
            });

            const json = await res.json();

            if (!res.ok || !json.success) {
                setServerError(json.message || "Invalid credentials.");
                return;
            }

            // Sync auth state
            await checkAuth();

            router.push("/home");
            router.refresh();
        } catch (err) {
            console.error("Login error:", err);
            setServerError("Something went wrong. Please try again.");
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex w-full flex-col gap-5 mt-5"
        >
            {serverError && (
                <div className="p-3 text-sm rounded bg-red-500/10 text-red-500 border border-red-500/20 font-mono">
                    {serverError}
                </div>
            )}

            {/* Email / Username */}
            <div>
                <label htmlFor="identifier" className="sr-only">
                    Email or Username
                </label>

                <InputBox
                    prefix={<Mail className="size-5" /> as any}
                    id="identifier"
                    type="text"
                    placeholder="Email or Username"
                    autoComplete="username"
                    {...register("identifier")}
                />

                {errors.identifier && (
                    <p className="mt-2 text-sm text-red-500">
                        {errors.identifier.message}
                    </p>
                )}
            </div>

            {/* Password */}
            <div>
                <label htmlFor="password" className="sr-only">
                    Password
                </label>

                <InputBox
                    prefix={<Key className="size-5" /> as any}
                    suffix={showPassword ? (
                        <EyeOff className="size-4" />
                    ) : (
                        <Eye className="size-4" />
                    )}
                    suffixOnClick={() => setShowPassword((v) => !v)}
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    autoComplete="current-password"
                    {...register("password")}
                />

                {errors.password && (
                    <p className="mt-2 text-sm text-red-500">
                        {errors.password.message}
                    </p>
                )}
            </div>

            <Button
                type="submit"
                className="w-full mt-5 cursor-pointer"
                disabled={isSubmitting}
            >
                {isSubmitting ? "Signing In..." : "Sign In"}
            </Button>
        </form>
    );
}