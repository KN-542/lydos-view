import { createFileRoute, Link } from '@tanstack/react-router'
import { ChevronLeft, ChevronRight, Menu, Plus, Send, Settings } from 'lucide-react'
import { useState } from 'react'
import { cn } from '../../../lib/utils'

export const Route = createFileRoute('/_authenticated/home/')({
  component: ChatPage,
})

interface Prompt {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface ChatHistory {
  id: string
  title: string
  lastMessage: Date
}

// TODO: 諸々
function ChatPage() {
  const [messages, setMessages] = useState<Prompt[]>([])
  const [prompt, setPrompt] = useState('')
  const [chatHistories, setChatHistories] = useState<ChatHistory[]>([])
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const createNewChat = () => {
    setCurrentChatId(null)
    setMessages([])
  }

  const handleSendMessage = () => {
    if (prompt.trim() === '') return

    const newPrompt: Prompt = {
      id: Date.now().toString(),
      role: 'user',
      content: prompt,
      timestamp: new Date(),
    }

    const aiResponse: Prompt = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: 'ご質問ありがとうございます。現在はデザインプレビューモードです。',
      timestamp: new Date(),
    }

    // 初回メッセージの場合、チャット履歴に追加
    if (messages.length === 0) {
      const newChatId = Date.now().toString()
      const newChat: ChatHistory = {
        id: newChatId,
        title: prompt.length > 20 ? prompt.slice(0, 20) + '...' : prompt,
        lastMessage: new Date(),
      }
      setChatHistories([newChat, ...chatHistories])
      setCurrentChatId(newChatId)
    }

    setMessages([...messages, newPrompt, aiResponse])
    setPrompt('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
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
                  onClick={createNewChat}
                  className={cn(
                    'rounded-lg p-1.5 text-gray-600 hover:bg-gray-200 transition-colors'
                  )}
                  title="新しいチャット"
                >
                  <Plus size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => setIsSidebarOpen(false)}
                  className={cn(
                    'rounded-lg p-1.5 text-gray-600 hover:bg-gray-200 transition-colors'
                  )}
                  title="サイドバーを閉じる"
                >
                  <ChevronLeft size={18} />
                </button>
              </div>
            </div>
            <div className="space-y-1">
              {chatHistories.map((chat) => (
                <button
                  type="button"
                  key={chat.id}
                  onClick={() => setCurrentChatId(chat.id)}
                  className={cn(
                    'w-full rounded-lg p-2.5 text-left',
                    'hover:bg-gray-200 transition-colors',
                    'group',
                    currentChatId === chat.id && 'bg-gray-200'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 truncate">{chat.title}</span>
                    <ChevronRight
                      size={14}
                      className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    />
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

              {/* 設定メニュー */}
              {isSettingsOpen && (
                <div
                  className={cn(
                    'absolute bottom-full left-0 right-0 mb-2',
                    'bg-white rounded-lg shadow-lg border border-gray-200',
                    'overflow-hidden'
                  )}
                >
                  <Link
                    to="/home/setting/plan"
                    className={cn(
                      'block px-4 py-3 text-sm text-gray-700',
                      'hover:bg-gray-100 transition-colors'
                    )}
                  >
                    プラン変更
                  </Link>
                  <Link
                    to="/home/setting/test"
                    className={cn(
                      'block px-4 py-3 text-sm text-gray-700',
                      'hover:bg-gray-100 transition-colors border-t border-gray-200'
                    )}
                  >
                    API通信テスト
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* メインチャットエリア */}
      <div className="flex flex-1 flex-col">
        {/* サイドバー開くボタン */}
        {!isSidebarOpen && (
          <div className="border-b border-gray-200 p-4">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className={cn('rounded-lg p-2 text-gray-600 hover:bg-gray-100 transition-colors')}
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
                  {message.timestamp
                    .toLocaleString('ja-JP', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                    .replace(/\//g, '/')}
                </span>
              </div>
            ))}
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
                className={cn(
                  'flex-1 resize-none rounded-xl border border-gray-300 px-4 py-3',
                  'focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20',
                  'text-sm'
                )}
                rows={1}
              />
              <button
                type="button"
                onClick={handleSendMessage}
                disabled={prompt.trim() === ''}
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
          </div>
        </div>
      </div>
    </div>
  )
}
