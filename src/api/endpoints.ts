import { fakeFetch } from './client'
import {
  generateTimeSeries,
  generateLatencyData,
  generateTokenUsageData,
  generateErrorRateData,
  generateLogs,
  generateModelSummaries,
  generateDashboardStats,
  MODELS,
} from './data'

export const api = {
  getDashboardStats: () =>
    fakeFetch(generateDashboardStats, 400),

  getModels: () =>
    fakeFetch(() => MODELS, 500),

  getModelSummaries: () =>
    fakeFetch(generateModelSummaries, 700),

  getLatencyData: (hours = 24) =>
    fakeFetch(() => generateLatencyData(generateTimeSeries(hours)), 600),

  getTokenUsageData: (hours = 24) =>
    fakeFetch(() => generateTokenUsageData(generateTimeSeries(hours)), 600),

  getErrorRateData: (hours = 24) =>
    fakeFetch(() => generateErrorRateData(generateTimeSeries(hours)), 600),

  getLogs: (limit = 100) =>
    fakeFetch(() => generateLogs(limit), 800),
}
