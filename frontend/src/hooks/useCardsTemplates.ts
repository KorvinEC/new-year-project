import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useFetchCardsTemplates, useRemoveCardsTemplate } from "../api/cardsTemplates"
import { useAtomValue } from "jotai"
import { tokenAtom } from "../state/atoms"

export const useCardsTemplates = () => {
  const fetchCardsTemplates = useFetchCardsTemplates()

  const useCardsTemplatesQuery = () => useQuery({
    queryKey: ["templates"],
    queryFn: fetchCardsTemplates,
  })

  const removeCardsTemplate = useRemoveCardsTemplate()

  const queryClient = useQueryClient()

  const cardsTemplatesRemoveMutation = useMutation({
    mutationFn: (templateId: number) => {
      return removeCardsTemplate(templateId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] })
    },
  })

  return {
    useCardsTemplatesQuery,
    cardsTemplatesRemoveMutation,
  }
}
