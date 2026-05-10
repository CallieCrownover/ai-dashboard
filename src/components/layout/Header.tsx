import { RefreshCw, Sun, Moon } from 'lucide-react'
import { useTheme } from '../../providers/ThemeProvider'
import type { NavPage } from './Sidebar'

const PAGE_META: Record<NavPage, { title: string; description: string }> = {
  overview: {
    title: 'Overview',
    description: 'Pipeline health, data quality, and SLA status at a glance',
  },
  pipelines: {
    title: 'Pipelines',
    description: 'Browse, filter, and monitor all pipeline runs',
  },
}

interface HeaderProps {
  page: NavPage
  onRefresh: () => void
  refreshing?: boolean
}

export function Header({ page, onRefresh, refreshing }: HeaderProps) {
  const { theme, toggleTheme } = useTheme()
  const { title, description } = PAGE_META[page]

  return (
    <header className="h-14 flex items-center justify-between gap-6 px-6 border-b border-gray-200 bg-white shrink-0">
      <div className="flex items-baseline gap-3 min-w-0">
        <h1 className="text-sm font-semibold text-gray-900 shrink-0">{title}</h1>
        <span className="hidden sm:block text-xs text-gray-400 truncate">{description}</span>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={onRefresh}
          title="Refresh data"
          className="h-8 w-8 flex items-center justify-center rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
        <button
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          className="h-8 w-8 flex items-center justify-center rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        >
          {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
        </button>
      </div>
    </header>
  )
}
