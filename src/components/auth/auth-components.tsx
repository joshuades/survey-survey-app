"use client";

import { signIn, signOut } from "next-auth/react";
import { Button } from "../ui/button";

export function SignIn({
  provider,
  ...props
}: { provider?: string } & React.ComponentPropsWithRef<typeof Button>) {
  return (
    <Button {...props} onClick={async () => await signIn(provider)}>
      Sign in
    </Button>
  );
}
export function SignOut({
  callbackUrl,
  ...props
}: { callbackUrl?: string } & React.ComponentPropsWithRef<typeof Button>) {
  return (
    <Button onClick={async () => await signOut({ redirect: true, callbackUrl })} {...props}>
      Sign out
    </Button>
  );
}
