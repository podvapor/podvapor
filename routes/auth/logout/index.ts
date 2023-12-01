import { Handlers } from "$fresh/server.ts"
import { WithSession } from "fresh-session";

export type Data = { session: Record<string, unknown> }

export const handler: Handlers<Data,WithSession> = {
  POST(req, ctx) {
    const { session } = ctx.state

    session.clear()

    const headers = new Headers()

    headers.set('location', '/auth/login')

    return new Response(null, {
      status: 303,
      headers
    })
  }
}