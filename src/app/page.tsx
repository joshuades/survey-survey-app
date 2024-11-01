import CreateSurveyForm from "@/components/create-survey-form";
import SurveyBuilder from "@/components/surveyBuilder";
import Surveys from "@/components/surveys";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center font-[family-name:var(--font-geist-sans)]">
      <div className="flex w-full max-w-screen-sm flex-col gap-11 py-10">
        <SurveyBuilder />

        <div className="surveys">
          <h1 className="mb-3 text-2xl font-bold">Create Survey</h1>
          <CreateSurveyForm />
        </div>

        <Surveys />
      </div>
    </div>
  );
}
