import { signIn, signOut } from "@/lib/auth";
import { Button } from "../ui/button";

export function SignIn({
  provider,
  ...props
}: { provider?: string } & React.ComponentPropsWithRef<typeof Button>) {
  return (
    <form
      action={async () => {
        "use server";
        await signIn(provider);
      }}
      className="flex"
    >
      <Button {...props}>Sign In</Button>
    </form>
  );
}

export function SignOut(props: React.ComponentPropsWithRef<typeof Button>) {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/", redirect: true });
      }}
      className="w-full"
    >
      <Button variant={"secondary"} className="w-full p-0" {...props}>
        Sign Out
      </Button>
    </form>
  );
}
