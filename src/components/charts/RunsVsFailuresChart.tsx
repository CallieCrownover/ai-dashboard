import { useState } from 'react'
import {
  ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { cn } from '../../utils/cn'
import { SkeletonChart } from '../ui/Skeleton'
import { useTheme } from '../../providers/ThemeProvider'
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
  const failed  = payload.find((p: any) => p.dataKey === 'failed')?.value ?? 0
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl px-3.5 py-3 shadow-lg text-xs">
      <p className="text-slate-400 dark:text-slate-500 mb-2 font-medium">{formatDate(label)}</p>
      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-8">
          <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
            <span className="w-2 h-2 rounded-sm bg-blue-400 inline-block" /> Successful
          </span>
          <span className="font-semibold text-slate-800 dark:text-slate-100 tabular-nums">{success.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between gap-8">
          <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
            <span className="w-2 h-2 rounded-sm bg-rose-400 inline-block" /> Failed
          </span>
          <span className="font-semibold text-slate-800 dark:text-slate-100 tabular-nums">{failed}</span>
        </div>
      </div>
    </div>
  )
}

const TIME_RANGES = [{ label: '7d', days: 7 }, { label: '14d', days: 14 }, { label: '30d', days: 30 }]

export function RunsVsFailuresChart({ data, loading }: Props) {
  const [days, setDays] = useState(14)
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  if (loading || !data) return <SkeletonChart />

  const display = data.slice(-days)

  const gridColor   = isDark ? '#1e293b' : '#f1f5f9'
  const tickColor   = isDark ? '#64748b' : '#94a3b8'
  const cursorColor = isDark ? '#334155' : '#e2e8f0'
  const legendColor = isDark ? '#94a3b8' : '#64748b'

  return (
    <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Pipeline Runs vs Failures</h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Successful and failed run trend over time</p>
        </div>
        <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          {TIME_RANGES.map((r) => (
            <button
              key={r.days}
              onClick={() => setDays(r.days)}
              className={cn(
                'px-2.5 py-1 text-xs font-medium transition-colors',
                days === r.days
                  ? 'bg-slate-800 dark:bg-slate-700 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
              )}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <ComposedChart data={display} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="successAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.12} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
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
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: cursorColor, strokeWidth: 1 }} />
          <Legend
            iconType="circle"
            iconSize={7}
            wrapperStyle={{ fontSize: 12, paddingTop: 16 }}
            formatter={(value) => (
              <span style={{ color: legendColor }}>
                {value === 'success' ? 'Successful' : 'Failed'}
              </span>
            )}
          />
          <Area
            type="monotone"
            dataKey="success"
            stroke="#3b82f6"
            strokeWidth={2}
            fill="url(#successAreaGrad)"
            dot={false}
            activeDot={{ r: 4, fill: '#3b82f6', strokeWidth: 0 }}
          />
          <Line
            type="monotone"
            dataKey="failed"
            stroke="#fb7185"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: '#fb7185', strokeWidth: 0 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
