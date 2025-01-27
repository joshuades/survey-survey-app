import ErrorBlock from "@/components/error/error-block";
import { Button } from "@/components/ui/button";
import { getSurveyById } from "@/db";
import { makeDateString } from "@/lib/utils";
import Link from "next/link";

export default async function AnswerSurveyPage({ params }: { params: Promise<{ id: string }> }) {
  const accessLinkId = (await params).id;
  const { survey } = await getSurveyById(accessLinkId, true, true);

  if (!survey) {
    return (
      <ErrorBlock title="Survey not found" message="Could not find requested resource">
        <Button asChild>
          <Link href="/">Return Home</Link>
        </Button>
      </ErrorBlock>
    );
  }

  return (
    <div className="text-center">
      <h2 className="mb-8 text-4xl font-extrabold md:mb-4">
        Survey <span className="uppercase">{survey.name}</span>
      </h2>

      <p className="mb-[45px] flex flex-col gap-x-[50px] gap-y-[10px] md:flex-row">
        <span>Survey created by {survey.creator.name}.</span>
        {survey.updated_at && <span>Last updated on {makeDateString(survey.updated_at)}.</span>}
      </p>
      <Button asChild>
        <Link href={`${accessLinkId}/q/0`}>Start Survey</Link>
      </Button>
    </div>
  );
}
