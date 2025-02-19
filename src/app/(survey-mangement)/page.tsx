import TutorialVideoAlert from "@/components/alert/tutorial-video-alert";
import MainHeadline from "@/components/main-headline";
import SurveyBuilder from "@/components/survey-build/survey-builder";
import { getVideoInfos } from "@/db";

export default async function Home() {
  const { videoInfos: videoInfosA, message } = await getVideoInfos("a");

  if (message !== "success" || videoInfosA == null) return null;

  return (
    <>
      <MainHeadline>SurveySurvey</MainHeadline>
      <div>
        <SurveyBuilder surveyAndQuestions={{ survey: null, questions: [] }} />
        <TutorialVideoAlert videoInfos={videoInfosA} />
      </div>
    </>
  );
}
