import { cn } from '../../utils/cn'
import type { ModelStatus, RequestStatus } from '../../types'

type Variant = 'green' | 'yellow' | 'red' | 'blue' | 'gray'

interface BadgeProps {
  children: React.ReactNode
  variant?: Variant
  dot?: boolean
  className?: string
}

const variantClasses: Record<Variant, string> = {
  green: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
  yellow: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
  red: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
  blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
  gray: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
}

const dotClasses: Record<Variant, string> = {
  green: 'bg-emerald-500',
  yellow: 'bg-amber-500',
  red: 'bg-red-500',
  blue: 'bg-blue-500',
  gray: 'bg-gray-500',
}

export function Badge({ children, variant = 'gray', dot = false, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium',
        variantClasses[variant],
        className
      )}
    >
      {dot && (
        <span className={cn('w-1.5 h-1.5 rounded-full', dotClasses[variant])} />
      )}
      {children}
    </span>
  )
}

export function ModelStatusBadge({ status }: { status: ModelStatus }) {
  const map: Record<ModelStatus, { label: string; variant: Variant }> = {
    healthy: { label: 'Healthy', variant: 'green' },
    degraded: { label: 'Degraded', variant: 'yellow' },
    down: { label: 'Down', variant: 'red' },
  }
  const { label, variant } = map[status]
  return <Badge variant={variant} dot>{label}</Badge>
}

export function RequestStatusBadge({ status }: { status: RequestStatus }) {
  const map: Record<RequestStatus, { label: string; variant: Variant }> = {
    success: { label: 'Success', variant: 'green' },
    error: { label: 'Error', variant: 'red' },
    timeout: { label: 'Timeout', variant: 'yellow' },
  }
  const { label, variant } = map[status]
  return <Badge variant={variant}>{label}</Badge>
}
