"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/auth-context";

/**
 * Client-side route guard. It improves UX but is NOT real security:
 * anyone can bypass client code, so a production app must also enforce
 * access on the server.
 */
export function RequireAuth({
  children,
  reason,
}: {
  children: React.ReactNode;
  reason?: "checkout";
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const hadUser = useRef(false);

  useEffect(() => {
    if (user) {
      hadUser.current = true;
      return;
    }
    // If the user just logged out, the page that logged them out handles navigation.
    if (!isLoading && !hadUser.current) {
      const params = new URLSearchParams({ redirect: pathname });
      if (reason) params.set("reason", reason);
      router.replace(`/login?${params.toString()}`);
    }
  }, [user, isLoading, pathname, reason, router]);

  if (isLoading || !user) {
    return (
      <div className="space-y-4" aria-busy="true" aria-label="Loading">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  return <>{children}</>;
}