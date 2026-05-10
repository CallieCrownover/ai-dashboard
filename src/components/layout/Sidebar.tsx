import { type LucideIcon, LayoutDashboard, Cpu, ScrollText, Activity, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '../../utils/cn'

export type NavPage = 'dashboard' | 'models' | 'logs'

interface NavItem {
  id: NavPage
  label: string
  icon: LucideIcon
  badge?: string
}

const NAV: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'models', label: 'Models', icon: Cpu },
  { id: 'logs', label: 'Request Logs', icon: ScrollText },
]

interface SidebarProps {
  page: NavPage
  onNavigate: (page: NavPage) => void
  collapsed: boolean
  onToggleCollapse: () => void
}

export function Sidebar({ page, onNavigate, collapsed, onToggleCollapse }: SidebarProps) {
  return (
    <aside
      className={cn(
        'flex flex-col shrink-0 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 transition-all duration-200',
        collapsed ? 'w-16' : 'w-56'
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          'flex items-center gap-2.5 px-4 h-16 border-b border-gray-200 dark:border-gray-700',
          collapsed && 'justify-center px-0'
        )}
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shrink-0">
          <Activity className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <div>
            <p className="text-sm font-bold text-gray-900 dark:text-white leading-none">ModelOps</p>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">Analytics</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-2 space-y-0.5">
        {NAV.map((item) => {
          const active = page === item.id
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              title={collapsed ? item.label : undefined}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                collapsed && 'justify-center px-0',
                active
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
              )}
            >
              <item.icon
                className={cn(
                  'w-4.5 h-4.5 shrink-0',
                  active ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'
                )}
                style={{ width: '1.125rem', height: '1.125rem' }}
              />
              {!collapsed && item.label}
              {!collapsed && item.badge && (
                <span className="ml-auto text-[10px] font-semibold bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="p-2 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>
    </aside>
  )
}
