// Build-time only: renders one public page to HTML for scripts/prerender.mjs.
// Never loaded in the browser, which still starts from main.tsx.
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/context/AuthContext'
import { AppRoutes } from './App.tsx'

export { PUBLIC_PAGES, APP_PATHS, SITE_URL } from '@/seo/pages'

// eslint-disable-next-line react-refresh/only-export-components -- never hot-reloaded
export function render(path: string): string {
  return renderToString(
    <QueryClientProvider client={new QueryClient()}>
      <AuthProvider>
        <StaticRouter location={path}>
          <AppRoutes />
        </StaticRouter>
      </AuthProvider>
    </QueryClientProvider>,
  )
}
