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
    hey there
  </AdminLayout>
}