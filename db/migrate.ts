import { migrate } from 'drizzle-orm/libsql/migrator'
import { db, client } from './db.ts'

await migrate(db, { migrationsFolder: './db/migrations' })

await client.close()