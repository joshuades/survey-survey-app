import ErrorBlock from "@/components/error/error-block";
import { Button } from "@/components/ui/button";
import { getSurveyById } from "@/db";
import { defaultThankYouMessage } from "@/lib/config";
import Link from "next/link";

export default async function CompletePage({ params }: { params: Promise<{ id: string }> }) {
  const accessLinkId = (await params).id;
  const { survey } = await getSurveyById(accessLinkId, true, true);

  const thankYouMessage = survey?.creator?.thankYouMessage || defaultThankYouMessage;
  return (
    <ErrorBlock title="Survey Completed" message={thankYouMessage}>
      <Button asChild>
        <Link href="/">Create my own survey</Link>
      </Button>
    </ErrorBlock>
  );
}
