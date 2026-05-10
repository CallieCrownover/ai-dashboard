import { cn } from '../../utils/cn'
import type { PipelineStatus } from '../../types'

interface StatusConfig {
  dot: string
  label: string
  text: string
}

const STATUS_CONFIG: Record<PipelineStatus, StatusConfig> = {
  healthy: { dot: 'bg-emerald-500', label: 'Healthy', text: 'text-emerald-700' },
  warning: { dot: 'bg-amber-400', label: 'Warning', text: 'text-amber-700' },
  failed: { dot: 'bg-red-500', label: 'Failed', text: 'text-red-600' },
  running: { dot: 'bg-blue-500 animate-pulse', label: 'Running', text: 'text-blue-600' },
  paused: { dot: 'bg-gray-300', label: 'Paused', text: 'text-gray-400' },
}

export function StatusBadge({ status }: { status: PipelineStatus }) {
  const cfg = STATUS_CONFIG[status]
  return (
    <div className="flex items-center gap-1.5">
      <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', cfg.dot)} />
      <span className={cn('text-sm', cfg.text)}>{cfg.label}</span>
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
        variant === 'default' && 'bg-gray-100 text-gray-600',
        variant === 'muted' && 'bg-gray-50 text-gray-400',
        className
      )}
    >
      {children}
    </span>
  )
}
