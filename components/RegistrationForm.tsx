"use client";

import { useState } from "react";
import { Eye, EyeOff, Key, Mail, User } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function RestrationForm() {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <form className="flex w-full flex-col gap-5 mt-5 font-mono">
            {/* Name */}
            <div>
                <label htmlFor="name" className="sr-only">
                    Name
                </label>
                <div>
                    <div className="flex items-center gap-2 border rounded-md overflow-hidden">
                        <div className="flex items-center justify-center border-r px-3 py-3">
                            <User className="size-5" />
                        </div>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            className="outline-none w-full"
                            placeholder="Your Name"
                            autoComplete="name"
                            required
                        />
                    </div>
                </div>
            </div>

            {/* Email */}
            <div>
                <label htmlFor="email" className="sr-only">
                    Email address
                </label>
                <div>
                    <div className="flex items-center gap-2 border rounded-md overflow-hidden">
                        <div className="flex items-center justify-center border-r px-3 py-3">
                            <Mail className="size-5" />
                        </div>
                        <input
                            id="email"
                            name="email"
                            type="text"
                            className="outline-none w-full"
                            placeholder="Email Address"
                            autoComplete="name"
                            required
                        />
                    </div>
                </div>
            </div>

            {/* Password */}
            <div className="relative">
                <label htmlFor="password" className="sr-only">
                    Password
                </label>

                <div>
                    <div className="flex items-center gap-2 border rounded-md overflow-hidden">
                        <div className="flex items-center justify-center border-r px-3 py-3">
                            <Key className="size-5" />
                        </div>
                        <input
                            className="outline-none w-full"
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            autoComplete="current-password"
                            required
                        />
                        <div className="flex items-center justify-center border-l px-3 py-3">
                            <button
                                type="button"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                                aria-pressed={showPassword}
                                onClick={() => setShowPassword((v) => !v)}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <Button type="submit" className="w-full mt-5">
                Sign in
            </Button>
        </form>
    );
}