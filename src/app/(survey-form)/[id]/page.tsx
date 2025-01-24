import ErrorBlock from "@/components/error/error-block";
import { Button } from "@/components/ui/button";
import { getSurveyById } from "@/db";
import Link from "next/link";

export default async function AnswerSurveyPage({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  // TODO: fetch description as well
  const { survey } = await getSurveyById(Number(id), true);

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
      <h2 className="mb-4 text-4xl font-extrabold">
        Survey <span className="uppercase">{survey.name}</span>
      </h2>

      <p className="mb-[45px]">
        Survey created by {survey.creator.name}.{" "}
        {survey.updated_at && (
          <span>
            Last updated on {survey.updated_at.getDay()}.{" "}
            {survey.updated_at.toLocaleString("default", { month: "short" })}.
          </span>
        )}
      </p>
      <Button asChild>
        <Link href={`${id}/q/0`}>Start Survey</Link>
      </Button>
    </div>
  );
}
