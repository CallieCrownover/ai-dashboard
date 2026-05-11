import { Activity, ShieldCheck, XCircle, Bell, ArrowRight, CheckCircle } from 'lucide-react'
import { useAsync } from '../hooks/useAsync'
import { api } from '../api/endpoints'
import { StatCard } from '../components/ui/StatCard'
import { EmptyState } from '../components/ui/EmptyState'
import { SkeletonTable } from '../components/ui/Skeleton'
import { PipelineRunsChart } from '../components/charts/PipelineRunsChart'
import { IncidentSeverityChart } from '../components/charts/IncidentSeverityChart'
import { RunsVsFailuresChart } from '../components/charts/RunsVsFailuresChart'
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
      'text-sm tabular-nums font-mono font-medium',
      ratio > 1
        ? 'text-rose-600 dark:text-rose-400'
        : ratio > 0.8
        ? 'text-amber-600 dark:text-amber-500'
        : 'text-slate-500 dark:text-slate-400'
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
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{r.name}</p>
        <p className="text-xs text-slate-400 dark:text-slate-500 font-mono mt-0.5">{r.dataset}</p>
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
      <span className="text-sm text-slate-500 dark:text-slate-400 tabular-nums">
        {formatRelativeTime(r.lastRunAt)}
      </span>
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
      <span className={cn(
        'text-sm tabular-nums font-semibold',
        r.errorCount24h > 0 ? 'text-rose-500' : 'text-slate-300'
      )}>
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
  const stats    = useAsync(() => api.getDashboardStats(), [refreshKey])
  const pipelines = useAsync(() => api.getPipelines(), [refreshKey])
  const runs     = useAsync(() => api.getPipelineRuns(30), [refreshKey])
  const incidents = useAsync(() => api.getIncidentSeverity(), [refreshKey])

  const attentionPipelines = (pipelines.data ?? [])
    .filter((p) => p.status === 'failed' || p.status === 'warning')
    .sort((a, b) => b.errorCount24h - a.errorCount24h)

  return (
    <div className="px-6 py-6 max-w-[1400px] mx-auto space-y-6">

      {/* KPI stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard
          label="Pipeline Health"
          value={stats.data ? `${stats.data.pipelineHealth}%` : '—'}
          delta={stats.data?.pipelineHealthDelta}
          positiveIsGood
          icon={Activity}
          iconBg="bg-blue-50 dark:bg-blue-900/30 text-blue-500 dark:text-blue-400"
          loading={stats.loading}
        />
        <StatCard
          label="Data Quality Score"
          value={stats.data ? `${stats.data.dataQualityScore}%` : '—'}
          delta={stats.data?.qualityDelta}
          positiveIsGood
          icon={ShieldCheck}
          iconBg="bg-violet-50 dark:bg-violet-900/30 text-violet-500 dark:text-violet-400"
          loading={stats.loading}
        />
        <StatCard
          label="Failed Jobs"
          value={stats.data ? String(stats.data.failedJobs) : '—'}
          delta={stats.data?.failedJobsDelta}
          positiveIsGood={false}
          icon={XCircle}
          iconBg="bg-rose-50 dark:bg-rose-900/30 text-rose-400 dark:text-rose-400"
          loading={stats.loading}
        />
        <StatCard
          label="SLA Breaches"
          value={stats.data ? String(stats.data.slaBreaches) : '—'}
          delta={stats.data?.slaBreachesDelta}
          positiveIsGood={false}
          icon={Bell}
          iconBg="bg-amber-50 dark:bg-amber-900/30 text-amber-500 dark:text-amber-400"
          loading={stats.loading}
        />
      </div>

      {/* Middle: Pipeline Runs + Incident Severity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <ErrorBoundary>
            <PipelineRunsChart data={runs.data} loading={runs.loading} />
          </ErrorBoundary>
        </div>
        <div>
          <ErrorBoundary>
            <IncidentSeverityChart data={incidents.data} loading={incidents.loading} />
          </ErrorBoundary>
        </div>
      </div>

      {/* Bottom: Runs vs Failures */}
      <ErrorBoundary>
        <RunsVsFailuresChart data={runs.data} loading={runs.loading} />
      </ErrorBoundary>

      {/* Needs Attention */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Needs Attention</h2>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Pipelines with failures or SLA breaches</p>
          </div>
          <button
            onClick={onNavigatePipelines}
            className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors group"
          >
            View all pipelines
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
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
