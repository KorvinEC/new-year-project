import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useFetchCards, useRemoveCard } from "../api/cards"
import { useAtomValue } from "jotai"
import { tokenAtom } from "../state/atoms"

export const useCards = () => {
  const fetchCards = useFetchCards()
  const removeCard = useRemoveCard()
  const token = useAtomValue(tokenAtom)

  const useCardsQuery = () => useQuery({
    queryKey: ['cards'],
    queryFn: fetchCards,
    staleTime: 0,
    gcTime: 0,
    enabled: !!token,
  })

  const queryClient = useQueryClient()

  const removeCardMutation = useMutation({
    mutationFn: (cardId: number) => removeCard(cardId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards"] })
    },
  })

  return {
    useCardsQuery,
    removeCardMutation
  }
}
