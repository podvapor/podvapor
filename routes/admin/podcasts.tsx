import { Handlers, PageProps } from "$fresh/server.ts";
import { db } from "../../db/db.ts";
import { AdminLayout } from "../../components/AdminLayout.tsx";

export const handler: Handlers = {
  async GET(req, ctx) {
    const podcasts = await db.query.podcasts.findMany()

    return ctx.render(podcasts)
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