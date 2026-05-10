import { useState } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer,
} from 'recharts'
import { cn } from '../../utils/cn'
import { SkeletonChart } from '../ui/Skeleton'
import { useTheme } from '../../providers/ThemeProvider'
import type { FreshnessPoint } from '../../types'

interface Props {
  data: FreshnessPoint[] | null
  loading?: boolean
  slaHours?: number
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  const val: number = payload[0]?.value ?? 0
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3.5 py-3 shadow-sm text-xs">
      <p className="text-gray-400 dark:text-gray-500 mb-1.5">{formatDate(label)}</p>
      <div className="flex items-center justify-between gap-6">
        <span className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
          <span className="w-2 h-2 rounded-sm bg-indigo-300 inline-block" /> Avg Freshness
        </span>
        <span className="font-medium text-gray-900 dark:text-gray-100 tabular-nums">{val.toFixed(1)}h</span>
      </div>
    </div>
  )
}

const TIME_RANGES = [{ label: '7d', days: 7 }, { label: '14d', days: 14 }, { label: '30d', days: 30 }]

export function FreshnessChart({ data, loading, slaHours = 4 }: Props) {
  const [days, setDays] = useState(14)
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const gridColor = isDark ? '#1f2937' : '#f3f4f6'
  const tickColor = isDark ? '#6b7280' : '#9ca3af'
  const slaLabelColor = isDark ? '#fbbf24' : '#d97706'

  if (loading || !data) return <SkeletonChart />

  const display = data.slice(-days)

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Data Freshness</h3>
          <p className="text-xs text-gray-400 dark:text-gray-600 mt-0.5">Average data age across all pipelines (hours)</p>
        </div>
        <div className={cn(
          'flex items-center rounded-md border overflow-hidden',
          'border-gray-200 dark:border-gray-700'
        )}>
          {TIME_RANGES.map((r) => (
            <button
              key={r.days}
              onClick={() => setDays(r.days)}
              className={cn(
                'px-2.5 py-1 text-xs font-medium transition-colors',
                days === r.days
                  ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900'
                  : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              )}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={display} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="freshnessGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#818cf8" stopOpacity={isDark ? 0.25 : 0.15} />
              <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke={gridColor} />
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            tick={{ fontSize: 11, fill: tickColor }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 11, fill: tickColor }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `${v}h`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: isDark ? '#374151' : '#e5e7eb', strokeWidth: 1 }} />
          <ReferenceLine
            y={slaHours}
            stroke="#fbbf24"
            strokeDasharray="4 3"
            strokeWidth={1}
            label={{
              value: `${slaHours}h SLA`,
              position: 'insideTopRight',
              fontSize: 10,
              fill: slaLabelColor,
              dy: -4,
            }}
          />
          <Area
            type="monotone"
            dataKey="avgFreshnessHours"
            stroke="#818cf8"
            strokeWidth={1.5}
            fill="url(#freshnessGrad)"
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
