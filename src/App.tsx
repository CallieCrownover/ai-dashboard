import { useState } from 'react'
import { ThemeProvider } from './providers/ThemeProvider'
import { ErrorBoundary } from './providers/ErrorBoundary'
import { Sidebar, type NavPage } from './components/layout/Sidebar'
import { Header } from './components/layout/Header'
import { Overview } from './pages/Overview'
import { Pipelines } from './pages/Pipelines'

function AppShell() {
  const [page, setPage] = useState<NavPage>('overview')
  const [refreshKey, setRefreshKey] = useState(0)
  const [refreshing, setRefreshing] = useState(false)

  function handleRefresh() {
    setRefreshing(true)
    setRefreshKey((k) => k + 1)
    setTimeout(() => setRefreshing(false), 1000)
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      <Sidebar page={page} onNavigate={setPage} />

      <div className="flex flex-col flex-1 min-w-0">
        <Header page={page} onRefresh={handleRefresh} refreshing={refreshing} />

        <main className="flex-1 overflow-y-auto scrollbar-thin">
          <ErrorBoundary key={page}>
            {page === 'overview' ? (
              <Overview
                refreshKey={refreshKey}
                onNavigatePipelines={() => setPage('pipelines')}
              />
            ) : (
              <Pipelines refreshKey={refreshKey} />
            )}
          </ErrorBoundary>
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AppShell />
    </ThemeProvider>
  )
}
