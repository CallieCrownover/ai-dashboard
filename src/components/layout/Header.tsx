import { Sun, Moon, RefreshCw, Bell } from 'lucide-react'
import { useTheme } from '../../providers/ThemeProvider'
import type { NavPage } from './Sidebar'

const PAGE_TITLES: Record<NavPage, { title: string; subtitle: string }> = {
  dashboard: { title: 'Dashboard', subtitle: 'Real-time AI model performance overview' },
  models: { title: 'Models', subtitle: 'Status and metrics per model' },
  logs: { title: 'Request Logs', subtitle: 'Full request history with filtering' },
}

interface HeaderProps {
  page: NavPage
  onRefresh: () => void
  refreshing?: boolean
}

export function Header({ page, onRefresh, refreshing }: HeaderProps) {
  const { theme, toggleTheme } = useTheme()
  const { title, subtitle } = PAGE_TITLES[page]

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shrink-0">
      <div>
        <h1 className="text-base font-semibold text-gray-900 dark:text-white leading-none">{title}</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{subtitle}</p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onRefresh}
          title="Refresh data"
          className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
        </button>

        <button
          title="Notifications"
          className="relative p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500" />
        </button>

        <button
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-1" />

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-white text-xs font-semibold">
            CC
          </div>
        </div>
      </div>
    </header>
  )
}
