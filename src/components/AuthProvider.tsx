import { useAuth } from '@clerk/clerk-react'
import { type ReactNode, useEffect } from 'react'
import { setToken } from '../lib/api'

export function AuthProvider({ children }: { children: ReactNode }) {
  const { getToken } = useAuth()

  useEffect(() => {
    getToken().then(setToken)
  }, [getToken])

  return <>{children}</>
}
