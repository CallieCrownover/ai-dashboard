import { SkeletonChart } from '../ui/Skeleton'
import type { IncidentSeverityPoint } from '../../types'

interface Props {
  data: IncidentSeverityPoint[] | null
  loading?: boolean
}

function SvgDonut({ data, total }: { data: IncidentSeverityPoint[]; total: number }) {
  const cx = 74
  const cy = 74
  const outerR = 66
  const innerR = 44
  const gap = 0.04

  let angle = -Math.PI / 2
  const arcs = data.map((d) => {
    const sweep = (d.value / total) * 2 * Math.PI - gap
    const start = angle
    const end = angle + sweep
    angle = end + gap

    const large = sweep > Math.PI ? 1 : 0
    const path = [
      `M ${cx + outerR * Math.cos(start)} ${cy + outerR * Math.sin(start)}`,
      `A ${outerR} ${outerR} 0 ${large} 1 ${cx + outerR * Math.cos(end)} ${cy + outerR * Math.sin(end)}`,
      `L ${cx + innerR * Math.cos(end)} ${cy + innerR * Math.sin(end)}`,
      `A ${innerR} ${innerR} 0 ${large} 0 ${cx + innerR * Math.cos(start)} ${cy + innerR * Math.sin(start)}`,
      'Z',
    ].join(' ')

    return { ...d, path }
  })

  return (
    <div className="relative shrink-0" style={{ width: 148, height: 148 }}>
      <svg width={148} height={148}>
        {arcs.map((arc, i) => (
          <path key={i} d={arc.path} fill={arc.color} />
        ))}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-2xl font-bold text-slate-900 dark:text-slate-100 tabular-nums leading-none">{total}</span>
        <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 font-medium">Total</span>
      </div>
    </div>
  )
}

export function IncidentSeverityChart({ data, loading }: Props) {
  if (loading || !data) return <SkeletonChart />

  const total = data.reduce((s, d) => s + d.value, 0)

  return (
    <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6 h-full">
      <div className="mb-5">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Incident Severity</h3>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Active incidents by priority</p>
      </div>

      <div className="flex items-center gap-5">
        <SvgDonut data={data} total={total} />

        {/* Legend */}
        <div className="flex-1 space-y-3">
          {data.map((d) => {
            const pct = Math.round((d.value / total) * 100)
            return (
              <div key={d.name} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: d.color }}
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-300">{d.name}</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-100 tabular-nums">{d.value}</span>
                  <span className="text-xs text-slate-400 dark:text-slate-500">({pct}%)</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
