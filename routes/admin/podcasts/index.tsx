import { Handlers, PageProps } from "$fresh/server.ts";
import { db } from "../../../db/db.ts";
import { AdminLayout } from "../../../components/AdminLayout.tsx";

import { podcasts as podcastsSchema } from "../../../db/schema.ts";

export const handler: Handlers = {
  async GET(req, ctx) {
    const podcasts = await db.query.podcasts.findMany()

    return ctx.render(podcasts)
  },

  async POST(req, ctx) {
    const form = await req.json()

    await db.insert(podcastsSchema).values({
      id: form.id,
      title: form.title,
      slug: form.slug,
      description: form.description,
      categories: form.categories,
      owner: { name: form.owner.name, email: form.owner.email },
      author: form.author,
      copyright: form.copyright,
      coverImageUrl: form.cover_image_url
    })

    return new Response(null, {
      status: 303,
      headers: {
        location: '/admin/podcasts'
      }
    })
  }
}

export default function Podcasts(props: PageProps) {
  return <AdminLayout>
    <h1>Podcasts</h1>
      <a class="btn btn-success" href="/admin/podcasts/create"><i class="bi-plus-lg me-2"></i>Create new podcast</a>
      <div class="row g-4 mt-3">
      { props.data.map(pc => {
        return <div class="col-12">
          <div class="card">
            <div class="card-body">
              <div class="row">
                <div class="col-12 col-sm-4 col-md-3 col-lg-2">
                  <img src={ pc.coverImageUrl } class="mb-3 w-100" alt="" />
                </div>
                <div class="col-12 col-sm-8 col-md-9 col-lg-10">
                  <h2 class="card-title"><a href="#">{ pc.title }</a></h2>
                  <p>{ pc.description }</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
      }) }
      </div>
  </AdminLayout>
}