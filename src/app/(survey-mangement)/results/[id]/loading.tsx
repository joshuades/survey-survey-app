import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-[45px]">
      <h1 className="opacity-loading w-max text-[calc(2rem_+_5vw)] font-extrabold">
        Survey <span className="tracking-[-3px]">00000</span>
      </h1>

      <div className="flex flex-col gap-[30px]">
        <Skeleton className="mx-2 h-[20px] w-[180px]" />

        <div className="mx-2 flex gap-[15px]">
          <Skeleton className="h-[20px] w-[120px] rounded-xl" />
          <Skeleton className="h-[20px] w-[120px] rounded-xl" />
        </div>
      </div>

      <div className="mx-2 flex flex-col gap-[40px]">
        <Skeleton className="h-[48px] w-[90vw] lg:w-[450px]" />
        <Skeleton className="h-[48px] w-[80vw] lg:w-[400px]" />
        <Skeleton className="h-[48px] w-[60vw] lg:w-[250px]" />
        <Skeleton className="h-[48px] w-[90vw] lg:w-[450px]" />
        <Skeleton className="h-[48px] w-[80vw] lg:w-[400px]" />
      </div>
    </div>
  );
}
