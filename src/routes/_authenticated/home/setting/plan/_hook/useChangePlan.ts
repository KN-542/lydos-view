import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { client } from '../../../../../../lib/api'

export function useChangePlan() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (params: { planId: number; paymentMethodId: string }) => {
      const { error } = await client.POST('/setting/plan', {
        body: { planId: params.planId, paymentMethodId: params.paymentMethodId },
      })

      if (error) {
        throw new Error('プランの変更に失敗しました')
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] })
      toast.success('プランを変更しました')
    },
    onError: () => {
      toast.error('プランの変更に失敗しました')
    },
  })
}
