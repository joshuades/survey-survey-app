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
      className="bg-custom-secondaryBg mx-auto mt-5 w-full max-w-[98vw] rounded-[var(--custom-border-radius)] px-[15px] py-[25px] md:px-[30px]"
    >
      <div className="grid grid-rows-[minmax(75px,_1fr)_auto] gap-[25px]">{children}</div>
    </motion.div>
  );
}
