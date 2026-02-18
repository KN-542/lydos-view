import { expect, test as setup } from '@playwright/test'
import { signIn } from '../helpers/signIn'

const authFile = 'e2e/.auth/user.json'

setup('認証セットアップ: ログインしてセッションを保存する', async ({ page }) => {
  await signIn(page)

  await expect(page).toHaveURL(/\/home/)
  await page.context().storageState({ path: authFile })
})
