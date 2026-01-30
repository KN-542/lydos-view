import { SignedIn, UserButton } from '@clerk/clerk-react'
import { createRootRoute, Outlet, useRouterState } from '@tanstack/react-router'
import { cn } from '../lib/utils'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  const router = useRouterState()
  const isRootPath = router.location.pathname === '/'

  return (
    <>
      {/* ルートパス以外で共通ヘッダーを表示 */}
      {!isRootPath && (
        <SignedIn>
          <header className={cn('bg-gray-50 border-b border-gray-200')}>
            <div className={cn('container mx-auto px-4 py-4 flex items-center justify-between')}>
              <h1 className={cn('text-xl font-bold text-gray-900')}>Lydos</h1>
              <UserButton userProfileMode="modal" signInUrl="/" />
            </div>
          </header>
        </SignedIn>
      )}
      <Outlet />
    </>
  )
}
