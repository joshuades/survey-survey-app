import ErrorBlock from "@/components/error-block";
import MainHeadline from "@/components/main-headline";
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
    <>
      <MainHeadline>
        Survey <span className="uppercase">{surveyAndQuestions.survey.name}</span>
      </MainHeadline>

      <SurveyBuilder surveyAndQuestions={surveyAndQuestions} />
    </>
  );
}
