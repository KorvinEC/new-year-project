import { Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../auth";
import { NavHeader } from "../components/NavHeader";
import { Box } from "@chakra-ui/react";

export const App = () => {
  const { logoutMutation } = useAuth();
  const queryClient = useQueryClient();

  if (logoutMutation.isSuccess) {
    queryClient.invalidateQueries({ queryKey: "user" });
    //navigate({to: "/login"})
  }

  return (
    <Box minH={"100vh"}>
      <NavHeader />
      <Outlet />
      <TanStackRouterDevtools />
    </Box>
  );
};
