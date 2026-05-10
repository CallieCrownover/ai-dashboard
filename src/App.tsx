import { useState } from 'react'
import { ThemeProvider } from './providers/ThemeProvider'
import { ErrorBoundary } from './providers/ErrorBoundary'
import { Sidebar, type NavPage } from './components/layout/Sidebar'
import { Header } from './components/layout/Header'
import { Dashboard } from './pages/Dashboard'
import { Models } from './pages/Models'
import { Logs } from './pages/Logs'

function AppShell() {
  const [page, setPage] = useState<NavPage>('dashboard')
  const [collapsed, setCollapsed] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [refreshing, setRefreshing] = useState(false)

  async function handleRefresh() {
    setRefreshing(true)
    setRefreshKey((k) => k + 1)
    setTimeout(() => setRefreshing(false), 1200)
  }

  const PageComponent = {
    dashboard: Dashboard,
    models: Models,
    logs: Logs,
  }[page]

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden">
      <Sidebar
        page={page}
        onNavigate={setPage}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((c) => !c)}
      />
      <div className="flex flex-col flex-1 min-w-0">
        <Header page={page} onRefresh={handleRefresh} refreshing={refreshing} />
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          <ErrorBoundary key={page}>
            <PageComponent refreshKey={refreshKey} />
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
