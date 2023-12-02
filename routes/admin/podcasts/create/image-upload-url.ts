import { Handlers } from '$fresh/server.ts'
import { getSignedUrl } from "aws-s3-presign"

export const handler: Handlers = {
  async POST(req, ctx) {
    const { filename } = await req.json()

    const url = getSignedUrl({
      accessKeyId: Deno.env.get('S3_ACCESS_KEY'),
      secretAccessKey: Deno.env.get('S3_SECRET_KEY'),
      bucket: 'podvapor',
      key: '/images/' + filename,
      method: 'PUT',
      expiresIn: 900,
      endpoint: Deno.env.get('S3_ENDPOINT'),
      protocol: Deno.env.get('S3_PROTOCOL'),
      usePathRequestStyle: Deno.env.get('S3_PATH_STYLE_ENDPOINT') === '1' ? true : false,
    })

    return new Response(JSON.stringify({
      url
    }), {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}