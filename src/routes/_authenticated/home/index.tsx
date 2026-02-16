import { createFileRoute, Link } from '@tanstack/react-router'
import { ChevronLeft, ChevronRight, Menu, Plus, Send, Settings, Trash2 } from 'lucide-react'
import { Suspense, useEffect, useRef, useState } from 'react'
import { cn } from '../../../lib/utils'
import { useCreateSession } from './_hook/useCreateSession'
import { useDeleteSession } from './_hook/useDeleteSession'
import { useMessagesQuery } from './_hook/useMessagesQuery'
import { useModelsQuery } from './_hook/useModelsQuery'
import { useSessionsQuery } from './_hook/useSessionsQuery'
import { useStreamMessage } from './_hook/useStreamMessage'

export const Route = createFileRoute('/_authenticated/home/')({
  component: () => (
    <Suspense fallback={<ChatPageSkeleton />}>
      <ChatPage />
    </Suspense>
  ),
})

function ChatPageSkeleton() {
  return (
    <div className="flex h-[calc(100vh-73px)] bg-white items-center justify-center text-gray-400 text-sm">
      読み込み中...
    </div>
  )
}

function ChatPage() {
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
  const [prompt, setPrompt] = useState('')
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [streamError, setStreamError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { data: modelsData } = useModelsQuery()
  const { data: sessionsData } = useSessionsQuery()
  const { data: messagesData } = useMessagesQuery(currentSessionId)
  const { mutateAsync: createSession } = useCreateSession()
  const { mutate: deleteSession } = useDeleteSession()
  const { streamMessage, streamingText, isStreaming } = useStreamMessage()

  const defaultModel = modelsData.models.find((m) => m.isDefault) ?? modelsData.models[0]
  const sessions = sessionsData.sessions
  const messages = messagesData?.messages ?? []

  const [selectedModelId, setSelectedModelId] = useState<number>(defaultModel.id)

  // 既存セッション選択時は、そのセッションのモデルを表示
  const currentSession = sessions.find((s) => s.id === currentSessionId)

  // メッセージ追加・ストリーミング時に最下部へスクロール (messages/streamingText は変化検知トリガー)
  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll trigger
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamingText])

  const handleSendMessage = async () => {
    if (prompt.trim() === '' || isStreaming) return

    const content = prompt
    setPrompt('')
    setStreamError(null)

    let sessionId = currentSessionId

    // セッションがなければ作成
    if (sessionId === null) {
      const title = content.length > 20 ? `${content.slice(0, 20)}...` : content
      const session = await createSession({ modelId: selectedModelId, title })
      sessionId = session.id
      setCurrentSessionId(session.id)
    }

    try {
      await streamMessage(sessionId, content)
    } catch (error) {
      setStreamError(error instanceof Error ? error.message : 'メッセージの送信に失敗しました')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleDeleteSession = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation()
    deleteSession(sessionId, {
      onSuccess: () => {
        if (currentSessionId === sessionId) {
          setCurrentSessionId(null)
        }
      },
    })
  }

  const handleNewChat = () => {
    setCurrentSessionId(null)
    setStreamError(null)
    setSelectedModelId(defaultModel.id)
  }

  return (
    <div className="flex h-[calc(100vh-73px)] bg-white">
      {/* サイドバー */}
      <div
        className={cn(
          'border-r border-gray-200 bg-gray-50 transition-all duration-300 overflow-hidden shrink-0',
          isSidebarOpen ? 'w-64' : 'w-0'
        )}
      >
        <div className="w-64 h-full flex flex-col">
          {/* チャット履歴 */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-700">チャット履歴</h2>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleNewChat}
                  className="rounded-lg p-1.5 text-gray-600 hover:bg-gray-200 transition-colors"
                  title="新しいチャット"
                >
                  <Plus size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => setIsSidebarOpen(false)}
                  className="rounded-lg p-1.5 text-gray-600 hover:bg-gray-200 transition-colors"
                  title="サイドバーを閉じる"
                >
                  <ChevronLeft size={18} />
                </button>
              </div>
            </div>
            <div className="space-y-1">
              {sessions.map((session) => (
                <button
                  type="button"
                  key={session.id}
                  onClick={() => setCurrentSessionId(session.id)}
                  className={cn(
                    'w-full rounded-lg p-2.5 text-left',
                    'hover:bg-gray-200 transition-colors',
                    'group',
                    currentSessionId === session.id && 'bg-gray-200'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 truncate">{session.title}</span>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={(e) => handleDeleteSession(e, session.id)}
                        className="p-0.5 rounded text-gray-400 hover:text-red-500 transition-colors"
                        title="削除"
                      >
                        <Trash2 size={13} />
                      </button>
                      <ChevronRight size={14} className="text-gray-400" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 設定エリア */}
          <div className="border-t border-gray-200 p-4">
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className={cn(
                  'w-full flex items-center gap-3 rounded-lg p-3',
                  'hover:bg-gray-200 transition-colors text-gray-700',
                  isSettingsOpen && 'bg-gray-200'
                )}
              >
                <Settings size={20} />
                <span className="text-sm font-medium">設定</span>
              </button>

              {isSettingsOpen && (
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                  <Link
                    to="/home/setting/plan"
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    プラン変更
                  </Link>
                  <Link
                    to="/home/setting/payment"
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    お支払い方法
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* メインチャットエリア */}
      <div className="flex flex-1 flex-col">
        {!isSidebarOpen && (
          <div className="border-b border-gray-200 p-4">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 transition-colors"
              title="サイドバーを開く"
            >
              <Menu size={20} />
            </button>
          </div>
        )}

        {/* メッセージエリア */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-3xl space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex flex-col',
                  message.role === 'user' ? 'items-end' : 'items-start'
                )}
              >
                <div
                  className={cn(
                    'max-w-[80%] rounded-2xl px-4 py-3',
                    message.role === 'user' ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'
                  )}
                >
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
                </div>
                <span className="mt-1 text-xs text-gray-400">
                  {new Date(message.createdAt).toLocaleString('ja-JP', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            ))}

            {/* ストリーミング中のアシスタントメッセージ */}
            {isStreaming && (
              <div className="flex flex-col items-start">
                <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-gray-50 text-gray-900">
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">
                    {streamingText}
                    <span className="inline-block w-1.5 h-4 ml-0.5 bg-gray-400 animate-pulse align-middle" />
                  </p>
                </div>
              </div>
            )}

            {/* エラーメッセージ */}
            {streamError && (
              <div className="flex flex-col items-start">
                <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-red-50 text-red-700 border border-red-200">
                  <p className="text-sm">{streamError}</p>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* 入力エリア */}
        <div className="border-t border-gray-200 bg-white p-4">
          <div className="mx-auto max-w-3xl">
            <div className="flex gap-3">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="メッセージを入力..."
                disabled={isStreaming}
                className={cn(
                  'flex-1 resize-none rounded-xl border border-gray-300 px-4 py-3',
                  'focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20',
                  'text-sm disabled:opacity-50'
                )}
                rows={1}
              />
              <button
                type="button"
                onClick={handleSendMessage}
                disabled={prompt.trim() === '' || isStreaming}
                className={cn(
                  'rounded-xl bg-gray-900 px-6 py-3 text-white',
                  'hover:bg-gray-700 transition-colors',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  'flex items-center gap-2'
                )}
              >
                <Send size={18} />
              </button>
            </div>
            <div className="mt-2 flex items-center justify-center gap-2">
              {currentSession ? (
                // 既存セッション: モデル表示のみ
                <p className="text-xs text-gray-400">{currentSession.modelName} を使用中</p>
              ) : (
                // 新規チャット: モデル選択ドロップダウン
                <select
                  value={selectedModelId}
                  onChange={(e) => setSelectedModelId(Number(e.target.value))}
                  className={cn(
                    'text-xs text-gray-600 border border-gray-200 rounded-lg px-2 py-1',
                    'focus:outline-none focus:border-indigo-400',
                    'bg-white cursor-pointer'
                  )}
                >
                  {modelsData.models.map((model) => (
                    <option key={model.id} value={model.id}>
                      {model.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
