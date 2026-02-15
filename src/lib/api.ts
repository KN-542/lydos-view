import createClient, { type Middleware } from 'openapi-fetch'
import type { paths } from './api-types'

const apiUrl = import.meta.env.VITE_API_URL as string

let token: string | null = null

export function setToken(newToken: string | null) {
  token = newToken
}

const authMiddleware: Middleware = {
  onRequest({ request }) {
    if (token) {
      request.headers.set('Authorization', `Bearer ${token}`)
    }
    return request
  },
}

export const client = createClient<paths>({ baseUrl: apiUrl })
client.use(authMiddleware)
