import { useNavigate } from "@tanstack/react-router";
import { ChangeEvent } from "react";
import { useCreateTemplate } from "../hooks/useCreateTemplates";
import { TemplateStructureType } from "../types/cardTemplate";
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  Input,
  SimpleGrid,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";

const Nomination = ({
  templateField,
  index,
}: {
  templateField: TemplateStructureType;
  index: number;
  key: number;
}) => {
  const { removeTemplateStructure, changeTemplateStructure } =
    useCreateTemplate();

  return (
    <div key={index}>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        mt={2}
        maxWidth={"550px"}
      >
        <Card w={"100%"}>
          <CardBody>
            <Box display={"flex"} gap={2}>
              <Input
                placeholder={"Заголовок"}
                id="title"
                name="title"
                type="text"
                value={templateField.title}
                onChange={(event) =>
                  changeTemplateStructure(
                    index,
                    event.target.name,
                    event.target.value,
                  )
                }
              />
              <Button onClick={() => removeTemplateStructure(index)}>
                <DeleteIcon />
              </Button>
            </Box>
            <Input
              mt={4}
              placeholder={"Краткое описание"}
              id="subtitle"
              name="subtitle"
              type="text"
              value={templateField.subtitle}
              onChange={(event) =>
                changeTemplateStructure(
                  index,
                  event.target.name,
                  event.target.value,
                )
              }
            />
          </CardBody>
        </Card>
      </Box>
    </div>
  );
};

const CreateTemplateForm = () => {
  const navigate = useNavigate({ from: "/templates/create" });
  const { template, addTemplateField, createCardsTemplateMutation } =
    useCreateTemplate();

  const handleOnSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    createCardsTemplateMutation.mutate(template);
  };

  if (createCardsTemplateMutation.isSuccess) {
    navigate({ to: "/templates" });
  }

  const colorScheme = useColorModeValue("blue", "orange");

  return (
    <>
      <form onSubmit={handleOnSubmit}>
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Text fontSize="4xl" pl={"5px"}>
            Создать шаблон
          </Text>
          <Button type="submit" variant="solid" colorScheme={colorScheme}>
            {createCardsTemplateMutation.isPending
              ? "Создается ..."
              : "Создать"}
          </Button>
        </Box>
        <SimpleGrid minChildWidth="420px" spacing="20px">
          {template.map((templateField, index) => (
            <Nomination
              templateField={templateField}
              key={index}
              index={index}
            />
          ))}
          <ButtonGroup
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            h={"180px"}
          >
            <Button
              variant="outline"
              onClick={addTemplateField}
              rightIcon={<AddIcon />}
            >
              <Text>Добавить номинацию</Text>
            </Button>
          </ButtonGroup>
        </SimpleGrid>
      </form>
    </>
  );
};

export const CreateTemplate = () => {
  return (
    <Box margin={"0 32px"}>
      <CreateTemplateForm />
    </Box>
  );
};
