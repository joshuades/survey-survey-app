import { auth } from "@/lib/auth";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";

const GeneralNav: React.FC = async () => {
  const session = await auth();

  return (
    <ul className="flex gap-4 sm:ms-auto">
      {session?.user && (
        <Button asChild>
          <Link href="/profile" className="">
            Profile
          </Link>
        </Button>
      )}
      <Button>Menu</Button>
    </ul>
  );
};

export default GeneralNav;
