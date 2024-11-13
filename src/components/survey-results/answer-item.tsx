import type { Answer, Answerer } from "@/db";

export default function AnswerItem({ answer }: { answer: Answer & { answerer: Answerer } }) {
  return (
    <li className="grid gap-1 bg-custom-secondaryBg p-[20px]">
      <p className="text-[14px] font-normal">
        User <span className="text-[0.9em] font-medium">&lt;</span>
        <span className="mx-[1px] font-medium">{answer.answerer.username}</span>
        <span className="text-[0.9em] font-medium">&gt;</span> wrote:
      </p>
      <div className="text-[26px] font-light">
        <span className="me-[7px] text-[#d9d6d6]">
          {/* &quot; */}
          &#10077;
        </span>
        {answer.answerText}
        <span className="ms-[2px]">
          {/* &quot; */}
          {/* &#10078; */}
        </span>
      </div>
    </li>
  );
}
