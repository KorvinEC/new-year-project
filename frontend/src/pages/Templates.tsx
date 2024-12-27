import { useCardsTemplates } from "../hooks/useCardsTemplates";
import { Link, useNavigate } from "@tanstack/react-router";
import { useSetAtom } from "jotai";
import { createCardAtom } from "../state/atoms";
import { TemplateStructureType } from "../types/cardTemplate";
import { UserType } from "../types/user";
import { useAuth } from "../auth";
import {
  Box,
  Button,
  StackDivider,
  Stack,
  SimpleGrid,
  ButtonGroup,
  Text,
  CardBody,
  Card,
  WrapItem,
  Wrap,
  Avatar,
  Heading,
  AlertIcon,
  Alert,
  useColorModeValue,
  Spinner,
  Center,
  useToast,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";

const UserContainer = ({ user }: { user: UserType }) => {
  return (
    <Wrap mt={2} mb={4}>
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
        <Heading size="md">{user.nickname}</Heading>
      </WrapItem>
    </Wrap>
  );
};

const TemplateFields = (props: { structure: TemplateStructureType }) => {
  const { structure } = props;

  return (
    <Card>
      <CardBody>
        <Stack divider={<StackDivider />} spacing="4">
          <Heading size={"md"}>{structure.title}</Heading>
          <Text>{structure.subtitle}</Text>
        </Stack>
      </CardBody>
    </Card>
  );
};

const TemplatesList = () => {
  const navigate = useNavigate({ from: "/templates" });

  const { isAuthenticated, isLoading: isLoadingUser } = useAuth();
  const bg = useColorModeValue("#f9f7f5", "#26292d");
  const toast = useToast();

  const setCreateAtom = useSetAtom(createCardAtom);

  const { useCardsTemplatesQuery, cardsTemplatesRemoveMutation } =
    useCardsTemplates();

  const { data, error, isLoading } = useCardsTemplatesQuery();

  if (isLoading || isLoadingUser) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  if (error) {
    return (
      <>
        <h1>Error:</h1>
        <p>{JSON.stringify(error)}</p>
      </>
    );
  }

  const handleRemoveTemplate = (templateId: number) => {
    cardsTemplatesRemoveMutation.mutateAsync(templateId).catch(() => {
      toast({
        position: "bottom-right",
        title: "Ошибка",
        description: "Невозможно удалить чужой шаблон",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    });
  };

  const handleCreateTemplate = (templateId: number) => {
    const item = data?.find((item) => item.id === templateId);
    if (item === undefined || item === null) {
      return;
    }
    setCreateAtom({
      card_template_id: item.id,
      card_nominations_data: item.structure.map((structure) => {
        return { ...structure, description: "" };
      }),
      card_suggestions_data: [],
    });
    navigate({ to: "/cards/create" });
  };

  if (data?.length === 0) {
    return (
      <Box p={"0 32px"}>
        <Alert status="info" mt={"8"}>
          <AlertIcon />
          Создайте шаблон, чтобы подвести итоги.
        </Alert>
      </Box>
    );
  }

  return (
    <Stack divider={<StackDivider />} spacing="4" margin={"0 32px"}>
      {data?.map((cardTemplate) => (
        <Box
          backgroundColor={bg}
          key={cardTemplate.id}
          p={4}
          borderRadius={"8px"}
        >
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
            mb={4}
          >
            <UserContainer user={cardTemplate.user} />
            {isAuthenticated() && (
              <ButtonGroup mt={4}>
                <Button
                  type="submit"
                  onClick={() => handleCreateTemplate(cardTemplate.id)}
                  variant={"outline"}
                >
                  <Text ml={2}>Заполнить шаблон</Text>
                </Button>
                <Button
                  type="submit"
                  onClick={() => {
                    handleRemoveTemplate(cardTemplate.id);
                  }}
                >
                  <DeleteIcon />
                </Button>
              </ButtonGroup>
            )}
          </Box>
          <SimpleGrid minChildWidth="340px" spacing="24px">
            {cardTemplate.structure.map((structure, index) => (
              <TemplateFields key={index} structure={structure} />
            ))}
          </SimpleGrid>
        </Box>
      ))}
    </Stack>
  );
};

export const Templates = () => {
  const { isAuthenticated } = useAuth();
  const colorSchema = useColorModeValue("blue", "orange");

  return (
    <>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        ml={"32px"}
        mr={"32px"}
        alignItems={"center"}
      >
        <Heading>Шаблоны</Heading>
        {isAuthenticated() && (
          <Link to="/templates/create">
            <Button mb={2} variant="solid" colorScheme={colorSchema}>
              Создать
            </Button>
          </Link>
        )}
      </Box>
      <TemplatesList />
    </>
  );
};
