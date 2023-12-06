import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'
import * as schema from './schema.ts'

const config = {
  url: Deno.env.get('DB_URL') as string || 'http://localhost:8080',
  authToken: Deno.env.get('DB_TOKEN')
}

export const client = createClient(config)
export const db = drizzle(client, { schema })