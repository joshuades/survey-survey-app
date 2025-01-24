"use client";

import { type PatchUpdate, type Question, type Survey } from "@/db";
import { checkForSurveyChanges, randomString } from "@/lib/utils";
import { type CollectedUpdate, type QuestionPointer, useStore } from "@/store/surveysStore";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FunctionComponent, useEffect, useState } from "react";
import { Button } from "../ui/button";

const SurveySubmitButton: FunctionComponent = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();

  const {
    currentSurvey,
    setCurrentSurvey,
    allSurveys,
    setAllSurveys,
    currentChanges,
    setCurrentChanges,
  } = useStore();

  useEffect(() => {
    console.log("currentSurvey:", currentSurvey);
  }, [currentSurvey]);

  /**
   * @description Updates currentSurvey questions with freshly added questions from db (e.g. updates id, status & surveyId by using comparing created_at) & clears collectedQuestions and deletedQuestions
   * @param confirmedAddedQs Questions from db response, when adding questions to db
   * @param confirmedDeletedQs Questions from db response, when deleting questions from db
   */
  const updateClientSideWithResults = (
    confirmedAddedQs: Question[],
    confirmedDeletedQs: Question[]
  ) => {
    const idsToClear: number[] = [];

    const updatedQuestions = currentSurvey?.questions
      ? currentSurvey?.questions.map((q) => {
          const matchingResultsQuestion = confirmedAddedQs.find(
            (nq: Question) => new Date(nq.created_at).getTime() === new Date(q.created_at).getTime()
          );
          if (!matchingResultsQuestion) return q;
          // save ids of old collectedQuestions to clear
          idsToClear.push(q.id);
          return matchingResultsQuestion;
        })
      : [];

    setCurrentSurvey({
      ...currentSurvey,
      survey: currentSurvey?.survey || null,
      questions: updatedQuestions,
    });

    setCurrentChanges({
      ...currentChanges,
      surveyId: currentSurvey?.survey?.id || null,
      collectedQuestions: currentChanges.collectedQuestions.filter(
        (cq) => !idsToClear.includes(cq.questionId)
      ),
      deletedQuestions: currentChanges.deletedQuestions.filter(
        (dq) => !confirmedDeletedQs.map((cdq) => cdq.id).includes(dq.id)
      ),
      collectedUpdates: [],
    });
  };

  /**
   * @description Loads builder view of newly created survey, updates allSurveys and currentChanges state
   * @param survey Survey object from db response
   */
  const loadCreatedSurvey = (survey: Survey) => {
    setAllSurveys([survey, ...allSurveys]);
    router.push(`/builder/${survey.id}`, { scroll: true });
    setCurrentChanges({
      ...currentChanges,
      surveyId: survey.id,
      collectedQuestions: [],
      collectedUpdates: [],
    });
  };

  const tryCreateSurveyInDb = async (name: string, questions: Question[]) => {
    if (questions.length === 0) {
      setErrorMessage("Please add questions to your survey");
      return;
    }

    const response = await fetch("/api/surveys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, questions }),
    });
    const data = await response.json();

    if (!response.ok) {
      console.error("Failed to create survey, check api response: ", data);
      setErrorMessage(`ERROR: ${data.error}`);
      return;
    }

    loadCreatedSurvey(data.survey as Survey);
  };

  const tryAddQuestionsToDb = async (collectedQuestions: QuestionPointer[]) => {
    if (collectedQuestions?.length == 0) return [];

    const questions = currentSurvey?.questions.filter((q) =>
      collectedQuestions.map((cq) => cq.questionId).includes(q.id)
    );

    const response = await fetch(`/api/surveys/${currentSurvey?.survey?.id}/questions/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ questions }),
    });
    const data = await response.json();

    if (!response.ok) {
      console.error("Failed adding questions, check api response: ", data);
      setErrorMessage(`ERROR: ${data.error}`);
      return [];
    }

    return data.questions;
  };

  const tryDeleteQuestionsFromDb = async (collectedDeletes: Question[]) => {
    if (collectedDeletes?.length == 0) return [];

    const response = await fetch(`/api/surveys/${currentSurvey?.survey?.id}/questions/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ collectedDeletes }),
    });
    const data = await response.json();

    if (!response.ok) {
      console.error("Failed to delete survey, check api response: ", data);
      setErrorMessage(`ERROR: ${data.error}`);
      return [];
    }

    return data.questions;
  };

  const tryUpdateQuestionsInDb = async (collectedUpdates: CollectedUpdate[]) => {
    if (collectedUpdates?.length == 0) return true;

    // filter out collectedUpdates for new questions and deleted questions
    const filteredCollectedUpdates = collectedUpdates.filter((cu) => {
      if (cu.questionStatus === "new") return false;
      return true;
    });
    currentChanges.deletedQuestions.forEach((dq) => {
      filteredCollectedUpdates.filter((cu) => cu.questionId !== dq.id);
    });

    // parse collectedUpdates to PatchUpdate objects
    const patchUpdates: PatchUpdate[] = [];
    filteredCollectedUpdates.forEach((cu) => {
      patchUpdates.push({ id: cu.questionId, [cu.field]: cu.newValue });
    });

    const response = await fetch(`/api/surveys/${currentSurvey?.survey?.id}/questions/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ patchUpdates }),
    });
    const data = await response.json();

    if (!response.ok) {
      console.error("Failed to update questions, check api response: ", data);
      setErrorMessage(`ERROR: ${data.error}`);
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    // if no survey, create new survey
    if (!currentSurvey?.survey) {
      const newSurveyName = randomString(); // TODO: get from user input
      tryCreateSurveyInDb(newSurveyName, currentSurvey?.questions || []);
      setIsLoading(false);
      return;
    }

    const confirmedAddedQs = await tryAddQuestionsToDb(currentChanges.collectedQuestions);
    const confirmedDeletedQs = await tryDeleteQuestionsFromDb(currentChanges.deletedQuestions);
    await tryUpdateQuestionsInDb(currentChanges.collectedUpdates);

    updateClientSideWithResults(confirmedAddedQs, confirmedDeletedQs);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-wrap gap-3">
      {!session?.user?.email ? (
        <Button disabled>SAVE & SHARE</Button>
      ) : (
        <Button
          variant="huge"
          onClick={() => handleSubmit()}
          disabled={
            !checkForSurveyChanges(currentSurvey?.survey?.id || null, currentChanges) || isLoading
          }
        >
          {currentSurvey?.survey ? "SAVE CHANGES" : "SAVE NEW SURVEY"}
        </Button>
      )}
      {!session?.user?.email && <div> (Sign in to save your survey)</div>}
      {errorMessage && (
        <p className="absolute top-[200%] flex flex-col justify-end text-custom-warning lg:top-[120%]">
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default SurveySubmitButton;
