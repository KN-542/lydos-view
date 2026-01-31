import { useMutation } from '@tanstack/react-query'
import { client } from '../../../../../../lib/api'

export const useCreateCheckoutSession = () => {
  return useMutation({
    mutationFn: async () => {
      const { data, error } = await client.POST('/setting/checkout-session')

      if (error || !data) {
        throw new Error('Checkout Sessionの作成に失敗しました')
      }

      return data
    },
  })
}
