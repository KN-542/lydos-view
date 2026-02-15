import { useAuth } from '@clerk/clerk-react'
import { type ReactNode, useEffect } from 'react'
import { setTokenGetter } from '../lib/api'

export function AuthProvider({ children }: { children: ReactNode }) {
  const { getToken } = useAuth()

  useEffect(() => {
    setTokenGetter(getToken)
  }, [getToken])

  return <>{children}</>
}
