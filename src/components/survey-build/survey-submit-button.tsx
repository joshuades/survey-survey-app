"use client";

import { Question, Survey } from "@/db";
import { checkForSurveyChanges, randomString } from "@/lib/utils";
import { CollectedQuestion, useStore } from "@/store/surveysStore";
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
   * @description Updates currentSurvey questions with freshly added questions from db (e.g. updates id, status & surveyId by using comparing created_at) & clears collectedQuestions and collectedDeletes
   * @param addedQuestions Questions from db response, when adding questions to db
   * @param deletedQuestions Questions from db response, when deleting questions from db
   */
  const updateClientSideWithResults = (
    addedQuestions: Question[],
    deletedQuestions: Question[]
  ) => {
    const idsToClear: number[] = [];

    const updatedQuestions = currentSurvey?.questions
      ? currentSurvey?.questions.map((q) => {
          const matchingResultsQuestion = addedQuestions.find(
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
      collectedDeletes: currentChanges.collectedDeletes.filter(
        (cd) => !deletedQuestions.map((dq) => dq.id).includes(cd.id)
      ),
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
    });
  };

  const tryCreateSurveyInDb = async (name: string, questions: Question[]) => {
    if (questions.length === 0) {
      setErrorMessage("Please add questions to your survey");
      setIsLoading(false);
      return;
    }

    const response = await fetch("/api/surveys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, questions }),
    });

    if (!response.ok) {
      console.error("ERROR, check api response: ", response);
      setErrorMessage(`${response.statusText}`);
      setIsLoading(false);
      return;
    } else {
      const data = await response.json();
      loadCreatedSurvey(data.survey);
    }
  };

  const tryAddQuestionsToDb = async (collectedQuestions: CollectedQuestion[]) => {
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

    if (!response.ok) {
      console.error("ERROR, check api response: ", response);
      setErrorMessage(`${response.statusText}`);
      setIsLoading(false);
      return [];
    } else {
      const data = await response.json();
      return data.questions;
    }
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

    if (!response.ok) {
      console.error("ERROR, check api response: ", response);
      alert("Error while deleting questions, please try again.");
      setErrorMessage(`${response.statusText}`);
      setIsLoading(false);
      return [];
    } else {
      const data = await response.json();
      console.log("tryDeleteQuestionsFromDb: deleted q's:", data.questions);
      return data.questions;
    }
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

    const addedQuestions = await tryAddQuestionsToDb(currentChanges.collectedQuestions);
    const deletedQuestions = await tryDeleteQuestionsFromDb(currentChanges.collectedDeletes);

    updateClientSideWithResults(addedQuestions, deletedQuestions);

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
        <p className="flex flex-col justify-end text-custom-warning">{errorMessage}</p>
      )}
    </div>
  );
};

export default SurveySubmitButton;
