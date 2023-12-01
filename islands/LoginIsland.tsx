import { useEffect, useRef, useState } from "preact/hooks"
import _sodium from 'https://esm.sh/libsodium-wrappers-sumo@0.7.10?target=es2020'
import { IS_BROWSER } from "$fresh/runtime.ts"
import "preact/debug"

export default function LoginIsland() {
  const [email, setEmail] = useState('test@example.com')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const submit = async (e: Event) => {
    e.preventDefault()

    setSubmitting(true)
    setError('')

    await _sodium.ready

    const saltResponse = await fetch('/auth/login-meta', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email
      })
    })

    if (saltResponse.status === 200) {
      const salt = (await saltResponse.json()).salt

      const salt_bytes = _sodium.from_base64(salt)
      const password_hashed = _sodium.crypto_pwhash(
        _sodium.crypto_box_SEEDBYTES,
        password,
        salt_bytes,
        _sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE,
        _sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE,
        _sodium.crypto_pwhash_ALG_DEFAULT,
        'base64'
      )

      const result = await fetch('/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password_hashed
        })
      })

      if (result.status === 401) {
        const newError = (await result.json()).error
        setError(newError)
      }

      if (result.status === 200) {
        window.location.href = '/admin/podcasts'
      }
    } else {
      setError('email must be provided')
    }
    
    setSubmitting(false)
  }

  return <div class="container">
    <div class="row justify-content-center align-items-center vh-100">
      <form onSubmit={submit}>
        { error && <div class="alert alert-danger" role="alert">
          { error }
        </div> }
        <div class="mb-3">
          <label for="exampleInputEmail1" class="form-label">Email address</label>
          <input 
            type="email" 
            class="form-control" 
            id="exampleInputEmail1" 
            aria-describedby="emailHelp"
            value={email}
            onInput={(e) => { setEmail(e.target.value) }}
          />
        </div>
        <div class="mb-3">
          <label for="exampleInputPassword1" class="form-label">Password</label>
          <input 
            type="password" 
            class="form-control" 
            id="exampleInputPassword1"
            value={password}
            onInput={(e) => { setPassword(e.target.value) }}
          />
        </div>
        <button type="submit" class="btn btn-primary" disabled={submitting}>
          { submitting ? <span>Logging in...</span> : <span>Log in</span> }
        </button>
      </form>
    </div>
  </div>
}