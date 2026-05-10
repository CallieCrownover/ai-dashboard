const BASE_DELAY = 600
const JITTER = 400

export function simulateDelay(ms = BASE_DELAY): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms + Math.random() * JITTER))
}

export function maybeSimulateError(rate = 0): void {
  if (Math.random() < rate) {
    throw new Error('API request failed: Service temporarily unavailable')
  }
}

export async function fakeFetch<T>(factory: () => T, delayMs?: number): Promise<T> {
  await simulateDelay(delayMs)
  maybeSimulateError(0)
  return factory()
}
