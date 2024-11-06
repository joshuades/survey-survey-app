import CreateSurveyForm from "@/components/create-survey-form";
import MainNavBox from "@/components/main-nav-box";
import SurveyBuilder from "@/components/surveyBuilder";
import Surveys from "@/components/surveys";
import SurveysNav from "@/components/surveys-nav";
import SurveysWrapper from "@/components/surveys-wrapper";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center font-[family-name:var(--font-geist-sans)]">
      <div className="flex w-full max-w-screen-sm flex-col gap-11 py-10">
        <SurveyBuilder />

        <div className="surveys">
          <CreateSurveyForm />
        </div>

        <MainNavBox>
          <div className="grid grid-rows-2 gap-4 lg:grid-rows-[minmax(50px,_1fr)_auto]">
            <SurveysWrapper>
              <Surveys surveys={[]} />
            </SurveysWrapper>

            <div className="flex justify-between">
              <SurveysNav />
              <div className="text-lg font-semibold uppercase">MENU MENU</div>
            </div>
          </div>
        </MainNavBox>
      </div>
    </div>
  );
}
