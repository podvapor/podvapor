import { useEffect, useRef, useState } from "preact/hooks"
import { signal } from "@preact/signals"

export default function Player() {
  const playerRef = useRef(null)

  const [showing, setShowing] = useState(false)

  const [episode, setEpisode] = useState({
    title: '',
    podcast_title: '',
    audio_url: '',
  })

  useEffect(() => {
    document.addEventListener('update-player', (e) => {
      setEpisode({
        title: e.detail.title,
        podcast_title: e.detail.podcast.title,
        audio_url: e.detail.audio.url
      })

      setShowing(true)
    })
    
    const player = new Plyr('#global-player')
  }, [])

  useEffect(() => {
    playerRef.current.pause()
    playerRef.current.src = episode.audio_url
    playerRef.current.play()
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