import { createContext, ReactNode, useContext } from "react";
import { useAuthenticationApi } from "./api/authentication";
import { useUserApi } from "./api/user";
import { useAtom } from "jotai";
import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import { tokenAtom } from "./state/atoms";
import { LoginType, TokenType, UserType } from "./types/user";
import { RESET } from "jotai/utils";

export interface AuthContext {
  user: UserType | null;
  token: string | null;
  isAuthenticated: () => boolean;
  loginMutation: UseMutationResult<TokenType, Error, LoginType, unknown>;
  logoutMutation: UseMutationResult<void, Error, void, unknown>;
  fetchMeQuery: UseQueryResult<UserType, Error>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContext | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { login } = useAuthenticationApi();
  const { fetchMe } = useUserApi();

  const [token, setToken] = useAtom(tokenAtom);

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess(data: TokenType) {
      setToken(data.access_token);
      loginMutation.reset();
    },
  });

  const queryClient = useQueryClient();

  const logoutMutation = useMutation({
    mutationFn: async () => {
      setToken(RESET);
      queryClient.clear();
      queryClient.removeQueries({ queryKey: ["user"] });
    },
  });

  const fetchMeQuery = useQuery({
    queryKey: ["user"],
    queryFn: fetchMe,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    enabled: !!token,
  });

  const isAuthenticated = () => {
    return !!fetchMeQuery.data;
  };

  const values = {
    user: fetchMeQuery.data === undefined ? null : fetchMeQuery.data,
    token,
    isAuthenticated,
    loginMutation,
    logoutMutation,
    fetchMeQuery,
    isLoading: fetchMeQuery.isLoading,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
