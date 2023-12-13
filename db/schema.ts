import { text, sqliteTable, integer } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
  id: text('id').$default(() => crypto.randomUUID()).primaryKey(),
  email: text('email').unique(),
  password: text('password'),
  passwordSalt: text('password_salt'),
})

export const podcasts = sqliteTable('podcasts', {
  id: text('id').$default(() => crypto.randomUUID()).primaryKey(),
  title: text('title'),
  slug: text('slug').unique(),
  categories: text('categories', { mode: 'json' }).$type<{ category: string, subcategory: string | null }[]>(),
  owner: text('owner', { mode: 'json' }).$type<{ name: string, email: string }>(),
  coverImageUrl: text('cover_image_url'),
  description: text('description'),
  links: text('links', { mode: 'json' }).$type<{ name: string, link: string }[]>(),
  author: text('author'),
  copyright: text('copyright'),
})

export const episodes = sqliteTable('episodes', {
  id: text('id').$default(() => crypto.randomUUID()).primaryKey(),
  podcastId: text('podcast_id').references(() => podcasts.id, { onDelete: 'cascade' }),
  title: text('title'),
  description: text('description'),
  notes: text('notes'),
  audio: text('audio', { mode: 'json' }).$type<{ length: number, type: string, url: string }>(),
  duration: integer('duration'),
  published: text('published'),
})

export const settings = sqliteTable('settings', {
  key: text('key').primaryKey(),
  type: text('type').$type<'string' | 'int'>(),
  value: text('value'),
})