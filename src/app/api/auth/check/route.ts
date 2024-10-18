import { NextResponse } from 'next/server'
import { getAuthCookie } from '@/lib/cookies'

export async function GET() {
  const isAuthenticated = getAuthCookie()
  return NextResponse.json({ isAuthenticated })
}