import { Activity, ShieldCheck, XCircle, Clock, CheckCircle, ArrowRight } from 'lucide-react'
import { useAsync } from '../hooks/useAsync'
import { api } from '../api/endpoints'
import { StatCard } from '../components/ui/StatCard'
import { EmptyState } from '../components/ui/EmptyState'
import { SkeletonTable } from '../components/ui/Skeleton'
import { PipelineRunsChart } from '../components/charts/PipelineRunsChart'
import { FreshnessChart } from '../components/charts/FreshnessChart'
import { DataTable, type ColumnDef } from '../components/table/DataTable'
import { StatusBadge } from '../components/ui/Badge'
import { ErrorBoundary } from '../providers/ErrorBoundary'
import type { Pipeline } from '../types'
import { formatRelativeTime, formatFreshness } from '../utils/format'
import { cn } from '../utils/cn'

function FreshnessCell({ hours, threshold }: { hours: number; threshold: number }) {
  const ratio = hours / threshold
  return (
    <span className={cn(
      'text-sm tabular-nums font-mono',
      ratio > 1 ? 'text-red-500' : ratio > 0.8 ? 'text-amber-500' : 'text-gray-600'
    )}>
      {formatFreshness(hours)}
    </span>
  )
}

const ATTENTION_COLUMNS: ColumnDef<Pipeline>[] = [
  {
    key: 'name',
    header: 'Pipeline',
    accessor: (r) => (
      <div>
        <p className="text-sm font-medium text-gray-900">{r.name}</p>
        <p className="text-xs text-gray-400 font-mono mt-0.5">{r.dataset}</p>
      </div>
    ),
    sortValue: (r) => r.name,
  },
  {
    key: 'status',
    header: 'Status',
    accessor: (r) => <StatusBadge status={r.status} />,
    sortValue: (r) => r.status,
  },
  {
    key: 'lastRun',
    header: 'Last Run',
    accessor: (r) => (
      <span className="text-sm text-gray-500 tabular-nums">{formatRelativeTime(r.lastRunAt)}</span>
    ),
    sortValue: (r) => r.lastRunAt,
  },
  {
    key: 'freshness',
    header: 'Freshness',
    accessor: (r) => <FreshnessCell hours={r.freshnessHours} threshold={r.freshnessThresholdHours} />,
    sortValue: (r) => r.freshnessHours,
  },
  {
    key: 'errors',
    header: 'Errors (24h)',
    accessor: (r) => (
      <span className={cn('text-sm tabular-nums font-medium', r.errorCount24h > 0 ? 'text-red-500' : 'text-gray-300')}>
        {r.errorCount24h > 0 ? r.errorCount24h : '—'}
      </span>
    ),
    sortValue: (r) => r.errorCount24h,
  },
]

interface OverviewProps {
  refreshKey: number
  onNavigatePipelines: () => void
}

export function Overview({ refreshKey, onNavigatePipelines }: OverviewProps) {
  const stats = useAsync(() => api.getDashboardStats(), [refreshKey])
  const pipelines = useAsync(() => api.getPipelines(), [refreshKey])
  const runs = useAsync(() => api.getPipelineRuns(30), [refreshKey])
  const freshness = useAsync(() => api.getFreshnessData(30), [refreshKey])

  const attentionPipelines = (pipelines.data ?? [])
    .filter((p) => p.status === 'failed' || p.status === 'warning')
    .sort((a, b) => b.errorCount24h - a.errorCount24h)

  return (
    <div className="px-6 py-8 max-w-7xl mx-auto space-y-8">

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard
          label="Pipeline Health"
          value={stats.data ? `${stats.data.pipelineHealth}%` : '—'}
          delta={stats.data?.pipelineHealthDelta}
          positiveIsGood
          icon={Activity}
          loading={stats.loading}
        />
        <StatCard
          label="Data Quality Score"
          value={stats.data ? `${stats.data.dataQualityScore}` : '—'}
          delta={stats.data?.qualityDelta}
          positiveIsGood
          icon={ShieldCheck}
          loading={stats.loading}
        />
        <StatCard
          label="Failed Jobs"
          value={stats.data ? String(stats.data.failedJobs) : '—'}
          delta={stats.data?.failedJobsDelta}
          positiveIsGood={false}
          icon={XCircle}
          loading={stats.loading}
        />
        <StatCard
          label="SLA Breaches"
          value={stats.data ? String(stats.data.slaBreaches) : '—'}
          delta={stats.data?.slaBreachesDelta}
          positiveIsGood={false}
          icon={Clock}
          loading={stats.loading}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ErrorBoundary>
          <PipelineRunsChart data={runs.data} loading={runs.loading} />
        </ErrorBoundary>
        <ErrorBoundary>
          <FreshnessChart data={freshness.data} loading={freshness.loading} />
        </ErrorBoundary>
      </div>

      {/* Needs attention */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Needs Attention</h2>
            <p className="text-xs text-gray-400 mt-0.5">Pipelines with failures or SLA breaches</p>
          </div>
          <button
            onClick={onNavigatePipelines}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900 transition-colors group"
          >
            View all pipelines
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
          {pipelines.loading ? (
            <SkeletonTable rows={4} />
          ) : attentionPipelines.length === 0 ? (
            <EmptyState
              icon={CheckCircle}
              title="All pipelines are healthy"
              description="No failures or SLA breaches to report."
              iconClassName="text-emerald-500"
            />
          ) : (
            <ErrorBoundary>
              <DataTable
                columns={ATTENTION_COLUMNS}
                data={attentionPipelines}
                rowKey={(r) => r.id}
                emptyTitle="No issues found"
                pageSize={10}
              />
            </ErrorBoundary>
          )}
        </div>
      </section>

    </div>
  )
}
