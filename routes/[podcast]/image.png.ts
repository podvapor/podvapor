import { Handlers } from '$fresh/server.ts'
import { eq } from "drizzle-orm";
import { db } from "../../db/db.ts";
import { podcasts as podcastsSchema } from "../../db/schema.ts";

export const handler: Handlers = {
  async GET(req, ctx) {
    const podcast = await db.query.podcasts.findFirst({
      where: eq(podcastsSchema.slug, ctx.params.podcast)
    })

    return new Response(null, {
      status: 302,
      headers: {
        location: podcast?.coverImageUrl as string
      }
    })  
  }
}