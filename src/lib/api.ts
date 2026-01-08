import { getToken } from './auth'

export async function apiFetch(
  url: string,
  options: RequestInit = {}
) {
  const token = await getToken()

  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  })
}
