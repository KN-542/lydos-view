import { createFileRoute, Outlet } from '@tanstack/react-router'
import { useRequireAuth } from '../hook/useRequireAuth'

export const Route = createFileRoute('/_authenticated')({
  component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
  const { isLoaded, isSignedIn } = useRequireAuth()

  if (!isLoaded || !isSignedIn) {
    return null
  }

  return <Outlet />
}
