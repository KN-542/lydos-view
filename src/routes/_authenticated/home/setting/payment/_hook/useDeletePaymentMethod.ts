import { useMutation, useQueryClient } from '@tanstack/react-query'
import { client } from '../../../../../../lib/api'

export const useDeletePaymentMethod = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (paymentMethodId: string) => {
      const { error } = await client.DELETE('/setting/payment-methods/{paymentMethodId}', {
        params: { path: { paymentMethodId } },
      })

      if (error) {
        throw new Error('支払い方法の削除に失敗しました')
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-methods'] })
    },
  })
}
