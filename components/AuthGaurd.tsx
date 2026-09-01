"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth";

export default function AuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const { checkAuth, checkingAuth, authUser } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!checkingAuth && !authUser && pathname !== "/auth/login") {
      router.replace("/auth/login");
    }
  }, [checkingAuth, authUser, pathname, router]);

  if (checkingAuth) {
    return null;
  }

  return children;
}