import { type Question } from "@/db";
import { springTransition } from "@/lib/utils";
import { motion, Reorder } from "framer-motion";

interface MovingQuestionWrapperProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  dndOn: boolean;
  className: string;
  reorderValue: Question;
}

const MovingQuestionWrapper: React.FC<MovingQuestionWrapperProps> = ({
  children,
  className,
  reorderValue,
  dndOn,
}) => {
  return dndOn ? (
    <Reorder.Item value={reorderValue} layout transition={springTransition} className={className}>
      {children}
    </Reorder.Item>
  ) : (
    <motion.li layout transition={springTransition} className={className}>
      {children}
    </motion.li>
  );
};

export default MovingQuestionWrapper;
