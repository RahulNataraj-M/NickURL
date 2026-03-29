const parseError = async (response, fallbackMessage) => {
  const payload = await response.json().catch(() => ({}))
  const message = payload.error || payload.message
  throw new Error(message || fallbackMessage)
}

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')
const apiPath = (path) => `${API_BASE_URL}${path}`

export const getUrls = async () => {
  const response = await fetch(apiPath('/api/shortUrl'))

  if (response.status === 404) {
    return []
  }

  if (!response.ok) {
    await parseError(response, 'Failed to fetch URLs')
  }

  const data = await response.json()
  return Array.isArray(data) ? data : []
}

export const createShortUrl = async (fullUrl) => {
  const response = await fetch(apiPath('/api/shortUrl'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fullUrl: fullUrl.trim() }),
  })

  if (!response.ok) {
    await parseError(response, 'Failed to create short URL')
  }

  return response.json()
}

export const deleteShortUrl = async (id) => {
  const response = await fetch(apiPath(`/api/shortUrl/${id}`), {
    method: 'DELETE',
  })

  if (!response.ok) {
    await parseError(response, 'Failed to delete URL')
  }

  return response.json()
}
