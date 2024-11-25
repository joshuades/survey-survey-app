import ErrorBlock from "@/components/error-block";
import MainHeadline from "@/components/main-headline";
import Footer from "@/components/navigation/footer";
import GeneralNav from "@/components/navigation/general-nav";
import MainNavBox from "@/components/navigation/main-nav-box";
import Surveys from "@/components/navigation/surveys";
import SurveysNav from "@/components/navigation/surveys-nav";
import SurveysWrapper from "@/components/navigation/surveys-wrapper";
import SurveyBuilder from "@/components/survey-build/survey-builder";
import { Button } from "@/components/ui/button";
import { getSurvAndQuestById } from "@/db";
import Link from "next/link";

export default async function BuilderPage({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const { surveyAndQuestions } = await getSurvAndQuestById(Number(id));

  if (!surveyAndQuestions) {
    return (
      <div className="flex h-full min-h-screen flex-col items-center justify-center font-[family-name:var(--font-supreme)]">
        <ErrorBlock title="Survey not found" message="Could not find requested resource">
          <Button asChild>
            <Link href="/">Return Home</Link>
          </Button>
        </ErrorBlock>
      </div>
    );
  }
  return (
    <div className="grid min-h-screen grid-rows-[max-content] justify-center font-[family-name:var(--font-supreme)]">
      <div className="flex w-full max-w-[600px] flex-col gap-[90px] pt-[90px] xl:max-w-[800px]">
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
      <Footer />
    </div>
  );
}
