import { Handlers } from '$fresh/server.ts'
import { convertTimeForFeed } from "../../helpers.ts"
import { db } from "../../db/db.ts"
import { podcasts as podcastsSchema, episodes as episodesSchema } from "../../db/schema.ts"
import { eq, desc } from "drizzle-orm"
import escape from 'npm:lodash.escape'

export const handler: Handlers = {
  async GET(req, ctx) {

    console.log(req)

    const podcast = await db.query.podcasts.findFirst({
      where: eq(podcastsSchema.slug, ctx.params.podcast)
    })

    const episodes = await db.query.episodes.findMany({
      where: eq(episodesSchema.podcastId, podcast.id),
      orderBy: desc(episodesSchema.published)
    })

    const feed = `<?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" xmlns:content="http://purl.org/rss/1.0/modules/content/">
        <channel>
            <title>${ podcast.title }</title>
            <description>${ podcast.description }</description>
            <language>en-us</language>
            <itunes:summary>${ podcast.description }</itunes:summary>
            <itunes:image href="${ podcast?.coverImageUrl }" />
            <link>${ Deno.env.get('DOMAIN') }/${ podcast.slug }</link>

            ${ podcast.categories.map(ct => {
              if (ct.subcategory) {
                return `<itunes:category text="${ escape(ct.category) }"><itunes:category text="${ escape(ct.subcategory) }" /></itunes:category>`
              } else {
                return `<itunes:category text="${ escape(ct.category) }" />`
              }
            }).join('') }

            <itunes:owner>
                <itunes:name>${ podcast.owner.name }</itunes:name>
                <itunes:email>${ podcast.owner.email }</itunes:email>
            </itunes:owner>

            <itunes:author>${ podcast.author }</itunes:author>

            <itunes:explicit>${ podcast?.explicit ? 'true' : 'false' }</itunes:explicit>
            <copyright>${ podcast.copyright }</copyright>
            ${ episodes.map(ep => {
              return `
              <item>
                <guid isPermalink="false">${ ep.id }</guid>
                <title>${ ep.title }</title>
                <itunes:title>${ ep.title }</itunes:title>
                
                ${ ep?.description && `
                <itunes:summary>${ ep.description }</itunes:summary>
                <itunes:subtitle>${ ep.description }</itunes:subtitle>
                <description>${ ep.description }</description>
                ` }
                
                ${ ep?.notes && `<content:encoded><![CDATA[${ ep.notes }]]></content:encoded>` }
                
                <enclosure
                    length="${ ep.audio.length }"
                    type="${ ep.audio.type }"
                    url="${ Deno.env.get('DOMAIN') }/episode/audio/${ ep.id }.mp3"
                />
                <itunes:duration>${ ep.duration }</itunes:duration>
                <pubDate>${ convertTimeForFeed(ep.published) }</pubDate>
                <link>${ Deno.env.get('DOMAIN') }/${ podcast.slug }/${ ep.id }</link>
              </item>
              `
            }).join('') }
        </channel>
    </rss>
  `

    return new Response(feed, {
      headers: {
        'Content-Type': 'application/xml'
      }
    })
  }
}