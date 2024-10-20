import { getUsers } from '@/db'
import { NextResponse } from 'next/server'

export async function GET() {
  const users = await getUsers()
  return NextResponse.json({ users, message: 'success' })
}

export async function POST(request: Request) {
  const body = await request.json()
  const name = body.name || 'Guest'

  return NextResponse.json({ message: `Hello, ${name}!` })
}
