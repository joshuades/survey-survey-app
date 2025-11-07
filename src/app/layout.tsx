import { auth } from "@/lib/auth";
import * as Sentry from "@sentry/nextjs";
import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import localFont from "next/font/local";
import "./globals.css";

const supreme = localFont({
  src: "./fonts/Supreme-Variable.ttf",
  variable: "--font-supreme",
  weight: "100 800",
  fallback: ["system-ui", "arial"],
  display: "swap",
  adjustFontFallback: false,
});

export function generateMetadata(): Metadata {
  return {
    title: "SurveySurvey",
    description: "SurveySurvey is your go-to survey platform for all your special survey needs.",
    other: {
      ...Sentry.getTraceData(),
    },
  };
}

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
      <head>
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={`${supreme.className} text-[15px] text-custom-black antialiased`}>
        <SessionProvider basePath={"/auth"} session={session}>
          <div className="flex min-h-screen flex-col">
            <main className="flex-grow">{children}</main>
          </div>
        </SessionProvider>
        <Analytics />
      </body>
    </html>
  );
}
