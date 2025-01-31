"use client";

import MuxVideo from "@mux/mux-video-react";
import Image from "next/image";
import * as React from "react";
import { useState } from "react";

export interface CustomMuxVideoProps {
  muxPlaybackId: string;
  maxPixelWidth: number;
  maxHeight?: string;
  aspectRatio: string;
  useAutoPlay?: "any" | boolean;
  useControls?: boolean;
  useMuted?: boolean;
  videoName?: string;
  placeholderTime?: number;
  style?: React.CSSProperties;
}

export const CustomMuxVideo = React.forwardRef<HTMLVideoElement, CustomMuxVideoProps>(
  (
    {
      muxPlaybackId,
      maxPixelWidth,
      maxHeight = "9999vh",
      aspectRatio,
      useAutoPlay = "any",
      useControls = false,
      useMuted = false,
      videoName = "noNameDefined",
      placeholderTime = 0,
      style = {},
    },
    ref
  ) => {
    const calcHeightForAspectRatio = (width: number, aspectRatioString: string) => {
      const [aspectWidth, aspectHeight] = aspectRatioString.split(":").map(Number);
      const height = (width / aspectWidth) * aspectHeight;
      return Math.round(height);
    };

    const [isVideoLoaded, setIsVideoLoaded] = useState(false);
    const [aspectWidth, aspectHeight] = aspectRatio.split(":").map(Number);
    const maxPixelHeight = calcHeightForAspectRatio(maxPixelWidth, aspectRatio);
    const thumbnailUrl = `https://image.mux.com/${muxPlaybackId}/thumbnail.jpg?width=${maxPixelWidth}&height=${maxPixelHeight}&time=${placeholderTime}&fit_mode=preserve`;

    return (
      <div
        className="relative h-auto max-w-full"
        style={{
          maxHeight: maxHeight,
          width: maxPixelWidth,
          aspectRatio: `${aspectWidth}/${aspectHeight}`,
          ...style,
        }}
      >
        {!isVideoLoaded && (
          <Image
            src={thumbnailUrl}
            alt={"First frame of video" + videoName}
            width={maxPixelWidth}
            height={maxPixelHeight}
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
          />
        )}
        <MuxVideo
          playbackId={muxPlaybackId}
          controls={useControls}
          muted={useMuted}
          playsInline
          loop
          autoPlay={useAutoPlay}
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
          onLoadedData={() => setIsVideoLoaded(true)}
          ref={ref}
          poster={thumbnailUrl}
        />
      </div>
    );
  }
);

CustomMuxVideo.displayName = "CustomMuxVideo";
