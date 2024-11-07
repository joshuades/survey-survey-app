import Link from "next/link";
import UserButton from "../auth/user-button";

export default async function Header() {
  return (
    <header className="sticky flex justify-center border-b">
      <div className="mx-auto flex h-16 w-full max-w-3xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-[40px]">
          <Link href="/" className="text-2xl font-bold">
            Survey
          </Link>
        </div>
        <UserButton />
      </div>
    </header>
  );
}
