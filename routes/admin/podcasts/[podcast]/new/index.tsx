import { AdminLayout } from "../../../../../components/AdminLayout.tsx"
import CreateEpisodeIsland from "../../../../../islands/CreateEpisodeIsland.tsx"
import { Handlers, PageProps } from '$fresh/server.ts'
import { episodes as episodesSchema, podcasts as podcastsSchema } from "../../../../../db/schema.ts";
import { db } from "../../../../../db/db.ts";
import { eq } from 'drizzle-orm'
import { Head } from "$fresh/runtime.ts";

export const handler: Handlers = {
  async GET(req, ctx) {
    const podcast = await db.query.podcasts.findFirst({
      where: eq(podcastsSchema.slug, ctx.params.podcast),
    })

    return ctx.render(podcast)
  }
}

export default function NewEpisode(props: PageProps) {
  return <>
  <Head>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/tinymce/6.7.0/tinymce.min.js" integrity="sha512-kGk8SWqEKL++Kd6+uNcBT7B8Lne94LjGEMqPS6rpDpeglJf3xpczBSSCmhSEmXfHTnQ7inRXXxKob4ZuJy3WSQ==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
  </Head>
  <AdminLayout>
    <CreateEpisodeIsland podcast={props.data} />
  </AdminLayout>
  </>
}