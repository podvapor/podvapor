import { useEffect, useRef, useState } from "preact/hooks"
import { signal } from "@preact/signals"

export default function Player() {
  const playerRef = useRef(null)

  const [showing, setShowing] = useState(false)

  const [episode, setEpisode] = useState({
    title: '',
    podcast_title: '',
    audio_url: 'https://podcast-media.sweeney.digital/episode_audio_files/72a6c29c-2414-4292-9289-5e6db8dda81b.mp3',
  })

  useEffect(() => {
    playerRef.current.src = episode.audio_url
    
    const player = new Plyr('#global-player')

    setShowing(true)
  }, [episode])

 return <div 
      id="global-player-wrapper"
      class="fixed-bottom p-3 border-top" 
      style={`background-color: var(--bs-body-bg); display: ${ showing ? 'block' : 'none' }`}
    >
      <small id="player-podcast-title">{ episode.podcast_title }</small>
      <h4 id="player-episode-title">{ episode.title }</h4>
      <audio ref={ playerRef } id="global-player" controls></audio>
  </div>
}