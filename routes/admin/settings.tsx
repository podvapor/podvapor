import { Handlers, PageProps } from '$fresh/server.ts'
import { db } from "../../db/db.ts"
import { eq } from "drizzle-orm"
import { settings as settingsSchema } from "../../db/schema.ts"
import { AdminLayout } from "../../components/AdminLayout.tsx"

export const handler: Handlers = {
  async GET(req, ctx) {
    const site_name = await db.query.settings.findFirst({
      where: eq(settingsSchema.key, 'site_name')
    })

    return ctx.render(site_name)
  },

  async POST(req, ctx) {
    const form = await req.formData()

    await db.update(settingsSchema).set({ value: form.get('site_name') }).where(eq(settingsSchema.key, 'site_name'))

    return new Response(null, {
      status: 303,
      headers: {
        'location': '/admin/settings'
      }
    })
  }
}

export default function Settings(props: PageProps) {
  return <AdminLayout>
  <h1>Settings</h1>
      
  <form action="/admin/settings" method="post">
    <div class="mb-3">
      <label for="site-name" class="form-label">Site Name</label>
      <input id="site-name" type="text" class="form-control" value={ props.data.value } name="site_name" />
    </div>
    <button class="btn btn-primary" type="submit">Save</button>
  </form>
  </AdminLayout>
}