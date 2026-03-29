import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import './App.css'
import logo from '../logo.png'
import { createShortUrl, deleteShortUrl, getUrls } from './api/shortUrl'

function App() {
  const [fullUrl, setFullUrl] = useState('')
  const queryClient = useQueryClient()

  const {
    data: urls = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['shortUrls'],
    queryFn: getUrls,
  })

  const createMutation = useMutation({
    mutationFn: createShortUrl,
    onSuccess: async () => {
      setFullUrl('')
      await queryClient.invalidateQueries({ queryKey: ['shortUrls'] })
    },
    onError: (err) => {
      toast.error(err.message || 'Something went wrong while creating URL')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteShortUrl,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['shortUrls'] })
    },
    onError: (err) => {
      toast.error(err.message || 'Something went wrong while deleting URL')
    },
  })

  const handleCreate = async (event) => {
    event.preventDefault()
    if (!fullUrl.trim()) return
    await createMutation.mutateAsync(fullUrl)
  }

  const handleDelete = async (id) => {
    await deleteMutation.mutateAsync(id)
  }

  const getShortLink = (item) => item.shortLink || `http://localhost:5001/${item.shortUrl}`

  const handleCopy = async (item) => {
    try {
      await navigator.clipboard.writeText(getShortLink(item))
      toast.success('Link copied')
    } catch {
      toast.error('Failed to copy short URL')
    }
  }

  return (
    <>
      <header className="topbar">
        <img src={logo} alt="NickURL logo" className="topbar-logo" />
        <span>NickURL</span>
      </header>

      <main className="container">
        <section className="hero">
          <h1>NickURL</h1>
          <p className="hero-subtitle">paste your long link to shorten it</p>
          <p className="hero-caption">
            free tool to shorten a URL or reduce link, Use our NickURL tool to create a shortened
            &amp; neat link making it easy to use
          </p>

          <form className="url-form" onSubmit={handleCreate}>
            <input
              type="url"
              placeholder="add your link"
              value={fullUrl}
              onChange={(event) => setFullUrl(event.target.value)}
              required
            />
            <button type="submit" aria-label="Shorten URL" title="Shorten URL">
              Shorten URL  ✂
            </button>
          </form>
        </section>

        {isError && <p className="error">{error.message || 'Failed to fetch URLs'}</p>}

        <section className="generated-section">
          <div className="table-head">
            <span>FULL URL</span>
            <span>SHORT URL</span>
            <span>ACTION</span>
          </div>

          {isLoading && <p className="state-text">Loading URLs...</p>}
          {!isLoading && urls.length === 0 && <p className="state-text">No URLs generated yet</p>}

          {[...urls].reverse().map((item) => (
            <div className="table-row" key={item._id}>
              <p className="full-url">{item.fullUrl}</p>
              <a className="short-url" href={getShortLink(item)} target="_blank" rel="noreferrer">
                {item.shortUrl}
              </a>
              <div className="action-cell">
                <button type="button" className="icon-btn copy" onClick={() => handleCopy(item)}>
                  Copy
                </button>
                <button
                  type="button"
                  className="icon-btn delete"
                  onClick={() => handleDelete(item._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </section>
      </main>

      <footer className="footer">Copyright © NickURL | Rahul Nataraj M</footer>

    </>
  )
}

export default App
