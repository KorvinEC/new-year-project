import { useAtom } from "jotai"
import { tokenAtom, userAtom } from "../state/atoms"
import { useLoginUser } from "../api/user"
import { useMutation } from "@tanstack/react-query"
import { TokenType } from "../types/user"

export const useUser = () => {
  const loginUser = useLoginUser();

  const [ user, setUser ] = useAtom(userAtom)
  const [ token, setToken ] = useAtom(tokenAtom)

  const loginMutation = useMutation({
      mutationFn: loginUser,
      onError: (error) => {
        console.log("useLogin onError", error);
      },
      onSuccess(data: TokenType) {
        console.log("useLogin onSuccess", data)
        setToken(data.access_token)
      },
    })

  const logout = () => {
    setUser(null)
  }

  return {
    user,
    setUser,
    token,
    setToken,
    loginMutation,
    logout,
  }
}
