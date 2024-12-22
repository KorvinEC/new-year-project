import { useAtom } from "jotai"
import { useCreateCardApi } from "../api/cards"
import { createCardAtom } from "../state/atoms"
import { useMutation } from "@tanstack/react-query"
import { CreateCardType } from "../types/card"

type FieldNameType = "description" | "title" | "subtitle"
type CardType = "card_nominations_data" | "card_suggestions_data"

export const useCreateCard = () => {
  const [createCard, setCreateAtom] = useAtom(createCardAtom)
  const fetchCardsTemplates = useCreateCardApi()

  const createCardMutation = useMutation({
    mutationFn: (createCard: CreateCardType) => {
      return fetchCardsTemplates(createCard)
    },
  })

  const changeCreateCard = (fieldType: CardType, index: number, name: FieldNameType, value: string) => {
    if (!createCard) { return }
    // TODO change to use of Atom in Atom
    const newCreateCard: CreateCardType = { ...createCard }
    newCreateCard[fieldType][index][name] = value
    setCreateAtom(newCreateCard)
  }

  return {
    createCard,
    setCreateAtom,
    createCardMutation,
    changeCreateCard,
  }
}
