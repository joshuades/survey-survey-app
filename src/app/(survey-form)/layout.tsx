import React from "react";

export default async function SurveyFormLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-full min-h-screen flex-col items-center justify-center font-[family-name:var(--font-supreme)]">
      {children}
    </div>
  );
}
