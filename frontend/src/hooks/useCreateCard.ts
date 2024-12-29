import { useAtom } from "jotai";
import { useCreateCardWithImage } from "../api/cards";
import { createCardAtom, imagesToAddAtom } from "../state/atoms";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CardDataFieldType, CreateCardType } from "../types/card";
import { RESET } from "jotai/utils";

type FieldNameType = "description" | "title" | "subtitle";
type CardType = "card_nominations_data" | "card_suggestions_data";

export const useCreateCard = () => {
  const [createCard, setCreateCardAtom] = useAtom(createCardAtom);
  const [imagesToAdd, setAddImageToCard] = useAtom(imagesToAddAtom);

  const createCardWithImage = useCreateCardWithImage();

  const addImageToCard = (
    index: number,
    card_data_type: CardDataFieldType,
    image_file: File,
  ) => {
    setAddImageToCard([
      ...imagesToAdd.filter(
        (imageToAdd) =>
          !(
            imageToAdd.card_data_type === card_data_type &&
            imageToAdd.index === index
          ),
      ),
      { index, card_data_type, image_file },
    ]);
  };

  const addSuggestionField = () => {
    if (!createCard) {
      throw Error("Template should be selected before card creation");
    }

    const newCreateCard: CreateCardType = { ...createCard };

    newCreateCard.card_suggestions_data = [
      ...newCreateCard.card_suggestions_data,
      { title: "", subtitle: "", description: "" },
    ];
    setCreateCardAtom(newCreateCard);
  };

  const removeSuggestionField = (removeIndex: number) => {
    if (!createCard) {
      throw Error("Template should be selected before card creation");
    }

    const newCreateCard: CreateCardType = { ...createCard };

    newCreateCard.card_suggestions_data =
      newCreateCard.card_suggestions_data.filter(
        (_, index) => index !== removeIndex,
      );
    setCreateCardAtom(newCreateCard);
  };

  const queryClient = useQueryClient();

  const createCardMutation = useMutation({
    mutationFn: () => {
      if (!createCard) {
        throw Error("Template should be selected before card creation");
      }
      return createCardWithImage(createCard, imagesToAdd);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: "card" });
    },
    onSettled: () => {
      setCreateCardAtom(RESET);
      setAddImageToCard(RESET);
    },
  });

  const changeCreateCard = (
    fieldType: CardType,
    index: number,
    name: FieldNameType,
    value: string,
  ) => {
    if (!createCard) {
      throw Error("Template should be selected before card creation");
    }
    // TODO change to use of Atom in Atom
    const newCreateCard: CreateCardType = { ...createCard };
    newCreateCard[fieldType][index][name] = value;
    setCreateCardAtom(newCreateCard);
  };

  return {
    createCard,
    setCreateCardAtom,
    imagesToAdd,
    setAddImageToCard,
    createCardMutation,
    changeCreateCard,
    addSuggestionField,
    removeSuggestionField,
    addImageToCard,
  };
};
