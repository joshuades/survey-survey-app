"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

export default function MainNavBox({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ ease: "easeInOut", duration: 0.5 }}
      viewport={{ once: true, amount: 0.5 }}
      className="bg-custom-grey-bg mx-auto w-full max-w-[98vw] rounded-[var(--custom-border-radius)] p-[25px]"
    >
      <div className="grid grid-rows-[minmax(75px,_1fr)_auto] gap-4">{children}</div>
    </motion.div>
  );
}
