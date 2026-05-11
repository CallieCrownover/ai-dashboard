import { cn } from '../../utils/cn'
import type { PipelineStatus } from '../../types'

interface StatusConfig {
  dot: string
  label: string
  text: string
  bg: string
}

const STATUS_CONFIG: Record<PipelineStatus, StatusConfig> = {
  healthy: {
    dot: 'bg-emerald-500',
    label: 'Healthy',
    text: 'text-emerald-700 dark:text-emerald-400',
    bg:   'bg-emerald-50 dark:bg-emerald-900/20',
  },
  warning: {
    dot: 'bg-amber-400',
    label: 'Warning',
    text: 'text-amber-700 dark:text-amber-400',
    bg:   'bg-amber-50 dark:bg-amber-900/20',
  },
  failed: {
    dot: 'bg-rose-500',
    label: 'Failed',
    text: 'text-rose-600 dark:text-rose-400',
    bg:   'bg-rose-50 dark:bg-rose-900/20',
  },
  running: {
    dot: 'bg-blue-500 animate-pulse',
    label: 'Running',
    text: 'text-blue-600 dark:text-blue-400',
    bg:   'bg-blue-50 dark:bg-blue-900/20',
  },
  paused: {
    dot: 'bg-slate-300 dark:bg-slate-600',
    label: 'Paused',
    text: 'text-slate-500 dark:text-slate-400',
    bg:   'bg-slate-100 dark:bg-slate-800',
  },
}

export function StatusBadge({ status }: { status: PipelineStatus }) {
  const cfg = STATUS_CONFIG[status]
  return (
    <div className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium', cfg.bg, cfg.text)}>
      <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', cfg.dot)} />
      {cfg.label}
    </div>
  )
}

interface TagProps {
  children: React.ReactNode
  variant?: 'default' | 'muted'
  className?: string
}

export function Tag({ children, variant = 'default', className }: TagProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
        variant === 'default' && 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400',
        variant === 'muted'   && 'bg-slate-50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500',
        className
      )}
    >
      {children}
    </span>
  )
}
