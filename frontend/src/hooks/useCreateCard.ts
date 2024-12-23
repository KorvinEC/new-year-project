import { useAtom } from "jotai"
import { useSendCreateCard } from "../api/cards"
import { createCardAtom } from "../state/atoms"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { CreateCardType } from "../types/card"
import { RESET } from "jotai/utils"

type FieldNameType = "description" | "title" | "subtitle"
type CardType = "card_nominations_data" | "card_suggestions_data"

export const useCreateCard = () => {
  const [createCard, setCreateCardAtom] = useAtom(createCardAtom)
  const fetchCardsTemplates = useSendCreateCard()

  const addSuggestionField = () => {
    if (!createCard) { return }
    const newCreateCard: CreateCardType = { ...createCard }
    newCreateCard.card_suggestions_data = [
      ...newCreateCard.card_suggestions_data,
      { "title": "", "subtitle": "", "description": "" }
    ]
    setCreateCardAtom(newCreateCard)
  }

  const removeSuggestionField = (removeIndex: number) => {
    if (!createCard) { return }
    const newCreateCard: CreateCardType = { ...createCard }
    newCreateCard.card_suggestions_data = newCreateCard.card_suggestions_data.filter((_, index) => (index !== removeIndex))
    setCreateCardAtom(newCreateCard)
  }

  const queryClient = useQueryClient()

  const createCardMutation = useMutation({
    mutationFn: (createCard: CreateCardType) => {
      return fetchCardsTemplates(createCard)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: "templates" })
    },
    onSettled: () => {
      setCreateCardAtom(RESET)
    }
  })

  const changeCreateCard = (fieldType: CardType, index: number, name: FieldNameType, value: string) => {
    if (!createCard) { return }
    // TODO change to use of Atom in Atom
    const newCreateCard: CreateCardType = { ...createCard }
    newCreateCard[fieldType][index][name] = value
    setCreateCardAtom(newCreateCard)
  }

  return {
    createCard,
    setCreateCardAtom,
    createCardMutation,
    changeCreateCard,
    addSuggestionField,
    removeSuggestionField,
  }
}
