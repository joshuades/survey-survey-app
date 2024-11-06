"use client";

import { Survey } from "@/db";
import { useStore } from "@/store/surveys";
import { useEffect, useState } from "react";

type SurveysProps = {
  surveys: Survey[];
};

const Surveys: React.FC<SurveysProps> = ({ surveys = [] }) => {
  const { allSurveys, setAllSurveys } = useStore();
  const [isLoading, setIsLoading] = useState(true);

  const { selectedSurveyId, toggleSelectedSurveyId } = useStore();

  useEffect(() => {
    setAllSurveys(surveys);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    console.log("allSurveys", allSurveys);
  }, [allSurveys]);

  return (
    <ul className="flex gap-[15px]">
      {!isLoading ? (
        allSurveys?.map((survey) => (
          <li
            key={survey.id}
            onClick={() => toggleSelectedSurveyId(survey.id)}
            style={{
              backgroundColor: selectedSurveyId === survey.id ? "lightblue" : "white",
            }}
            className="cursor-pointer"
          >
            Survey <span className="uppercase">{survey.name}</span>
          </li>
        ))
      ) : (
        <li>loading...</li>
      )}
    </ul>
  );
};

export default Surveys;
