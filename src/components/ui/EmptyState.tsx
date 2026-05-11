import { type LucideIcon, SearchX } from 'lucide-react'
import { cn } from '../../utils/cn'

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  action?: React.ReactNode
  iconClassName?: string
}

export function EmptyState({
  icon: Icon = SearchX,
  title,
  description,
  action,
  iconClassName,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-6">
      <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
        <Icon className={cn('w-5 h-5 text-slate-400 dark:text-slate-500', iconClassName)} />
      </div>
      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{title}</p>
      {description && (
        <p className="mt-1 text-sm text-slate-400 dark:text-slate-500 max-w-xs">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
