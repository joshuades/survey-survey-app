import { setAuthCookie } from '@/lib/cookies'
import { NextResponse } from 'next/server'

const VALID_PASSWORDS = process.env.VALID_PASSWORDS?.split(',') || []

export async function POST(request: Request) {
  const { password } = await request.json()

  if (VALID_PASSWORDS.includes(password)) {
    setAuthCookie(true)
    return NextResponse.json({ success: true })
  } else {
    return NextResponse.json({ success: false }, { status: 401 })
  }
}

export async function DELETE() {
  setAuthCookie(false)
  return NextResponse.json({ success: true })
}
