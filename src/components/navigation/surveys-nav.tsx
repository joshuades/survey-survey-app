"use client";

import { checkForSurveyChanges } from "@/lib/utils";
import { useLoadingStore } from "@/store/loadingStore";
import { useStore } from "@/store/surveysStore";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import SurveyShareDrawer from "./survey-share-drawer";

const SurveysNav: React.FC = () => {
  const {
    currentSurvey,
    selectedSurveyId,
    toggleSelectedSurveyId,
    currentChanges,
    allSurveys,
    setAllSurveys,
  } = useStore();
  const { setIsRouting } = useLoadingStore();
  const router = useRouter();
  const pathname = usePathname();

  type SurveyNavOptionType = {
    name: string;
    onClick: (surveyId: number) => void;
    disabled?: boolean;
    pathIncludes?: string;
  };

  const surveyNavOptions: SurveyNavOptionType[] = [
    {
      name: "edit",
      onClick: () => {
        setIsRouting(true);
        confirmedRouteTo(`/builder/${selectedSurveyId}`);
      },
      disabled: false,
      pathIncludes: "builder",
    },
    {
      name: "results",
      onClick: () => confirmedRouteTo(`/results/${selectedSurveyId}`),
      disabled: false,
      pathIncludes: "results",
    },
    { name: "share", onClick: () => console.log("share"), disabled: false },
    {
      name: "del",
      disabled: false,
      onClick: (surveyId: number) => handleSurveyDelete(surveyId),
    },
  ];

  const handleSurveyDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete the selected survey?")) return;

    const response = await fetch(`/api/surveys/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();

    if (!response.ok) {
      console.error("Failed to delete survey, check api response: ", data);
      // TODO: show error message
      return;
    }

    // delete in state
    toggleSelectedSurveyId(id);
    setAllSurveys(allSurveys.filter((s) => s.id !== id)); // same as data.survey[0].id
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

  const isButtonSelected = (pathIncludes: string | undefined) => {
    if (pathIncludes) {
      return pathname.includes(pathIncludes + "/" + selectedSurveyId);
    }
    return false;
  };

  return (
    <ul className="flex flex-wrap gap-x-[20px] gap-y-[15px] text-lg font-semibold uppercase md:flex-nowrap">
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
              style={{
                pointerEvents: isButtonSelected(option.pathIncludes) ? "none" : "initial",
              }}
              className="relative leading-[1.5em]"
            >
              {isButtonSelected(option.pathIncludes) && (
                <span className="absolute bottom-[3px] left-1/2 h-[2px] w-[90%] -translate-x-1/2 rounded-[1px] bg-custom-black"></span>
              )}
              {option.name}
            </Button>
          )
        )}
    </ul>
  );
};

export default SurveysNav;
