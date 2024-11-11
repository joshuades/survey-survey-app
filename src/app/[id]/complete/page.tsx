import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CompletePage() {
  return (
    <div className="text-center">
      <h2 className="mb-4 text-4xl font-extrabold">Survey Completed</h2>
      <p className="mb-[45px]">Thank you for completing the survey!</p>
      <Button asChild>
        <Link href="/">Create my own survey</Link>
      </Button>
    </div>
  );
}
