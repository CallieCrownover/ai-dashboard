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
      <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <Icon className={cn('w-4 h-4 text-gray-400', iconClassName)} />
      </div>
      <p className="text-sm font-medium text-gray-900">{title}</p>
      {description && (
        <p className="mt-1 text-sm text-gray-400 max-w-xs">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
