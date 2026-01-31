import { SignedIn, SignedOut, SignUp } from '@clerk/clerk-react'
import { createFileRoute, Navigate } from '@tanstack/react-router'
import { cn } from '../lib/utils'

export const Route = createFileRoute('/sign-up')({
  component: SignUpPage,
})

function SignUpPage() {
  return (
    <div className={cn('min-h-screen flex items-center justify-center bg-gray-50')}>
      <SignedOut>
        <SignUp />
      </SignedOut>
      <SignedIn>
        <Navigate to="/home" />
      </SignedIn>
    </div>
  )
}
