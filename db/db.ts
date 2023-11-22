import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'
import * as schema from './schema.ts'

const config = {
  url: 'http://0.0.0.0:8080'
}

export const client = createClient(config)
export const db = drizzle(client, { schema })