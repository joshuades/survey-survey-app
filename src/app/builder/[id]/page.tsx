import GeneralNav from "@/components/general-nav";
import MainHeadline from "@/components/main-headline";
import MainNavBox from "@/components/main-nav-box";
import SurveyBuilder from "@/components/survey-builder";
import Surveys from "@/components/surveys";
import SurveysNav from "@/components/surveys-nav";
import SurveysWrapper from "@/components/surveys-wrapper";
import { getSurveyById } from "@/db";

export default async function BuilderPage({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const { survey: surveyWithQuestions } = await getSurveyById(Number(id));

  if (!surveyWithQuestions) {
    console.error("Survey not found:", surveyWithQuestions);
    return <div className="mx-auto mt-[20vh] w-fit text-3xl font-bold">Survey not found</div>;
  }
  const survey = surveyWithQuestions.survey;

  return (
    <div className="flex min-h-screen flex-col items-center font-[family-name:var(--font-supreme)]">
      <div className="flex w-full max-w-[600px] flex-col gap-[90px] py-[90px] xl:max-w-[800px]">
        <MainHeadline>
          Survey <span className="uppercase">{survey.name}</span>
        </MainHeadline>

        <SurveyBuilder survey={surveyWithQuestions} />

        <MainNavBox>
          <SurveysWrapper>
            <Surveys surveys={[]} />
          </SurveysWrapper>

          <div className="grid justify-between gap-3 sm:grid-cols-2">
            <SurveysNav />
            <GeneralNav />
          </div>
        </MainNavBox>
      </div>
    </div>
  );
}
