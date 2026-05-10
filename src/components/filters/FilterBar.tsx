import { Search, X } from 'lucide-react'
import { cn } from '../../utils/cn'
import type { FilterState, PipelineStatus } from '../../types'

interface FilterBarProps {
  value: FilterState
  onChange: (v: FilterState) => void
  owners: string[]
  resultCount: number
  totalCount: number
}

const STATUS_OPTIONS: { value: PipelineStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All statuses' },
  { value: 'healthy', label: 'Healthy' },
  { value: 'warning', label: 'Warning' },
  { value: 'failed', label: 'Failed' },
  { value: 'running', label: 'Running' },
  { value: 'paused', label: 'Paused' },
]

const SELECT_CLASS =
  'h-9 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 pr-8 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-gray-100/10 focus:border-gray-400 dark:focus:border-gray-600 appearance-none cursor-pointer'

export function FilterBar({ value, onChange, owners, resultCount, totalCount }: FilterBarProps) {
  const hasFilters = value.query !== '' || value.status !== 'all' || value.owner !== 'all'

  function clear() {
    onChange({ query: '', status: 'all', owner: 'all' })
  }

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {/* Search */}
      <div className="relative flex-1 min-w-[220px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 dark:text-gray-600 pointer-events-none" />
        <input
          type="text"
          value={value.query}
          onChange={(e) => onChange({ ...value, query: e.target.value })}
          placeholder="Search pipelines…"
          className="h-9 w-full rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 pl-8 pr-3 text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-gray-100/10 focus:border-gray-400 dark:focus:border-gray-600"
        />
      </div>

      {/* Status */}
      <div className="relative">
        <select
          value={value.status}
          onChange={(e) => onChange({ ...value, status: e.target.value as FilterState['status'] })}
          className={SELECT_CLASS}
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-600">
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
            <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>

      {/* Owner */}
      <div className="relative">
        <select
          value={value.owner}
          onChange={(e) => onChange({ ...value, owner: e.target.value })}
          className={SELECT_CLASS}
        >
          <option value="all">All owners</option>
          {owners.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-600">
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
            <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>

      {/* Clear */}
      {hasFilters && (
        <button
          onClick={clear}
          className="flex items-center gap-1.5 h-9 px-3 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-md border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
          Clear
        </button>
      )}

      {/* Count */}
      <p className={cn(
        'ml-auto text-sm whitespace-nowrap',
        hasFilters ? 'text-gray-600 dark:text-gray-400' : 'text-gray-400 dark:text-gray-600'
      )}>
        {hasFilters
          ? `${resultCount} of ${totalCount} pipelines`
          : `${totalCount} pipelines`
        }
      </p>
    </div>
  )
}
