import { JSX } from "preact";
import { Partial, Head } from "$fresh/runtime.ts";
import Player from '../islands/Player.tsx'

export function PublicLayout(props) {
  return <>
    <Head>
      <link rel="stylesheet" href="https://cdn.plyr.io/3.6.4/plyr.css" />
      <script src="https://cdn.plyr.io/3.6.4/plyr.js" defer></script>
      <link rel="stylesheet" href="/app.css" />
    </Head>
    <div class="container pt-3" f-client-nav>
      <Partial name="public-page">
        { props.children }
      </Partial>
      <Player />
    </div>
  </>
}