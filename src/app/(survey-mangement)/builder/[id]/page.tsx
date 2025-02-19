import SurveyCreatedAlert from "@/components/alert/survey-created-alert";
import SurveyErrorBlock from "@/components/error/survey-error-block";
import MainHeadline from "@/components/main-headline";
import SurveyBuilder from "@/components/survey-build/survey-builder";
import { getSurvAndQuestById } from "@/db";

export default async function BuilderPage({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const { surveyAndQuestions, message } = await getSurvAndQuestById(Number(id));

  if (message !== "success") return SurveyErrorBlock({ message });

  return (
    <>
      <MainHeadline>
        Survey <span className="uppercase">{surveyAndQuestions!.survey.name}</span>
      </MainHeadline>

      <div>
        <SurveyBuilder surveyAndQuestions={surveyAndQuestions!} />
        <SurveyCreatedAlert survey={surveyAndQuestions!.survey} />
      </div>
    </>
  );
}
