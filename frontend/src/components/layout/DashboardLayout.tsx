'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import {
  FiHome,
  FiVideo,
  FiArchive,
  FiUpload,
  FiSearch,
  FiSettings,
  FiLogOut,
  FiUser,
} from 'react-icons/fi'
import clsx from 'clsx'

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, loading, logout } = useAuth()

  // Redirect if not authenticated
  if (!loading && !user) {
    router.push('/login')
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-pause-500 text-2xl">Loading...</div>
      </div>
    )
  }

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: FiHome },
    { name: 'Videos', href: '/dashboard/videos', icon: FiVideo },
    { name: 'Archives', href: '/dashboard/archives', icon: FiArchive },
    { name: 'Upload', href: '/dashboard/upload', icon: FiUpload },
    { name: 'Search', href: '/dashboard/search', icon: FiSearch },
  ]

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-dark-900 border-r border-dark-800">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center space-x-2 px-6 py-5 border-b border-dark-800">
            <div className="text-pause-500 text-2xl font-bold">⏸</div>
            <span className="text-xl font-bold text-white">Pause</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={clsx(
                    'flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors',
                    isActive
                      ? 'bg-pause-600 text-white'
                      : 'text-dark-300 hover:bg-dark-800 hover:text-white'
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* User Menu */}
          <div className="border-t border-dark-800 p-4">
            <div className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-dark-800">
              <div className="w-8 h-8 rounded-full bg-pause-600 flex items-center justify-center">
                <FiUser className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user?.username}
                </p>
                <p className="text-xs text-dark-400 truncate">{user?.email}</p>
              </div>
            </div>

            <div className="mt-2 space-y-1">
              <Link
                href="/dashboard/settings"
                className="flex items-center space-x-3 px-4 py-2 rounded-lg text-dark-300 hover:bg-dark-800 hover:text-white transition-colors"
              >
                <FiSettings className="w-4 h-4" />
                <span className="text-sm">Settings</span>
              </Link>
              <button
                onClick={logout}
                className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-dark-300 hover:bg-dark-800 hover:text-red-400 transition-colors"
              >
                <FiLogOut className="w-4 h-4" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="pl-64">
        <div className="min-h-screen p-8">{children}</div>
      </main>
    </div>
  )
}
