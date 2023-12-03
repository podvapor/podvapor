import { PublicLayout } from "../components/PublicLayout.tsx";
import { db } from "../db/db.ts";
import { podcasts as podcastsSchema } from "../db/schema.ts";
import { Handlers, PageProps } from "$fresh/server.ts";

export const handler: Handlers = {
  async GET(_req, ctx) {
    const podcasts = await db.select().from(podcastsSchema)
    return ctx.render(podcasts)
  }
}

export default function Home(props: PageProps) {
  return (
    <PublicLayout>
      { props.data.map((pc, pcIndex) => <div class="col-12">
          <div class={ `card ${ pcIndex > 0 && 'mt-3' }` }>
            <div class="card-body">
              <div class="row">
                <div class="col-12 col-sm-4 col-md-3 col-lg-2">
                  <img src={ pc.coverImageUrl } class="mb-3 w-100" alt="" />
                </div>
                <div class="col-12 col-sm-8 col-md-9 col-lg-10">
                  <h2 class="card-title"><a href={ '/' + pc.slug }>{ pc.title }</a></h2>
                  <p>{ pc.description }</p>
                  <ul f-client-nav={false}>
                    <li><a href={ `/${ pc.slug }/feed` }>RSS Feed</a></li>
                    { pc.links?.map((lk, lkIndex) => <li><a href={ lk.link }>{ lk.name }</a></li>) }
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) }
    </PublicLayout>
  );
}
