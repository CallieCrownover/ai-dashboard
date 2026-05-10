import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardHeader } from '../ui/Card'
import { SkeletonChart } from '../ui/Skeleton'
import type { LatencyPoint } from '../../types'

interface Props {
  data: LatencyPoint[] | null
  loading?: boolean
}

function formatTime(iso: string) {
  const d = new Date(iso)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-lg text-xs">
      <p className="text-gray-500 dark:text-gray-400 mb-1.5">{formatTime(label)}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-gray-600 dark:text-gray-300">{p.name}:</span>
          <span className="font-semibold text-gray-900 dark:text-white">{p.value}ms</span>
        </div>
      ))}
    </div>
  )
}

export function LatencyChart({ data, loading }: Props) {
  if (loading || !data) return <SkeletonChart />

  const display = data.filter((_, i) => i % 2 === 0)

  return (
    <Card>
      <CardHeader
        title="Latency"
        subtitle="Response time percentiles over the last 24 hours"
      />
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={display} margin={{ top: 4, right: 8, left: -12, bottom: 0 }}>
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
            tickFormatter={(v) => `${v}ms`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
            formatter={(value) => (
              <span className="text-gray-600 dark:text-gray-300">{value}</span>
            )}
          />
          <Line type="monotone" dataKey="p50" name="p50" stroke="#3b82f6" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="p95" name="p95" stroke="#f59e0b" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="p99" name="p99" stroke="#ef4444" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  )
}
