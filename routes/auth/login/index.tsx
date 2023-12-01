import LoginIsland from "../../../islands/LoginIsland.tsx"
import { Handlers } from "$fresh/server.ts"
import { db } from "../../../db/db.ts";
import { eq } from 'drizzle-orm'
import { users as usersSchema } from "../../../db/schema.ts";
import { WithSession } from "fresh-session";

export type Data = { session: Record<string, unknown> }

export const handler: Handlers<Data,WithSession> = {
  GET(req, ctx) {
    return ctx.render()
  },

  async POST(req, ctx) {
    const { session } = ctx.state

    const { email, password_hashed } = await req.json()
    const user = await db.query.users.findFirst({
      where: eq(usersSchema.email, email)
    })

    if (email) {
      if (user) {
        if (password_hashed === user.password) {
          session.set('user_id', user.id)
          return new Response(JSON.stringify({ message: 'Login successful' }), {
            headers: {
              'Content-Type': 'application/json'
            }
          })
        } else {
          return new Response(JSON.stringify({ error: 'Email or password incorrect' }), {
            headers: {
              'Content-Type': 'application/json',
            },
            status: 401
          })
        }
      } else {
        return new Response(JSON.stringify({ error: 'Email or password incorrect' }), {
          headers: {
            'Content-Type': 'application/json',
          },
          status: 401
        })
      }
    } else {
      return new Response(JSON.stringify({ error: 'Email must be provided' }), {
        headers: {
          'Content-Type': 'application/json',
        },
        status: 401
      })
    }
  }
}

export default function Login() {
  return <LoginIsland />
}