import React, { ReactNode } from "react";
import { Link, Box, Flex, Text, Stack, FlexProps } from "@chakra-ui/react";
import { Logo } from "./Logo";
import { useAuth } from "../../auth.tsx";
import { UserContainer } from "../../pages/Cards.tsx";
import { ThemeToggle } from "../ThemeColorButton";

const CloseIcon = () => (
  <svg width="24" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
    <title>Close</title>
    <path
      fill="white"
      d="M9.00023 7.58599L13.9502 2.63599L15.3642 4.04999L10.4142 8.99999L15.3642 13.95L13.9502 15.364L9.00023 10.414L4.05023 15.364L2.63623 13.95L7.58623 8.99999L2.63623 4.04999L4.05023 2.63599L9.00023 7.58599Z"
    />
  </svg>
);

const MenuIcon = () => (
  <svg
    width="24px"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
    fill="white"
  >
    <title>Menu</title>
    <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
  </svg>
);

const MenuToggle = ({
  toggle,
  isOpen,
}: {
  toggle(): void;
  isOpen: boolean;
}) => {
  return (
    <Box display={{ base: "block", md: "none" }} onClick={toggle}>
      {isOpen ? <CloseIcon /> : <MenuIcon />}
    </Box>
  );
};

interface IMenuProps {
  children: ReactNode;
  to: string;
}

const MenuItem = ({ children, to = "/" }: IMenuProps) => {
  return (
    <Link href={to}>
      <Text display="block">{children}</Text>
    </Link>
  );
};

const MenuLinks = ({ isOpen }: { isOpen: boolean }) => {
  const { user, isAuthenticated } = useAuth();

  const isAuth = isAuthenticated();

  return (
    <Box
      display={{ base: isOpen ? "block" : "none", md: "block" }}
      flexBasis={{ base: "100%", md: "auto" }}
    >
      <Stack
        spacing={8}
        align="center"
        justify={["center", "space-between", "flex-end", "flex-end"]}
        direction={["column", "row", "row", "row"]}
        pt={[4, 4, 0, 0]}
      >
        {!isAuth ? (
          <>
            <MenuItem to="/login">Войти</MenuItem>{" "}
            <MenuItem to="/register">Регистрация</MenuItem>
          </>
        ) : (
          <>
            {user && (
              <div style={{ display: "inline-block" }}>
                <UserContainer user={user}></UserContainer>
              </div>
            )}{" "}
          </>
        )}
        <Box h={"40px"}>
          <ThemeToggle />
        </Box>
      </Stack>
    </Box>
  );
};

interface INavBarContainerProps extends FlexProps {
  children: ReactNode;
}

const NavBarContainer = ({ children, ...props }: INavBarContainerProps) => {
  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      w="100%"
      mb={8}
      p={8}
      {...props}
    >
      {children}
    </Flex>
  );
};

export const NavHeader = (props: FlexProps) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <NavBarContainer {...props}>
      <Box display={"flex"} gap={4} alignItems={"center"}>
        <Logo />
        <MenuItem to="/cards">Итоги</MenuItem>
        <MenuItem to="/templates">Шаблоны </MenuItem>
      </Box>
      <MenuToggle toggle={toggle} isOpen={isOpen} />
      <MenuLinks isOpen={isOpen} />
    </NavBarContainer>
  );
};
