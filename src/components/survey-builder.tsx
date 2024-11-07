"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SurveysWithQuestions } from "@/db";
import { useStore } from "@/store/surveys";
import { useEffect, useState } from "react";
import SurveySubmitButton from "./survey-submit-button";
import { Skeleton } from "./ui/skeleton";

export default function SurveyBuilder({ survey }: { survey: SurveysWithQuestions }) {
  const [newQuestionText, setNewQuestionText] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const {
    currentSurvey,
    collectedQuestions,
    addCollectedQuestion,
    setCollectedQuestions,
    setCurrentSurvey,
  } = useStore();

  useEffect(() => {
    if (survey) {
      setCurrentSurvey(survey);
    }
    setIsLoading(false);
  }, []);

  const addQuestion = () => {
    if (newQuestionText.trim()) {
      const collectedQuestion = {
        questionText: newQuestionText,
        answerType: "text",
        created_at: new Date(),
        updated_at: new Date(),
      };
      addCollectedQuestion(collectedQuestion);
      setNewQuestionText("");
    }
  };

  return (
    <div className="container grid max-w-screen-sm gap-[50px]">
      <div className="grid gap-[15px] align-baseline">
        <p className="mx-2">What is your survey about?</p>
        <Input
          placeholder=""
          value={newQuestionText}
          onChange={(e) => setNewQuestionText(e.target.value)}
          className="mx-auto h-[60px] max-w-[96vw] text-[36px] font-bold"
        />
        <Button className="mx-2" onClick={addQuestion}>
          Add Question
        </Button>
      </div>
      <div>
        {!isLoading ? (
          <>
            {collectedQuestions?.length > 0 || currentSurvey?.questions ? (
              <>
                <ul className="mx-2 flex flex-col gap-[25px] text-[32px] font-light">
                  {collectedQuestions?.map((question) => (
                    <li
                      key={question.created_at.getTime()}
                      className="grid grid-cols-[auto,_min-content]"
                    >
                      <div>
                        {question.questionText} - {question.created_at.toLocaleString()}
                      </div>
                      <div className="flex flex-col justify-end">
                        <Button
                          variant={"secondary"}
                          onClick={() =>
                            setCollectedQuestions(collectedQuestions.filter((q) => q !== question))
                          }
                        >
                          Remove
                        </Button>
                      </div>
                    </li>
                  ))}
                  {currentSurvey?.questions.map((question) => (
                    <li key={question.id}>{question.questionText}</li>
                  ))}
                </ul>
              </>
            ) : (
              ""
            )}
          </>
        ) : (
          <div className="mx-2 flex flex-col gap-[25px]">
            <Skeleton className="h-[48px] w-[60vw] lg:w-[250px]" />
            <Skeleton className="h-[48px] w-[200px]" />
            <Skeleton className="h-[48px] w-[90vw] lg:w-[450px]" />
          </div>
        )}
      </div>

      {!isLoading ? (
        <>
          {collectedQuestions?.length > 0 && (
            <div className="mx-2 flex justify-between gap-5">
              <SurveySubmitButton />
              <Button
                onClick={() => {
                  if (confirm("Are you sure you want to delete all survey changes?"))
                    setCollectedQuestions([]);
                }}
                variant={"secondary"}
              >
                Delete Changes
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="mx-2 flex justify-between gap-5">
          <Skeleton className="h-4 w-[150px]" />
          <Skeleton className="h-4 w-[150px]" />
        </div>
      )}
    </div>
  );
}
