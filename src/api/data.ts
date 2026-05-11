import type { Pipeline, PipelineRunPoint, FreshnessPoint, DashboardStats, IncidentSeverityPoint } from '../types'

function seed(n: number): number {
  return (Math.abs(Math.sin(n) * 10000) % 1)
}

export function getPipelines(): Pipeline[] {
  const now = Date.now()
  const h = (hrs: number) => new Date(now - hrs * 3600000).toISOString()
  const fwd = (hrs: number) => new Date(now + hrs * 3600000).toISOString()

  return [
    { id: 'p001', name: 'customer_events_etl', description: 'Ingests clickstream events from Kafka into Snowflake', owner: 'ml-platform', team: 'Platform', status: 'healthy', lastRunAt: h(1.2), nextRunAt: fwd(0.8), avgDurationSeconds: 142, freshnessHours: 1.2, freshnessThresholdHours: 3, errorCount24h: 0, successRate7d: 99.2, dataset: 'prod.events.customer_events' },
    { id: 'p002', name: 'user_profile_sync', description: 'Syncs user profiles from PostgreSQL to the data warehouse', owner: 'data-eng', team: 'Platform', status: 'healthy', lastRunAt: h(0.5), nextRunAt: fwd(0.5), avgDurationSeconds: 87, freshnessHours: 0.5, freshnessThresholdHours: 1, errorCount24h: 0, successRate7d: 100, dataset: 'prod.users.profiles' },
    { id: 'p003', name: 'web_analytics_rollup', description: 'Aggregates GA4 events into session and user metrics', owner: 'analytics', team: 'Marketing', status: 'healthy', lastRunAt: h(3), nextRunAt: fwd(21), avgDurationSeconds: 412, freshnessHours: 3.1, freshnessThresholdHours: 24, errorCount24h: 0, successRate7d: 98.6, dataset: 'prod.marketing.web_sessions' },
    { id: 'p004', name: 'transaction_ledger_sync', description: 'Replicates financial transactions from Oracle ERP', owner: 'data-eng', team: 'Finance', status: 'healthy', lastRunAt: h(0.3), nextRunAt: fwd(0.7), avgDurationSeconds: 234, freshnessHours: 0.3, freshnessThresholdHours: 1, errorCount24h: 1, successRate7d: 97.8, dataset: 'prod.finance.transactions' },
    { id: 'p005', name: 'product_catalog_sync', description: 'Keeps product catalog in sync with upstream Shopify store', owner: 'data-eng', team: 'Engineering', status: 'healthy', lastRunAt: h(2), nextRunAt: fwd(1), avgDurationSeconds: 65, freshnessHours: 2.1, freshnessThresholdHours: 4, errorCount24h: 0, successRate7d: 99.7, dataset: 'prod.commerce.products' },
    { id: 'p006', name: 'recommendation_features', description: 'Computes user-item affinity scores for the recommendation engine', owner: 'ml-platform', team: 'Product', status: 'healthy', lastRunAt: h(5), nextRunAt: fwd(19), avgDurationSeconds: 1840, freshnessHours: 5.2, freshnessThresholdHours: 24, errorCount24h: 0, successRate7d: 96.4, dataset: 'prod.ml.recommendation_features' },
    { id: 'p007', name: 'partner_api_usage', description: 'Aggregates API usage metrics per partner account daily', owner: 'data-eng', team: 'Partnerships', status: 'healthy', lastRunAt: h(1.8), nextRunAt: fwd(22.2), avgDurationSeconds: 198, freshnessHours: 1.8, freshnessThresholdHours: 24, errorCount24h: 0, successRate7d: 99.1, dataset: 'prod.partnerships.api_usage' },
    { id: 'p008', name: 'subscription_churn_model', description: 'Runs daily churn probability inference on active subscribers', owner: 'ml-platform', team: 'Growth', status: 'healthy', lastRunAt: h(8), nextRunAt: fwd(16), avgDurationSeconds: 2340, freshnessHours: 8.1, freshnessThresholdHours: 24, errorCount24h: 0, successRate7d: 95.8, dataset: 'prod.ml.churn_scores' },
    { id: 'p009', name: 'inventory_snapshot', description: 'Hourly snapshot of warehouse inventory levels across all SKUs', owner: 'data-eng', team: 'Operations', status: 'healthy', lastRunAt: h(0.8), nextRunAt: fwd(0.2), avgDurationSeconds: 112, freshnessHours: 0.8, freshnessThresholdHours: 2, errorCount24h: 0, successRate7d: 98.9, dataset: 'prod.ops.inventory' },
    { id: 'p010', name: 'search_ranking_features', description: 'Generates query-document relevance signals for search index', owner: 'ml-platform', team: 'Search', status: 'healthy', lastRunAt: h(6), nextRunAt: fwd(6), avgDurationSeconds: 876, freshnessHours: 6.1, freshnessThresholdHours: 12, errorCount24h: 0, successRate7d: 97.2, dataset: 'prod.ml.search_features' },
    { id: 'p011', name: 'compliance_audit_log', description: 'Exports access and change logs for SOC-2 audit trail', owner: 'data-eng', team: 'Legal', status: 'healthy', lastRunAt: h(12), nextRunAt: fwd(12), avgDurationSeconds: 320, freshnessHours: 12.1, freshnessThresholdHours: 24, errorCount24h: 0, successRate7d: 100, dataset: 'prod.compliance.audit_log' },
    { id: 'p012', name: 'email_engagement_weekly', description: 'Computes open/click rates rolled up by campaign and week', owner: 'analytics', team: 'Growth', status: 'healthy', lastRunAt: h(48), nextRunAt: fwd(120), avgDurationSeconds: 560, freshnessHours: 48.2, freshnessThresholdHours: 168, errorCount24h: 0, successRate7d: 100, dataset: 'prod.growth.email_engagement' },
    { id: 'p013', name: 'cost_attribution_model', description: 'Allocates infrastructure spend to product teams via tagging', owner: 'ml-platform', team: 'Finance', status: 'healthy', lastRunAt: h(24), nextRunAt: fwd(24), avgDurationSeconds: 743, freshnessHours: 24.1, freshnessThresholdHours: 48, errorCount24h: 0, successRate7d: 98.6, dataset: 'prod.finance.cost_attribution' },
    { id: 'p014', name: 'data_quality_checks', description: 'Runs dbt tests and freshness checks across all critical tables', owner: 'data-eng', team: 'Platform', status: 'healthy', lastRunAt: h(0.2), nextRunAt: fwd(0.8), avgDurationSeconds: 98, freshnessHours: 0.2, freshnessThresholdHours: 1, errorCount24h: 0, successRate7d: 99.8, dataset: 'prod.platform.quality_checks' },
    { id: 'p015', name: 'revenue_metrics_daily', description: 'Calculates MRR, ARR, and churn rate from billing events', owner: 'analytics', team: 'Finance', status: 'warning', lastRunAt: h(28), nextRunAt: fwd(-4), avgDurationSeconds: 890, freshnessHours: 28.3, freshnessThresholdHours: 24, errorCount24h: 3, successRate7d: 78.6, dataset: 'prod.finance.revenue_metrics' },
    { id: 'p016', name: 'ad_performance_daily', description: 'Pulls spend and ROAS data from Google Ads and Meta APIs', owner: 'analytics', team: 'Marketing', status: 'warning', lastRunAt: h(30), nextRunAt: fwd(-6), avgDurationSeconds: 1240, freshnessHours: 30.1, freshnessThresholdHours: 24, errorCount24h: 5, successRate7d: 82.1, dataset: 'prod.marketing.ad_performance' },
    { id: 'p017', name: 'fraud_detection_features', description: 'Computes real-time fraud signals from transaction patterns', owner: 'ml-platform', team: 'Risk', status: 'failed', lastRunAt: h(36), nextRunAt: fwd(-12), avgDurationSeconds: 624, freshnessHours: 36.2, freshnessThresholdHours: 4, errorCount24h: 12, successRate7d: 64.3, dataset: 'prod.risk.fraud_features' },
    { id: 'p018', name: 'support_ticket_metrics', description: 'Aggregates Zendesk ticket data into SLA and CSAT metrics', owner: 'data-eng', team: 'CX', status: 'failed', lastRunAt: h(18), nextRunAt: fwd(-6), avgDurationSeconds: 445, freshnessHours: 18.4, freshnessThresholdHours: 12, errorCount24h: 8, successRate7d: 71.4, dataset: 'prod.cx.support_metrics' },
    { id: 'p019', name: 'user_segments_refresh', description: 'Recalculates behavioral segments for targeted campaigns', owner: 'analytics', team: 'Marketing', status: 'running', lastRunAt: h(0.1), nextRunAt: fwd(23.9), avgDurationSeconds: 1860, freshnessHours: 0.1, freshnessThresholdHours: 24, errorCount24h: 0, successRate7d: 92.9, dataset: 'prod.marketing.user_segments' },
    { id: 'p020', name: 'mobile_crash_reports', description: 'Aggregates Sentry crash reports by app version and device class', owner: 'data-eng', team: 'Engineering', status: 'paused', lastRunAt: h(72), nextRunAt: fwd(0), avgDurationSeconds: 215, freshnessHours: 72, freshnessThresholdHours: 24, errorCount24h: 0, successRate7d: 0, dataset: 'prod.eng.crash_reports' },
  ]
}

