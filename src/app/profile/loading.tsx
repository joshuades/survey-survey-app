import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronsUpDown } from "lucide-react";

export default function Loading() {
  return (
    <>
      <div className="flex h-full min-h-screen flex-col items-center justify-center">
        <div className="w-full max-w-[300px]">
          <div className="relative flex h-[100svh] flex-col justify-between pt-[25vh]">
            <div>
              <h2 className="mb-7 text-4xl font-extrabold opacity-loading">Profile Settings</h2>
              <div className="w-full max-w-md space-y-8">
                <Skeleton className="h-[70px] space-y-2" />
                <Skeleton className="h-[110px] space-y-2" />
                <Skeleton className="h-[20px] space-y-6" />
              </div>
            </div>

            <div className="mt-8 pb-4 opacity-loading lg:pb-5">
              <Button variant="secondary">
                Advanced Settings <ChevronsUpDown />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
