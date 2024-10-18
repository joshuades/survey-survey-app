'use client'

import { useState } from 'react'
import { PlusCircle, Trash2, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

type Question = {
  id: number
  text: string
  type: 'text' | 'multipleChoice'
  options?: string[]
}

export default function SurveyBuilder() {
  const [survey, setSurvey] = useState<Question[]>([])
  const [newQuestion, setNewQuestion] = useState('')
  const [aiPrompt, setAiPrompt] = useState('')

  const addQuestion = () => {
    if (newQuestion.trim()) {
      setSurvey([...survey, { id: Date.now(), text: newQuestion, type: 'text' }])
      setNewQuestion('')
    }
  }

  const removeQuestion = (id: number) => {
    setSurvey(survey.filter((q) => q.id !== id))
  }

  const generateAIQuestions = async () => {
    try {
      const response = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt }),
      })
      const data = await response.json()
      if (data.questions) {
        const newQuestions = data.questions.map((text: string) => ({
          id: Date.now() + Math.random(),
          text,
          type: 'text' as const,
        }))
        setSurvey([...survey, ...newQuestions])
        setAiPrompt('')
      }
    } catch (error) {
      console.error('Failed to generate questions:', error)
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-screen-sm">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>AI Survey Builder</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <Input
              placeholder="Enter a new question"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
            />
            <Button onClick={addQuestion}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add
            </Button>
          </div>
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-[minmax(100px,_1fr)_auto]">
            <Textarea
              placeholder="Describe the kind of survey you want to create..."
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
            />
            <Button onClick={generateAIQuestions}>
              <Send className="mr-2 h-4 w-4" /> Generate AI Questions
            </Button>
          </div>
        </CardContent>
      </Card>

      {survey.map((question) => (
        <Card key={question.id} className="mb-4">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <p>{question.text}</p>
              <Button variant="ghost" onClick={() => removeQuestion(question.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      {survey.length > 0 && (
        <Card>
          <CardFooter className="p-6">
            <Button className="w-full">Save Survey</Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
