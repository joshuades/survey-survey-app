import AnswererForm from "@/components/survey-form/answerer-form";
import React from "react";

export default async function SurveySubLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col items-center font-[family-name:var(--font-supreme)]">
      <div className="grid min-h-screen w-full max-w-[600px] grid-rows-[auto,_max-content] xl:max-w-[700px]">
        <div className="flex h-full flex-col justify-center">{children}</div>
        <AnswererForm />
      </div>
    </div>
  );
}
