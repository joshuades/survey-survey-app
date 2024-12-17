import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
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
  const [copiedAnimation, setCopiedAnimation] = useState(false);

  const { selectedSurveyId, allSurveys } = useStore();

  useEffect(() => {
    if (copiedAnimation) {
      const timeout = setTimeout(() => {
        setCopiedAnimation(false);
      }, 1500);
      return () => clearTimeout(timeout);
    }
  }, [copiedAnimation]);

  const selectedSurvey = allSurveys.find((s) => s.id === selectedSurveyId);
  const surveyFormUrl = `${window.location.origin}/${selectedSurveyId}`;

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
              <Input
                placeholder={surveyFormUrl}
                className="w-full cursor-pointer"
                // disabled
                readOnly
              />
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
            <p className="mt-[20px] text-center">
              Share your custom form for survey &apos;
              <span className="uppercase">{selectedSurvey?.name} </span>&apos;.
            </p>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default SurveyShareDrawer;
