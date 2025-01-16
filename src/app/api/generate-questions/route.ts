import { Question } from "@/db";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const promptSystem = `Generate three unique survey questions based on the given user input. Each question should be presented in a separate row without any symbols or bullet points. If the user provides specific questions, ensure the new questions are different but related to the same topic, enhancing the survey's depth and interest.
  # Steps

  1. Analyze the user's input to understand the core topic or subject matter.
  2. Review any existing questions the user provides to avoid duplication.
  3. Formulate three distinct questions that align with the topic but offer a new perspective or angle.
  4. Ensure each question is clear, concise, and relevant to the survey as a whole.

  # Output Format

  - Each question should be on a separate line.
  - The text should be plain, with no symbols, numbers or bullet points before the questions.

  # Notes

  - Ensure the questions are diverse and contribute meaningful insights related to the topic.
  - Tailor the complexity and focus of questions to suit the expected survey audience.`;

export async function POST(req: Request) {
  const { prompt, questions } = await req.json();

  const existingQuestionTexts = questions?.map((q: Question) => q.questionText);
  const promptUser = `Survey topic: "${prompt}". \n\nExisting questions: \n${existingQuestionTexts.join(" \n")}`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: promptSystem,
        },
        {
          role: "user",
          content: promptUser,
        },
      ],
    });

    const regexForListSymbols = /^\s*[\d\.\)\-\*•–—]+\s*/gm;

    const questionTexts = completion?.choices[0]?.message?.content
      ?.split("\n")
      .filter((q) => q.trim() !== "")
      .map((q) => q.replace(regexForListSymbols, ""));

    return NextResponse.json({ questionTexts });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Failed to generate questions" }, { status: 500 });
  }
}
