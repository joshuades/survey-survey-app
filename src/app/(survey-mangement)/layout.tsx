import Footer from "@/components/navigation/footer";
import GeneralNav from "@/components/navigation/general-nav";
import MainNavBox from "@/components/navigation/main-nav-box";
import Surveys from "@/components/navigation/surveys";
import SurveysNav from "@/components/navigation/surveys-nav";
import SurveysWrapper from "@/components/navigation/surveys-wrapper";
import React from "react";

export default async function SurveyManagementLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="grid min-h-screen grid-rows-[max-content] justify-center font-[family-name:var(--font-supreme)]">
      <div className="flex w-full max-w-[600px] flex-col gap-[90px] pt-[90px] xl:max-w-[800px]">
        {children}

        <MainNavBox>
          <SurveysWrapper>
            <Surveys surveys={[]} />
          </SurveysWrapper>

          <div className="grid grid-cols-1 justify-between gap-7 sm:grid-cols-2 md:gap-5">
            <SurveysNav />
            <GeneralNav />
          </div>
        </MainNavBox>
      </div>
      <Footer />
    </div>
  );
}
