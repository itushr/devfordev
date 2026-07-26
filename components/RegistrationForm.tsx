"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Key, Mail, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import InputBox from "./ui/inputBox";

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
            className="flex w-full flex-col gap-5 mt-5"
        >
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
                className="w-full mt-5"
                disabled={isSubmitting}
            >
                {isSubmitting ? "Creating Account..." : "Sign Up"}
            </Button>
        </form>
    );
}