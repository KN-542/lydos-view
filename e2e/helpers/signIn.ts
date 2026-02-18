import { createClerkClient } from '@clerk/backend'
import type { Page } from '@playwright/test'

/**
 * Clerk sign_in_token を使ってUI認証（メールOTP等）をバイパスしてログインする。
 * `https://local.lydos/?__clerk_ticket=TOKEN` に遷移すると
 * 埋め込みの <SignIn /> がトークンを検出して自動サインインする。
 */
export async function signIn(page: Page) {
  const secretKey = process.env.CLERK_SECRET_KEY
  const userId = process.env.E2E_USER_ID

  if (!secretKey || !userId) {
    throw new Error('CLERK_SECRET_KEY / E2E_USER_ID が .env.test に未設定です')
  }

  const clerk = createClerkClient({ secretKey })
  const tokenResult = await clerk.signInTokens.createSignInToken({
    userId,
    expiresInSeconds: 60,
  })

  await page.goto(`/?__clerk_ticket=${tokenResult.token}`)
  await page.waitForURL('**/home', { timeout: 30000 })
}
