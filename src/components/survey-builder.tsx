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
  const [currentInput, setCurrentInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [inputMessage, setInputMessage] = useState("");

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
    if (!currentInput.trim()) {
      setInputMessage("Type something above to add a question!");
      return;
    }
    const collectedQuestion = {
      questionText: currentInput,
      answerType: "text",
      created_at: new Date(),
      updated_at: new Date(),
    };
    addCollectedQuestion(collectedQuestion, survey?.survey?.id || null);
    setCurrentInput("");
    setInputMessage("");
  };

  const generateAIQuestions = async () => {
    if (!currentInput.trim()) {
      setInputMessage("Type something above to generate questions!");
      return;
    }

    try {
      const response = await fetch("/api/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: currentInput }),
      });
      const data = await response.json();
      if (data.questionTexts) {
        console.log("Generated questions:", data.questionTexts);
        const aiQuestions = data.questionTexts?.map((text: string, i: number) => {
          const d = new Date();
          d.setSeconds(d.getSeconds() + i);
          return {
            questionText: text,
            answerType: "text",
            created_at: d,
            updated_at: null,
          };
        });

        setCurrentChanges({
          surveyId: survey?.survey?.id || null,
          collectedQuestions: [...currentChanges.collectedQuestions, ...aiQuestions],
        });

        setCurrentInput("");
        setInputMessage("");
      }
    } catch (error) {
      console.error("Failed to generate questions:", error);
    }
  };

  return (
    <div className="grid w-full gap-[60px]">
      <FadeInWrapper delay={0.2}>
        <div className="grid gap-[15px] align-baseline">
          <p className="mx-2">What is your survey about?</p>
          <Input
            placeholder=""
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            className="mx-auto h-[60px] max-w-[96vw] text-[36px] font-bold"
          />
          {inputMessage ? <p className="text-custom-orange mx-2">{inputMessage}</p> : ""}
          <div className="mx-2 flex justify-between gap-3">
            <Button onClick={generateAIQuestions}>Generate</Button>
            <Button onClick={addQuestion}>Add Question</Button>
          </div>
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
                        className="grid grid-cols-[auto,_min-content] gap-2"
                      >
                        <div>
                          {question.questionText}{" "}
                          <span className="text-sm font-semibold uppercase">new</span>
                        </div>
                        <div className="flex flex-col justify-end pb-[10px]">
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
