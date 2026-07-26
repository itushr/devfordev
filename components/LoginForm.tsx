"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Key, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import InputBox from "./ui/inputBox";

const loginSchema = z.object({
    identifier: z
        .string()
        .min(3, "Enter your email or username"),

    password: z
        .string()
        .min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
        mode: "onChange",
        reValidateMode: "onChange",
        defaultValues: {
            identifier: "",
            password: "",
        },
    });

    const onSubmit = async (data: LoginForm) => {
        // working on it
        console.log(data);
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex w-full flex-col gap-5 mt-5"
        >
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
                className="w-full mt-5"
                disabled={isSubmitting}
            >
                {isSubmitting ? "Signing In..." : "Sign In"}
            </Button>
        </form>
    );
}