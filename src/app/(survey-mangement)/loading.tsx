import SurveyBuilderSkeleton from "@/components/survey-build/survey-builder-skeleton";

export default function Loading() {
  return (
    <>
      <h1 className="opacity-loading w-max text-[calc(2rem_+_5vw)] font-extrabold">SurveySurvey</h1>
      <SurveyBuilderSkeleton />
    </>
  );
}
