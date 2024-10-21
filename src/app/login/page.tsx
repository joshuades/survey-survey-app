import LoginForm from "@/components/auth/LoginForm";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <div className="container mx-auto p-4">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
