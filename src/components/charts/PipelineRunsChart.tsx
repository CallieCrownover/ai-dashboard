import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { cn } from '../../utils/cn'
import { SkeletonChart } from '../ui/Skeleton'
import type { PipelineRunPoint } from '../../types'

interface Props {
  data: PipelineRunPoint[] | null
  loading?: boolean
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  const success = payload.find((p: any) => p.dataKey === 'success')?.value ?? 0
  const failed = payload.find((p: any) => p.dataKey === 'failed')?.value ?? 0
  return (
    <div className="bg-white border border-gray-200 rounded-lg px-3.5 py-3 shadow-sm text-xs">
      <p className="text-gray-400 mb-2">{formatDate(label)}</p>
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-6">
          <span className="flex items-center gap-1.5 text-gray-600">
            <span className="w-2 h-2 rounded-sm bg-emerald-400 inline-block" /> Success
          </span>
          <span className="font-medium text-gray-900 tabular-nums">{success}</span>
        </div>
        <div className="flex items-center justify-between gap-6">
          <span className="flex items-center gap-1.5 text-gray-600">
            <span className="w-2 h-2 rounded-sm bg-red-300 inline-block" /> Failed
          </span>
          <span className="font-medium text-gray-900 tabular-nums">{failed}</span>
        </div>
        <div className="pt-1 border-t border-gray-100 flex items-center justify-between gap-6">
          <span className="text-gray-400">Total</span>
          <span className="font-medium text-gray-900 tabular-nums">{success + failed}</span>
        </div>
      </div>
    </div>
  )
}

const TIME_RANGES = [{ label: '7d', days: 7 }, { label: '14d', days: 14 }, { label: '30d', days: 30 }]

export function PipelineRunsChart({ data, loading }: Props) {
  const [days, setDays] = useState(14)

  if (loading || !data) return <SkeletonChart />

  const display = data.slice(-days)

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Pipeline Run Trend</h3>
          <p className="text-xs text-gray-400 mt-0.5">Success and failure counts per day</p>
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
        <BarChart data={display} barCategoryGap="35%" margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
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
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f9fafb' }} />
          <Legend
            iconType="square"
            iconSize={8}
            wrapperStyle={{ fontSize: 12, paddingTop: 16 }}
            formatter={(value) => (
              <span style={{ color: '#6b7280' }}>
                {value.charAt(0).toUpperCase() + value.slice(1)}
              </span>
            )}
          />
          <Bar dataKey="success" name="success" stackId="run" fill="#4ade80" radius={[0, 0, 2, 2]} />
          <Bar dataKey="failed" name="failed" stackId="run" fill="#fca5a5" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
