import { sessionHandler } from "../../middleware/Session.ts";
import { authHandler } from "../../middleware/Auth.ts";

export type Data = { session: Record<string, unknown> }

export const handler = [
  sessionHandler,
  authHandler
]