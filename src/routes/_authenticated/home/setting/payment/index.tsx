import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { client } from '../../../../../lib/api'
import { LeftMenu } from '../_components/LeftMenu'
import { useCreateCheckoutSession } from './_hook/useCreateCheckoutSession'

export const Route = createFileRoute('/_authenticated/home/setting/payment/')({
  component: Payment,
})

function Payment() {
  const navigate = useNavigate()
  const { mutate, isPending, error } = useCreateCheckoutSession()

  const { data } = useSuspenseQuery({
    queryKey: ['payment-methods'],
    queryFn: async () => {
      const response = await client.GET('/setting/payment-methods')

      if (response.error) {
        throw new Error('支払い方法の取得に失敗しました')
      }

      return response.data
    },
  })

  const hasPaymentMethod = data.paymentMethods.length > 0

  const handleRegisterPayment = () => {
    mutate(undefined, {
      onSuccess: (data) => {
        // Stripe Checkoutページにリダイレクト
        window.location.href = data.checkoutUrl
      },
    })
  }

  const handleAddCard = () => {
    mutate(undefined, {
      onSuccess: (data) => {
        window.location.href = data.checkoutUrl
      },
    })
  }

  return (
    <LeftMenu
      title="支払い方法の設定"
      description={
        hasPaymentMethod
          ? '登録済みのクレジットカード情報'
          : 'クレジットカード情報を登録してください'
      }
    >
      <div className="mx-auto max-w-2xl">
        <div className="rounded-lg bg-white p-8 shadow">
          {hasPaymentMethod ? (
            // カード登録済みの場合
            <>
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">登録カード一覧</h3>
                <button
                  type="button"
                  onClick={handleAddCard}
                  disabled={isPending}
                  className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isPending ? '準備中...' : 'カードを追加'}
                </button>
              </div>

              <div className="space-y-4">
                {data.paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className="flex items-center justify-between rounded-lg border border-gray-200 p-4"
                  >
                    <div className="flex items-center">
                      <div className="mr-4 flex h-12 w-16 items-center justify-center rounded bg-gray-100">
                        <svg
                          className="h-8 w-8 text-gray-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          role="img"
                          aria-label="クレジットカード"
                        >
                          <title>クレジットカード</title>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 capitalize">{method.brand}</p>
                        <p className="text-sm text-gray-600">**** {method.last4}</p>
                        <p className="text-xs text-gray-500">
                          有効期限: {method.expMonth}/{method.expYear}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {isPending && (
                <div className="mt-4 flex items-center justify-center">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-200 border-t-gray-900" />
                  <p className="ml-2 text-sm text-gray-600">決済ページを準備しています...</p>
                </div>
              )}

              {error && (
                <div className="mt-4 rounded-md bg-red-50 p-4">
                  <p className="text-sm font-medium text-red-800">エラーが発生しました</p>
                  <p className="mt-1 text-sm text-red-700">
                    {error instanceof Error ? error.message : '予期しないエラーが発生しました'}
                  </p>
                </div>
              )}

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => navigate({ to: '/home/setting/plan' })}
                  className="rounded-lg border border-gray-300 bg-white px-6 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                >
                  プラン選択へ
                </button>
              </div>
            </>
          ) : (
            // カード未登録の場合
            <>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900">カード情報の登録</h3>
                <p className="mt-2 text-sm text-gray-600">
                  Stripeの安全な決済ページでカード情報を登録します。
                  <br />
                  ボタンをクリックすると、外部の決済ページに移動します。
                </p>
              </div>

              {error && (
                <div className="mb-6 rounded-md bg-red-50 p-4">
                  <p className="text-sm font-medium text-red-800">エラーが発生しました</p>
                  <p className="mt-1 text-sm text-red-700">
                    {error instanceof Error ? error.message : '予期しないエラーが発生しました'}
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={handleRegisterPayment}
                disabled={isPending}
                className="w-full rounded-lg bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPending ? '準備中...' : 'カード情報を登録'}
              </button>

              {isPending && (
                <div className="mt-4 flex items-center justify-center">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-200 border-t-gray-900" />
                  <p className="ml-2 text-sm text-gray-600">決済ページを準備しています...</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </LeftMenu>
  )
}
