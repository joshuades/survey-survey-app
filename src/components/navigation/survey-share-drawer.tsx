"use client";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { makeDateString } from "@/lib/utils";
import { useStore } from "@/store/surveysStore";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { ButtonAnimated } from "../button-animated";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const SurveyShareDrawer = ({
  buttonName,
  disableNav,
}: {
  buttonName: string;
  disableNav?: boolean;
}) => {
  const { selectedSurveyId, allSurveys } = useStore();
  const selectedSurvey = allSurveys.find((s) => s.id === selectedSurveyId);

  const [surveyFormUrl, setSurveyFormUrl] = useState(
    `${window.location.origin}/${selectedSurvey?.accessLinkId}`
  );
  const [copiedAnimation, setCopiedAnimation] = useState(false);

  useEffect(() => {
    if (copiedAnimation) {
      const timeout = setTimeout(() => {
        setCopiedAnimation(false);
      }, 1500);
      return () => clearTimeout(timeout);
    }
  }, [copiedAnimation]);

  const tryUpdateAccessLink = async (surveyId: number) => {
    const patchUpdate = { id: surveyId, accessLinkId: "new" };
    const response = await fetch(`/api/surveys/${surveyId}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ patchUpdate }),
    });
    const data = await response.json();

    if (!response.ok) {
      console.error("Failed to update access link, check api response: ", data);
      // TODO: show error message "ERROR: Failed to update access link"
      return null;
    }

    return data.survey;
  };

  const handleChangeAccessLink = async () => {
    // TODO: show error message "ERROR: No survey selected"
    if (!selectedSurveyId) return;

    const confirmMessage = `Are you sure you want to generate a new link for survey '${selectedSurvey?.name}'? \n\nThe current link will not work anymore.`;
    if (!confirm(confirmMessage)) return;

    const updatedSurvey = await tryUpdateAccessLink(selectedSurveyId);
    if (!updatedSurvey || updatedSurvey == undefined) return;

    setSurveyFormUrl(`${window.location.origin}/${updatedSurvey.accessLinkId}`);
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button disabled={disableNav}>{buttonName}</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-[400px]">
          <DrawerHeader className="hidden">
            <DrawerTitle>Share Survey</DrawerTitle>
            <DrawerDescription>Share your survey with others.</DrawerDescription>
          </DrawerHeader>
          <div className="py-[50px] md:py-8">
            <div
              className="grid cursor-pointer grid-cols-[auto,_106px] gap-[10px]"
              onClick={() => {
                // copy url for survey to clipboard
                navigator.clipboard.writeText(surveyFormUrl);
                setCopiedAnimation(true);
              }}
            >
              <Input placeholder={surveyFormUrl} className="w-full cursor-pointer" readOnly />
              <div className="my-auto flex h-fit overflow-hidden">
                <AnimatePresence mode={"wait"} initial={false}>
                  {!copiedAnimation ? (
                    <ButtonAnimated key={1}>Copy Link</ButtonAnimated>
                  ) : (
                    <ButtonAnimated key={2}>Copied!</ButtonAnimated>
                  )}
                </AnimatePresence>
              </div>
            </div>
            <p className="mt-[15px] text-center">
              Share your custom form for survey &apos;
              <span className="uppercase">{selectedSurvey?.name} </span>&apos;.
            </p>
            <div className="mt-[30px] flex flex-col items-center gap-[15px] text-center">
              <Button onClick={() => handleChangeAccessLink()} variant={"secondary"}>
                Generate New Link
              </Button>
              {selectedSurvey?.linkUpdatedAt && (
                <p>Current link active since {makeDateString(selectedSurvey.linkUpdatedAt)}.</p>
              )}
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default SurveyShareDrawer;
