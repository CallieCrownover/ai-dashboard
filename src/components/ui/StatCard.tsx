import { type LucideIcon, ArrowUp, ArrowDown } from 'lucide-react'
import { cn } from '../../utils/cn'

interface StatCardProps {
  label: string
  value: string
  delta?: number
  deltaLabel?: string
  positiveIsGood?: boolean
  icon?: LucideIcon
  iconBg?: string
  loading?: boolean
}

function SkeletonStatCardInner() {
  return (
    <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-5 space-y-3 animate-pulse">
      <div className="h-3.5 w-28 rounded bg-slate-100 dark:bg-slate-800" />
      <div className="h-9 w-24 rounded bg-slate-100 dark:bg-slate-800" />
      <div className="h-3 w-36 rounded bg-slate-100 dark:bg-slate-800" />
    </div>
  )
}

export function StatCard({
  label,
  value,
  delta,
  deltaLabel = 'vs last 7 days',
  positiveIsGood = true,
  icon: Icon,
  iconBg = 'bg-blue-50 dark:bg-blue-900/30 text-blue-500 dark:text-blue-400',
  loading = false,
}: StatCardProps) {
  if (loading) return <SkeletonStatCardInner />

  const isUp   = delta !== undefined && delta > 0
  const isDown = delta !== undefined && delta < 0
  const isGood = (isUp && positiveIsGood) || (isDown && !positiveIsGood)
  const isBad  = (isUp && !positiveIsGood) || (isDown && positiveIsGood)

  const deltaColor = isGood
    ? 'text-emerald-600 dark:text-emerald-400'
    : isBad
    ? 'text-rose-500 dark:text-rose-400'
    : 'text-slate-400 dark:text-slate-500'

  const formattedDelta = delta !== undefined
    ? `${delta > 0 ? '+' : ''}${delta}${Math.abs(delta) < 10 && !Number.isInteger(delta) ? '%' : ''}`
    : null

  return (
    <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100 tabular-nums tracking-tight">
            {value}
          </p>
        </div>
        {Icon && (
          <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', iconBg)}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {delta !== undefined && (
        <div className="mt-3 flex items-center gap-1.5">
          {isGood && <ArrowUp   className={cn('w-3.5 h-3.5', deltaColor)} />}
          {isBad  && <ArrowDown className={cn('w-3.5 h-3.5', deltaColor)} />}
          <span className={cn('text-sm font-medium', deltaColor)}>{formattedDelta}</span>
          <span className="text-sm text-slate-400 dark:text-slate-500">{deltaLabel}</span>
        </div>
      )}
    </div>
  )
}
