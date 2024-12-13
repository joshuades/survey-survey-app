import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
      <div className="flex h-full min-h-screen flex-col items-center justify-center">
        <div className="w-full max-w-[300px] text-start">
          <h2 className="opacity-loading mb-7 text-4xl font-extrabold">Profile Settings</h2>
          <div className="w-full max-w-md space-y-8">
            <Skeleton className="h-[70px] space-y-2" />
            <Skeleton className="h-[110px] space-y-2" />
            <Skeleton className="h-[20px] space-y-6" />
          </div>
        </div>
      </div>
    </>
  );
}
