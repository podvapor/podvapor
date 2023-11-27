import { useSignal } from "@preact/signals";
import Counter from "../islands/Counter.tsx";
import { PublicLayout } from "../components/PublicLayout.tsx";
import { db } from "../db/db.ts";
import { podcasts as podcastsSchema } from "../db/schema.ts";
import { Handlers, PageProps } from "$fresh/src/server/types.ts";

export const handler: Handlers = {
  async GET(_req, ctx) {
    const podcasts = await db.select().from(podcastsSchema)
    return ctx.render(podcasts)
  }
}

export default function Home(props: PageProps) {
  return (
    <PublicLayout>
      { props.data.map(pc => <div class="col-12">
          <div class="card">
            <div class="card-body">
              <div class="row">
                <div class="col-12 col-sm-4 col-md-3 col-lg-2">
                  <img src={ pc.coverImageUrl } class="mb-3 w-100" alt="" />
                </div>
                <div class="col-12 col-sm-8 col-md-9 col-lg-10">
                  <h2 class="card-title"><a href="">{ pc.title }</a></h2>
                  <p>{ pc.description }</p>
                  <ul>
                    <li><a data-turbo="false" href="">RSS Feed</a></li>
                    { pc.links.map((lk, index) => <li><a href={ lk.link }>{ lk.name }</a></li>) }
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
