import { LayoutDashboard, GitBranch, Activity } from 'lucide-react'
import { cn } from '../../utils/cn'

export type NavPage = 'overview' | 'pipelines'

interface NavItem {
  id: NavPage
  label: string
  icon: typeof LayoutDashboard
}

const NAV: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'pipelines', label: 'Pipelines', icon: GitBranch },
]

interface SidebarProps {
  page: NavPage
  onNavigate: (page: NavPage) => void
}

export function Sidebar({ page, onNavigate }: SidebarProps) {
  return (
    <aside className="w-56 shrink-0 flex flex-col border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      {/* Logo */}
      <div className="flex items-center gap-2.5 h-14 px-5 border-b border-gray-200 dark:border-gray-800">
        <Activity className="w-4 h-4 text-gray-700 dark:text-gray-300 shrink-0" />
        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 tracking-tight">Observe</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <p className="px-2 pb-2 text-[10px] font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-widest">
          Monitor
        </p>
        {NAV.map((item) => {
          const active = page === item.id
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                'w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-colors',
                active
                  ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/60 hover:text-gray-800 dark:hover:text-gray-200'
              )}
            >
              <item.icon
                className={cn(
                  'w-4 h-4 shrink-0',
                  active ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-600'
                )}
              />
              {item.label}
            </button>
          )
        })}
      </nav>

      {/* User */}
      <div className="px-3 py-4 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2.5 px-2.5 py-2">
          <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center shrink-0">
            <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400">CC</span>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">Callie Crownover</p>
            <p className="text-[10px] text-gray-400 dark:text-gray-600 truncate">Data Engineering</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
