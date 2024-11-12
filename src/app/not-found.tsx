import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center font-[family-name:var(--font-supreme)]">
      <div className="grid min-h-screen w-full max-w-[600px] grid-rows-[auto,_max-content] xl:max-w-[700px]">
        <div className="flex h-full flex-col justify-center">
          <div className="text-center">
            <h2 className="mb-4 text-4xl font-extrabold">Page Not Found</h2>
            <p className="mb-[45px]">Could not find requested resource</p>
            <Button asChild>
              <Link href="/">Return Home</Link>
            </Button>
          </div>
        </div>
        {/* put footer info here */}
      </div>
    </div>
  );
}
