import ErrorBlock from "@/components/error-block";
import { Button } from "@/components/ui/button";
import { getSurveyById } from "@/db";
import Link from "next/link";

export default async function AnswerSurveyPage({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  // TODO: fetch user name and description as well
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
        This survey is about Lorem ipsum dolor sit amet consectetur adipisicing elit.
      </p>
      <Button asChild>
        <Link href={`${id}/q/0`}>Start Survey</Link>
      </Button>
    </div>
  );
}
