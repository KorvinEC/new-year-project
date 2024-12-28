import {
  Button,
  CardBody,
  Heading,
  Stack,
  Text,
  Image,
  Card as ChakraCard,
  SimpleGrid,
  Box,
  WrapItem,
  Avatar,
  Wrap,
  Tooltip,
  Popover,
  PopoverContent,
  PopoverTrigger,
  AlertIcon,
  Alert,
  useColorModeValue,
  Spinner,
  Center,
  useToast,
} from "@chakra-ui/react";
import { useCards } from "../hooks/useCards";
import { CardFieldsType, CardType } from "../types/card";
import styled from "styled-components";
import { DeleteIcon } from "@chakra-ui/icons";
import { useAuth } from "../auth";
import { UserType } from "../types/user";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

export const UserContainer = ({ user }: { user: UserType }) => {
  const { logoutMutation } = useAuth();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <Popover>
      <PopoverTrigger>
        <Wrap cursor={"pointer"}>
          <WrapItem>
            {user.image && (
              <Avatar
                size="md"
                src={user.image.url}
                borderRadius={"8px"}
                className="icon-image"
              />
            )}
          </WrapItem>
          <WrapItem alignItems="center" display="flex">
            <Text size="md">{user.nickname}</Text>
          </WrapItem>
        </Wrap>
      </PopoverTrigger>
      <PopoverContent w={"200px"}>
        <Button variant="outline" onClick={handleLogout}>
          Выйти
        </Button>
      </PopoverContent>
    </Popover>
  );
};

const CardFields = (props: { field: CardFieldsType }) => {
  const { field } = props;

  return (
    <ChakraCard maxW="sm">
      <CardBody>
        <Tooltip
          label={field.subtitle}
          colorScheme={"seal"}
          borderRadius={"4px"}
          w={"300px"}
        >
          <Heading size="md" mb={2} as="h2">
            {field.title}
          </Heading>
        </Tooltip>
        <Image
          src={field.image_url}
          alt="Green double couch with wooden legs"
          borderRadius="lg"
        />
        <Stack mt="6" spacing="3">
          <Text>{field.description}</Text>
        </Stack>
      </CardBody>
    </ChakraCard>
  );
};

const CardListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
`;

const Card = (props: { card: CardType }) => {
  const { card } = props;
  const { nominations, suggestions } = card.data;
  const { removeCardMutation } = useCards();
  const { isAuthenticated } = useAuth();

  const bg = useColorModeValue("#f9f7f5", "#26292d");
  const toast = useToast();

  const handleDelete = () => {
    removeCardMutation.mutateAsync(props.card.id).catch(() => {
      toast({
        position: "bottom-right",
        title: "Ошибка",
        description: "Невозможно удалить чужие итоги",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    });
  };

  return (
    <Box bgColor={bg} borderRadius="8px" p={4}>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        mb={2}
      >
        <UserContainer user={card.user} />
        {isAuthenticated() && (
          <Button type="submit" onClick={handleDelete}>
            <DeleteIcon />
          </Button>
        )}
      </Box>
      <SimpleGrid minChildWidth="250px" spacing="40px">
        {nominations.map((field) => (
          <CardFields key={field.id} field={field} />
        ))}
      </SimpleGrid>
      {suggestions.length > 0 && (
        <Box mt={4}>
          <Heading size="md" mb={4}>
            Рекомендации:
          </Heading>
          <CardListContainer>
            {suggestions.map((field) => (
              <CardFields key={field.id} field={field} />
            ))}
          </CardListContainer>
        </Box>
      )}
    </Box>
  );
};

const CardsList = () => {
  const { useCardsQuery } = useCards();

  const { data, status, error, hasNextPage, isFetchingNextPage, fetchNextPage } = useCardsQuery()

  const { ref, inView, entry } = useInView()

  useEffect(() => {
    console.log(inView);
    if (inView) {
      fetchNextPage()
    }
  }, [entry, inView, fetchNextPage])

  if (status === "pending") {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  if (status === "error") {
    return <>
      <h2>Error:</h2>
      <p>{JSON.stringify(error)}</p>
    </>
  }

  return (
    <Box display={"flex"} flexDirection={"column"} gap={4}>
      {
        data.length > 0
          ? (data.map((value) => <Card key={value.id} card={value} />))
          : <Alert status="info" mt={8}>
            <AlertIcon />
            Итоги года не подведены, создайте шаблон и заполните его.
          </Alert>
      }
      <div ref={ref} style={{ height: "5px" }}>
        {!hasNextPage && "No data"}
        {isFetchingNextPage && "Fetching ..."}
      </div>
    </Box>
  );
};

export const Cards = () => {
  return (
    <Box m={"0 32px"}>
      <Heading>Итоги</Heading>
      <CardsList />
    </Box>
  );
};
