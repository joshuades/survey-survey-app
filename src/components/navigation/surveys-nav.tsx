"use client";

import { checkForSurveyChanges } from "@/lib/utils";
import { useStore } from "@/store/surveysStore";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import SurveyShareDrawer from "./survey-share-drawer";

const SurveysNav: React.FC = () => {
  const { currentSurvey, selectedSurveyId, toggleSelectedSurveyId, removeSurvey, currentChanges } =
    useStore();
  const router = useRouter();

  type SurveyNavOptionType = {
    name: string;
    onClick: (surveyId: number) => void;
    disabled?: boolean;
  };

  const surveyNavOptions: SurveyNavOptionType[] = [
    {
      name: "edit",
      onClick: () => confirmedRouteTo(`/builder/${selectedSurveyId}`),
      disabled: false,
    },
    {
      name: "results",
      onClick: () => confirmedRouteTo(`/results/${selectedSurveyId}`),
      disabled: false,
    },
    { name: "share", onClick: () => console.log("share"), disabled: false },
    {
      name: "del",
      disabled: false,
      onClick: (surveyId: number) => handleDelete(surveyId),
    },
  ];

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete the selected survey?")) {
      console.log("cancel delete");
    }

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
        surveyNavOptions.map((option) =>
          option.name === "share" ? (
            <SurveyShareDrawer
              disableNav={option.disabled}
              key={option.name}
              buttonName={"Share"}
            />
          ) : (
            <Button
              key={option.name}
              onClick={() => option.onClick(selectedSurveyId)}
              disabled={option.disabled}
            >
              {option.name}
            </Button>
          )
        )}
    </ul>
  );
};

export default SurveysNav;
