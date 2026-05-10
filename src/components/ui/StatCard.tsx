import { type LucideIcon, TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '../../utils/cn'
import { Skeleton } from './Skeleton'

interface StatCardProps {
  label: string
  value: string
  delta?: number
  deltaLabel?: string
  // Whether a positive delta is good (health ↑ = good) or bad (failures ↑ = bad)
  positiveIsGood?: boolean
  icon?: LucideIcon
  loading?: boolean
}

export function StatCard({
  label,
  value,
  delta,
  deltaLabel = 'vs last week',
  positiveIsGood = true,
  icon: Icon,
  loading = false,
}: StatCardProps) {
  if (loading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 space-y-3">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-3 w-32" />
      </div>
    )
  }

  const isUp = delta !== undefined && delta > 0
  const isDown = delta !== undefined && delta < 0
  const isGood = (isUp && positiveIsGood) || (isDown && !positiveIsGood)
  const isBad = (isUp && !positiveIsGood) || (isDown && positiveIsGood)

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{label}</p>
        {Icon && <Icon className="w-4 h-4 text-gray-300" />}
      </div>

      <p className="mt-3 text-3xl font-semibold text-gray-900 tabular-nums tracking-tight">
        {value}
      </p>

      {delta !== undefined && (
        <div className="mt-2 flex items-center gap-1.5">
          {isGood && <TrendingUp className="w-3 h-3 text-emerald-500" />}
          {isBad && <TrendingDown className="w-3 h-3 text-red-400" />}
          <span
            className={cn(
              'text-xs',
              isGood && 'text-emerald-600',
              isBad && 'text-red-500',
              !isGood && !isBad && 'text-gray-400'
            )}
          >
            {delta > 0 ? '+' : ''}{delta}{typeof delta === 'number' && Math.abs(delta) < 10 ? ' pp' : '%'}
          </span>
          <span className="text-xs text-gray-400">{deltaLabel}</span>
        </div>
      )}
    </div>
  )
}
