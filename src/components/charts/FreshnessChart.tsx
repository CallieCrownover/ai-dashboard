import { useState } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer,
} from 'recharts'
import { cn } from '../../utils/cn'
import { SkeletonChart } from '../ui/Skeleton'
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
    <div className="bg-white border border-gray-200 rounded-lg px-3.5 py-3 shadow-sm text-xs">
      <p className="text-gray-400 mb-1.5">{formatDate(label)}</p>
      <div className="flex items-center justify-between gap-6">
        <span className="flex items-center gap-1.5 text-gray-600">
          <span className="w-2 h-2 rounded-sm bg-indigo-300 inline-block" /> Avg Freshness
        </span>
        <span className="font-medium text-gray-900 tabular-nums">{val.toFixed(1)}h</span>
      </div>
    </div>
  )
}

const TIME_RANGES = [{ label: '7d', days: 7 }, { label: '14d', days: 14 }, { label: '30d', days: 30 }]

export function FreshnessChart({ data, loading, slaHours = 4 }: Props) {
  const [days, setDays] = useState(14)

  if (loading || !data) return <SkeletonChart />

  const display = data.slice(-days)

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Data Freshness</h3>
          <p className="text-xs text-gray-400 mt-0.5">Average data age across all pipelines (hours)</p>
        </div>
        <div className="flex items-center rounded-md border border-gray-200 overflow-hidden">
          {TIME_RANGES.map((r) => (
            <button
              key={r.days}
              onClick={() => setDays(r.days)}
              className={cn(
                'px-2.5 py-1 text-xs font-medium transition-colors',
                days === r.days
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-500 hover:bg-gray-50'
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
              <stop offset="5%" stopColor="#818cf8" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="#f3f4f6" />
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `${v}h`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#e5e7eb', strokeWidth: 1 }} />
          <ReferenceLine
            y={slaHours}
            stroke="#fbbf24"
            strokeDasharray="4 3"
            strokeWidth={1}
            label={{ value: `${slaHours}h SLA`, position: 'insideTopRight', fontSize: 10, fill: '#d97706', dy: -4 }}
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
