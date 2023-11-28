import { Handlers, PageProps } from "$fresh/server.ts";
import { PublicLayout } from "../../components/PublicLayout.tsx";
import PlayerEpisode from "../../islands/PlayerEpisode.tsx";
import { episodes as episodesSchema, podcasts as podcastsSchema } from "../../db/schema.ts";
import { db } from "../../db/db.ts";
import { eq } from 'drizzle-orm'
import { convertDateForWeb } from "../../helpers.ts";

export const handler: Handlers = {
  async GET(_req, ctx) {
    const podcast = await db.query.podcasts.findFirst({
      where: eq(podcastsSchema.slug, ctx.params.podcast),
    })

    const episodes = await db.query.episodes.findMany({
      where: eq(episodesSchema.podcastId, podcast.id)
    })

    podcast.episodes = episodes

    return ctx.render(podcast)
  }
}

export default function Podcast(props: PageProps) {
    return <PublicLayout>
      <div class="row">
        <div class="col-12 col-sm-4 col-md-3 col-lg-2">
          <img src={ props.data.coverImageUrl } class="w-100" alt="" />
        </div>
        <div class="col-12 col-sm-8 col-md-9 col-lg-10 mt-3">
          <a href="/">Back to podcasts</a>
          <h1>{ props.data.title }</h1>
          <p>{ props.data.description }</p>
          <ul>
            <li><a href={ Deno.env.get('DOMAIN') + '/' + props.data.slug + '/feed' }>RSS Feed</a></li>
            { props.data.links.map((lk, index) => <li><a href={ lk.link }>{ lk.name }</a></li>) }
          </ul>
        </div>
      </div>

      <h2 class="my-3">Episodes</h2>
      <div class="row g-4">
        { props.data.episodes.map(ep => 
        <div class="col-12">
          <div class="card">
            <div class="card-body">
              <h3 class="card-title"><a href={ '/' + props.data.slug + '/' + ep.id }>{ ep.title }</a></h3>
              <em class="text-secondary-emphasis">{ convertDateForWeb(ep.published) }</em>
              <p class="mt-2">{ ep.description }</p>
              <PlayerEpisode { ...ep } podcast={ props.data } />
            </div> 
          </div>
        </div>
        ) }
      </div>
    </PublicLayout>
}