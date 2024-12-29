import { ChangeEvent, useState } from "react";
import { useAuth } from "../auth";
import {
  Input,
  Button,
  VStack,
  Box,
  useColorModeValue,
} from "@chakra-ui/react";
import { useNavigate } from "@tanstack/react-router";

export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { loginMutation } = useAuth();

  const bg = useColorModeValue("#f9f7f5", "#26292d");

  const navigate = useNavigate({ from: "/login" });

  if (loginMutation.isPending) {
    return <h1>Logging ...</h1>;
  }

  const handleOnSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    await loginMutation.mutateAsync({ username, password })
      .then(() => navigate({ to: "/templates" }))
  };

  return (
    <>
      <form onSubmit={handleOnSubmit}>
        <Box w={"100%"} display={"flex"} justifyContent="center">
          <VStack
            p={4}
            bgColor={bg}
            borderRadius={"5px"}
            border={"1px solid gray.500"}
            spacing={4}
            align="stretch"
            width={"50%"}
            maxW={"500px"}
            minW={"400px"}
          >
            <label htmlFor="username">username:</label>
            <Input
              id="username"
              name="username"
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />

            <label htmlFor="password">password:</label>
            <Input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />

            <Button
              type="submit"
              disabled={loginMutation.isPending}
              variant="solid"
            >
              {loginMutation.isPending ? "Входим ..." : "Войти"}
            </Button>
          </VStack>
        </Box>
      </form>
    </>
  );
};
