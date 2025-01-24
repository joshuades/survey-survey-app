import SurveyErrorBlock from "@/components/error/survey-error-block";
import ResultsHeader from "@/components/survey-results/results-header";
import ResultsList from "@/components/survey-results/results-list";
import { getFullSurveyById } from "@/db";

export default async function ResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const { survey, message } = await getFullSurveyById(Number(id));

  if (message !== "success") return SurveyErrorBlock({ message });

  return (
    <div className="flex flex-col gap-[45px]">
      <h1 className="w-max text-[calc(2rem_+_5vw)] font-extrabold">
        Survey <span className="uppercase">{survey!.name}</span>
      </h1>
      <ResultsHeader survey={survey!} />
      <ResultsList questions={survey!.questions} />
    </div>
  );
}
