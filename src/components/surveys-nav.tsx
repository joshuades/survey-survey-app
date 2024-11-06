"use client";

import { useStore } from "@/store/surveys";
import { useState } from "react";

const SurveysNav: React.FC = () => {
  const { selectedSurveyId, toggleSelectedSurveyId, removeSurvey } = useStore();
  const [disableNav, setDisableNav] = useState(false);

  type SurveyNavOptionType = {
    name: string;
    onClick: (surveyId: number) => void;
  };

  const surveyNavOptions: SurveyNavOptionType[] = [
    { name: "edit", onClick: () => console.log("edit") },
    { name: "results", onClick: () => console.log("results") },
    { name: "share", onClick: () => console.log("share") },
    {
      name: "del",
      onClick: (surveyId: number) => handleDelete(surveyId),
    },
  ];

  const handleDelete = async (id: number) => {
    setDisableNav(true);
    // delete in db
    const response = await fetch(`/api/surveys/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      // body: JSON.stringify({ id: id }),
    });
    const data = await response.json();
    if (response.ok) {
      // delete in state
      toggleSelectedSurveyId(id);
      removeSurvey(id); // same as data.survey[0].id
      setDisableNav(false);
      console.log("Survey deleted successfully:", data);
    } else {
      console.error("Failed to delete survey:", data);
    }
  };

  return (
    <ul className="flex gap-[15px] text-lg font-semibold uppercase">
      {selectedSurveyId &&
        surveyNavOptions.map((option) => (
          <button
            key={option.name}
            className="cursor-pointer uppercase"
            onClick={() => option.onClick(selectedSurveyId)}
            disabled={disableNav}
          >
            {option.name}
          </button>
        ))}
    </ul>
  );
};

export default SurveysNav;
