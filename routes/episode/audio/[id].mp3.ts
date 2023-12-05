import { Handlers } from "$fresh/server.ts";
import { eq } from "drizzle-orm";
import { db } from "../../../db/db.ts";
import { episodes as episodesSchema } from "../../../db/schema.ts";

export const handler: Handlers = {
  async GET(req, ctx) {
    const episode = await db.query.episodes.findFirst({
      where: eq(episodesSchema.id, ctx.params.id)
    })

    return new Response(null, {
      status: 302,
      headers: {
        location: episode?.audio?.url as string
      }
    })  
  }
}