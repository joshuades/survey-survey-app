import Footer from "@/components/navigation/footer";
import GeneralNav from "@/components/navigation/general-nav";
import MainNavBox from "@/components/navigation/main-nav-box";
import Surveys from "@/components/navigation/surveys";
import SurveysNav from "@/components/navigation/surveys-nav";
import SurveysWrapper from "@/components/navigation/surveys-wrapper";
import ResultsHeader from "@/components/survey-results/results-header";
import ResultsList from "@/components/survey-results/results-list";
import { getFullSurveyById } from "@/db";

export default async function ResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const { survey } = await getFullSurveyById(Number(id));

  if (!survey) {
    console.error("Survey not found:", survey);
    return <div className="mx-auto mt-[20vh] w-fit text-3xl font-bold">Survey not found</div>;
  }

  return (
    <div className="grid min-h-screen grid-rows-[max-content] justify-center font-[family-name:var(--font-supreme)]">
      <div className="flex w-full max-w-[600px] flex-col gap-[90px] pt-[90px] xl:max-w-[800px]">
        <div className="flex flex-col gap-[45px]">
          <h1 className="w-max text-[calc(2rem_+_5vw)] font-extrabold">
            Survey <span className="uppercase">{survey.name}</span>
          </h1>
          <ResultsHeader survey={survey} />
          <ResultsList questions={survey.questions} />
        </div>

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
