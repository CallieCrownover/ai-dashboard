import { RefreshCw, Sun, Moon, LayoutDashboard, GitBranch, BarChart2, Calendar, Filter, ChevronDown } from 'lucide-react'
import { useTheme } from '../../providers/ThemeProvider'
import { cn } from '../../utils/cn'
import type { NavPage } from '../../types'

const PAGE_META: Record<NavPage, { title: string; description: string }> = {
  overview:  { title: 'Overview',  description: 'Monitor the health and quality of your data pipelines.' },
  pipelines: { title: 'Pipelines', description: 'Browse, filter, and monitor all pipeline runs.' },
}

const MOBILE_NAV = [
  { id: 'overview'  as NavPage, label: 'Overview',  icon: LayoutDashboard },
  { id: 'pipelines' as NavPage, label: 'Pipelines', icon: GitBranch },
]

interface HeaderProps {
  page: NavPage
  onNavigate: (page: NavPage) => void
  onRefresh: () => void
  refreshing?: boolean
}

export function Header({ page, onNavigate, onRefresh, refreshing }: HeaderProps) {
  const { theme, toggleTheme } = useTheme()
  const { title, description } = PAGE_META[page]

  return (
    <header className="shrink-0 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
      {/* Main bar */}
      <div className="h-16 flex items-center justify-between gap-4 px-4 sm:px-6">
        {/* Mobile: logo */}
        <div className="flex md:hidden items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
            <BarChart2 className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-sm font-bold text-slate-900 dark:text-slate-100 tracking-tight">DataPulse</span>
        </div>

        {/* Desktop: page title */}
        <div className="hidden md:block min-w-0">
          <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100">{title}</h1>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{description}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button className="hidden lg:flex items-center gap-2 h-9 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
            <span>Last 30 days</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
          </button>

          <button className="hidden lg:flex items-center gap-1.5 h-9 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            <Filter className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
            Filters
          </button>

          <button
            onClick={onRefresh}
            title="Refresh data"
            className="h-9 w-9 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            className="h-9 w-9 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav tab strip */}
      <div className="flex md:hidden border-t border-slate-100 dark:border-slate-800">
        {MOBILE_NAV.map((item) => {
          const active = page === item.id
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                'flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors',
                active
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-slate-400 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-400'
              )}
            >
              <item.icon className="w-3.5 h-3.5" />
              {item.label}
            </button>
          )
        })}
      </div>
    </header>
  )
}
