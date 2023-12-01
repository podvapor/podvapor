import { MiddlewareHandlerContext } from "$fresh/server.ts";
import { cookieSession, WithSession } from 'fresh-session'

export type State = {} & WithSession

const session = cookieSession()

export function sessionHandler(req: Request, ctx: MiddlewareHandlerContext<State>) {
  return session(req, ctx)
}