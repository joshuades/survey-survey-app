"use client";

import { motion } from "framer-motion";

interface FadeInWrapperProps {
  children: React.ReactNode;
  delay?: number;
  startOpacity?: number;
}

const FadeInWrapper: React.FC<FadeInWrapperProps> = ({
  children,
  delay = 0,
  startOpacity = 0.3,
}) => {
  return (
    <motion.div
      initial={{ opacity: startOpacity, pointerEvents: "none" }}
      animate={{ opacity: 1, pointerEvents: "auto" }}
      transition={{ ease: "easeIn", duration: 0.3, delay: delay }}
    >
      {children}
    </motion.div>
  );
};
export default FadeInWrapper;
