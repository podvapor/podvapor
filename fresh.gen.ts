// DO NOT EDIT. This file is generated by Fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import * as $_podcast_episode_id_index from "./routes/[podcast]/[episode_id]/index.tsx";
import * as $_podcast_index from "./routes/[podcast]/index.tsx";
import * as $_404 from "./routes/_404.tsx";
import * as $_app from "./routes/_app.tsx";
import * as $admin_middleware from "./routes/admin/_middleware.ts";
import * as $admin_index from "./routes/admin/index.ts";
import * as $admin_podcasts from "./routes/admin/podcasts.tsx";
import * as $admin_settings from "./routes/admin/settings.tsx";
import * as $auth_index from "./routes/auth/index.ts";
import * as $auth_login_meta from "./routes/auth/login-meta.tsx";
import * as $auth_login_middleware from "./routes/auth/login/_middleware.ts";
import * as $auth_login_index from "./routes/auth/login/index.tsx";
import * as $auth_logout_middleware from "./routes/auth/logout/_middleware.ts";
import * as $auth_logout_index from "./routes/auth/logout/index.ts";
import * as $index from "./routes/index.tsx";
import * as $LoginIsland from "./islands/LoginIsland.tsx";
import * as $Player from "./islands/Player.tsx";
import * as $PlayerButton from "./islands/PlayerButton.tsx";
import { type Manifest } from "$fresh/server.ts";

const manifest = {
  routes: {
    "./routes/[podcast]/[episode_id]/index.tsx": $_podcast_episode_id_index,
    "./routes/[podcast]/index.tsx": $_podcast_index,
    "./routes/_404.tsx": $_404,
    "./routes/_app.tsx": $_app,
    "./routes/admin/_middleware.ts": $admin_middleware,
    "./routes/admin/index.ts": $admin_index,
    "./routes/admin/podcasts.tsx": $admin_podcasts,
    "./routes/admin/settings.tsx": $admin_settings,
    "./routes/auth/index.ts": $auth_index,
    "./routes/auth/login-meta.tsx": $auth_login_meta,
    "./routes/auth/login/_middleware.ts": $auth_login_middleware,
    "./routes/auth/login/index.tsx": $auth_login_index,
    "./routes/auth/logout/_middleware.ts": $auth_logout_middleware,
    "./routes/auth/logout/index.ts": $auth_logout_index,
    "./routes/index.tsx": $index,
  },
  islands: {
    "./islands/LoginIsland.tsx": $LoginIsland,
    "./islands/Player.tsx": $Player,
    "./islands/PlayerButton.tsx": $PlayerButton,
  },
  baseUrl: import.meta.url,
} satisfies Manifest;

export default manifest;
