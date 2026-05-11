import { useState, useMemo } from 'react'
import { ChevronUp, ChevronDown, ChevronsUpDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '../../utils/cn'
import { EmptyState } from '../ui/EmptyState'
import type { SortDirection } from '../../types'

export interface ColumnDef<T> {
  key: string
  header: string
  accessor: (row: T) => React.ReactNode
  sortValue?: (row: T) => string | number
  className?: string
}

interface DataTableProps<T> {
  columns: ColumnDef<T>[]
  data: T[]
  rowKey: (row: T) => string
  pageSize?: number
  emptyTitle?: string
  emptyDescription?: string
  onEmptyAction?: () => void
  emptyActionLabel?: string
  className?: string
}

function SortIcon({ direction }: { direction: SortDirection | null }) {
  if (direction === 'asc')  return <ChevronUp className="w-3 h-3" />
  if (direction === 'desc') return <ChevronDown className="w-3 h-3" />
  return <ChevronsUpDown className="w-3 h-3 opacity-30" />
}

export function DataTable<T>({
  columns,
  data,
  rowKey,
  pageSize = 20,
  emptyTitle = 'No results found',
  emptyDescription,
  onEmptyAction,
  emptyActionLabel = 'Clear filters',
  className,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<SortDirection>('asc')
  const [page, setPage] = useState(0)

  const sorted = useMemo(() => {
    if (!sortKey) return data
    const col = columns.find((c) => c.key === sortKey)
    if (!col?.sortValue) return data
    return [...data].sort((a, b) => {
      const av = col.sortValue!(a)
      const bv = col.sortValue!(b)
      const cmp = av < bv ? -1 : av > bv ? 1 : 0
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [data, sortKey, sortDir, columns])

  const totalPages = Math.ceil(sorted.length / pageSize)
  const safePage = Math.min(page, Math.max(0, totalPages - 1))
  const paged = sorted.slice(safePage * pageSize, (safePage + 1) * pageSize)

  function handleSort(key: string) {
    const col = columns.find((c) => c.key === key)
    if (!col?.sortValue) return
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
    setPage(0)
  }

  return (
    <div className={cn('', className)}>
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className={cn(
                    'px-6 py-3.5 text-left text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider whitespace-nowrap select-none',
                    col.sortValue && 'cursor-pointer hover:text-slate-600 dark:hover:text-slate-300',
                    col.className
                  )}
                >
                  <div className="flex items-center gap-1">
                    {col.header}
                    {col.sortValue && <SortIcon direction={sortKey === col.key ? sortDir : null} />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
            {paged.length === 0 ? (
              <tr>
                <td colSpan={columns.length}>
                  <EmptyState
                    title={emptyTitle}
                    description={emptyDescription}
                    action={
                      onEmptyAction ? (
                        <button
                          onClick={onEmptyAction}
                          className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                        >
                          {emptyActionLabel}
                        </button>
                      ) : undefined
                    }
                  />
                </td>
              </tr>
            ) : (
              paged.map((row) => (
                <tr
                  key={rowKey(row)}
                  className="hover:bg-slate-50/60 dark:hover:bg-slate-800/60 transition-colors"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn('px-6 py-4 text-slate-700 dark:text-slate-300', col.className)}
                    >
                      {col.accessor(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-slate-100 dark:border-slate-800">
          <p className="text-xs text-slate-400 dark:text-slate-500">
            {sorted.length} results — page {safePage + 1} of {totalPages}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={safePage === 0}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={safePage >= totalPages - 1}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
