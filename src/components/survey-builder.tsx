"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SurveysWithQuestions } from "@/db";
import { checkForSurveyChanges } from "@/lib/utils";
import { useStore } from "@/store/surveys";
import { useEffect, useState } from "react";
import FadeInWrapper from "./fade-in-wrapper";
import SurveySubmitButton from "./survey-submit-button";
import { Skeleton } from "./ui/skeleton";

export default function SurveyBuilder({ survey }: { survey: SurveysWithQuestions }) {
  const [newQuestionText, setNewQuestionText] = useState("");
  // const [aiPrompt, setAiPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const {
    currentSurvey,
    currentChanges,
    addCollectedQuestion,
    setCurrentChanges,
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
      addCollectedQuestion(collectedQuestion, survey?.survey?.id || null);

      // setSurvey([...survey, { id: Date.now(), text: newQuestion, type: "text" }]);
      setNewQuestionText("");
    }
  };

  // const generateAIQuestions = async () => {
  //   try {
  //     const response = await fetch("/api/generate-questions", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ prompt: aiPrompt }),
  //     });
  //     const data = await response.json();
  //     if (data.questions) {
  //       const newQuestions = data.questions.map((text: string) => ({
  //         id: Date.now() + Math.random(),
  //         text,
  //         type: "text" as const,
  //       }));
  //       setSurvey([...survey, ...newQuestions]);
  //       setAiPrompt("");
  //     }
  //   } catch (error) {
  //     console.error("Failed to generate questions:", error);
  //   }
  // };

  return (
    <div className="grid w-full gap-[60px]">
      <FadeInWrapper delay={0.2}>
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
      </FadeInWrapper>
      <div>
        {!isLoading ? (
          <>
            {checkForSurveyChanges(currentSurvey, currentChanges) || currentSurvey?.questions ? (
              <FadeInWrapper>
                <ul className="mx-2 flex flex-col gap-[25px] text-[32px] font-light">
                  {checkForSurveyChanges(currentSurvey, currentChanges) &&
                    currentChanges.collectedQuestions?.map((question) => (
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
                              setCurrentChanges({
                                surveyId: survey?.survey?.id || null,
                                collectedQuestions: currentChanges.collectedQuestions.filter(
                                  (q) => q.created_at.getTime() !== question.created_at.getTime()
                                ),
                              })
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
              </FadeInWrapper>
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
          {checkForSurveyChanges(currentSurvey, currentChanges) && (
            <div className="mx-2 flex justify-between gap-5">
              <SurveySubmitButton />
              <Button
                onClick={() => {
                  if (confirm("Are you sure you want to delete all survey changes?"))
                    setCurrentChanges({
                      surveyId: survey?.survey?.id || null,
                      collectedQuestions: [],
                    });
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
