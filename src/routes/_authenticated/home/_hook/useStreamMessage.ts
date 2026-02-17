import { useAuth } from '@clerk/clerk-react'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { messagesQueryKey } from './useMessagesQuery'
import { sessionsQueryKey } from './useSessionsQuery'

const apiUrl = import.meta.env.VITE_API_URL as string

// SSE ストリーミングは TanStack Query (useQuery/useMutation) の Promise ベース設計と相性が悪いため、
// fetch + ReadableStream を直接扱うカスタムフックで実装している。
export function useStreamMessage() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  const [streamingText, setStreamingText] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)

  const streamMessage = async (sessionId: string, content: string) => {
    setIsStreaming(true)
    setStreamingText('')

    try {
      const token = await getToken()
      const res = await fetch(`${apiUrl}/chat/sessions/${sessionId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ content }),
      })

      if (!res.ok || !res.body) {
        throw new Error('メッセージの送信に失敗しました')
      }

      const reader = res.body.pipeThrough(new TextDecoderStream()).getReader()
      let buffer = ''

      while (true) {
        const { value, done } = await reader.read()
        if (done) break

        buffer += value
        const parts = buffer.split('\n\n')
        buffer = parts.pop() ?? ''

        for (const part of parts) {
          for (const line of part.split('\n')) {
            if (!line.startsWith('data: ')) continue
            const payload = line.slice(6)

            if (payload === '[DONE]') break

            // JSON パース失敗のみ無視。API エラーは握りつぶさずそのまま throw する
            let parsed:
              | { token: string }
              | { messageId: number; inputTokens: number; outputTokens: number }
              | { error: string }
            try {
              parsed = JSON.parse(payload)
            } catch {
              continue
            }

            if ('error' in parsed) {
              throw new Error(parsed.error)
            }
            if ('token' in parsed) {
              setStreamingText((prev) => prev + parsed.token)
            }
            if ('messageId' in parsed) {
              // ストリーム完了: メッセージ一覧とセッション一覧を再取得
              await queryClient.invalidateQueries({ queryKey: messagesQueryKey(sessionId) })
              await queryClient.invalidateQueries({ queryKey: sessionsQueryKey })
            }
          }
        }
      }
    } finally {
      // エラー有無に関わらず必ずリセット
      setIsStreaming(false)
      setStreamingText('')
    }
  }

  return { streamMessage, streamingText, isStreaming }
}
