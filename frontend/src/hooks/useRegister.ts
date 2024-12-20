import { useMutation } from "@tanstack/react-query"
import { useRegisterUser } from "../api/user"
import { TokenType } from "../types/user";
import { useAtom } from "jotai";
import { tokenAtom } from "../state/atoms";

export const useRegister = () => {
  const registerUser = useRegisterUser()

  const [ token, setToken ] = useAtom(tokenAtom)

  const registerMutation = useMutation({
    mutationFn: registerUser,
    onError: (error) => {
      console.log("useRegister Error", error);
    },
    onSuccess(data: TokenType) {
      console.log("useRegister onSuccess", data);
      setToken(data.access_token)
    },
  })

  return {
    token,
    setToken,
    registerMutation
  }
}
