import { useNavigate } from "@tanstack/react-router";
import { ChangeEvent, useState } from "react";
import { useCreateCard } from "../hooks/useCreateCard";
import {
  Box,
  Button,
  Card,
  CardHeader,
  Input,
  Textarea,
  Text,
  CardBody,
  Stack,
  SimpleGrid,
  Heading,
  useColorModeValue,
  Image,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";

interface FieldProps {
  index: number;
  title: string;
  subtitle: string;
  description: string;
}

const Nomination = (props: { structure: FieldProps }) => {
  const { changeCreateCard, addImageToCard } = useCreateCard();
  const [preview, setPreview] = useState<string | undefined>(undefined);

  const handleImageFile = (
    index: number,
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (event.target.files?.length != 1) {
      return;
    }

    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    addImageToCard(index, "nominations", file);
  };

  return (
    <Card w={"350px"}>
      <CardHeader>
        <Heading size={"md"}>{props.structure.title}</Heading>
        <div>
          <Text>{props.structure.subtitle}</Text>
        </div>
      </CardHeader>
      <CardBody>
        <Stack spacing="4">
          <Box display={"flex"} alignItems={"center"} h={"60px"}>
            <Input
              mr={8}
              p={0}
              border={"none"}
              width={"100%"}
              type="file"
              datatype="image"
              onChange={(e) => handleImageFile(props.structure.index, e)}
            />
            <Image maxH={"60px"} src={preview} />
          </Box>
          <Box>
            <Text as="b">Описание: </Text>
            <Textarea
              maxLength={500}
              name="description"
              value={props.structure.description}
              onChange={(event) =>
                changeCreateCard(
                  "card_nominations_data",
                  props.structure.index,
                  "description",
                  event.target.value,
                )
              }
            />
          </Box>
        </Stack>
      </CardBody>
    </Card>
  );
};

const Suggestion = (props: { structure: FieldProps }) => {
  const { changeCreateCard, removeSuggestionField, addImageToCard } =
    useCreateCard();

  const handleImageFile = (
    index: number,
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    if (event.target.files?.length != 1) {
      return;
    }
    addImageToCard(index, "suggestions", event.target.files[0]);
  };

  return (
    <Card w={"350px"}>
      <CardBody>
        <Stack spacing={2}>
          <Box>
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
              mb={2}
            >
              <Text as="b">Заголовок: </Text>
              <Button
                onClick={() => removeSuggestionField(props.structure.index)}
              >
                <DeleteIcon />
              </Button>
            </Box>
            <Input
              type="text"
              name="title"
              value={props.structure.title}
              onChange={(event) =>
                changeCreateCard(
                  "card_suggestions_data",
                  props.structure.index,
                  "title",
                  event.target.value,
                )
              }
            />
          </Box>
          <Box>
            <Input
              type="file"
              datatype="image"
              onChange={(e) => handleImageFile(props.structure.index, e)}
            />
          </Box>
          <Box>
            <Text as="b">Подзаголовок: </Text>
            <Input
              type="text"
              name="subtitle"
              value={props.structure.subtitle}
              onChange={(event) =>
                changeCreateCard(
                  "card_suggestions_data",
                  props.structure.index,
                  "subtitle",
                  event.target.value,
                )
              }
            />
          </Box>
          <Box>
            <Text as="b">Описание: </Text>
            <Textarea
              name="description"
              value={props.structure.description}
              onChange={(event) =>
                changeCreateCard(
                  "card_suggestions_data",
                  props.structure.index,
                  "description",
                  event.target.value,
                )
              }
            />
          </Box>
        </Stack>
      </CardBody>
    </Card>
  );
};

const Nominations = () => {
  const { createCard } = useCreateCard();

  return (
    <Box>
      <SimpleGrid minChildWidth="350px" spacing="20px">
        {createCard ? (
          createCard.card_nominations_data.map((value, index) => (
            <Nomination key={index} structure={{ ...value, index }} />
          ))
        ) : (
          <p>No items</p>
        )}
      </SimpleGrid>
    </Box>
  );
};

const Suggestions = () => {
  const { createCard, addSuggestionField } = useCreateCard();
  const colorScheme = useColorModeValue("blue", "orange");

  return (
    <Box mt={"20px"}>
      <Text fontSize="xl">Предложения:</Text>
      <SimpleGrid minChildWidth="350px" spacing="20px" mt={2}>
        {createCard ? (
          createCard.card_suggestions_data.map((value, index) => (
            <Suggestion key={index} structure={{ ...value, index }} />
          ))
        ) : (
          <p>No items</p>
        )}
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          h={"360px"}
          border={"1px solid #f1f1f1"}
          borderRadius={4}
          w={"350px"}
        >
          <Button colorScheme={colorScheme} onClick={addSuggestionField}>
            <AddIcon />
          </Button>
        </Box>
      </SimpleGrid>
    </Box>
  );
};

export const CreateCards = () => {
  const { createCardMutation } = useCreateCard();

  const navigate = useNavigate({ from: "/cards/create" });

  const handleOnSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    await createCardMutation.mutateAsync()
      .then(() => navigate({ to: "/cards" }))
  };

  const colorScheme = useColorModeValue("blue", "orange");

  return (
    <Box m={"0 32px"}>
      <form onSubmit={handleOnSubmit}>
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
          mb={4}
        >
          <Text fontSize="4xl">Создать номинации</Text>
          <Button type="submit" colorScheme={colorScheme}>
            Сохранить
          </Button>
        </Box>
        <Nominations />
        <Suggestions />
      </form>
    </Box>
  );
};
