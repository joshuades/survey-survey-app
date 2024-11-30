import { SurveyForm } from "@/components/survey-form/survey-form";
import { getSurveyById } from "@/db";

export default async function AnswerQuestionPage({
  params,
}: {
  params: Promise<{ id: string; qid: string }>;
}) {
  const surveyId = (await params).id;
  const questionId = (await params).qid;

  const { survey } = await getSurveyById(Number(surveyId), true);

  if (!survey) {
    console.error("Survey not found:", survey);
    return <div className="mx-auto w-fit text-3xl font-bold">Survey not found</div>;
  }
  const questions = survey.questions;

  const minfiedSurvey = {
    id: surveyId,
    name: survey.name,
  };

  return <SurveyForm questionId={questionId} questions={questions} survey={minfiedSurvey} />;
}
