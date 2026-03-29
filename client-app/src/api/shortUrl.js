const parseError = async (response, fallbackMessage) => {
  const payload = await response.json().catch(() => ({}))
  const message = payload.error || payload.message
  throw new Error(message || fallbackMessage)
}

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')
const apiPath = (path) => `${API_BASE_URL}${path}`

export const getUrls = async (userId) => {
  const response = await fetch(apiPath(`/api/shortUrl?userId=${encodeURIComponent(userId)}`), {
    headers: { 'x-user-id': userId },
  })

  if (response.status === 404) {
    return []
  }

  if (!response.ok) {
    await parseError(response, 'Failed to fetch URLs')
  }

  const data = await response.json()
  return Array.isArray(data) ? data : []
}

export const createShortUrl = async ({ fullUrl, userId }) => {
  const response = await fetch(apiPath('/api/shortUrl'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fullUrl: fullUrl.trim(), userId }),
  })

  if (!response.ok) {
    await parseError(response, 'Failed to create short URL')
  }

  return response.json()
}

export const deleteShortUrl = async ({ id, userId }) => {
  const response = await fetch(apiPath(`/api/shortUrl/${id}`), {
    method: 'DELETE',
    headers: { 'x-user-id': userId },
  })

  if (!response.ok) {
    await parseError(response, 'Failed to delete URL')
  }

  return response.json()
}
