"use client";

import { signOut, useSession } from "next-auth/react";
import { FunctionComponent, useState } from "react";
import { Alert, AlertDescription } from "../ui/alert";
import { Button } from "../ui/button";

const UserDeleteButton: FunctionComponent = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();

  const tryDeleteAccountInDb = async (userId: string | undefined) => {
    if (!userId) return;

    try {
      const response = await fetch("/api/users", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });
      const data = await response.json();

      if (!response.ok) {
        console.error("Failed to delete account, check api response: ", data);
        setErrorMessage("ERROR: " + data.error);
        return;
      }

      if (response.ok) {
        // Account deleted successfully, sign out the user
        signOut({ redirect: true, callbackUrl: "/" });
        return;
      }
    } catch (error) {
      console.error("Caught error while deleting account:", error);
      setErrorMessage(
        "An unexpected error occurred while deleting the account. Please try again later."
      );
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (confirmed) {
      setIsLoading(true);
      tryDeleteAccountInDb(session?.user?.id);
      setIsLoading(false);
      return;
    }
  };

  return (
    <>
      <Button variant="default" onClick={() => handleDeleteAccount()} disabled={isLoading}>
        Delete My Account
      </Button>
      <Alert variant={"destructive"} className="mt-2">
        <AlertDescription>errorMessage</AlertDescription>
      </Alert>
      {errorMessage && (
        <Alert variant={"destructive"} className="mt-4">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default UserDeleteButton;
