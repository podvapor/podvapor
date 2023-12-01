import { MiddlewareHandlerContext } from "$fresh/server.ts";
import { users as usersSchema } from "../db/schema.ts";
import { db } from "../db/db.ts";
import { eq } from 'drizzle-orm';
import { Session } from "fresh-session";

export async function authHandler (req: Request, ctx: MiddlewareHandlerContext) {
  const session = ctx.state.session as Session

  if (session.has('user_id')) {
    const authResult = await db.query.users.findFirst({
      where: eq(usersSchema.id, session.get('user_id'))
    })

    if (authResult) {
      return await ctx.next()
    } else {
      return new Response(null, {
        status: 303,
        headers: {
          'location': '/auth/login'
        }
      })
    }
  } else {
    return new Response(null, {
      status: 303,
      headers: {
        'location': '/auth/login'
      }
    })
  }
}