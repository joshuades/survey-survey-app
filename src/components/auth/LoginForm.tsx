"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useAuth } from "./AuthContext";

export default function LoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, isLoading } = useAuth();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirectUrl");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const success = await login(password, redirectUrl || "/");
    if (!success) {
      setError("Invalid password");
    }
  };

  return (
    <Card className="mx-auto mt-8 w-full max-w-md">
      <CardHeader>
        <CardTitle>Login</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
            disabled={isLoading}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Login"
            )}
          </Button>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </form>
      </CardContent>
    </Card>
  );
}
