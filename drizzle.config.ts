import type { Config } from 'npm:drizzle-kit'

export default {
  schema: './db/schema.ts',
  out: './db/migrations',
  driver: 'libsql',
} satisfies Config