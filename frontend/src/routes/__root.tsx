import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="p-2 flex gap-2">
        <Link to="/" className="[&.active]:font-bold">Home</Link>{' '}
        <Link to="/cards" className="[&.active]:font-bold">Cards</Link>{' '}
        <Link to="/templates" className="[&.active]:font-bold">Templates</Link>{' '}
        <Link to="/login" className="[&.active]:font-bold">Login</Link>{' '}
        <Link to="/register" className="[&.active]:font-bold">Register</Link>{' '}
      </div>
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
})
