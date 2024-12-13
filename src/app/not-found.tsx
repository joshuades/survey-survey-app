import ErrorBlock from "@/components/error-block";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center">
      <div className="grid min-h-screen w-full max-w-[600px] grid-rows-[auto,_max-content] xl:max-w-[700px]">
        <div className="flex h-full flex-col justify-center">
          <ErrorBlock title="Page Not Found" message="Could not find requested resource">
            <Button asChild>
              <Link href="/">Return Home</Link>
            </Button>
          </ErrorBlock>
        </div>
        {/* put footer info here */}
      </div>
    </div>
  );
}
