import { Handlers, PageProps } from "$fresh/server.ts";
import { PublicLayout } from "../components/PublicLayout.tsx";
import { podcasts as podcastsSchema } from "../db/schema.ts";
import { db } from "../db/db.ts";
import { eq } from 'drizzle-orm'

export const handler: Handlers = {
  async GET(_req, ctx) {
    console.log(ctx)
    const podcast = await db.query.podcasts.findFirst({
      where: eq(podcastsSchema.slug, ctx.params.podcast)
    })
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
    </PublicLayout>
}