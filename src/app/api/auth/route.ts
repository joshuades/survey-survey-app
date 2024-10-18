import { setAuthCookie } from '@/lib/cookies'
import { verifyPassword } from '@/lib/passwordUtils'
import { NextResponse } from 'next/server'

const HASHED_PASSWORDS = process.env.HASHED_PASSWORDS?.split(',') || []

export async function POST(request: Request) {
  const { password } = await request.json()

  for (const hashedPassword of HASHED_PASSWORDS) {
    console.log("tried hash:", hashedPassword);
    if (await verifyPassword(password, hashedPassword)) {
      setAuthCookie(true)
      return NextResponse.json({ success: true })
    }
  }

  return NextResponse.json({ success: false }, { status: 401 })
}

export async function DELETE() {
  setAuthCookie(false)
  return NextResponse.json({ success: true })
}