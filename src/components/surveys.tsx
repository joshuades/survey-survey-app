import { getSurveys } from "@/db";

export default async function Surveys() {
  const { surveys, message } = await getSurveys();

  if (message === "unauthenticated") {
    return <p>Unauthenticated, please Sign in.</p>;
  }

  return (
    <div>
      <h2 className="mb-2 text-2xl font-bold">Surveys</h2>
      <ul className="">
        {surveys?.map((survey) => (
          <li key={survey.id} className="">
            {survey.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
