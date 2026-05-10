import { useState } from 'react'
import { Filter, Download } from 'lucide-react'
import { useAsync } from '../hooks/useAsync'
import { api } from '../api/endpoints'
import { Card, CardHeader } from '../components/ui/Card'
import { RequestStatusBadge } from '../components/ui/Badge'
import { SkeletonTable } from '../components/ui/Skeleton'
import { DataTable, type ColumnDef } from '../components/table/DataTable'
import { ErrorBoundary } from '../providers/ErrorBoundary'
import type { LogEntry, RequestStatus } from '../types'
import { cn } from '../utils/cn'

function formatMs(ms: number) {
  return ms >= 1000 ? `${(ms / 1000).toFixed(1)}s` : `${ms}ms`
}

const ALL_STATUSES: RequestStatus[] = ['success', 'error', 'timeout']

interface LogsProps {
  refreshKey: number
}

export function Logs({ refreshKey }: LogsProps) {
  const [statusFilter, setStatusFilter] = useState<RequestStatus | 'all'>('all')
  const { data: allLogs, loading } = useAsync(() => api.getLogs(200), [refreshKey])

  const logs = allLogs
    ? statusFilter === 'all'
      ? allLogs
      : allLogs.filter((l) => l.status === statusFilter)
    : []

  const COLUMNS: ColumnDef<LogEntry>[] = [
    {
      key: 'id',
      header: 'Request ID',
      accessor: (r) => (
        <span className="font-mono text-xs text-gray-500 dark:text-gray-400">{r.id}</span>
      ),
    },
    {
      key: 'timestamp',
      header: 'Timestamp',
      accessor: (r) => (
        <span className="text-xs tabular-nums whitespace-nowrap">
          {new Date(r.timestamp).toLocaleString()}
        </span>
      ),
      sortValue: (r) => r.timestamp,
    },
    {
      key: 'model',
      header: 'Model',
      accessor: (r) => (
        <div>
          <p className="text-xs font-medium text-gray-900 dark:text-white">{r.modelName}</p>
          <p className="text-[11px] text-gray-400">{r.provider}</p>
        </div>
      ),
      sortValue: (r) => r.modelName,
    },
    {
      key: 'endpoint',
      header: 'Endpoint',
      accessor: (r) => (
        <span className="font-mono text-xs text-gray-500 dark:text-gray-400">{r.endpoint}</span>
      ),
      sortValue: (r) => r.endpoint,
    },
    {
      key: 'latency',
      header: 'Latency',
      accessor: (r) => (
        <span
          className={cn(
            'tabular-nums text-xs font-medium',
            r.latencyMs > 5000
              ? 'text-red-500'
              : r.latencyMs > 1000
              ? 'text-amber-500'
              : 'text-gray-700 dark:text-gray-300'
          )}
        >
          {formatMs(r.latencyMs)}
        </span>
      ),
      sortValue: (r) => r.latencyMs,
    },
    {
      key: 'input',
      header: 'In Tokens',
      accessor: (r) => <span className="tabular-nums text-xs">{r.inputTokens.toLocaleString()}</span>,
      sortValue: (r) => r.inputTokens,
    },
    {
      key: 'output',
      header: 'Out Tokens',
      accessor: (r) => <span className="tabular-nums text-xs">{r.outputTokens.toLocaleString()}</span>,
      sortValue: (r) => r.outputTokens,
    },
    {
      key: 'status',
      header: 'Status',
      accessor: (r) => <RequestStatusBadge status={r.status} />,
      sortValue: (r) => r.status,
    },
    {
      key: 'error',
      header: 'Error',
      accessor: (r) =>
        r.errorMessage ? (
          <span className="text-xs text-red-500 dark:text-red-400">{r.errorMessage}</span>
        ) : (
          <span className="text-gray-300 dark:text-gray-600">—</span>
        ),
    },
  ]

  const counts = {
    all: allLogs?.length ?? 0,
    success: allLogs?.filter((l) => l.status === 'success').length ?? 0,
    error: allLogs?.filter((l) => l.status === 'error').length ?? 0,
    timeout: allLogs?.filter((l) => l.status === 'timeout').length ?? 0,
  }

  function handleExport() {
    if (!logs.length) return
    const headers = ['id', 'timestamp', 'modelName', 'provider', 'endpoint', 'latencyMs', 'inputTokens', 'outputTokens', 'status', 'errorMessage']
    const rows = logs.map((l) =>
      headers.map((h) => JSON.stringify((l as any)[h] ?? '')).join(',')
    )
    const csv = [headers.join(','), ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'logs.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="p-6 space-y-5 animate-fade-in">
      <Card>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter by status</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {(['all', ...ALL_STATUSES] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                  statusFilter === s
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                )}
              >
                {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
                <span className="ml-1.5 opacity-70">({counts[s]})</span>
              </button>
            ))}
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
        </div>
      </Card>

      <ErrorBoundary>
        <Card padding={false}>
          <div className="p-5">
            <CardHeader
              title="Request Log"
              subtitle={`${logs.length} requests${statusFilter !== 'all' ? ` with status: ${statusFilter}` : ''}`}
            />
          </div>
          {loading ? (
            <SkeletonTable rows={8} />
          ) : (
            <DataTable
              columns={COLUMNS}
              data={logs}
              rowKey={(r) => r.id}
              searchKeys={(r) => [r.id, r.modelName, r.provider, r.endpoint, r.errorMessage ?? '']}
              pageSize={20}
            />
          )}
        </Card>
      </ErrorBoundary>
    </div>
  )
}
