import { useSuspenseQuery } from '@tanstack/react-query'
import { client } from '../../../../../lib/api'

export function usePaymentMethodsQuery() {
  return useSuspenseQuery({
    queryKey: ['payment-methods'],
    queryFn: async () => {
      const response = await client.GET('/setting/payment-methods')

      if (response.error) {
        throw new Error('支払い方法の取得に失敗しました')
      }

      return response.data
    },
  })
}
