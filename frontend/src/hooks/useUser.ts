import { useAtom } from "jotai"
import { tokenAtom, userAtom } from "../state/atoms"
import { useAuthenticationApi } from "../api/authentication"
import { useMutation, useQuery } from "@tanstack/react-query"
import { TokenType } from "../types/user"
import { RESET } from "jotai/utils"
import { useUserApi } from "../api/user"

export const useUser = () => {
  const { login } = useAuthenticationApi()
  const { fetchMe } = useUserApi()

  const [user, setUser] = useAtom(userAtom)
  const [token, setToken] = useAtom(tokenAtom)

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess(data: TokenType) {
      setToken(data.access_token)
    },
  })

  const logout = () => {
    setUser(RESET)
  }

  const fetchMeQuery = useQuery({
    queryKey: ["user"],
    queryFn: fetchMe,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    initialData: token,
    enabled: !!token
  })

  const isAuthenticated = (): boolean => {
    if (fetchMeQuery.isError) {
      setToken(RESET)
    }
    return !!fetchMeQuery.data
  }

  return {
    user,
    setUser,
    token,
    setToken,
    loginMutation,
    logout,
    isAuthenticated,
  }
}
