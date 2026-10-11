"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Key, Mail, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";

import { Button } from "@/components/ui/button";
import InputBox from "@/components/ui/inputBox";

const registrationFormSchema = z.object({
    name: z
        .string()
        .min(3, "Name must be at least 3 characters")
        .max(50),

    email: z
        .string()
        .email("Enter a valid email"),

    password: z
        .string()
        .min(6, "Password must be at least 6 characters"),
});

type RegistrationFormValues = z.infer<typeof registrationFormSchema>;

export default function RegistrationForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const router = useRouter();
    const { checkAuth } = useAuthStore();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegistrationFormValues>({
        resolver: zodResolver(registrationFormSchema),
        mode: "onSubmit",
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: RegistrationFormValues) => {
        setServerError(null);
        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
                credentials: "include",
            });

            const json = await res.json();

            if (!res.ok || !json.success) {
                setServerError(json.message || "Registration failed.");
                return;
            }

            // Sync auth state
            await checkAuth();

            router.push("/home");
            router.refresh();
        } catch (err) {
            console.error("Registration error:", err);
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

            {/* Name */}
            <div>
                <label htmlFor="name" className="sr-only">
                    Name
                </label>

                <InputBox
                    prefix={<User className="size-5" /> as any}
                    id="name"
                    type="text"
                    placeholder="Your Name"
                    autoComplete="name"
                    {...register("name")}
                />

                {errors.name && (
                    <p className="mt-2 text-sm text-red-500">
                        {errors.name.message}
                    </p>
                )}
            </div>

            {/* Email */}
            <div>
                <label htmlFor="email" className="sr-only">
                    Email
                </label>

                <InputBox
                    prefix={<Mail className="size-5" /> as any}
                    id="email"
                    type="text"
                    placeholder="Email Address"
                    autoComplete="email"
                    {...register("email")}
                />

                {errors.email && (
                    <p className="mt-2 text-sm text-red-500">
                        {errors.email.message}
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
                    autoComplete="new-password"
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
                {isSubmitting ? "Creating Account..." : "Sign Up"}
            </Button>
        </form>
    );
}