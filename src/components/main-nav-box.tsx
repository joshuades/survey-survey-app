import { ReactNode } from "react";

export default async function MainNavBox({ children }: { children: ReactNode }) {
  return (
    <div className="bg-custom-grey-bg mx-auto w-full max-w-[98vw] rounded-[var(--custom-border-radius)] p-[25px]">
      <div className="grid grid-rows-[minmax(75px,_1fr)_auto] gap-4">{children}</div>
    </div>
  );
}
