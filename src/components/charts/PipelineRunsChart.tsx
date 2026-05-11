import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { cn } from '../../utils/cn'
import { SkeletonChart } from '../ui/Skeleton'
import { useTheme } from '../../providers/ThemeProvider'
import type { PipelineRunPoint } from '../../types'
import { ArrowUp, ArrowDown, Database } from 'lucide-react'

interface Props {
  data: PipelineRunPoint[] | null
  loading?: boolean
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  const success = payload[0]?.value ?? 0
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl px-3.5 py-3 shadow-lg text-xs">
      <p className="text-slate-400 dark:text-slate-500 mb-2 font-medium">{formatDate(label)}</p>
      <div className="flex items-center justify-between gap-6">
        <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
          <span className="w-2 h-2 rounded-sm bg-blue-400 inline-block" /> Successful
        </span>
        <span className="font-semibold text-slate-800 dark:text-slate-100 tabular-nums">{success.toLocaleString()}</span>
      </div>
    </div>
  )
}

const TIME_RANGES = [{ label: '7d', days: 7 }, { label: '14d', days: 14 }, { label: '30d', days: 30 }]

export function PipelineRunsChart({ data, loading }: Props) {
  const [days, setDays] = useState(14)
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  if (loading || !data) return <SkeletonChart />

  const display = data.slice(-days)
  const totalSuccess = display.reduce((s, d) => s + d.success, 0)
  const totalFailed = display.reduce((s, d) => s + d.failed, 0)

  const gridColor  = isDark ? '#1e293b' : '#f1f5f9'
  const tickColor  = isDark ? '#64748b' : '#94a3b8'
  const cursorFill = isDark ? '#1e293b' : '#f1f5f9'

  return (
    <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6 h-full">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Pipeline Runs</h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Successful runs per day</p>
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

      {/* Summary stats */}
      <div className="flex items-center gap-4 mb-5 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
        <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
          <Database className="w-4 h-4 text-blue-500 dark:text-blue-400" />
        </div>
        <div className="flex items-center gap-6 flex-wrap">
          <div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wide">Successful</p>
            <div className="flex items-center gap-1 mt-0.5">
              <ArrowUp className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-lg font-bold text-slate-800 dark:text-slate-100 tabular-nums">
                {totalSuccess.toLocaleString()}
              </span>
            </div>
          </div>
          <div className="w-px h-8 bg-slate-200 dark:bg-slate-700" />
          <div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wide">Failed</p>
            <div className="flex items-center gap-1 mt-0.5">
              <ArrowDown className="w-3.5 h-3.5 text-rose-400" />
              <span className="text-lg font-bold text-slate-800 dark:text-slate-100 tabular-nums">
                {totalFailed.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={display} barCategoryGap="28%" margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
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
          <Tooltip content={<CustomTooltip />} cursor={{ fill: cursorFill }} />
          <Bar dataKey="success" fill="#93c5fd" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
