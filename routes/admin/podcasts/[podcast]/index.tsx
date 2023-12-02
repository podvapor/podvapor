import { Handlers, PageProps } from '$fresh/server.ts'
import { convertDateForWeb } from "../../../../helpers.ts"
import { episodes as episodesSchema, podcasts as podcastsSchema } from "../../../../db/schema.ts";
import { db } from "../../../../db/db.ts";
import { eq } from 'drizzle-orm'
import { AdminLayout } from "../../../../components/AdminLayout.tsx";

export const handler: Handlers = {
  async GET(req, ctx) {
    const podcast = await db.query.podcasts.findFirst({
      where: eq(podcastsSchema.slug, ctx.params.podcast),
    })

    const episodes = await db.query.episodes.findMany({
      where: eq(episodesSchema.podcastId, podcast.id)
    })

    return ctx.render({podcast, episodes})
  }
}

export default function Podcast(props: PageProps) {
  return <AdminLayout><h1>{ props.data.podcast.title }</h1>
    <a href={ `/admin/podcasts/${ props.data.podcast.slug }/new` } class="btn btn-success"><i class="bi-plus-lg me-2"></i>Add episode</a>
    <h2 class="my-3">Episodes</h2>
      <div class="row g-4">
        { props.data.episodes.map(ep => 
        <div class="col-12">
          <div class="card">
            <div class="card-body">
              <h3 class="card-title"><a href={ `/${ props.data.podcast.slug }/${ ep.id }` }>{ ep.title }</a></h3>
              <em class="text-secondary-emphasis">{ convertDateForWeb(ep.published) }</em>
              <p class="mt-2">{ ep.description }</p>
              <audio class="player" controls>
                <source src={ ep.audio.url } />
              </audio>
            </div> 
          </div>
        </div>
        ) }
      </div>
    </AdminLayout>
}