import { Handlers, PageProps } from "$fresh/server.ts";
import { episodes as episodesSchema, podcasts as podcastsSchema } from "../../../db/schema.ts";
import { db } from "../../../db/db.ts";
import { eq } from "drizzle-orm";
import { convertDateForWeb } from "../../../helpers.ts";
import { PublicLayout } from "../../../components/PublicLayout.tsx";
import PlayerButton from "../../../islands/PlayerButton.tsx";

export const handler: Handlers = {
  async GET(_req, ctx) {
    const episode = await db.query.episodes.findFirst({
      where: eq(episodesSchema.id, ctx.params.episode_id)
    })

    const podcast = await db.query.podcasts.findFirst({
      where: eq(podcastsSchema.id, episode?.podcastId)
    })

    episode.podcast = podcast

    return ctx.render(episode)
  }
}

export default function Episode(props: PageProps) {
  return <PublicLayout>
    <div>
      <a href={ '/' + props.data.podcast.slug }>Back to podcast</a>
      <h1>{ props.data.title }</h1>
      <em class="text-secondary-emphasis">{ convertDateForWeb(props.data.published) }</em>
      <p class="mt-2" dangerouslySetInnerHTML={{ __html: props.data.notes }}></p>
      <PlayerButton { ...props.data } />
    </div>
  </PublicLayout>
}