"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function UserButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="h-8 w-20 animate-pulse rounded-lg bg-muted" />
    );
  }

  if (!session?.user) {
    return (
      <div className="flex gap-2">
        <Button variant="ghost" size="sm" render={<Link href="/login" />}>
          Sign In
        </Button>
        <Button size="sm" render={<Link href="/register" />}>
          Sign Up
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-muted-foreground">
        {session.user.name ?? session.user.email}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => signOut({ callbackUrl: "/" })}
      >
        Sign Out
      </Button>
    </div>
  );
}
