import { auth } from "@/lib/auth";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import localFont from "next/font/local";
import "./globals.css";

const supreme = localFont({
  src: "./fonts/Supreme-Variable.ttf",
  variable: "--font-supreme",
  weight: "100 800",
});

export const metadata: Metadata = {
  title: "SurveySurvey",
  description: "SurveySurvey is your go-to survey platform",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  if (session?.user) {
    // TODO: Look into https://react.dev/reference/react/experimental_taintObjectReference
    session.user = {
      name: session.user.name,
      email: session.user.email,
      image: session.user.image,
    };
  }

  return (
    <html lang="en">
      <body className={`${supreme.className} text-[15px] text-custom-black antialiased`}>
        <SessionProvider basePath={"/auth"} session={session}>
          <div className="flex min-h-screen flex-col">
            <main className="flex-grow">{children}</main>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
