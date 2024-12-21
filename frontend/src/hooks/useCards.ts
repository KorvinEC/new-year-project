import { useQuery } from "@tanstack/react-query"
import { useFetchCardsTemplates } from "../api/cardsTemplates"

export const useCardsTemplates = () => {
  const fetchCardsTemplates = useFetchCardsTemplates()

  const useCardsTemplatesQuery = () => useQuery({
    queryKey: [],
    queryFn: fetchCardsTemplates,
    staleTime: 0,
    gcTime: 0
  })

  return {
    useCardsTemplatesQuery
  }
}
