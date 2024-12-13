import SurveyBuilderSkeleton from "@/components/survey-build/survey-builder-skeleton";

export default function Loading() {
  return (
    <>
      <h1 className="opacity-loading w-max text-[calc(2rem_+_5vw)] font-extrabold">
        Survey <span className="tracking-[-3px]">00000</span>
      </h1>
      <SurveyBuilderSkeleton />
    </>
  );
}
