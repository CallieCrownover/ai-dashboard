export type PipelineStatus = 'healthy' | 'warning' | 'failed' | 'running' | 'paused'

export type NavPage = 'overview' | 'pipelines'

export interface Pipeline {
  id: string
  name: string
  description: string
  owner: string
  team: string
  status: PipelineStatus
  lastRunAt: string
  nextRunAt: string
  avgDurationSeconds: number
  freshnessHours: number
  freshnessThresholdHours: number
  errorCount24h: number
  successRate7d: number
  dataset: string
}

export interface PipelineRunPoint {
  date: string
  success: number
  failed: number
}

export interface FreshnessPoint {
  date: string
  avgFreshnessHours: number
}

export interface IncidentSeverityPoint {
  name: string
  value: number
  color: string
}

export interface DashboardStats {
  pipelineHealth: number
  dataQualityScore: number
  failedJobs: number
  slaBreaches: number
  pipelineHealthDelta: number
  qualityDelta: number
  failedJobsDelta: number
  slaBreachesDelta: number
}

export type SortDirection = 'asc' | 'desc'

export interface FilterState {
  query: string
  status: PipelineStatus | 'all'
  owner: string | 'all'
}
