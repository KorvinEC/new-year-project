import { ChangeEvent, useState } from "react";
import { useRegister } from "../hooks/useRegister";
import {
  Box,
  Button,
  Input,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { useNavigate } from '@tanstack/react-router'

export const Register = () => {
  const [nickname, setNickname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState<File | null>(null)

  const { registerMutation } = useRegister();

  const navigate = useNavigate({ from: "/register" })

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    const files = e.target.files

    if (files && files.length > 0) {
      setImage(files[0])
    }
  }

  const handleOnSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (image === null) {
      return
    }

    await registerMutation.mutateAsync({ nickname, username, password, image })
      .then(() => navigate({ to: "/templates" }))
  };

  const bg = useColorModeValue("#f9f7f5", "#26292d");

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
            <label htmlFor="nickname">nickname:</label>
            <Input
              id="nickname"
              name="nickname"
              value={nickname}
              onChange={(e) => {
                setNickname(e.target.value);
              }}
            />
            <br />
            <label htmlFor="username">login:</label>
            <Input
              id="username"
              name="username"
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
            <br />
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
            <br />
            <label htmlFor="image">image:</label>
            <Input
              id="image"
              name="image"
              type="file"
              datatype="image"
              onChange={handleImageChange}
            />
            <Button type="submit">
              {registerMutation.isPending
                ? "Регистрируемся ..."
                : "Зарегистрироваться"}
            </Button>
            {registerMutation.isError && <p>Error</p>}
            {registerMutation.isSuccess && <p>Success</p>}
          </VStack>
        </Box>
      </form>
    </>
  );
};