export function getPipelineRuns(days = 30): PipelineRunPoint[] {
  const now = Date.now()
  return Array.from({ length: days }, (_, i) => {
    const date = new Date(now - (days - 1 - i) * 86400000)
    const total = 140 + Math.round(seed(i * 7) * 50)
    const failRate = (i === 7 || i === 19) ? 0.14 : 0.02 + seed(i * 11) * 0.04
    const failed = Math.round(total * failRate)
    return {
      date: date.toISOString().split('T')[0],
      success: total - failed,
      failed,
    }
  })
}

export function getFreshnessData(days = 30): FreshnessPoint[] {
  const now = Date.now()
  return Array.from({ length: days }, (_, i) => {
    const date = new Date(now - (days - 1 - i) * 86400000)
    const spike = (i === 7 || i === 19) ? 3.5 : 0
    return {
      date: date.toISOString().split('T')[0],
      avgFreshnessHours: parseFloat((1.4 + seed(i * 13) * 2.0 + spike).toFixed(2)),
    }
  })
}

export function getDashboardStats(): DashboardStats {
  return {
    pipelineHealth: 98.2,
    dataQualityScore: 94.6,
    failedJobs: 12,
    slaBreaches: 3,
    pipelineHealthDelta: 2.4,
    qualityDelta: 1.8,
    failedJobsDelta: -5,
    slaBreachesDelta: -2,
  }
}

export function getIncidentSeverity(): IncidentSeverityPoint[] {
  return [
    { name: 'Critical', value: 12, color: '#f43f5e' },
    { name: 'High',     value: 23, color: '#f97316' },
    { name: 'Medium',   value: 45, color: '#eab308' },
    { name: 'Low',      value: 61, color: '#60a5fa' },
  ]
}
