export default function PlayerButton(props) {

  function updatePlayer(episode) {
    const event = new CustomEvent('update-player', {
      detail: episode
    })

    document.dispatchEvent(event)
  }

  return <button class="btn btn-primary" onClick={() => updatePlayer(props)}><i class="bi-play-fill"></i></button>
}