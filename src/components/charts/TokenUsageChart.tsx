import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardHeader } from '../ui/Card'
import { SkeletonChart } from '../ui/Skeleton'
import type { TokenUsagePoint } from '../../types'

interface Props {
  data: TokenUsagePoint[] | null
  loading?: boolean
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function formatK(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(0)}k` : String(n)
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-lg text-xs">
      <p className="text-gray-500 dark:text-gray-400 mb-1.5">{formatTime(label)}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: p.fill }} />
          <span className="text-gray-600 dark:text-gray-300">{p.name}:</span>
          <span className="font-semibold text-gray-900 dark:text-white">{p.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  )
}

export function TokenUsageChart({ data, loading }: Props) {
  if (loading || !data) return <SkeletonChart />

  const display = data.filter((_, i) => i % 2 === 0)

  return (
    <Card>
      <CardHeader
        title="Token Usage"
        subtitle="Input vs. output tokens over the last 24 hours"
      />
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={display} margin={{ top: 4, right: 8, left: -12, bottom: 0 }}>
          <defs>
            <linearGradient id="inputGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="outputGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
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
            tickFormatter={formatK}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
            formatter={(value) => (
              <span className="text-gray-600 dark:text-gray-300">{value}</span>
            )}
          />
          <Area
            type="monotone"
            dataKey="input"
            name="Input"
            stroke="#8b5cf6"
            fill="url(#inputGrad)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="output"
            name="Output"
            stroke="#06b6d4"
            fill="url(#outputGrad)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  )
}
