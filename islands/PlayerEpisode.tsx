import { ConsoleLogWriter } from "drizzle-orm";
import { convertDateForWeb } from "../helpers.ts";
import { useEffect, useRef, useState } from "preact/hooks"

export default function PlayerEpisode(props) {

  function updatePlayer(episode) {
    const event = new CustomEvent('update-player', {
      detail: episode
    })

    document.dispatchEvent(event)
  }

  return <div class="card">
  <div class="card-body">
    <h3 class="card-title"><a href="/${ props.podcast.slug }/${ ep.id }">{ props.title }</a></h3>
    <em class="text-secondary-emphasis">{ convertDateForWeb(props.published) }</em>
    <p class="mt-2">{ props.description }</p>
    <button class="btn btn-primary" onClick={() => updatePlayer(props)}><i class="bi-play-fill"></i></button>
  </div> 
</div>
}