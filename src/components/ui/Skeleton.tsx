import { cn } from '../../utils/cn'

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn('animate-pulse rounded bg-gray-100', className)} />
  )
}

export function SkeletonStatCard() {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 space-y-3">
      <Skeleton className="h-3 w-28" />
      <Skeleton className="h-8 w-20" />
      <Skeleton className="h-3 w-32" />
    </div>
  )
}

export function SkeletonChart() {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <div className="flex items-center justify-between mb-5">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-6 w-24 rounded-md" />
      </div>
      <Skeleton className="h-[220px] w-full rounded" />
    </div>
  )
}

export function SkeletonTable({ rows = 6 }: { rows?: number }) {
  return (
    <div className="divide-y divide-gray-100">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="px-6 py-4 flex items-center gap-6">
          <div className="space-y-1.5 flex-1">
            <Skeleton className="h-3.5 w-40" />
            <Skeleton className="h-3 w-56" />
          </div>
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-14" />
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-10" />
          <Skeleton className="h-6 w-12 rounded" />
        </div>
      ))}
    </div>
  )
}
