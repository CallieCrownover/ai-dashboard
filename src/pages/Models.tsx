import { Server, AlertCircle, CheckCircle, XCircle, BarChart3 } from 'lucide-react'
import { useAsync } from '../hooks/useAsync'
import { api } from '../api/endpoints'
import { Card, CardHeader } from '../components/ui/Card'
import { ModelStatusBadge } from '../components/ui/Badge'
import { SkeletonCard } from '../components/ui/Skeleton'
import { DataTable, type ColumnDef } from '../components/table/DataTable'
import { ErrorBoundary } from '../providers/ErrorBoundary'
import type { ModelSummary } from '../types'
import { cn } from '../utils/cn'

function MetricBox({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="text-center">
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
      <p className="text-lg font-bold text-gray-900 dark:text-white mt-0.5">{value}</p>
      {sub && <p className="text-[11px] text-gray-400 dark:text-gray-500">{sub}</p>}
    </div>
  )
}

function ModelCard({ model }: { model: ModelSummary }) {
  const statusIcon = {
    healthy: <CheckCircle className="w-4 h-4 text-emerald-500" />,
    degraded: <AlertCircle className="w-4 h-4 text-amber-500" />,
    down: <XCircle className="w-4 h-4 text-red-500" />,
  }[model.status]

  const borderColor = {
    healthy: 'border-l-emerald-500',
    degraded: 'border-l-amber-500',
    down: 'border-l-red-500',
  }[model.status]

  return (
    <div
      className={cn(
        'rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 p-5 shadow-sm border-l-4 animate-fade-in',
        borderColor
      )}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
            <Server className="w-4 h-4 text-gray-500 dark:text-gray-300" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{model.modelName}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{model.provider}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {statusIcon}
          <ModelStatusBadge status={model.status} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 py-3 border-y border-gray-100 dark:border-gray-700/60">
        <MetricBox
          label="Avg Latency"
          value={`${model.avgLatency}ms`}
          sub={`p95: ${model.p95Latency}ms`}
        />
        <MetricBox
          label="Success Rate"
          value={`${model.successRate}%`}
          sub={`${model.totalRequests.toLocaleString()} reqs`}
        />
        <MetricBox
          label="Cost"
          value={`$${model.costUsd.toFixed(2)}`}
          sub={`${(model.totalTokens / 1_000_000).toFixed(1)}M tok`}
        />
      </div>

      <div className="mt-3 flex items-center gap-2">
        <div className="flex-1 h-1.5 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full',
              model.errorRate > 5 ? 'bg-red-500' : model.errorRate > 2 ? 'bg-amber-500' : 'bg-emerald-500'
            )}
            style={{ width: `${Math.min(100, model.successRate)}%` }}
          />
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {model.errorRate}% errors
        </span>
      </div>
    </div>
  )
}

const COLUMNS: ColumnDef<ModelSummary>[] = [
  {
    key: 'model',
    header: 'Model',
    accessor: (r) => (
      <div>
        <p className="font-medium text-xs text-gray-900 dark:text-white">{r.modelName}</p>
        <p className="text-[11px] text-gray-400">{r.provider}</p>
      </div>
    ),
    sortValue: (r) => r.modelName,
  },
  { key: 'status', header: 'Status', accessor: (r) => <ModelStatusBadge status={r.status} />, sortValue: (r) => r.status },
  { key: 'requests', header: 'Total Requests', accessor: (r) => r.totalRequests.toLocaleString(), sortValue: (r) => r.totalRequests },
  { key: 'avgLatency', header: 'Avg (ms)', accessor: (r) => r.avgLatency, sortValue: (r) => r.avgLatency },
  { key: 'p95', header: 'p95 (ms)', accessor: (r) => r.p95Latency, sortValue: (r) => r.p95Latency },
  {
    key: 'errorRate',
    header: 'Error %',
    accessor: (r) => (
      <span className={r.errorRate > 5 ? 'text-red-500 font-semibold' : ''}>
        {r.errorRate}%
      </span>
    ),
    sortValue: (r) => r.errorRate,
  },
  { key: 'tokens', header: 'Total Tokens', accessor: (r) => (r.totalTokens / 1_000_000).toFixed(1) + 'M', sortValue: (r) => r.totalTokens },
  { key: 'cost', header: 'Cost ($)', accessor: (r) => `$${r.costUsd.toFixed(2)}`, sortValue: (r) => r.costUsd },
]

interface ModelsProps {
  refreshKey: number
}

export function Models({ refreshKey }: ModelsProps) {
  const { data: summaries, loading } = useAsync(() => api.getModelSummaries(), [refreshKey])

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Summary bar */}
      <div className="grid grid-cols-3 gap-4">
        {(['healthy', 'degraded', 'down'] as const).map((s) => {
          const count = summaries?.filter((m) => m.status === s).length ?? 0
          const colors = {
            healthy: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20',
            degraded: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20',
            down: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20',
          }[s]
          const icons = {
            healthy: <CheckCircle className="w-5 h-5" />,
            degraded: <AlertCircle className="w-5 h-5" />,
            down: <XCircle className="w-5 h-5" />,
          }[s]
          return (
            <div
              key={s}
              className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 p-4 flex items-center gap-3"
            >
              <div className={cn('p-2 rounded-lg', colors)}>{icons}</div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{s}</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{loading ? '—' : count}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Model cards */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-4 h-4 text-gray-400" />
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Model Overview</h2>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} lines={5} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {(summaries ?? []).map((m) => (
              <ErrorBoundary key={m.modelId}>
                <ModelCard model={m} />
              </ErrorBoundary>
            ))}
          </div>
        )}
      </div>

      {/* Comparison table */}
      <ErrorBoundary>
        <Card padding={false}>
          <div className="p-5">
            <CardHeader title="Model Comparison" subtitle="Sortable metrics across all models" />
          </div>
          <DataTable
            columns={COLUMNS}
            data={summaries ?? []}
            rowKey={(r) => r.modelId}
            searchKeys={(r) => [r.modelName, r.provider]}
          />
        </Card>
      </ErrorBoundary>
    </div>
  )
}
