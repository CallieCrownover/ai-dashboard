import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import { Card, CardHeader } from '../ui/Card'
import { SkeletonChart } from '../ui/Skeleton'
import type { ErrorRatePoint } from '../../types'

interface Props {
  data: ErrorRatePoint[] | null
  loading?: boolean
  threshold?: number
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  const rate = payload[0]?.value
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-lg text-xs">
      <p className="text-gray-500 dark:text-gray-400 mb-1">{formatTime(label)}</p>
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-red-500" />
        <span className="text-gray-600 dark:text-gray-300">Error Rate:</span>
        <span className="font-semibold text-gray-900 dark:text-white">
          {(rate * 100).toFixed(2)}%
        </span>
      </div>
    </div>
  )
}

export function ErrorRateChart({ data, loading, threshold = 0.05 }: Props) {
  if (loading || !data) return <SkeletonChart />

  const display = data.filter((_, i) => i % 2 === 0)

  return (
    <Card>
      <CardHeader
        title="Error Rate"
        subtitle="Request error percentage — dashed line marks 5% threshold"
      />
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={display} margin={{ top: 4, right: 8, left: -8, bottom: 0 }}>
          <defs>
            <linearGradient id="errorGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700/60" />
          <XAxis
            dataKey="timestamp"
            tickFormatter={formatTime}
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine
            y={threshold}
            stroke="#f59e0b"
            strokeDasharray="4 4"
            strokeWidth={1.5}
          />
          <Area
            type="monotone"
            dataKey="rate"
            name="Error Rate"
            stroke="#ef4444"
            fill="url(#errorGrad)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  )
}
