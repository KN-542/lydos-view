import { createFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'
import { cn } from '../../../../../lib/utils'
import { LeftMenu } from '../_components/LeftMenu'
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
            'rounded-xl border-2 bg-white p-8 transition-all',
            plan.isSelected
              ? 'border-green-500 bg-green-50 shadow-lg'
              : 'border-gray-200 hover:border-gray-900 hover:shadow-lg'
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
            disabled={plan.isSelected}
            className={cn(
              'mt-8 w-full rounded-lg px-6 py-3 text-sm font-semibold transition-colors',
              plan.isSelected
                ? 'bg-green-500 text-white opacity-60'
                : 'bg-gray-900 text-white hover:bg-gray-700'
            )}
          >
            {plan.isSelected ? '✓ 現在のプラン' : 'このプランを選択'}
          </button>
        </div>
      ))}
    </div>
  )
}

function Plan() {
  return (
    <LeftMenu title="プラン変更" description="お客様に最適なプランをお選びください">
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-gray-900" />
          </div>
        }
      >
        <Content />
      </Suspense>
    </LeftMenu>
  )
}
