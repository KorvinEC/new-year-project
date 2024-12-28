import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useFetchCards, useRemoveCard } from "../api/cards"

export const useCards = () => {
  const fetchCards = useFetchCards()
  const removeCard = useRemoveCard()

  const useCardsQuery = () => useInfiniteQuery({
    queryKey: ['cards'],
    queryFn: ({ pageParam }) => fetchCards(pageParam, 5),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      return lastPage.page !== lastPage.total_pages ? lastPageParam + 1 : undefined
    },
    select: result => result.pages.flatMap(page => page.items),
    refetchOnWindowFocus: false,
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
