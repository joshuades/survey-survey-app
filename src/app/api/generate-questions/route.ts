import { Question } from "@/db";
import * as Sentry from "@sentry/nextjs";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const promptSystem = `Generate three unique survey questions based on the given user input. Each question should be presented in a separate row without any symbols or bullet points. If the user provides specific questions, ensure the new questions are different but related to the same topic, enhancing the survey's depth and interest.
  # Steps

  1. Analyze the user's input to understand the core topic or subject matter.
  2. Review any existing questions the user provides to avoid duplication.
  3. Formulate three distinct questions that align with the topic but offer a new perspective or angle.
  4. Ensure each question is clear, concise, and relevant to the survey as a whole.

  # Output Format

  - Each question should be on a separate line.
  - The text should be plain, with no symbols, numbers or bullet points before the questions.
  - Each question should have a "?" symbol at the end indicating it is a question.

  # Notes

  - Ensure the questions are diverse and contribute meaningful insights related to the topic.
  - Tailor the complexity and focus of questions to suit the expected survey audience.`;

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not configured");
    }

    const { prompt, questions } = await req.json();

    if (typeof prompt !== "string" || !prompt.trim()) {
      return NextResponse.json({ error: "A prompt is required" }, { status: 400 });
    }

    const existingQuestionTexts = Array.isArray(questions)
      ? questions.map((q: Question) => q.questionText).filter(Boolean)
      : [];
    const promptUser = `Survey topic: "${prompt}". \n\nExisting questions: \n${existingQuestionTexts.join(" \n")}`;

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
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
    Sentry.captureException(error, { tags: { route: "generate-questions" } });
    console.error("Error:", error);
    return NextResponse.json({ error: "Failed to generate questions" }, { status: 500 });
  }
}
