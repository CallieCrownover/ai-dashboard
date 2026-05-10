export type ModelStatus = 'healthy' | 'degraded' | 'down'
export type RequestStatus = 'success' | 'error' | 'timeout'

export interface AIModel {
  id: string
  name: string
  provider: string
  version: string
  status: ModelStatus
  region: string
  contextWindow: number
}

export interface LatencyPoint {
  timestamp: string
  p50: number
  p95: number
  p99: number
}

export interface TokenUsagePoint {
  timestamp: string
  input: number
  output: number
}

export interface ErrorRatePoint {
  timestamp: string
  rate: number
  total: number
}

export interface LogEntry {
  id: string
  modelId: string
  modelName: string
  provider: string
  timestamp: string
  latencyMs: number
  inputTokens: number
  outputTokens: number
  status: RequestStatus
  errorMessage?: string
  endpoint: string
}

export interface ModelSummary {
  modelId: string
  modelName: string
  provider: string
  status: ModelStatus
  avgLatency: number
  p95Latency: number
  totalRequests: number
  successRate: number
  errorRate: number
  totalTokens: number
  costUsd: number
}

export interface DashboardStats {
  totalRequests: number
  avgLatencyMs: number
  errorRate: number
  totalTokens: number
  activeModels: number
  requestsDelta: number
  latencyDelta: number
  errorDelta: number
}

export type SortDirection = 'asc' | 'desc'

export interface SortState<T extends string = string> {
  key: T
  direction: SortDirection
}
