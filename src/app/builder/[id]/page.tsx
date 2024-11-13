import MainHeadline from "@/components/main-headline";
import GeneralNav from "@/components/navigation/general-nav";
import MainNavBox from "@/components/navigation/main-nav-box";
import Surveys from "@/components/navigation/surveys";
import SurveysNav from "@/components/navigation/surveys-nav";
import SurveysWrapper from "@/components/navigation/surveys-wrapper";
import SurveyBuilder from "@/components/survey-build/survey-builder";
import { getSurvAndQuestById } from "@/db";

export default async function BuilderPage({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const { surveyAndQuestions } = await getSurvAndQuestById(Number(id));

  if (!surveyAndQuestions) {
    console.error("Survey not found:", surveyAndQuestions);
    return <div className="mx-auto mt-[20vh] w-fit text-3xl font-bold">Survey not found</div>;
  }
  return (
    <div className="flex min-h-screen flex-col items-center font-[family-name:var(--font-supreme)]">
      <div className="flex w-full max-w-[600px] flex-col gap-[90px] py-[90px] xl:max-w-[800px]">
        <MainHeadline>
          Survey <span className="uppercase">{surveyAndQuestions.survey.name}</span>
        </MainHeadline>

        <SurveyBuilder surveyAndQuestions={surveyAndQuestions} />

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
    </div>
  );
}
