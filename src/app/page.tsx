import GeneralNav from "@/components/general-nav";
import MainHeadline from "@/components/main-headline";
import MainNavBox from "@/components/main-nav-box";
import SurveyBuilder from "@/components/survey-builder";
import Surveys from "@/components/surveys";
import SurveysNav from "@/components/surveys-nav";
import SurveysWrapper from "@/components/surveys-wrapper";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center font-[family-name:var(--font-supreme)]">
      <div className="flex w-full max-w-[600px] flex-col gap-[90px] py-[90px] xl:max-w-[800px]">
        <MainHeadline>SurveySurvey</MainHeadline>

        <SurveyBuilder survey={{ survey: null, questions: [] }} />

        <MainNavBox>
          <SurveysWrapper>
            <Surveys surveys={[]} />
          </SurveysWrapper>

          <div className="grid grid-cols-2 gap-3 sm:justify-between">
            <SurveysNav />
            <GeneralNav />
          </div>
        </MainNavBox>
      </div>
    </div>
  );
}
