import { useMutation } from "@tanstack/react-query";
import { useAuthenticationApi } from "../api/authentication";
import { TokenType } from "../types/user";
import { useAtom } from "jotai";
import { tokenAtom } from "../state/atoms";
import { useNavigate } from "@tanstack/react-router";

export const useRegister = () => {
  const { regitser } = useAuthenticationApi();

  const [token, setToken] = useAtom(tokenAtom);
  const navigate = useNavigate();

  const registerMutation = useMutation({
    mutationFn: regitser,
    onSuccess: async (data: TokenType) => {
      setToken(data.access_token);
      await navigate({ to: "/" });
    },
  });

  return {
    token,
    setToken,
    registerMutation,
  };
};
