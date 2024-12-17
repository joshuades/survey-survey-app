import { auth } from "@/lib/auth";
import Link from "next/link";
import React from "react";
import UserButton from "../auth/user-button";
import { Button } from "../ui/button";

const GeneralNav: React.FC = async () => {
  const session = await auth();
  return (
    <ul className="flex flex-wrap-reverse justify-end gap-5 sm:ms-auto">
      <Button asChild>
        <Link href="/">Home</Link>
      </Button>

      {session?.user && (
        <Button asChild activateIsRouting>
          <Link href="/profile">Profile</Link>
        </Button>
      )}
      <UserButton />
    </ul>
  );
};

export default GeneralNav;
