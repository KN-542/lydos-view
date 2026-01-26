import createClient from 'openapi-fetch'
import type { paths } from './api-types'

const apiUrl = import.meta.env.VITE_API_URL as string

export const client = createClient<paths>({ baseUrl: apiUrl })
