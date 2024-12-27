import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useFetchCards, useRemoveCard } from "../api/cards"

export const useCards = () => {
  const fetchCards = useFetchCards()
  const removeCard = useRemoveCard()

  const useCardsQuery = () => useQuery({
    queryKey: ['cards'],
    queryFn: fetchCards,
    staleTime: 0,
    gcTime: 0,
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
