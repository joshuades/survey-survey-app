import '@/lib/config'
import { drizzle } from 'drizzle-orm/vercel-postgres'
import { sql } from '@vercel/postgres'
import { usersTable } from './schema'

export const db = drizzle({ client: sql, casing: "snake_case" });

export const getUsers = async () => {
  const selectResult = await db.select().from(usersTable)
  return selectResult
}
