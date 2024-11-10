"use client";

import { Survey } from "@/db";
import { useStore } from "@/store/surveys";
import { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";

type SurveysProps = {
  surveys: Survey[];
};

const Surveys: React.FC<SurveysProps> = ({ surveys = [] }) => {
  const { allSurveys, setAllSurveys } = useStore();
  const [isLoading, setIsLoading] = useState(true);

  const { selectedSurveyId, toggleSelectedSurveyId } = useStore();

  useEffect(() => {
    toggleSelectedSurveyId(null);
    setAllSurveys(surveys);
    setIsLoading(false);
  }, []);

  return (
    <ul className="flex flex-wrap content-start gap-x-[15px] gap-y-[10px]">
      {!isLoading ? (
        allSurveys?.map((survey) => (
          <li
            key={survey.id}
            onClick={() => toggleSelectedSurveyId(survey.id)}
            style={{
              backgroundColor: selectedSurveyId === survey.id ? "#313131" : "transparent",
              color: selectedSurveyId === survey.id ? "white" : "#313131",
            }}
            className="border-custom-black h-fit cursor-pointer rounded-[var(--custom-border-radius)] border-[1px] px-2"
          >
            Survey <span className="uppercase">{survey.name}</span>
          </li>
        ))
      ) : (
        <div className="flex flex-wrap content-start gap-x-[15px] gap-y-[10px]">
          <Skeleton className="bg-custom-secondaryBg-skeleton h-[22px] w-[110px]" />
          <Skeleton className="bg-custom-secondaryBg-skeleton h-[22px] w-[110px]" />
          <Skeleton className="bg-custom-secondaryBg-skeleton h-[22px] w-[110px]" />
          <Skeleton className="bg-custom-secondaryBg-skeleton h-[22px] w-[110px]" />
        </div>
      )}
    </ul>
  );
};

export default Surveys;
