import type { FullQuestion } from "@/db";
import AnswerItem from "./answer-item";
import QuestionItem from "./question-item";

function ResultsList({ questions }: { questions: FullQuestion[] }) {
  const sortedQuestions = questions?.sort((a, b) => {
    // Primary sort by index ascending
    const primaryComparison = a.index - b.index;
    if (primaryComparison !== 0) {
      return primaryComparison;
    }
    // If indexes are the same, sort by created_at
    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();

    return dateA - dateB;
  });

  return (
    <ul className="mx-2 flex flex-col gap-[40px]">
      {sortedQuestions.map((question, i) => (
        <QuestionItem question={question} i={i} key={new Date(question.created_at).getTime() + i}>
          <ul className="flex flex-col gap-[10px] p-[25px_15px_0px_50px]">
            {question.answers.length > 0 ? (
              question.answers.map((answer, j) => (
                <AnswerItem answer={answer} key={new Date(answer.created_at).getTime() + j} />
              ))
            ) : (
              <li className="font-light italic">No answers yet</li>
            )}
          </ul>
        </QuestionItem>
      ))}
    </ul>
  );
}

export default ResultsList;
