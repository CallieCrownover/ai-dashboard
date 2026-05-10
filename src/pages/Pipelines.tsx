import { useMemo, useState } from 'react'
import { Download } from 'lucide-react'
import { useAsync } from '../hooks/useAsync'
import { api } from '../api/endpoints'
import { FilterBar } from '../components/filters/FilterBar'
import { DataTable, type ColumnDef } from '../components/table/DataTable'
import { StatusBadge } from '../components/ui/Badge'
import { SkeletonTable } from '../components/ui/Skeleton'
import { ErrorBoundary } from '../providers/ErrorBoundary'
import type { Pipeline, FilterState } from '../types'
import { formatRelativeTime, formatFreshness, formatDuration } from '../utils/format'
import { cn } from '../utils/cn'

function FreshnessCell({ hours, threshold }: { hours: number; threshold: number }) {
  const ratio = hours / threshold
  const color =
    ratio > 1 ? 'text-red-500' : ratio > 0.8 ? 'text-amber-500' : 'text-gray-600'
  const thresholdLabel = `${formatFreshness(threshold)} SLA`
  return (
    <div>
      <span className={cn('text-sm tabular-nums font-mono', color)}>
        {formatFreshness(hours)}
      </span>
      <p className="text-[11px] text-gray-400 mt-0.5">{thresholdLabel}</p>
    </div>
  )
}

function SuccessRateCell({ rate, status }: { rate: number; status: Pipeline['status'] }) {
  if (status === 'paused') return <span className="text-sm text-gray-300">—</span>
  const color = rate >= 95 ? 'text-gray-700' : rate >= 80 ? 'text-amber-600' : 'text-red-500'
  return <span className={cn('text-sm tabular-nums', color)}>{rate}%</span>
}

const COLUMNS: ColumnDef<Pipeline>[] = [
  {
    key: 'name',
    header: 'Pipeline',
    accessor: (r) => (
      <div>
        <p className="text-sm font-medium text-gray-900">{r.name}</p>
        <p className="text-[11px] text-gray-400 font-mono mt-0.5">{r.dataset}</p>
      </div>
    ),
    sortValue: (r) => r.name,
  },
  {
    key: 'owner',
    header: 'Owner',
    accessor: (r) => (
      <div>
        <p className="text-sm text-gray-700">{r.team}</p>
        <p className="text-[11px] text-gray-400 mt-0.5">{r.owner}</p>
      </div>
    ),
    sortValue: (r) => r.team,
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
      <div>
        <span className="text-sm text-gray-600 tabular-nums">
          {formatRelativeTime(r.lastRunAt)}
        </span>
        <p className="text-[11px] text-gray-400 mt-0.5">{formatDuration(r.avgDurationSeconds)} avg</p>
      </div>
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
        'text-sm tabular-nums font-medium',
        r.errorCount24h > 0 ? 'text-red-500' : 'text-gray-300'
      )}>
        {r.errorCount24h > 0 ? r.errorCount24h : '—'}
      </span>
    ),
    sortValue: (r) => r.errorCount24h,
    className: 'text-right',
  },
  {
    key: 'successRate',
    header: 'Success (7d)',
    accessor: (r) => <SuccessRateCell rate={r.successRate7d} status={r.status} />,
    sortValue: (r) => r.successRate7d,
  },
  {
    key: 'action',
    header: '',
    accessor: () => (
      <button className="text-xs font-medium text-gray-400 hover:text-gray-700 transition-colors whitespace-nowrap">
        View →
      </button>
    ),
  },
]

function applyFilters(pipelines: Pipeline[], filters: FilterState): Pipeline[] {
  return pipelines.filter((p) => {
    if (filters.status !== 'all' && p.status !== filters.status) return false
    if (filters.owner !== 'all' && p.team !== filters.owner) return false
    if (filters.query) {
      const q = filters.query.toLowerCase()
      const haystack = [p.name, p.team, p.owner, p.dataset, p.description].join(' ').toLowerCase()
      if (!haystack.includes(q)) return false
    }
    return true
  })
}

function exportCSV(pipelines: Pipeline[]) {
  const headers = ['id', 'name', 'team', 'owner', 'status', 'lastRunAt', 'freshnessHours', 'freshnessThresholdHours', 'errorCount24h', 'successRate7d', 'dataset']
  const rows = pipelines.map((p) =>
    headers.map((h) => JSON.stringify((p as unknown as Record<string, unknown>)[h] ?? '')).join(',')
  )
  const csv = [headers.join(','), ...rows].join('\n')
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
  const a = document.createElement('a')
  a.href = url
  a.download = 'pipelines.csv'
  a.click()
  URL.revokeObjectURL(url)
}

interface PipelinesProps {
  refreshKey: number
}

export function Pipelines({ refreshKey }: PipelinesProps) {
  const [filters, setFilters] = useState<FilterState>({ query: '', status: 'all', owner: 'all' })
  const { data: allPipelines, loading } = useAsync(() => api.getPipelines(), [refreshKey])

  const uniqueOwners = useMemo(
    () => [...new Set((allPipelines ?? []).map((p) => p.team))].sort(),
    [allPipelines]
  )

  const filtered = useMemo(
    () => applyFilters(allPipelines ?? [], filters),
    [allPipelines, filters]
  )

  return (
    <div className="px-6 py-8 max-w-7xl mx-auto space-y-5">

      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex-1">
          <FilterBar
            value={filters}
            onChange={setFilters}
            owners={uniqueOwners}
            resultCount={filtered.length}
            totalCount={allPipelines?.length ?? 0}
          />
        </div>
        <button
          onClick={() => exportCSV(filtered)}
          disabled={filtered.length === 0}
          className="flex items-center gap-1.5 h-9 px-3 text-sm text-gray-500 hover:text-gray-700 rounded-md border border-gray-200 hover:border-gray-300 bg-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
        >
          <Download className="w-3.5 h-3.5" />
          Export
        </button>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
        {loading ? (
          <SkeletonTable rows={8} />
        ) : (
          <ErrorBoundary>
            <DataTable
              columns={COLUMNS}
              data={filtered}
              rowKey={(r) => r.id}
              pageSize={15}
              emptyTitle="No pipelines match your filters"
              emptyDescription="Try adjusting the search term, status, or owner filter."
              onEmptyAction={() => setFilters({ query: '', status: 'all', owner: 'all' })}
              emptyActionLabel="Clear all filters"
            />
          </ErrorBoundary>
        )}
      </div>

    </div>
  )
}
