import MainHeadline from "@/components/main-headline";
import GeneralNav from "@/components/navigation/general-nav";
import MainNavBox from "@/components/navigation/main-nav-box";
import Surveys from "@/components/navigation/surveys";
import SurveysNav from "@/components/navigation/surveys-nav";
import SurveysWrapper from "@/components/navigation/surveys-wrapper";
import SurveyBuilder from "@/components/survey-build/survey-builder";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center font-[family-name:var(--font-supreme)]">
      <div className="flex w-full max-w-[600px] flex-col gap-[90px] py-[90px] xl:max-w-[800px]">
        <MainHeadline>SurveySurvey</MainHeadline>

        <SurveyBuilder surveyAndQuestions={{ survey: null, questions: [] }} />

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
