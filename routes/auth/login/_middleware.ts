import { sessionHandler } from "../../../middleware/Session.ts";
import { authHandler } from "../../../middleware/Auth.ts";

export const handler = [
  sessionHandler
]