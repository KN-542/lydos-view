import { expect, test } from '@playwright/test'
import { signIn } from './helpers/signIn'

// AUTH-01〜AUTH-04: 未認証状態でのテスト
test.describe('認証フロー (未認証)', () => {
  test.use({ storageState: { cookies: [], origins: [] } })

  // AUTH-01: ログイン成功
  test('AUTH-01: sign_in_token でログインすると /home に遷移する', async ({ page }) => {
    await signIn(page)

    await expect(page).toHaveURL(/\/home/)
    await expect(page.getByText('チャット履歴')).toBeVisible()
    await expect(page.locator('textarea[placeholder="メッセージを入力..."]')).toBeVisible()
  })

  // AUTH-02: ログイン失敗（誤パスワード）
  test('AUTH-02: 誤ったパスワードを入力するとエラーが表示される', async ({ page }) => {
    const email = process.env.E2E_USER_EMAIL
    if (!email) {
      test.skip(true, 'E2E_USER_EMAIL が未設定')
    }

    await page.goto('/')
    await page.waitForSelector('input[name="identifier"]', { timeout: 10000 })
    await page.fill('input[name="identifier"]', email as string)
    await page.getByRole('button', { name: '続ける', exact: true }).click()

    await page.waitForSelector('input[name="password"]', { timeout: 10000 })
    await page.fill('input[name="password"]', 'WrongPassword_Invalid_999!')
    await page.getByRole('button', { name: '続ける', exact: true }).click()

    // /home に遷移しない（メールコード画面や元のフォームに留まる）
    await page.waitForTimeout(3000)
    await expect(page).not.toHaveURL(/\/home/)
  })

  // AUTH-03: 未認証ユーザーの認証必須ページアクセス
  test('AUTH-03: 未認証で /home にアクセスするとログイン画面にリダイレクトされる', async ({
    page,
  }) => {
    await page.goto('/home')

    // useRequireAuth が / にリダイレクトする
    await page.waitForURL('https://local.lydos/', { timeout: 10000 })
    await expect(page).toHaveURL('https://local.lydos/')
    await expect(page.locator('input[name="identifier"]')).toBeVisible()
  })

  // AUTH-04: ユーザー登録フォームの表示確認
  // NOTE: メール確認コード (OTP) の入力が必要なため、フォーム表示確認まで
  test('AUTH-04: /sign-up にアクセスするとユーザー登録フォームが表示される', async ({ page }) => {
    await page.goto('/sign-up')

    await expect(page.locator('form')).toBeVisible({ timeout: 10000 })

    if (page.url().includes('/sign-up')) {
      const emailInput = page
        .locator('input[name="emailAddress"]')
        .or(page.locator('input[type="email"]'))
        .or(page.locator('input[name="identifier"]'))
      await expect(emailInput.first()).toBeVisible()
    }
  })
})

// AUTH-05: ログアウト (認証済み状態でのテスト)
test.describe('認証フロー (認証済み)', () => {
  test.use({ storageState: 'e2e/.auth/user.json' })

  test('AUTH-05: ログアウト後にログイン画面にリダイレクトされ /home にアクセスできない', async ({
    page,
  }) => {
    await page.goto('/home')
    await expect(page).toHaveURL(/\/home/)

    // ヘッダーの Clerk UserButton をクリック
    await page.locator('.cl-userButtonTrigger').click()

    // サインアウトをクリック（Clerk の UserButton ポップオーバー内）
    await page.getByText('サインアウト').click()

    // ログイン画面にリダイレクトされる
    await page.waitForURL('https://local.lydos/', { timeout: 10000 })
    await expect(page).toHaveURL('https://local.lydos/')

    // /home に再アクセスしてもリダイレクトされる
    await page.goto('/home')
    await page.waitForURL('https://local.lydos/', { timeout: 10000 })
    await expect(page).toHaveURL('https://local.lydos/')
  })
})
