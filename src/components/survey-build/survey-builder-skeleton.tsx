import { Skeleton } from "../ui/skeleton";

export default function SurveyBuilderSkeleton() {
  return (
    <div className="grid w-full gap-[60px]">
      <div className="grid gap-[15px] align-baseline">
        <Skeleton className="mx-2 h-[20px] w-[200px]" />
        <Skeleton className="mx-auto h-[60px] w-full max-w-[96vw] rounded-[2px] px-3 py-2" />
        <div className="mx-2 flex justify-between gap-3">
          <Skeleton className="h-4 w-[150px]" />
          <Skeleton className="h-4 w-[150px]" />
        </div>
      </div>
      <div className="mx-2 flex flex-col gap-[25px]">
        <Skeleton className="h-[48px] w-[60vw] lg:w-[250px]" />
        <Skeleton className="h-[48px] w-[200px]" />
        <Skeleton className="h-[48px] w-[90vw] lg:w-[450px]" />
      </div>
    </div>
  );
}
