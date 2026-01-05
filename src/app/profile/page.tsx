import { SignIn } from "@/components/auth/auth-components";
import ErrorBlock from "@/components/error/error-block";
import FadeInWrapper from "@/components/fade-in-wrapper";
import ProfileForm from "@/components/profile-form";
import UserDeleteButton from "@/components/survey-build/user-delete-button";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { getUserSettings } from "@/db";
import { auth } from "@/lib/auth";
import { ChevronsUpDown } from "lucide-react";

export default async function ProfilePage() {
  const session = await auth();
  const profileSettings = await getUserSettings();

  if (!session?.user)
    return (
      <div className="pb-[5vh] pt-[15vh]">
        <ErrorBlock title="Unauthenticated" message="You need to be signed in to view this page">
          <SignIn />
        </ErrorBlock>
      </div>
    );

  const profileData = {
    name: session.user.name ?? "",
    email: session.user.email ?? "",
    image: session.user.image ?? "",
    thankYouMessage: profileSettings?.settings?.thankYouMessage ?? "", // Thank you for filling out my survey!
  };

  return (
    <div className="flex min-h-screen flex-col items-center">
      <div className="w-full max-w-[300px]">
        <div className="relative flex h-[100svh] flex-col justify-between pt-[25vh]">
          <FadeInWrapper>
            <h2 className="mb-7 text-4xl font-extrabold">Profile Settings</h2>
            <ProfileForm profileData={profileData} />
          </FadeInWrapper>
          <Collapsible className="mt-16 pb-4 lg:mt-8 lg:pb-5">
            <FadeInWrapper>
              <CollapsibleTrigger asChild className="data-[state=open]:">
                <Button variant="secondary">
                  Advanced Settings <ChevronsUpDown />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-3">
                <UserDeleteButton />
              </CollapsibleContent>
            </FadeInWrapper>
          </Collapsible>
        </div>
      </div>
    </div>
  );
}
