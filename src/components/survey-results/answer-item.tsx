import type { Answer, Answerer } from "@/db";

export default function AnswerItem({ answer }: { answer: Answer & { answerer: Answerer } }) {
  return (
    <li className="grid gap-1 bg-custom-secondaryBg p-[20px]">
      <p className="text-[14px] font-normal">User {answer.answerer.username} wrote:</p>
      <div className="text-[26px] font-light">&quot;{answer.answerText}&quot;</div>
    </li>
  );
}
