import { LayoutDashboard, GitBranch, BarChart2, ChevronDown } from 'lucide-react'
import { cn } from '../../utils/cn'
import type { NavPage } from '../../types'

interface NavItem {
  id: NavPage
  label: string
  icon: typeof LayoutDashboard
}

const NAV: NavItem[] = [
  { id: 'overview',  label: 'Overview',  icon: LayoutDashboard },
  { id: 'pipelines', label: 'Pipelines', icon: GitBranch },
]

interface SidebarProps {
  page: NavPage
  onNavigate: (page: NavPage) => void
}

export function Sidebar({ page, onNavigate }: SidebarProps) {
  return (
    <aside className="hidden md:flex w-56 shrink-0 flex-col bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800">
      {/* Logo */}
      <div className="flex items-center gap-3 h-16 px-5 border-b border-slate-100 dark:border-slate-800">
        <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
          <BarChart2 className="w-4 h-4 text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-tight tracking-tight">DataPulse</p>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-tight">Observability</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4">
        <p className="px-3 pb-1.5 text-[10px] font-semibold text-slate-400 dark:text-slate-600 uppercase tracking-widest">
          Monitor
        </p>
        <div className="space-y-0.5">
          {NAV.map((item) => {
            const active = page === item.id
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={cn(
                  'w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-colors',
                  active
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-medium'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
                )}
              >
                <item.icon className={cn('w-4 h-4 shrink-0', active ? 'text-blue-500 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500')} />
                {item.label}
              </button>
            )
          })}
        </div>
      </nav>

      {/* User */}
      <div className="px-3 py-4 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors">
          <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center shrink-0">
            <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400">CC</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">Callie Crownover</p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">Data Engineer</p>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600 shrink-0" />
        </div>
      </div>
    </aside>
  )
}
