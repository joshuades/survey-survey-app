import { getSurveys } from "@/db";

export default async function Surveys() {
  const { surveys, message } = await getSurveys();

  if (message === "unauthenticated") {
    return <p>Sign up to see all Surveys.</p>;
  }

  return (
    <div>
      <h2 className="mb-3 text-2xl font-semibold">My Surveys</h2>
      <ul className="grid grid-cols-3 gap-2">
        {Object.values(surveys)?.map(({ survey, questions }) => (
          <li key={survey.id}>
            <h4 className="font-semibold">{survey.name}</h4>
            <ul>
              {questions.map((q) => {
                return <li key={q.id}>{q.questionText}</li>;
              })}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
