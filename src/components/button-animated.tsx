import { motion } from "framer-motion";
import { Button } from "./ui/button";

const ButtonAnimated = ({ children }: { children: React.ReactNode }) => {
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
      <Button className="h-[1em]">{children}</Button>
    </motion.div>
  );
};

export default ButtonAnimated;
