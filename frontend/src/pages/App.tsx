import { Link, Outlet, useNavigate } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../auth'
import { UserContainer } from './Cards'

export const App = () => {
  const navigate = useNavigate({from: location.href})

  const { user, logoutMutation, isAuthenticated } = useAuth()
  const queryClient = useQueryClient()

  if (logoutMutation.isSuccess) {
    queryClient.invalidateQueries({ queryKey: "user" })
    //navigate({to: "/login"})
  }

  const handleLogout = () => {
    logoutMutation.mutate()
  }

  return <>
    <div className="p-2 flex gap-2" style={{ display: "flex", alignItems: "center" }}>
      <div>
        <Link to="/" className="[&.active]:font-bold">Home</Link>{' '}
        <Link to="/cards" className="[&.active]:font-bold">Cards</Link>{' '}
        <Link to="/templates" className="[&.active]:font-bold">Templates</Link>{' '}
      </div>
      <div style={{ flexGrow: "8" }} />
      {
        !isAuthenticated()
          ? <div>
            <Link to="/login" className="[&.active]:font-bold">Login</Link>{' '}
            <Link to="/register" className="[&.active]:font-bold">Register</Link>
          </div>
          : <div>
            {
              user &&
              <div style={{ display: "inline-block" }}>
                <UserContainer user={user}></UserContainer>
              </div>
            }{' '}
            <button type="button" onClick={handleLogout}>Logout</button>
          </div>
      }
    </div>
    <hr />
    <Outlet />
    <TanStackRouterDevtools />
  </>
}
