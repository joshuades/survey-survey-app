import ErrorBlock from "@/components/error-block";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CompletePage() {
  return (
    <ErrorBlock title="Survey Completed" message="Thank you for completing the survey!">
      <Button asChild>
        <Link href="/">Create my own survey</Link>
      </Button>
    </ErrorBlock>
  );
}
