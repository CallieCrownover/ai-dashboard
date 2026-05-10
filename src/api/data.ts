import type {
  AIModel,
  LatencyPoint,
  TokenUsagePoint,
  ErrorRatePoint,
  LogEntry,
  ModelSummary,
  DashboardStats,
} from '../types'

const MODELS: AIModel[] = [
  { id: 'claude-opus-4', name: 'Claude Opus 4', provider: 'Anthropic', version: '4.0', status: 'healthy', region: 'us-east-1', contextWindow: 200000 },
  { id: 'claude-sonnet-4', name: 'Claude Sonnet 4', provider: 'Anthropic', version: '4.0', status: 'healthy', region: 'us-east-1', contextWindow: 200000 },
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI', version: '2025-01', status: 'degraded', region: 'eastus', contextWindow: 128000 },
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini', provider: 'OpenAI', version: '2025-01', status: 'healthy', region: 'eastus', contextWindow: 128000 },
  { id: 'gemini-2-pro', name: 'Gemini 2.0 Pro', provider: 'Google', version: '2.0', status: 'healthy', region: 'us-central1', contextWindow: 1000000 },
  { id: 'llama-3-70b', name: 'Llama 3 70B', provider: 'Meta', version: '3.1', status: 'down', region: 'us-west-2', contextWindow: 128000 },
]

function seed(n: number) {
  // Deterministic-ish pseudo random based on index
  return ((Math.sin(n) * 10000) % 1 + 1) / 2
}

export function generateTimeSeries(hours = 24, intervalMinutes = 30) {
  const now = Date.now()
  const points = Math.floor((hours * 60) / intervalMinutes)
  return Array.from({ length: points }, (_, i) => {
    const t = new Date(now - (points - i) * intervalMinutes * 60 * 1000)
    return t.toISOString()
  })
}

export function generateLatencyData(timestamps: string[]): LatencyPoint[] {
  return timestamps.map((ts, i) => {
    const base = 120 + seed(i * 3) * 80
    return {
      timestamp: ts,
      p50: Math.round(base),
      p95: Math.round(base * 1.8 + seed(i * 7) * 40),
      p99: Math.round(base * 2.5 + seed(i * 11) * 60),
    }
  })
}

export function generateTokenUsageData(timestamps: string[]): TokenUsagePoint[] {
  return timestamps.map((ts, i) => {
    const hour = new Date(ts).getHours()
    const load = 0.4 + 0.6 * Math.sin((hour / 24) * Math.PI)
    return {
      timestamp: ts,
      input: Math.round(12000 * load + seed(i * 5) * 4000),
      output: Math.round(4500 * load + seed(i * 9) * 1500),
    }
  })
}

export function generateErrorRateData(timestamps: string[]): ErrorRatePoint[] {
  return timestamps.map((ts, i) => {
    const spike = i === 10 || i === 28 ? 0.12 : 0
    return {
      timestamp: ts,
      rate: Math.round((0.008 + seed(i * 13) * 0.015 + spike) * 1000) / 1000,
      total: Math.round(500 + seed(i * 17) * 300),
    }
  })
}

const ENDPOINTS = ['/v1/messages', '/v1/completions', '/v1/chat', '/v1/embeddings']
const ERROR_MSGS = [
  'Rate limit exceeded',
  'Context length exceeded',
  'Model overloaded',
  'Invalid API key',
  'Timeout after 30s',
]

export function generateLogs(count = 100): LogEntry[] {
  const now = Date.now()
  return Array.from({ length: count }, (_, i) => {
    const model = MODELS[Math.floor(seed(i * 19) * MODELS.length)]
    const r = seed(i * 23)
    const status: LogEntry['status'] =
      r < 0.05 ? 'error' : r < 0.08 ? 'timeout' : 'success'
    const latency =
      status === 'timeout'
        ? 30000
        : Math.round(80 + seed(i * 31) * 400 + (model.status === 'degraded' ? 300 : 0))
    return {
      id: `req_${(i + 1).toString().padStart(6, '0')}`,
      modelId: model.id,
      modelName: model.name,
      provider: model.provider,
      timestamp: new Date(now - i * 15000 - seed(i) * 10000).toISOString(),
      latencyMs: latency,
      inputTokens: Math.round(200 + seed(i * 37) * 2000),
      outputTokens: Math.round(50 + seed(i * 41) * 800),
      status,
      errorMessage: status !== 'success' ? ERROR_MSGS[Math.floor(seed(i * 43) * ERROR_MSGS.length)] : undefined,
      endpoint: ENDPOINTS[Math.floor(seed(i * 47) * ENDPOINTS.length)],
    }
  })
}

export function generateModelSummaries(): ModelSummary[] {
  return MODELS.map((m, i) => {
    const requests = Math.round(8000 + seed(i * 53) * 40000)
    const errors = Math.round(requests * (0.01 + seed(i * 59) * 0.08))
    const base = 100 + seed(i * 61) * 150 + (m.status === 'degraded' ? 200 : 0)
    return {
      modelId: m.id,
      modelName: m.name,
      provider: m.provider,
      status: m.status,
      avgLatency: Math.round(base),
      p95Latency: Math.round(base * 2.1),
      totalRequests: requests,
      successRate: Math.round(((requests - errors) / requests) * 1000) / 10,
      errorRate: Math.round((errors / requests) * 1000) / 10,
      totalTokens: Math.round(requests * (300 + seed(i * 67) * 1200)),
      costUsd: Math.round(requests * (0.002 + seed(i * 71) * 0.015) * 100) / 100,
    }
  })
}

export function generateDashboardStats(): DashboardStats {
  return {
    totalRequests: 187432,
    avgLatencyMs: 218,
    errorRate: 3.2,
    totalTokens: 94821000,
    activeModels: 5,
    requestsDelta: 12.4,
    latencyDelta: -8.1,
    errorDelta: 0.4,
  }
}

export { MODELS }
