import { type LucideIcon, TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '../../utils/cn'
import { Skeleton } from './Skeleton'

interface StatCardProps {
  title: string
  value: string
  delta?: number
  deltaLabel?: string
  icon: LucideIcon
  iconColor?: string
  iconBg?: string
  loading?: boolean
}

export function StatCard({
  title,
  value,
  delta,
  deltaLabel,
  icon: Icon,
  iconColor = 'text-blue-600 dark:text-blue-400',
  iconBg = 'bg-blue-50 dark:bg-blue-900/30',
  loading = false,
}: StatCardProps) {
  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 p-5 space-y-3">
        <div className="flex justify-between items-start">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-9 w-9 rounded-lg" />
        </div>
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-3 w-32" />
      </div>
    )
  }

  const isPositive = delta !== undefined && delta > 0
  const isNegative = delta !== undefined && delta < 0

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 p-5 shadow-sm animate-fade-in">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{title}</p>
        <div className={cn('p-2 rounded-lg shrink-0', iconBg)}>
          <Icon className={cn('w-5 h-5', iconColor)} />
        </div>
      </div>
      <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
        {value}
      </p>
      {delta !== undefined && (
        <div className="mt-2 flex items-center gap-1.5">
          {isPositive && <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />}
          {isNegative && <TrendingDown className="w-3.5 h-3.5 text-red-500" />}
          <span
            className={cn(
              'text-xs font-medium',
              isPositive && 'text-emerald-600 dark:text-emerald-400',
              isNegative && 'text-red-600 dark:text-red-400',
              !isPositive && !isNegative && 'text-gray-500 dark:text-gray-400'
            )}
          >
            {delta > 0 ? '+' : ''}{delta}%
          </span>
          {deltaLabel && (
            <span className="text-xs text-gray-400 dark:text-gray-500">{deltaLabel}</span>
          )}
        </div>
      )}
    </div>
  )
}
