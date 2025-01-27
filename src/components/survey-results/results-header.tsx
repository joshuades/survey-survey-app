import { SurveyFull } from "@/db";
import { makeDateString } from "@/lib/utils";

export default function ResultsHeader({ survey }: { survey: SurveyFull }) {
  const answererCount = survey.questions.reduce(
    (acc, q) => (q.answers.length > acc ? q.answers.length : acc),
    0
  );

  return (
    <div className="flex flex-col gap-[30px]">
      <ul className="mx-2 flex gap-[20px]">
        <li className="flex gap-[8px]">
          <span>Created</span>
          <span>{makeDateString(survey.created_at)}</span>
        </li>
        {survey.updated_at && (
          <li className="flex gap-[8px]">
            <span>Last Update</span>
            <span>{makeDateString(survey.updated_at)}</span>
          </li>
        )}
      </ul>

      <ul className="mx-2 flex gap-[15px]">
        <li className="h-fit w-fit rounded-xl border-[1px] border-custom-black bg-custom-black px-3 text-custom-secondaryBg">
          {survey.questions.length} questions
        </li>
        <li className="h-fit w-fit rounded-xl border-[1px] border-custom-black px-3">
          {answererCount == 0
            ? "No answers yet"
            : answererCount == 1
              ? "1 person answered"
              : `${answererCount} people answered`}
        </li>
      </ul>
    </div>
  );
}
