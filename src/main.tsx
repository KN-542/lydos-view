import { ClerkProvider } from '@clerk/clerk-react'
import { jaJP } from '@clerk/localizations'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './components/AuthProvider'
import './index.css'
import { routeTree } from './routeTree.gen'

// QueryClientを作成
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10000 * 60,
      refetchOnWindowFocus: false,
    },
  },
})

// ルーターを作成
const router = createRouter({ routeTree })

// TypeScript用の型定義
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Root element not found')
}

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Add your Clerk publishable key to the .env file')
}

createRoot(rootElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ClerkProvider
        publishableKey={PUBLISHABLE_KEY}
        signInFallbackRedirectUrl="/home"
        signUpFallbackRedirectUrl="/home"
        signInForceRedirectUrl="/home"
        signUpForceRedirectUrl="/home"
        localization={jaJP}
      >
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </ClerkProvider>
    </QueryClientProvider>
  </StrictMode>
)
