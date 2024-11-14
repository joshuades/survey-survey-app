import { SignIn } from "@/components/auth/auth-components";
import ProfileForm from "@/components/profile-form";
import { auth } from "@/lib/auth";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) return <SignIn />;

  const userData = {
    name: session.user.name ?? "",
    email: session.user.email ?? "",
    image: session.user.image ?? "",
    thankYouMsg: "Thank you for filling out my survey!",
  };

  return (
    <div className="flex h-full min-h-screen flex-col items-center justify-center font-[family-name:var(--font-supreme)]">
      <div className="w-full max-w-[300px] text-start">
        <h2 className="mb-7 text-4xl font-extrabold">Profile Settings</h2>
        {/* <p className="mb-[45px]">More options coming soon!</p> */}

        <ProfileForm userData={userData} />
      </div>
    </div>
  );
}
