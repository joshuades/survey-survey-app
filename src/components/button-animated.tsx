import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React from "react";
import { Button } from "./ui/button";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const ButtonAnimated = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: "-100%" }}
        animate={{
          opacity: 1,
          y: "0",
          transition: { duration: 0.3, ease: "easeInOut" },
        }}
        exit={{ opacity: 0, y: "100%" }}
        className="flex items-center justify-center"
      >
        <Button className={cn({ className }, "h-[1em]")} ref={ref} {...props}>
          {children}
        </Button>
      </motion.div>
    );
  }
);
ButtonAnimated.displayName = "ButtonAnimated";

export { ButtonAnimated };
