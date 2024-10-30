"use client";

import SessionData from "@/components/session-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";
import { useState } from "react";

const UpdateForm = () => {
  const { data: session, update } = useSession();
  const [name, setName] = useState(`New ${session?.user?.name}`);

  if (!session?.user) return null;
  return (
    <>
      <h2 className="text-xl font-bold">Updating the session client-side</h2>
      <div className="flex w-full max-w-sm items-center space-x-2">
        <Input
          type="text"
          placeholder="New name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <Button onClick={() => update({ user: { name } })} type="submit">
          Update
        </Button>
      </div>
    </>
  );
};

export default function ProfilePage() {
  const { data: session, status } = useSession();

  return (
    <div className="mx-auto mt-4 flex max-w-screen-sm flex-col">
      {status === "loading" ? <div>Loading...</div> : <SessionData session={session} />}
      <UpdateForm />
    </div>
  );
}
