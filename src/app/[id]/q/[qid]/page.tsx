import { SurveyForm } from "@/components/survey-form/survey-form";
import { getSurveyById } from "@/db";

export default async function AnswerQuestionPage({
  params,
}: {
  params: Promise<{ id: string; qid: string }>;
}) {
  const surveyId = (await params).id;
  const questionId = (await params).qid;

  const { survey: surveyWithQuestions } = await getSurveyById(Number(surveyId));

  if (!surveyWithQuestions) {
    console.error("Survey not found:", surveyWithQuestions);
    return <div className="mx-auto w-fit text-3xl font-bold">Survey not found</div>;
  }
  const questions = surveyWithQuestions.questions;

  return (
    <div className="">
      <SurveyForm questionId={questionId} questions={questions} surveyId={surveyId} />
    </div>
  );
}
