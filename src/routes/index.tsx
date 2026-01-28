import { SignedIn, SignedOut, SignIn } from '@clerk/clerk-react'
import { createFileRoute, Navigate } from '@tanstack/react-router'
import { cn } from '../lib/utils'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <div className={cn('min-h-screen flex items-center justify-center bg-gray-50')}>
      <SignedOut>
        <SignIn />
      </SignedOut>
      <SignedIn>
        <Navigate to="/home" />
      </SignedIn>
    </div>
  )
}
