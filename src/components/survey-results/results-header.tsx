import { SurveyFull } from "@/db";

export default function ResultsHeader({ survey }: { survey: SurveyFull }) {
  const answererCount = survey.questions.reduce(
    (acc, q) => (q.answers.length > acc ? q.answers.length : acc),
    0
  );

  return (
    <div className="flex flex-col gap-[30px]">
      <ul className="mx-2 flex gap-[15px]">
        <li>
          Created {survey.created_at.getDay()}.{" "}
          {survey.created_at.toLocaleString("default", { month: "short" })}
        </li>
        {survey.updated_at && (
          <li>
            Updated {survey.updated_at.getDay()}.{" "}
            {survey.updated_at.toLocaleString("default", { month: "short" })}
          </li>
        )}
      </ul>

      <ul className="mx-2 flex gap-[15px]">
        <li className="h-fit w-fit cursor-pointer rounded-xl border-[1px] border-custom-black bg-custom-black px-3 text-custom-secondaryBg">
          {survey.questions.length} questions
        </li>
        <li className="h-fit w-fit cursor-pointer rounded-xl border-[1px] border-custom-black px-3">
          {answererCount} people answered
        </li>
      </ul>
    </div>
  );
}
