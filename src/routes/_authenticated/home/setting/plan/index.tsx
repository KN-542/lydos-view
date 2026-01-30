import { createFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'
import { cn } from '../../../../../lib/utils'
import { usePlansQuery } from './_hook/usePlansQuery'

export const Route = createFileRoute('/_authenticated/home/setting/plan/')({
  component: Plan,
})

function Content() {
  const { data: response } = usePlansQuery()

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {response.plans.map((plan) => (
        <div
          key={plan.id}
          className={cn(
            'rounded-xl border-2 border-gray-200 bg-white p-8',
            'hover:border-gray-900 hover:shadow-lg transition-all'
          )}
        >
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
            <div className="mt-4">
              <span className="text-2xl font-bold text-gray-900">
                ¥{plan.price.toLocaleString()}
              </span>
              <span className="text-gray-500"> / 月</span>
            </div>
            <p className="mt-4 text-sm text-gray-600">{plan.description}</p>
          </div>
          <button
            type="button"
            className={cn(
              'mt-8 w-full rounded-lg bg-gray-900 px-6 py-3 text-sm font-semibold text-white',
              'hover:bg-gray-700 transition-colors'
            )}
          >
            このプランを選択
          </button>
        </div>
      ))}
    </div>
  )
}

function Plan() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900">プラン変更</h1>
        <p className="mt-2 text-gray-600">お客様に最適なプランをお選びください</p>

        <div className="mt-8">
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-gray-900" />
              </div>
            }
          >
            <Content />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
