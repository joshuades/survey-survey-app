"use client";

import { checkForSurveyChanges } from "@/lib/utils";
import { useStore } from "@/store/surveys";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";

const SurveysNav: React.FC = () => {
  const { currentSurvey, selectedSurveyId, toggleSelectedSurveyId, removeSurvey, currentChanges } =
    useStore();
  const router = useRouter();
  const [disableNav, setDisableNav] = useState(false);

  type SurveyNavOptionType = {
    name: string;
    onClick: (surveyId: number) => void;
    disabled?: boolean;
  };

  const surveyNavOptions: SurveyNavOptionType[] = [
    {
      name: "edit",
      onClick: () => confirmedRouteTo(`/builder/${selectedSurveyId}`),
      disabled: currentSurvey?.survey?.id === selectedSurveyId,
    },
    { name: "results", onClick: () => console.log("results"), disabled: false },
    { name: "share", onClick: () => console.log("share"), disabled: false },
    {
      name: "del",
      onClick: (surveyId: number) => handleDelete(surveyId),
    },
  ];

  const handleDelete = async (id: number) => {
    setDisableNav(true);
    const response = await fetch(`/api/surveys/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
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

  const confirmedRouteTo = (path: string) => {
    if (checkForSurveyChanges(currentSurvey?.survey?.id || null, currentChanges)) {
      if (confirm("Are you sure you don't want to save your changes?")) {
        router.push(path, { scroll: true });
      }
    } else {
      router.push(path, { scroll: true });
    }
  };

  return (
    <ul className="flex flex-wrap gap-5 text-lg font-semibold uppercase md:flex-nowrap">
      {selectedSurveyId &&
        surveyNavOptions.map((option) => (
          <Button
            key={option.name}
            onClick={() => option.onClick(selectedSurveyId)}
            disabled={disableNav || option.disabled}
          >
            {option.name}
          </Button>
        ))}
    </ul>
  );
};

export default SurveysNav;