import { Activity, Zap, AlertTriangle, Hash } from 'lucide-react'
import { useAsync } from '../hooks/useAsync'
import { api } from '../api/endpoints'
import { StatCard } from '../components/ui/StatCard'
import { LatencyChart } from '../components/charts/LatencyChart'
import { TokenUsageChart } from '../components/charts/TokenUsageChart'
import { ErrorRateChart } from '../components/charts/ErrorRateChart'
import { DataTable, type ColumnDef } from '../components/table/DataTable'
import { RequestStatusBadge, ModelStatusBadge } from '../components/ui/Badge'
import { Card, CardHeader } from '../components/ui/Card'
import { SkeletonTable } from '../components/ui/Skeleton'
import { ErrorBoundary } from '../providers/ErrorBoundary'
import type { LogEntry, ModelSummary } from '../types'

function formatMs(ms: number) {
  return ms >= 1000 ? `${(ms / 1000).toFixed(1)}s` : `${ms}ms`
}

function formatNum(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`
  return String(n)
}

const LOG_COLUMNS: ColumnDef<LogEntry>[] = [
  {
    key: 'id',
    header: 'Request ID',
    accessor: (r) => (
      <span className="font-mono text-xs text-gray-500 dark:text-gray-400">{r.id}</span>
    ),
  },
  {
    key: 'model',
    header: 'Model',
    accessor: (r) => (
      <div>
        <p className="font-medium text-gray-900 dark:text-white text-xs">{r.modelName}</p>
        <p className="text-[11px] text-gray-400 dark:text-gray-500">{r.provider}</p>
      </div>
    ),
    sortValue: (r) => r.modelName,
  },
  {
    key: 'timestamp',
    header: 'Time',
    accessor: (r) => (
      <span className="text-xs">
        {new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
      </span>
    ),
    sortValue: (r) => r.timestamp,
  },
  {
    key: 'latency',
    header: 'Latency',
    accessor: (r) => (
      <span className={r.latencyMs > 1000 ? 'text-amber-500 font-medium' : ''}>
        {formatMs(r.latencyMs)}
      </span>
    ),
    sortValue: (r) => r.latencyMs,
  },
  {
    key: 'tokens',
    header: 'Tokens',
    accessor: (r) => (
      <span className="text-xs tabular-nums">
        {r.inputTokens.toLocaleString()} / {r.outputTokens.toLocaleString()}
      </span>
    ),
    sortValue: (r) => r.inputTokens + r.outputTokens,
  },
  {
    key: 'status',
    header: 'Status',
    accessor: (r) => <RequestStatusBadge status={r.status} />,
    sortValue: (r) => r.status,
  },
]

const MODEL_COLUMNS: ColumnDef<ModelSummary>[] = [
  {
    key: 'model',
    header: 'Model',
    accessor: (r) => (
      <div>
        <p className="font-medium text-gray-900 dark:text-white text-xs">{r.modelName}</p>
        <p className="text-[11px] text-gray-400">{r.provider}</p>
      </div>
    ),
    sortValue: (r) => r.modelName,
  },
  { key: 'status', header: 'Status', accessor: (r) => <ModelStatusBadge status={r.status} />, sortValue: (r) => r.status },
  {
    key: 'requests',
    header: 'Requests',
    accessor: (r) => <span className="tabular-nums">{r.totalRequests.toLocaleString()}</span>,
    sortValue: (r) => r.totalRequests,
  },
  {
    key: 'latency',
    header: 'Avg Latency',
    accessor: (r) => <span className="tabular-nums">{r.avgLatency}ms</span>,
    sortValue: (r) => r.avgLatency,
  },
  {
    key: 'errorRate',
    header: 'Error Rate',
    accessor: (r) => (
      <span className={r.errorRate > 5 ? 'text-red-500 font-medium' : ''}>
        {r.errorRate}%
      </span>
    ),
    sortValue: (r) => r.errorRate,
  },
  {
    key: 'cost',
    header: 'Cost',
    accessor: (r) => <span className="tabular-nums">${r.costUsd.toFixed(2)}</span>,
    sortValue: (r) => r.costUsd,
  },
]

interface DashboardProps {
  refreshKey: number
}

export function Dashboard({ refreshKey }: DashboardProps) {
  const stats = useAsync(() => api.getDashboardStats(), [refreshKey])
  const latency = useAsync(() => api.getLatencyData(), [refreshKey])
  const tokens = useAsync(() => api.getTokenUsageData(), [refreshKey])
  const errors = useAsync(() => api.getErrorRateData(), [refreshKey])
  const logs = useAsync(() => api.getLogs(50), [refreshKey])
  const summaries = useAsync(() => api.getModelSummaries(), [refreshKey])

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Requests"
          value={stats.data ? formatNum(stats.data.totalRequests) : '—'}
          delta={stats.data?.requestsDelta}
          deltaLabel="vs yesterday"
          icon={Activity}
          loading={stats.loading}
          iconColor="text-blue-600 dark:text-blue-400"
          iconBg="bg-blue-50 dark:bg-blue-900/30"
        />
        <StatCard
          title="Avg Latency"
          value={stats.data ? `${stats.data.avgLatencyMs}ms` : '—'}
          delta={stats.data?.latencyDelta}
          deltaLabel="vs yesterday"
          icon={Zap}
          loading={stats.loading}
          iconColor="text-violet-600 dark:text-violet-400"
          iconBg="bg-violet-50 dark:bg-violet-900/30"
        />
        <StatCard
          title="Error Rate"
          value={stats.data ? `${stats.data.errorRate}%` : '—'}
          delta={stats.data?.errorDelta}
          deltaLabel="vs yesterday"
          icon={AlertTriangle}
          loading={stats.loading}
          iconColor="text-red-600 dark:text-red-400"
          iconBg="bg-red-50 dark:bg-red-900/30"
        />
        <StatCard
          title="Total Tokens"
          value={stats.data ? formatNum(stats.data.totalTokens) : '—'}
          icon={Hash}
          loading={stats.loading}
          iconColor="text-emerald-600 dark:text-emerald-400"
          iconBg="bg-emerald-50 dark:bg-emerald-900/30"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        <ErrorBoundary>
          <LatencyChart data={latency.data} loading={latency.loading} />
        </ErrorBoundary>
        <ErrorBoundary>
          <TokenUsageChart data={tokens.data} loading={tokens.loading} />
        </ErrorBoundary>
        <ErrorBoundary>
          <ErrorRateChart data={errors.data} loading={errors.loading} />
        </ErrorBoundary>
      </div>

      {/* Model summary table */}
      <ErrorBoundary>
        <Card padding={false}>
          <div className="p-5">
            <CardHeader title="Model Summary" subtitle="Performance breakdown by model" />
          </div>
          {summaries.loading ? (
            <SkeletonTable rows={4} />
          ) : (
            <DataTable
              columns={MODEL_COLUMNS}
              data={summaries.data ?? []}
              rowKey={(r) => r.modelId}
            />
          )}
        </Card>
      </ErrorBoundary>

      {/* Recent logs */}
      <ErrorBoundary>
        <Card padding={false}>
          <div className="p-5">
            <CardHeader title="Recent Requests" subtitle="Last 50 requests across all models" />
          </div>
          {logs.loading ? (
            <SkeletonTable rows={6} />
          ) : (
            <DataTable
              columns={LOG_COLUMNS}
              data={logs.data ?? []}
              rowKey={(r) => r.id}
              searchKeys={(r) => [r.modelName, r.provider, r.id, r.status]}
              pageSize={10}
            />
          )}
        </Card>
      </ErrorBoundary>
    </div>
  )
}
