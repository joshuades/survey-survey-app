"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Question } from "@/db";
import { CollectedAnswer, useStore } from "@/store/surveys";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "../ui/card";

export function SurveyForm({
  questionId,
  questions,
  surveyId,
}: {
  questionId: string;
  questions: Question[];
  surveyId: string;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { collectedAnswers, setCollectedAnswers } = useStore();
  const router = useRouter();

  const questionIds = [...questions.map((q) => q.id), 0];
  questionIds.sort((a, b) => a - b);

  questionId = questionId === "0" ? questionIds[1].toString() : questionId;

  const currentQuestion = questions.find((q) => q.id === Number(questionId));
  const currentIndex = questionIds.findIndex((q) => q === Number(questionId));

  useEffect(() => {
    console.log("collectedAnswers:", collectedAnswers);
  }, [collectedAnswers]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const collectedAnswer = {
      type: "text",
      answerText: formData.get("answer") as string,
      username: "anonymous",
      questionId: Number(questionId),
      created_at: new Date(),
      // email?: string | null;
      // answerBoolean?: boolean | null;
    };

    // filter collectedAnswers if same question was already answered
    const filteredCollectedAnswers = collectedAnswers.filter(
      (a) => a.questionId !== Number(questionId)
    );

    setCollectedAnswers([...filteredCollectedAnswers, collectedAnswer]);

    if (currentIndex < questionIds.length - 1) {
      router.push(`/${surveyId}/q/${questionIds[currentIndex + 1]}`);
    } else {
      setIsLoading(true);
      const createSuccessful = await tryCreateAnswersInDb(surveyId, [
        ...filteredCollectedAnswers,
        collectedAnswer,
      ]);
      if (!createSuccessful) {
        setErrorMessage("Failed to save answers, please try again.");
        setIsLoading(false);
        return;
      }
      router.push(`/${surveyId}/complete`);
      setIsLoading(false);
    }
  };

  const tryCreateAnswersInDb = async (surveyId: string, collectedAnswers: CollectedAnswer[]) => {
    const response = await fetch(`/api/surveys/${surveyId}/answers/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ collectedAnswers, userdata: {} }),
    });

    if (!response.ok) {
      console.error("ERROR, check api response: ", response);
      return false;
    } else {
      const data = await response.json();
      console.log("Created answers:", data.answers);
      return true;
    }
  };

  if (!currentQuestion) {
    return (
      <div className="text-center">
        <h2 className="mb-4 text-4xl font-extrabold">Question not found</h2>
        <p className="mb-[45px]">Something went wrong, please try again.</p>
        <Button asChild>
          <Link href={`/${surveyId}`}>Start Over</Link>
        </Button>
      </div>
    );
  }

  const collectedAnswer = collectedAnswers.find((a) => a.questionId === Number(questionId));
  return (
    <Card className="mx-2 py-2">
      <form onSubmit={handleSubmit} className="">
        <CardHeader className="pb-4 pt-9">
          <div className="text-lg font-bold">
            Question {questionId} of Survey <span className="uppercase">{surveyId}</span>
          </div>
        </CardHeader>
        <CardContent>
          <Label htmlFor="answer" className="text-3xl font-light">
            {currentQuestion.questionText}
          </Label>
          <Input
            type="text"
            id="answer"
            name="answer"
            required
            defaultValue={
              collectedAnswer && typeof collectedAnswer?.answerText == "string"
                ? collectedAnswer?.answerText
                : ""
            }
            className="mb-[40px] mt-[25px] w-full"
          />
          <div className="flex justify-between gap-[35px] lg:justify-normal">
            {currentIndex > 1 && (
              <Button
                type="button"
                onClick={() => router.push(`/${surveyId}/q/${questionIds[currentIndex - 1]}`)}
              >
                Previous
              </Button>
            )}
            <Button type="submit" disabled={isLoading}>
              {currentIndex === questionIds.length - 1 ? "Finish" : "Go Next"}
            </Button>
          </div>
          {errorMessage && <div className="pt-2 text-custom-warning">{errorMessage}</div>}
        </CardContent>
      </form>
    </Card>
  );
}
