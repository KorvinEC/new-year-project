import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'

// Import the generated route tree
import { routeTree } from './routeTree.gen'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider, useAuth } from './auth'

// Create a new router instance
const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  context: {
    auth: undefined!
  },
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const InnerApp = () => {
  const auth = useAuth()
  return (
    <RouterProvider router={router} context={{ auth }} />
  )
}

export const MainApp = () => {
  return (
    <AuthProvider>
      <InnerApp />
    </AuthProvider>
  )
}

// Render the app
const rootElement = document.getElementById('root')!

const queryClient = new QueryClient()

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <MainApp />
      </QueryClientProvider>
    </StrictMode>
  )
}
