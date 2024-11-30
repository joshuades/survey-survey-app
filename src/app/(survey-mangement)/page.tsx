import MainHeadline from "@/components/main-headline";
import SurveyBuilder from "@/components/survey-build/survey-builder";

export default function Home() {
  return (
    <>
      <MainHeadline>SurveySurvey</MainHeadline>
      <SurveyBuilder surveyAndQuestions={{ survey: null, questions: [] }} />
    </>
  );
}
