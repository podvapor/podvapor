import { Handlers, PageProps } from "$fresh/server.ts";
import { db } from "../../../db/db.ts";
import { episodes as episodesSchema } from "../../../db/schema.ts";

export const handler: Handlers = {
  async POST(req, ctx) {
    const form = await req.json()

    await db.insert(episodesSchema).values({
      id: form.id,
      title: form.title,
      description: form.description,
      notes: form.notes,
      audio: {
        length: form.audio.length,
        type: form.audio.type,
        url: form.audio.url
      },
      duration: form.duration,
      published: form.published,
      podcastId: form.podcast_id
    })

    return new Response(JSON.stringify({
      message: 'Episode added successfully'
    }), {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}