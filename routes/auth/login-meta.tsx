import { HandlerContext, Handlers } from "$fresh/server.ts";
import { db } from "../../db/db.ts";
import { eq } from 'drizzle-orm'
import { users as usersSchema } from "../../db/schema.ts";
import { encode } from 'https://deno.land/std@0.160.0/encoding/base64url.ts'

export const handler: Handlers = {
  async POST(_req: Request, _ctx: HandlerContext) {
    const form = await _req.json()
    
    const user = await db.query.users.findFirst({
      where: eq(usersSchema.email, form.email)
    })

    return new Response(JSON.stringify({
      salt: user ? user.passwordSalt : encode(crypto.getRandomValues(new Uint8Array(16)))
    }), {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}