import { useEffect, useRef, useState } from "preact/hooks"
import { v4 as uuidv4 } from 'https://esm.sh/uuid@9.0.1'

export default function CreatePodcastIsland() {
  const [ id, setId ] = useState(uuidv4())
  const [ title, setTitle ] = useState('')
  const [ slug, setSlug ] = useState('')
  const [ description, setDescription ] = useState('')
  const [ categories, setCategories ] = useState([
    {
      id: uuidv4(),
      name: ''
    }
  ])
  const [ ownerName, setOwnerName ] = useState('')
  const [ ownerEmail, setOwnerEmail ] = useState('')
  const [ author, setAuthor ] = useState('')
  const [ copyright, setCopyright ] = useState('')
  const [ coverImageFile, setCoverImageFile ] = useState(null)
  const coverImageFileRef = useRef(null)

  function addCategory() {
    setCategories(cats => [...cats, { id: uuidv4(), name: '' }])
  }

  function updateCategory(id: string, text: string) {
    const categoriesCopy = [...categories]

    const index = categoriesCopy.findIndex(cat => cat.id === id)
    categoriesCopy[index].name = text

    setCategories(categoriesCopy)
  }

  function removeCategory(id: string) {
    const categoriesCopy = [...categories]

    const index = categoriesCopy.findIndex(cat => cat.id === id)
    categoriesCopy.splice(index, 1)

    setCategories(categoriesCopy)
  }

  function setCoverImageFileRef(e) {
    setCoverImageFile(e.target.files[0])
  }

  async function submit(e) {
    e.preventDefault()

    const imageResponse = await fetch('/admin/podcasts/image-upload-url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        filename: id + '.png'
      })
    })

    const uploadUrl = (await imageResponse.json()).url

    const uploadResponse = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'image/png',
        'x-amz-acl': 'public-read',
      },
      body: coverImageFile
    })

    const prunedCoverImageUrl = new URL(uploadUrl)

    const formResponse = await fetch('/admin/podcasts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: id,
        title: title,
        slug: slug,
        description: description,
        categories: categories.map(cat => cat.name),
        owner: {
          name: ownerName,
          email: ownerEmail,
        },
        author: author,
        copyright: copyright,
        cover_image_url: prunedCoverImageUrl.origin + prunedCoverImageUrl.pathname
      })
    })

    window.location.href = '/admin/podcasts'
  }

  return <>
    <h1>Create new podcast</h1>
    <form onSubmit={ submit }>
      <div class="row mb-3">
        <div class="col-12 col-sm-6">
          <label for="title" class="form-label">Title</label>
          <input type="text" class="form-control" id="title" value={ title } onInput={ (e) => { setTitle(e.target.value) } } />
        </div>
        <div class="col-12 col-sm-6">
          <label for="slug" class="form-label">Slug</label>
          <input type="text" class="form-control" id="slug" value={ slug } onInput={ (e) => { setSlug(e.target.value) } } />
        </div>
      </div>
      <div class="mb-3">
        <label for="description" class="form-label">Description</label>
        <textarea class="form-control" id="description" value={ description } onInput={ (e) => { setDescription(e.target.value) } } ></textarea>
      </div>
      <div class="mb-3">
        <label class="form-label">Categories</label>
        { categories.map(cat => <div class="input-group mb-2" key={ cat.id }>
          <input type="text" class="form-control" value={ cat.name } onInput={ (e) => updateCategory(cat.id, e.target.value) } />
          <button class="btn btn-danger" onClick={ e => { e.preventDefault(); removeCategory(cat.id) } } ><i class="bi-x-lg"></i></button>
        </div>) }
        
        <button class="btn btn-success" onClick={ e => { e.preventDefault(); addCategory() } }>
          <i class="bi-plus-lg"></i>
          Add Category
        </button>
      </div>
      <div class="row mb-3">
        <div class="col-12 col-sm-6">
          <label for="owner_name" class="form-label">Owner Name</label>
          <input type="text" class="form-control" id="owner_name" value={ ownerName } onInput={ e => { setOwnerName(e.target.value) } } />
        </div>
        <div class="col-12 col-sm-6">
          <label for="owner_email" class="form-label">Owner Email</label>
          <input type="text" class="form-control" id="owner_email" value={ ownerEmail } onInput={ e => { setOwnerEmail(e.target.value) } } />
        </div>
      </div>
      <div class="row mb-3">
        <div class="col-12 col-sm-6">
          <label for="author" class="form-label">Author</label>
          <input type="text" class="form-control" id="author" value={ author } onInput={ e => { setAuthor(e.target.value) } } />
        </div>
        <div class="col-12 col-sm-6">
          <label for="copyright" class="form-label">Copyright</label>
          <input type="text" class="form-control" id="copyright" value={ copyright } onInput={ e => { setCopyright(e.target.value) } } />
        </div>
      </div>
      <div class="mb-3">
        <label for="image" class="form-label">Image</label>
        <input ref={ coverImageFileRef } onChange={ setCoverImageFileRef } type="file" class="form-control" id="image" accept=".jpg,.jpeg,.png" />
      </div>
      <button class="btn btn-primary" type="submit">Submit</button>
    </form>
  </>
}