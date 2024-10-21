"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "../auth/AuthContext";
import { Loader2 } from "lucide-react";

export default function Header() {
  const { isAuthenticated, isLoading, logout } = useAuth();

  return (
    <header>
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link href="/" className="text-2xl font-bold">
          Survey
        </Link>
        <nav>
          {isLoading ? (
            <Button variant="outline" disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading
            </Button>
          ) : isAuthenticated ? (
            <Button variant="outline" onClick={logout}>
              Logout
            </Button>
          ) : (
            <Link href="/login" passHref>
              <Button variant="outline">Login</Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
