import createClient from 'openapi-fetch'
import type { paths } from './api-types'

const apiUrl = import.meta.env.PROD ? 'https://local.api.lydos' : 'https://local.api.lydos'

export const client = createClient<paths>({ baseUrl: apiUrl })
