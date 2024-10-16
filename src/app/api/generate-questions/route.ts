import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  const { prompt } = await req.json()

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant that generates survey questions.' },
        { role: 'user', content: `Generate 3 survey questions about: ${prompt}` },
      ],
    })

    const questions = completion?.choices[0]?.message?.content
      ?.split('\n')
      .filter((q) => q.trim() !== '')

    return NextResponse.json({ questions })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed to generate questions' }, { status: 500 })
  }
}
