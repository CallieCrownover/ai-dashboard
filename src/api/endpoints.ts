import { fakeFetch } from './client'
import { getPipelines, getPipelineRuns, getFreshnessData, getDashboardStats, getIncidentSeverity } from './data'

export const api = {
  getDashboardStats: () =>
    fakeFetch(getDashboardStats, 350),

  getPipelines: () =>
    fakeFetch(getPipelines, 500),

  getPipelineRuns: (days = 30) =>
    fakeFetch(() => getPipelineRuns(days), 450),

  getFreshnessData: (days = 30) =>
    fakeFetch(() => getFreshnessData(days), 450),

  getIncidentSeverity: () =>
    fakeFetch(getIncidentSeverity, 300),
}
