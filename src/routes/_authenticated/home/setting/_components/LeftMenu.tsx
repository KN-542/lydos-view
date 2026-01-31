import { Link, useRouterState } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { cn } from '../../../../../lib/utils'

interface SettingMenuItem {
  title: string
  path: string
}

const menuItems: SettingMenuItem[] = [{ title: 'プラン変更', path: '/home/setting/plan' }]

interface LeftMenuProps {
  children: ReactNode
  title: string
  description?: string
}

export function LeftMenu({ children, title, description }: LeftMenuProps) {
  const router = useRouterState()
  const currentPath = router.location.pathname

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="flex gap-8">
          {/* 左側のナビゲーションメニュー */}
          <nav className="w-56 flex-shrink-0">
            <div className="space-y-6">
              <div>
                <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  設定
                </h3>
                <ul className="space-y-0.5">
                  {menuItems.map((item) => {
                    const isActive = currentPath === item.path
                    return (
                      <li key={item.path}>
                        <Link
                          to={item.path}
                          className={cn(
                            'block rounded px-3 py-1.5 text-sm transition-colors',
                            isActive
                              ? 'bg-gray-100 text-gray-900 font-medium'
                              : 'text-gray-700 hover:bg-gray-50'
                          )}
                        >
                          {item.title}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <Link
                  to="/home"
                  className="block rounded px-3 py-1.5 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                >
                  ホームに戻る
                </Link>
              </div>
            </div>
          </nav>

          {/* 右側のコンテンツエリア */}
          <div className="flex-1">
            <div className="rounded-lg bg-white p-8 shadow">
              <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
              {description && <p className="mt-2 text-gray-600">{description}</p>}
              <div className="mt-8">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
