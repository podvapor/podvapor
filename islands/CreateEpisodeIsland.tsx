import { useEffect, useRef, useState } from "preact/hooks"
import { v4 as uuidv4 } from 'https://esm.sh/uuid@9.0.1'
import { LoudnessMeter } from 'https://esm.sh/@domchristie/needles@0.0.2-1'
import axios from 'https://cdn.skypack.dev/axios'
import { ID3Writer } from 'https://esm.sh/browser-id3-writer@6.0.0'
import { DateTime } from 'https://esm.sh/luxon@3.4.3'

export default function CreateEpisodeIsland(props) {
  const [ id, setId ] = useState(uuidv4())
  const [ title, setTitle ] = useState('')
  const [ description, setDescription ] = useState('')
  const [ notes, setNotes ] = useState('')
  const [ submittingText, setSubmittingText ] = useState('')

  const [ audioFile, setAudioFile ] = useState(null)
  const [ audioFileLoudness, setAudioFileLoudness ] = useState('')
  const audioFileRef = useRef(null)
  
  async function setAudioFileRef(e) {
    setAudioFileLoudness('Calculating...')
    setAudioFile(e.target.files[0])

    const AudioContext = window.AudioContext || window.webkitAudioContext
    const audioContext = new AudioContext()

    const audioData = await audioContext.decodeAudioData(await e.target.files[0].arrayBuffer(), (buffer) => {
      const OfflineAudioContext = window.OfflineAudioContext || window.webkitOfflineAudioContext
      const offlineAudioContext = new OfflineAudioContext(
        buffer.numberOfChannels,
        buffer.length,
        buffer.sampleRate
      )

      const source = offlineAudioContext.createBufferSource()
      source.buffer = buffer

      // @ts-ignore no types for LoudnessMeter
      const loudnessMeter = new LoudnessMeter({
        source,
        modes: ['integrated'],
        workerUri: '/needles-worker.js'
      })

      loudnessMeter.on('dataavailable', function (event) {
        setAudioFileLoudness(event.data.value.toFixed(2))
      })

      loudnessMeter.start()
    })
  }

  async function submit(e) {
    e.preventDefault()

    const now = DateTime.now()

    setSubmittingText('Submitting...')
    const newFilename = id + '.mp3'

    setNotes(tinymce.get('notes').getContent())

    const uploadUrlResponse = await axios.post(`/admin/episodes/audio-upload-url`, {
      filename: newFilename
    })

    const uploadUrl = uploadUrlResponse.data.url

    const audioArrayBuffer = await audioFile.arrayBuffer()

    // ID3 tags
    const podcastImage = await axios.get(props.podcast.coverImageUrl, {
      responseType: 'arraybuffer'
    })

    setSubmittingText('Writing ID3 tags...')

    const writer = new ID3Writer(audioArrayBuffer)
    writer.setFrame('TIT2', title)
      .setFrame('TALB', props.podcast.title)
      .setFrame('TYER', now.toFormat('yyyy'))
      .setFrame('TPE1', [props.podcast.owner.name])
      .setFrame('APIC', {
        type: 3,
        data: podcastImage.data,
        description: props.podcast.title + ' cover art'
      })
    
    writer.addTag()

    const audioFileSize = writer.arrayBuffer.byteLength
            
    const uploadAudioResponse = await axios.put(uploadUrl, writer.arrayBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'x-amz-acl': 'public-read'
      },

      onUploadProgress: (progressEvent) => {
        const percentCompleted = (progressEvent.loaded * 100) / progressEvent.total
        setSubmittingText('Uploading audio file: '+Math.floor(percentCompleted)+'% complete')
      }
    })

    const prunedAudioUrl = new URL(uploadUrl)

    const AudioContext = window.AudioContext || window.webkitAudioContext
    const audioContext = new AudioContext()

    const audioData = await audioContext.decodeAudioData(await audioFile.arrayBuffer())

    const formResponse = await fetch('/admin/episodes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: id,
        title: title,
        description: description,
        notes: tinymce.get('notes').getContent(),
        audio: {
          length: audioFileSize,
          type: 'audio/mpeg',
          url: prunedAudioUrl.origin + prunedAudioUrl.pathname
        },
        duration: Math.ceil(audioData.duration),
        published: now.toFormat('yyyy-LL-dd HH:mm:ss'),
        podcast_id: props.podcast.id,
      })
    })

    window.location.href = `/admin/podcasts/${ props.podcast.slug }`
  }

  useEffect(() => {
    const darkMode = document.documentElement.getAttribute('data-bs-theme') === 'dark' ? true : false

    // @ts-ignore tinymce is a global browser dep
    tinymce.init({
      selector: 'textarea#notes',
      promotion: false,
      plugins: ['lists', 'link'],
      toolbar: 'undo redo | styles | bold italic underline | link | numlist bullist | alignleft aligncenter alignright alignjustify',
      skin: darkMode ? 'oxide-dark' : 'oxide',
      content_css: darkMode ? 'dark' : 'light',
      link_assume_external_targets: true,
    })
  }, [])

  return <>
    <h1>Add episode to { props.podcast.title }</h1>
    <form onSubmit={submit}>
      <div class="mb-3">
        <label for="title" class="form-label">Title</label>
        <input type="text" class="form-control" id="title" value={title} onInput={e => { setTitle(e.target.value) }} />
      </div>
      <div class="mb-3">
        <label for="description" class="form-label">Description</label>
        <textarea class="form-control" id="description" value={description} onInput={e => { setDescription(e.target.value) }}></textarea>
      </div>
      <div class="mb-3">
        <label for="notes" class="form-label">Notes</label>
        <textarea class="form-control" id="notes"></textarea>
      </div>
      <div class="mb-3 row g-3">
        <div class="col-12 col-md-6">
          <label for="audio-file" class="form-label">Audio file</label>
          <input ref={audioFileRef} onChange={setAudioFileRef} type="file" class="form-control" />
        </div>
        { audioFile &&  <div class="col-12 col-md-6">
          <div class="d-flex w-100 h-100 align-items-end">
            <div class="alert alert-info w-100 m-0">
              LUFS: { audioFileLoudness }
            </div>
          </div>
        </div> }
      </div>
      <button type="submit" class="btn btn-success">
        <span>
          {
            submittingText || <><i class="bi-plus-lg me-2"></i>Add episode</>
          }
        </span>
      </button>
    </form>
  </>
}