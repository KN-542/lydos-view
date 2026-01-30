import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { client } from '../lib/api'

// GET: メッセージ取得
export function useGetMessage(message: string) {
  return useSuspenseQuery({
    queryKey: ['message', 'get', message],
    queryFn: async () => {
      const response = await client.GET('/api/message', {
        params: {
          query: {
            message: message || undefined,
          },
        },
      })

      if (response.error) {
        throw new Error('メッセージの取得に失敗しました')
      }

      return response.data
    },
  })
}

// GET: プラン一覧取得
export function useGetPlans() {
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

// POST: メッセージ送信
export function usePostMessage() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await client.POST('/api/message', {
        body: {
          message: message as never,
        } as never,
      })

      if (response.error) {
        throw new Error('メッセージの送信に失敗しました')
      }

      return response.data
    },
    onSuccess: (data) => {
      if (data) {
        queryClient.setQueryData(['message', 'post', data.message], data)
      }
    },
  })

  return {
    sendMessage: mutation.mutate,
    data: mutation.data,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  }
}
