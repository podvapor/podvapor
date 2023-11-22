import { db } from "../db/db.ts"
import { users } from '../db/schema.ts'

await db.insert(users).values({ email: 'joe.sweeney224@gmail.com', password: 'password' })