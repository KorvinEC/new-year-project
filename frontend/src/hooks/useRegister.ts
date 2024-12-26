import { useMutation } from "@tanstack/react-query"
import { useAuthenticationApi } from "../api/authentication"
import { TokenType } from "../types/user";
import { useAtom } from "jotai";
import { tokenAtom } from "../state/atoms";

export const useRegister = () => {
  const { regitser } = useAuthenticationApi()

  const [ token, setToken ] = useAtom(tokenAtom)

  const registerMutation = useMutation({
    mutationFn: regitser,
    onSuccess(data: TokenType) {
      setToken(data.access_token)
    },
  })

  return {
    token,
    setToken,
    registerMutation
  }
}
