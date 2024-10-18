import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  return NextResponse.json({ message: 'Hello from the API!' })
}

export async function POST(request: Request) {
  const body = await request.json()
  const name = body.name || 'Guest'
  
  return NextResponse.json({ message: `Hello, ${name}!` })
}