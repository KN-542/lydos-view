import { createFileRoute } from '@tanstack/react-router'
import { Suspense, useState } from 'react'
import { useGetMessage, useGetSites, usePostMessage } from '../../../hooks/useMessage'
import { cn } from '../../../lib/utils'

export const Route = createFileRoute('/test/sample/')({
  component: TestPage,
})

// レスポンス表示コンポーネント（Suspense対象）
function MessageResponse({ message }: { message: string }) {
  const { data: getData } = useGetMessage(message)

  return (
    <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-4">
      <h3 className="text-lg font-semibold text-green-900">レスポンス</h3>
      <div className="mt-3 space-y-2">
        <div>
          <span className="font-medium text-green-800">メッセージ: </span>
          <span className="text-green-700">{getData.message}</span>
        </div>
        <div>
          <span className="font-medium text-green-800">タイムスタンプ: </span>
          <span className="font-mono text-sm text-green-700">{getData.timestamp}</span>
        </div>
      </div>
      <div className="mt-3 space-y-2">
        <div className="rounded bg-green-100 p-2">
          <p className="text-xs text-green-700">
            ✓ useSuspenseQueryで自動実行・キャッシュされています
          </p>
        </div>
        <div className="rounded bg-green-100 p-2">
          <p className="text-xs font-semibold text-green-700">キャッシュ動作：</p>
          <ul className="ml-4 mt-1 list-disc text-xs text-green-700">
            <li>同じメッセージ → キャッシュから即座に返却</li>
            <li>異なるメッセージ → 新規APIリクエスト</li>
            <li>
              キャッシュ有効期限: 10分間（
              <code className="rounded bg-green-200 px-1">staleTime</code>）
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

// 媒体一覧表示コンポーネント（Suspense対象）
function SitesResponse() {
  const { data: sitesData } = useGetSites()

  return (
    <div className="mt-4 rounded-lg border border-purple-200 bg-purple-50 p-4">
      <h3 className="text-lg font-semibold text-purple-900">媒体一覧</h3>
      <div className="mt-3">
        <ul className="space-y-2">
          {sitesData.sites.map((site) => (
            <li key={site.id} className="rounded bg-purple-100 p-3">
              <div className="flex items-center justify-between">
                <span className="font-medium text-purple-900">
                  {site.id}. {site.name}
                </span>
                <span className="text-xs text-purple-700">
                  {new Date(site.createdAt).toLocaleString('ja-JP')}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-3 rounded bg-purple-100 p-2">
        <p className="text-xs text-purple-700">
          ✓ useSuspenseQueryで自動実行・キャッシュされています
        </p>
      </div>
    </div>
  )
}

function TestPage() {
  // GET用の入力状態
  const [getMessage, setGetMessage] = useState('こんにちは！')

  // POST: ボタンクリックで実行
  const {
    sendMessage,
    data: postData,
    isLoading: isPostLoading,
    isError: isPostError,
    error: postError,
    isSuccess: isPostSuccess,
  } = usePostMessage()

  const handlePostMessage = () => {
    sendMessage('POSTで送信された固定メッセージです')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="mx-auto max-w-2xl space-y-6">
        {/* GET API */}
        <div className="rounded-lg bg-white p-8 shadow-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">GET /api/message</h2>
            <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-800">
              GET
            </span>
          </div>
          <p className="mt-2 text-gray-600">
            入力したメッセージをクエリパラメータで送信します（入力変更で自動実行）
          </p>

          <div className="mt-6">
            <label htmlFor="get-message" className="block text-sm font-medium text-gray-700">
              メッセージ
            </label>
            <input
              id="get-message"
              type="text"
              value={getMessage}
              onChange={(e) => setGetMessage(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="メッセージを入力..."
            />
            <p className="mt-1 text-xs text-gray-500">入力を変更すると自動的にAPIが実行されます</p>
          </div>

          <Suspense
            fallback={
              <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="h-6 w-6 animate-spin rounded-full border-3 border-green-600 border-t-transparent" />
                  <span className="font-semibold text-green-900">読み込み中...</span>
                </div>
              </div>
            }
          >
            <MessageResponse message={getMessage} />
          </Suspense>
        </div>

        {/* POST API */}
        <div className="rounded-lg bg-white p-8 shadow-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">POST /api/message</h2>
            <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-800">
              POST
            </span>
          </div>
          <p className="mt-2 text-gray-600">
            固定メッセージを送信すると、APIがそのメッセージをエコーバックします
          </p>

          <div className="mt-6">
            <button
              type="button"
              onClick={handlePostMessage}
              disabled={isPostLoading}
              className={cn(
                'rounded-lg px-6 py-3 font-semibold text-white shadow-md transition-all',
                isPostLoading
                  ? 'cursor-not-allowed bg-gray-400'
                  : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg'
              )}
            >
              {isPostLoading ? '送信中...' : '固定メッセージを送信'}
            </button>
          </div>

          {isPostError && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="font-semibold text-red-800">エラー</p>
              <p className="mt-1 text-red-600">{postError?.message}</p>
            </div>
          )}

          {isPostSuccess && postData && (
            <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
              <h3 className="text-lg font-semibold text-blue-900">レスポンス</h3>
              <div className="mt-3 space-y-2">
                <div>
                  <span className="font-medium text-blue-800">ステータス: </span>
                  <span className="text-blue-700">{postData.success ? '✓ 成功' : '✗ 失敗'}</span>
                </div>
                <div>
                  <span className="font-medium text-blue-800">メッセージ: </span>
                  <span className="text-blue-700">{postData.message}</span>
                </div>
              </div>
              <div className="mt-3 rounded bg-blue-100 p-2">
                <p className="text-xs text-blue-700">✓ useMutationで実行・Redisに保存されました</p>
              </div>
            </div>
          )}
        </div>

        {/* 媒体一覧 */}
        <div className="rounded-lg bg-white p-8 shadow-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">GET /api/sites</h2>
            <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-800">
              GET
            </span>
          </div>
          <p className="mt-2 text-gray-600">媒体マスタを全件取得します（初回自動実行）</p>

          <Suspense
            fallback={
              <div className="mt-4 rounded-lg border border-purple-200 bg-purple-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="h-6 w-6 animate-spin rounded-full border-3 border-purple-600 border-t-transparent" />
                  <span className="font-semibold text-purple-900">読み込み中...</span>
                </div>
              </div>
            }
          >
            <SitesResponse />
          </Suspense>
        </div>

        {/* 説明 */}
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h3 className="text-lg font-semibold text-gray-900">技術スタック</h3>
          <div className="mt-4 space-y-3 text-sm text-gray-600">
            <p>
              <span className="font-semibold text-gray-900">型安全性: </span>
              OpenAPI仕様から自動生成された型により、APIのリクエスト・レスポンス型が自動的に推論されます
            </p>
            <p>
              <span className="font-semibold text-gray-900">TanStack Query: </span>
            </p>
            <ul className="ml-6 list-disc space-y-1">
              <li>
                <code className="rounded bg-gray-200 px-2 py-1 font-mono text-xs">
                  useSuspenseQuery
                </code>{' '}
                - GET APIを自動実行・キャッシュ管理
              </li>
              <li>
                <code className="rounded bg-gray-200 px-2 py-1 font-mono text-xs">useMutation</code>{' '}
                - POST APIを手動実行・楽観的更新
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
