import { createFileRoute } from '@tanstack/react-router'
import { Suspense, useState } from 'react'
import { cn } from '../../../../../lib/utils'
import { LeftMenu } from '../_components/LeftMenu'
import { usePaymentMethodsQuery } from '../_hook/usePaymentMethodsQuery'
import { useChangePlan } from './_hook/useChangePlan'
import { usePlansQuery } from './_hook/usePlansQuery'

export const Route = createFileRoute('/_authenticated/home/setting/plan/')({
  component: Plan,
})

type SelectedPlan = {
  id: number
  name: string
  price: number
}

function Content() {
  const { data: plansData } = usePlansQuery()
  const { data: paymentData } = usePaymentMethodsQuery()
  const { mutate: changePlan, isPending } = useChangePlan()

  const [selectedPlan, setSelectedPlan] = useState<SelectedPlan | null>(null)
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<string>('')
  const [isPaymentListOpen, setIsPaymentListOpen] = useState(false)

  const handleSelectPlan = (plan: SelectedPlan) => {
    const defaultPm = paymentData.paymentMethods.find((pm) => pm.isDefault)
    setSelectedPlan(plan)
    setSelectedPaymentMethodId(defaultPm?.id ?? paymentData.paymentMethods[0]?.id ?? '')
    setIsPaymentListOpen(false)
  }

  const handleConfirm = () => {
    if (!selectedPlan || !selectedPaymentMethodId) return
    changePlan(
      { planId: selectedPlan.id, paymentMethodId: selectedPaymentMethodId },
      {
        onSuccess: () => {
          setSelectedPlan(null)
          setSelectedPaymentMethodId('')
          setIsPaymentListOpen(false)
        },
      }
    )
  }

  const selectedPmDetail = paymentData.paymentMethods.find(
    (pm) => pm.id === selectedPaymentMethodId
  )

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2">
        {plansData.plans.map((plan) => (
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
              onClick={() => handleSelectPlan({ id: plan.id, name: plan.name, price: plan.price })}
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

      {selectedPlan !== null && (
        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow">
          {/* 支払い方法 */}
          <h3 className="mb-4 text-base font-semibold text-gray-900">お支払い方法</h3>

          {paymentData.paymentMethods.length === 0 ? (
            <p className="text-sm text-gray-500">
              支払い方法が登録されていません。先にお支払い方法を登録してください。
            </p>
          ) : (
            <div className="space-y-3">
              {/* 選択中の支払い方法（常時表示） */}
              {selectedPmDetail && (
                <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-900 bg-gray-50 p-4">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={selectedPmDetail.id}
                    checked
                    onChange={() => {}}
                    className="accent-gray-900"
                  />
                  <span className="text-sm font-medium capitalize text-gray-900">
                    {selectedPmDetail.brand} **** {selectedPmDetail.last4}
                  </span>
                  <span className="text-xs text-gray-500">
                    {selectedPmDetail.expMonth}/{selectedPmDetail.expYear}
                  </span>
                </label>
              )}

              {/* 支払い方法を変更ボタン */}
              {paymentData.paymentMethods.length > 1 && (
                <button
                  type="button"
                  onClick={() => setIsPaymentListOpen((prev) => !prev)}
                  className="text-sm text-gray-600 underline-offset-2 hover:underline"
                >
                  {isPaymentListOpen ? '閉じる' : '支払い方法を変更'}
                </button>
              )}

              {/* 支払い方法一覧（展開時のみ） */}
              {isPaymentListOpen && (
                <div className="space-y-2 pt-1">
                  {paymentData.paymentMethods
                    .filter((pm) => pm.id !== selectedPaymentMethodId)
                    .map((pm) => (
                      <label
                        key={pm.id}
                        className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 p-4 hover:border-gray-400"
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={pm.id}
                          checked={selectedPaymentMethodId === pm.id}
                          onChange={() => {
                            setSelectedPaymentMethodId(pm.id)
                            setIsPaymentListOpen(false)
                          }}
                          className="accent-gray-900"
                        />
                        <span className="text-sm font-medium capitalize text-gray-900">
                          {pm.brand} **** {pm.last4}
                        </span>
                        <span className="text-xs text-gray-500">
                          {pm.expMonth}/{pm.expYear}
                        </span>
                      </label>
                    ))}
                </div>
              )}
            </div>
          )}

          <hr className="my-6 border-gray-200" />

          {/* プラン確認 */}
          <div className="mb-6 space-y-1">
            <p className="text-sm text-gray-500">変更後のプラン</p>
            <p className="text-base font-semibold text-gray-900">{selectedPlan.name}</p>
            <p className="text-sm text-gray-700">
              ¥{selectedPlan.price.toLocaleString()}
              <span className="text-gray-500"> / 月</span>
            </p>
          </div>

          {/* 確定ボタン */}
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!selectedPaymentMethodId || isPending}
            className="w-full rounded-lg bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? '処理中...' : 'お支払いを確定する'}
          </button>
        </div>
      )}
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
