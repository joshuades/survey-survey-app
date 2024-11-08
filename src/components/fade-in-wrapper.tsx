"use client";

import { motion } from "framer-motion";

interface FadeInWrapperProps {
  children: React.ReactNode;

  delay?: number;
}

const FadeInWrapper: React.FC<FadeInWrapperProps> = ({ children, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0.3 }}
      animate={{ opacity: 1 }}
      transition={{ ease: "easeIn", duration: 0.3, delay: delay }}
    >
      {children}
    </motion.div>
  );
};
export default FadeInWrapper;