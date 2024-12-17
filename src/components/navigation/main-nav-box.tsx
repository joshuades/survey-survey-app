"use client";

import { useLoadingStore } from "@/store/loadingStore";
import { ReactNode } from "react";
import FadeInWrapper from "../fade-in-wrapper";

export default function MainNavBox({ children }: { children: ReactNode }) {
  const { isRouting } = useLoadingStore();
  return (
    <FadeInWrapper delay={0.2}>
      <div
        className="mx-auto mt-5 w-full max-w-[98vw] rounded-[var(--custom-border-radius)] bg-custom-secondaryBg px-[15px] py-[25px] md:px-[30px]"
        style={{
          opacity: isRouting ? 0.6 : 1,
          pointerEvents: isRouting ? "none" : "initial",
        }}
      >
        <div className="grid grid-rows-[minmax(75px,_1fr)_auto] gap-[25px]">{children}</div>
      </div>
    </FadeInWrapper>
  );
}
