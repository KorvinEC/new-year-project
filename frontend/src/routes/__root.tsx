import { createRootRouteWithContext } from '@tanstack/react-router'
import { App } from "../pages/App";

import type { AuthContext } from '../auth'

interface MyRouterContext {
  auth: AuthContext
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => {
    return <App />
  },
})
