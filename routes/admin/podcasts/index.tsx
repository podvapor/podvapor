import { Handlers, PageProps } from "$fresh/server.ts";
import { z } from 'zod'
import { fromZodError, errorMap } from 'zod-validation-error'
import vine, { SimpleMessagesProvider } from '@vinejs/vine'

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

    const parsed = {
      id: form.id,
      title: form.title,
      slug: form.slug,
      description: form.description,
      categories: form.categories,
      owner: { name: form.owner.name, email: form.owner.email },
      author: form.author,
      copyright: form.copyright,
      coverImageUrl: form.cover_image_url
    }

    // const Podcast = z.object({
    //   id: z.string().min(1),
    //   title: z.string().min(1),
    //   slug: z.string().min(1),
    //   description: z.string().min(1),
    //   categories: z.string().min(1).array().nonempty(),
    //   owner: z.object({
    //     name: z.string().min(1),
    //     email: z.string().min(1).email()
    //   }),
    //   author: z.string().min(1),
    //   copyright: z.string().min(1),
    //   coverImageUrl: z.string().min(1).url()
    // })

    vine.convertEmptyStringsToNull = true

    vine.messagesProvider = new SimpleMessagesProvider({
      'required': '{{ field }} is required',
      'categories.*.required': 'At least one category is required'
    })

    const Podcast = vine.object({
      id: vine.string().minLength(36),
      title: vine.string(),
      slug: vine.string().regex(/^[a-z-]+$/),
      description: vine.string(),
      categories: vine.array(vine.string()),
      owner: vine.object({
        name: vine.string(),
        email: vine.string().email()
      }),
      author: vine.string(),
      copyright: vine.string(),
      coverImageUrl: vine.string().url({
        require_tld: false // for local minio
      })
    })

    try {
      await vine.validate({
        schema: Podcast,
        data: parsed,
      })

      await db.insert(podcastsSchema).values(parsed)

      return new Response(null, {
        status: 303,
        headers: {
          location: '/admin/podcasts'
        }
      })
    } catch (e) {
      return new Response(JSON.stringify(e.messages.map(err => err.message)), {
        status: 422,
        headers: {
          'Content-Type': 'application/json',
        }
      })
    }
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
                  <h2 class="card-title"><a href={ `/admin/podcasts/${ pc.slug }` }>{ pc.title }</a></h2>
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