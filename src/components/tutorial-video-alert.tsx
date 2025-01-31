"use client";

import { CustomMuxVideo } from "@/components/custom-mux-video";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TutorialVideoInfo } from "@/db";
import useWindowSize from "@/lib/hooks";
import { SCREENS } from "@/lib/utils";
import { useStore } from "@/store/surveysStore";
import { X } from "lucide-react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import FadeInWrapper from "./fade-in-wrapper";

const TutorialVideoAlert = ({
  videoInfos,
}: {
  videoInfos: { desktop: TutorialVideoInfo; mobile: TutorialVideoInfo };
}) => {
  const { data: session } = useSession();

  const searchParams = useSearchParams();
  const tutorial = searchParams.get("tutorial");
  const [isDialogOpen, setIsDialogOpen] = useState(tutorial === "a");
  const [isVisible, setIsVisible] = useState(true);
  const { allSurveys } = useStore();
  const size = useWindowSize();
  const isMobile = size.width && size.width < SCREENS.lg;

  if (!isVisible || (session?.user && tutorial !== "a" && allSurveys.length !== 0)) return null;

  const tutorialVideoInfo = isMobile ? videoInfos.mobile : videoInfos.desktop;
  if (!tutorialVideoInfo) return null;

  const videoPlaybackId = tutorialVideoInfo?.muxPlaybackId;
  const videoAspectRatio = tutorialVideoInfo?.aspectRatio;

  return (
    <FadeInWrapper startOpacity={0} delay={1.5}>
      <Alert variant={"popover"}>
        <AlertTitle>Hi there!</AlertTitle>
        <AlertDescription>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            Are you new here? Check out this{" "}
            <DialogTrigger className="underline underline-offset-2">tutorial</DialogTrigger> on how
            to create your first survey!
            <DialogContent className="max-h-[98vh] w-fit max-w-[100vw] px-0 sm:px-6">
              <DialogHeader>
                <DialogTitle>Figuring Things Out?</DialogTitle>
                <DialogDescription>
                  No worries, we’ve got a quick walkthrough for you!
                </DialogDescription>
              </DialogHeader>
              <div className="h-auto w-fit max-w-[100vw]">
                <CustomMuxVideo
                  muxPlaybackId={videoPlaybackId}
                  maxPixelWidth={1024}
                  aspectRatio={videoAspectRatio}
                  useControls={true}
                  style={{
                    maxWidth: "100vw",
                    overflow: "hidden",
                    borderRadius: "5px",
                    maxHeight: "70vh",
                  }}
                />
              </div>
            </DialogContent>
          </Dialog>
        </AlertDescription>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-300 hover:text-white absolute right-[14px] top-[14px] transition-colors duration-200"
          aria-label="Close alert"
        >
          <X size={20} />
        </button>
      </Alert>
    </FadeInWrapper>
  );
};

export default TutorialVideoAlert;
