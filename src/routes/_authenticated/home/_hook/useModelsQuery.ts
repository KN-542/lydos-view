import { useSuspenseQuery } from '@tanstack/react-query'
import { client } from '../../../../lib/api'

export function useModelsQuery() {
  return useSuspenseQuery({
    queryKey: ['chat-models'],
    queryFn: async () => {
      const response = await client.GET('/chat/models')
      if (response.error) throw new Error('モデルの取得に失敗しました')
      return response.data
    },
  })
}
