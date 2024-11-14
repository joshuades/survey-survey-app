"use client";

import { submitUserForm } from "@/db/actions";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { Alert, AlertDescription } from "./ui/alert";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

interface UserData {
  name: string;
  email: string;
  image: string;
  thankYouMsg: string;
}

function ProfileForm({ userData }: { userData: UserData }) {
  const [userNameInput, setUsernameInput] = useState(userData.name);
  const [thankYouInput, setThankYouInput] = useState(userData.thankYouMsg);

  const initialState = { message: "", errors: {}, result: { name: "" } };
  const [state, dispatch] = useFormState(submitUserForm, initialState);
  const { data: session, update } = useSession();

  useEffect(() => {
    if (
      state.result?.name &&
      state.result?.name != "" &&
      state.result?.name != session?.user?.name
    ) {
      update({ user: { name: state.result?.name } });
    }
  }, [state.result]);

  return (
    <form action={dispatch} className="w-full max-w-md space-y-8">
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          name="username"
          required
          aria-describedby="username-error"
          value={userNameInput}
          placeholder={userData.name}
          onChange={(e) => setUsernameInput(e.target.value)}
        />
        {state.errors?.username && (
          <Alert variant="warning" id="username-error">
            <AlertDescription>{state.errors.username[0]}</AlertDescription>
          </Alert>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">&apos;Thank You&apos; Message</Label>
        <Textarea
          value={thankYouInput}
          placeholder={userData.thankYouMsg}
          onChange={(e) => setThankYouInput(e.target.value)}
          id="message"
          name="message"
          required
          aria-describedby="message-error"
        />
        {state.errors?.message && (
          <Alert variant={"warning"} id="message-error">
            <AlertDescription>{state.errors.message[0]}</AlertDescription>
          </Alert>
        )}
      </div>
      <div className="space-y-6">
        <div className="flex justify-between">
          <Button asChild>
            <Link href="/">Go Back</Link>
          </Button>
          {(userNameInput !== session?.user?.name || thankYouInput !== userData.thankYouMsg) && (
            <Button type="submit">Update</Button>
          )}
        </div>
        {state.message && (
          <Alert variant={state.errors ? "warning" : "text"} className="absolute w-fit">
            <AlertDescription>{state.message}</AlertDescription>
          </Alert>
        )}
      </div>
    </form>
  );
}

export default ProfileForm;
