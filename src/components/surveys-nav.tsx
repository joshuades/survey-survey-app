"use client";

import { checkForSurveyChanges } from "@/lib/utils";
import { useStore } from "@/store/surveys";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";

const SurveysNav: React.FC = () => {
  const { currentSurvey, selectedSurveyId, toggleSelectedSurveyId, removeSurvey, currentChanges } =
    useStore();
  const router = useRouter();
  const [disableNav, setDisableNav] = useState(false);

  type SurveyNavOptionType = {
    name: string;
    onClick: (surveyId: number) => void;
  };

  const handleEdit = () => {
    if (checkForSurveyChanges(currentSurvey, currentChanges)) {
      if (confirm("Are you sure you don't want to save your changes?")) {
        router.push(`/builder/${selectedSurveyId}`, { scroll: true });
      }
    } else {
      router.push(`/builder/${selectedSurveyId}`, { scroll: true });
    }
  };

  const surveyNavOptions: SurveyNavOptionType[] = [
    { name: "edit", onClick: () => handleEdit() },
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

    if (!response.ok) {
      console.error("Failed to delete survey, check api response: ", response);
      return;
    }

    const data = await response.json();
    if (response.ok) {
      // delete in state
      toggleSelectedSurveyId(id);
      removeSurvey(id); // same as data.survey[0].id
      setDisableNav(false);
    } else {
      console.error("Failed to delete survey:", data);
    }
  };

  return (
    <ul className="flex gap-[15px] text-lg font-semibold uppercase">
      {selectedSurveyId &&
        surveyNavOptions.map((option) => (
          <Button
            key={option.name}
            onClick={() => option.onClick(selectedSurveyId)}
            disabled={disableNav}
          >
            {option.name}
          </Button>
        ))}
    </ul>
  );
};

export default SurveysNav;
