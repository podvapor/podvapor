import { JSX } from "preact";
import { Partial } from "$fresh/runtime.ts";

export function PublicLayout(props) {
  return <div class="container pt-3" f-client-nav>
    <Partial name="public-page">
      { props.children }
    </Partial>
    <audio controls src="https://podcast-media.sweeney.digital/episode_audio_files/72a6c29c-2414-4292-9289-5e6db8dda81b.mp3"></audio>
  </div>
}