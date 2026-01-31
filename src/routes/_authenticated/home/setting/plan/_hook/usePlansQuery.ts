import { useSuspenseQuery } from '@tanstack/react-query'
import { client } from '../../../../../../lib/api'

/**
 * GET: プラン一覧取得
 */
export function usePlansQuery() {
  return useSuspenseQuery({
    queryKey: ['plans'],
    queryFn: async () => {
      const response = await client.GET('/setting/plans')

      if (response.error) {
        throw new Error('プラン一覧の取得に失敗しました')
      }

      return response.data
    },
  })
}
