import { ReactNode } from "react";

export default async function MainNavBox({ children }: { children: ReactNode }) {
  return (
    <div className="bg-custom-grey-bg p-[25px]">
      {/* <h1>MainNavBox</h1> */}
      {children}
    </div>
  );
}
