import { createFileRoute, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/home/setting/payment/success')({
  component: PaymentSuccess,
})

function PaymentSuccess() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-lg">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg
            className="h-8 w-8 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            role="img"
            aria-label="完了"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="mb-2 text-2xl font-bold text-gray-900">登録完了</h1>
        <p className="mb-8 text-gray-600">カード情報の登録が完了しました</p>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => navigate({ to: '/home/setting/payment' })}
            className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            支払い方法を確認
          </button>
          <button
            type="button"
            onClick={() => navigate({ to: '/home/setting/plan' })}
            className="rounded-lg bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-700"
          >
            プランを選択
          </button>
        </div>
      </div>
    </div>
  )
}
