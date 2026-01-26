import { createFileRoute, Link } from '@tanstack/react-router'
import { cn } from '../../lib/utils'

export const Route = createFileRoute('/test/')({
  component: TestIndex,
})

function TestIndex() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-5xl font-bold text-gray-900">
            Welcome to <span className="text-indigo-600">Lydos</span>
          </h1>
          <p className="mt-6 text-xl text-gray-600">
            OpenAPI仕様から自動生成された型を使った、型安全なフルスタックアプリケーション
          </p>

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            <Link
              to="/test/sample"
              className={cn(
                'group rounded-lg bg-white p-8 shadow-lg transition-all hover:shadow-xl',
                'border-2 border-transparent hover:border-indigo-500'
              )}
            >
              <div className="text-3xl">🧪</div>
              <h2 className="mt-4 text-2xl font-bold text-gray-900">API通信テスト</h2>
              <p className="mt-2 text-gray-600">
                OpenAPI仕様から生成された型を使った型安全なAPI通信を試してみましょう
              </p>
              <div className="mt-4 font-semibold text-indigo-600 group-hover:text-indigo-700">
                テストページへ →
              </div>
            </Link>

            <div
              className={cn(
                'rounded-lg bg-white p-8 shadow-lg',
                'border-2 border-gray-200 opacity-60'
              )}
            >
              <div className="text-3xl">🚧</div>
              <h2 className="mt-4 text-2xl font-bold text-gray-900">その他の機能</h2>
              <p className="mt-2 text-gray-600">準備中...</p>
              <div className="mt-4 font-semibold text-gray-400">Coming Soon</div>
            </div>
          </div>

          <div className="mt-16 rounded-lg bg-white p-6 shadow-md">
            <h3 className="text-lg font-semibold text-gray-900">技術スタック</h3>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              {[
                'React 19',
                'TypeScript',
                'Vite',
                'TanStack Router',
                'Tailwind CSS',
                'Hono',
                'OpenAPI',
                'Bun',
              ].map((tech) => (
                <span
                  key={tech}
                  className="rounded-full bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-700"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
