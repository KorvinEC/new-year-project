import { useQuery } from "@tanstack/react-query"
import { useFetchCards } from "../api/cards"
import { useAtomValue } from "jotai"
import { tokenAtom } from "../state/atoms"

export const useCards = () => {
  const fetchCards = useFetchCards()
  const token = useAtomValue(tokenAtom)

  const useCardsQuery = () => useQuery({
    queryKey: ['cards'],
    queryFn: fetchCards,
    staleTime: 0,
    gcTime: 0,
    enabled: !!token,
  })

  return {
    useCardsQuery
  }
}
