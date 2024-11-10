import Link from "next/link";
import UserButton from "../auth/user-button";

export default async function Header() {
  return (
    <header className="sticky flex justify-center border-b">
      <div className="mx-auto flex h-16 w-full max-w-[600px] items-center justify-between px-2 xl:max-w-[800px]">
        <div className="flex items-center gap-[40px]">
          <Link href="/" className="text-2xl font-bold">
            SurveySurvey
          </Link>
        </div>
        <UserButton />
      </div>
    </header>
  );
}
