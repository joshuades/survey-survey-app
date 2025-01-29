import { type Question } from "@/db";
import { Reorder } from "framer-motion";

interface MovingQuestionsWrapperProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  dndOn: boolean;
  className: string;
  reorderValues: Question[];
  onReorder: (values: Question[]) => void;
}

const MovingQuestionsWrapper: React.FC<MovingQuestionsWrapperProps> = ({
  children,
  className,
  reorderValues,
  onReorder,
  dndOn,
}) => {
  return dndOn ? (
    <Reorder.Group as="ul" values={reorderValues} onReorder={onReorder} className={className}>
      {children}
    </Reorder.Group>
  ) : (
    <ul className={className}>{children}</ul>
  );
};

export default MovingQuestionsWrapper;
