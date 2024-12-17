"use client";

import { submitUserForm } from "@/db/actions";
import { defaultThankYouMessage } from "@/lib/config";
import { useLoadingStore } from "@/store/loadingStore";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { Alert, AlertDescription } from "./ui/alert";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

interface ProfileData {
  name: string;
  email: string;
  image: string;
  thankYouMessage: string;
}

function ProfileForm({ profileData }: { profileData: ProfileData }) {
  const [userNameInput, setUsernameInput] = useState(profileData.name);
  const [thankYouInput, setThankYouInput] = useState(profileData.thankYouMessage);

  const initialState = { message: "", errors: {}, result: { name: "", thankYouMessage: "" } };
  const [state, dispatch] = useFormState(submitUserForm, initialState);
  const { data: session, update } = useSession();
  const { setIsRouting } = useLoadingStore();

  useEffect(() => {
    setIsRouting(false);
  }, []);

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
          placeholder={profileData.name}
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
          placeholder={defaultThankYouMessage}
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
          {(userNameInput !== session?.user?.name ||
            thankYouInput !== profileData.thankYouMessage) && <Button type="submit">Update</Button>}
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
