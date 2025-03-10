"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Question } from "@/db";
import { CollectedAnswer, CollectedAnswerer, useStore } from "@/store/surveysStore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ErrorBlock from "../error/error-block";
import { Card, CardContent, CardHeader } from "../ui/card";

export function SurveyForm({
  questionId,
  questions,
  survey,
}: {
  questionId: string;
  questions: Question[];
  survey: { id: string; accessLinkId: string; name: string };
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { collectedAnswers, setCollectedAnswers, collectedAnswerer } = useStore();
  const router = useRouter();

  const questionIds = [0, ...questions.sort((a, b) => a.index - b.index).map((q) => q.id)];

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
      questionId: Number(questionId),
      created_at: new Date(),
      // answerBoolean?: boolean | null;
    };
    // filter collectedAnswers if same question was already answered
    const filteredCollectedAnswers = collectedAnswers.filter(
      (a) => a.questionId !== Number(questionId)
    );
    const allCollectedAnswers = [...filteredCollectedAnswers, collectedAnswer];
    setCollectedAnswers(allCollectedAnswers);

    if (currentIndex < questionIds.length - 1) {
      router.push(`/${survey.accessLinkId}/q/${questionIds[currentIndex + 1]}`);
    } else {
      setIsLoading(true);
      const createSuccessful = await tryCreateAnswersInDb(
        survey.id,
        allCollectedAnswers,
        collectedAnswerer
      );
      if (!createSuccessful) {
        setErrorMessage("Failed to save answers, please try again.");
        setIsLoading(false);
        return;
      }
      router.push(`/${survey.accessLinkId}/complete`);
      setIsLoading(false);
    }
  };

  const tryCreateAnswersInDb = async (
    surveyId: string,
    collectedAnswers: CollectedAnswer[],
    collectedAnswerer: CollectedAnswerer
  ) => {
    const response = await fetch(`/api/surveys/${surveyId}/answers/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ collectedAnswers, collectedAnswerer }),
    });
    const data = await response.json();

    if (!response.ok) {
      console.error("Failed creating answers, check api response: ", data);
      return false;
    }

    return true;
  };

  if (!currentQuestion) {
    return (
      <ErrorBlock title="Question not found" message="Something went wrong, please try again.">
        <Button asChild>
          <Link href={`/${survey.accessLinkId}`}>Start Over</Link>
        </Button>
      </ErrorBlock>
    );
  }

  const collectedAnswer = collectedAnswers.find((a) => a.questionId === Number(questionId));

  return (
    <Card className="mx-2 py-2">
      <form onSubmit={handleSubmit} className="">
        <CardHeader className="pb-4 pt-9">
          <div className="text-lg font-bold">
            Question {currentIndex} of Survey &apos;<span className="uppercase">{survey.name}</span>
            &apos;
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
                onClick={() =>
                  router.push(`/${survey.accessLinkId}/q/${questionIds[currentIndex - 1]}`)
                }
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
