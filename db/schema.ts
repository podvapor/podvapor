import { text, sqliteTable } from 'drizzle-orm/sqlite-core'
import { createId } from '@paralleldrive/cuid2'

export const users = sqliteTable('users', {
  id: text('id').$default(() => createId()).primaryKey(),
  email: text('email'),
  password: text('password')
})