import Link from "next/link";
import { SignIn } from "../auth/auth-components";
import { Button } from "../ui/button";
import ErrorBlock from "./error-block";

interface SurveyErrorBlockProps {
  message: string;
}

/**
 * Handles survey-related errors by displaying appropriate error messages and actions.
 *
 * @param {string} message - The error message to handle.
 * - "unauthenticated", "unauthorized" or "not found"
 * - Any other message: Treated as an internal error.
 * @returns {JSX.Element} A JSX element containing the error message and corresponding action.
 */
const SurveyErrorBlock: React.FC<SurveyErrorBlockProps> = ({ message }) => {
  switch (message) {
    case "unauthenticated":
      return (
        <div className="pb-[5vh] pt-[15vh]">
          <ErrorBlock title="Unauthenticated" message="You need to be signed in to view this page">
            <SignIn />
          </ErrorBlock>
        </div>
      );
    case "unauthorized":
      return (
        <div className="pb-[5vh] pt-[15vh]">
          <ErrorBlock title="Unauthorized" message="You do not have permission to view this page">
            <Button asChild>
              <Link href="/">Return Home</Link>
            </Button>
          </ErrorBlock>
        </div>
      );
    case "not found":
      return (
        <div className="pb-[5vh] pt-[15vh]">
          <ErrorBlock title="Survey not found" message="Could not find requested resource">
            <Button asChild>
              <Link href="/">Return Home</Link>
            </Button>
          </ErrorBlock>
        </div>
      );
    default:
      return (
        <div className="pb-[5vh] pt-[15vh]">
          <ErrorBlock title="Internal Error" message={message}>
            <Button asChild>
              <Link href="/">Return Home</Link>
            </Button>
          </ErrorBlock>
        </div>
      );
  }
};

export default SurveyErrorBlock;
