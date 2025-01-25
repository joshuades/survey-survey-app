import { SignIn } from "@/components/auth/auth-components";
import ErrorBlock from "@/components/error/error-block";
import FadeInWrapper from "@/components/fade-in-wrapper";
import ProfileForm from "@/components/profile-form";
import { getUserSettings } from "@/db";
import { auth } from "@/lib/auth";

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
    <div className="flex h-full min-h-screen flex-col items-center justify-center">
      <div className="w-full max-w-[300px] text-start">
        <FadeInWrapper>
          <h2 className="mb-7 text-4xl font-extrabold">Profile Settings</h2>
          <ProfileForm profileData={profileData} />
        </FadeInWrapper>
      </div>
    </div>
  );
}
