import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useFetchCardsTemplates, useRemoveCardsTemplate } from "../api/cardsTemplates"

export const useCardsTemplates = () => {
  const fetchCardsTemplates = useFetchCardsTemplates();

  const useCardsTemplatesQuery = () => useInfiniteQuery({
    queryKey: ["templates"],
    queryFn: ({ pageParam }) => fetchCardsTemplates(pageParam, 10),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      return lastPage.page !== lastPage.total_pages ? lastPageParam + 1 : undefined
    },
    select: data => data.pages.flatMap(item => item.items),
    refetchOnWindowFocus: false,
  })

  const removeCardsTemplate = useRemoveCardsTemplate();

  const queryClient = useQueryClient();

  const cardsTemplatesRemoveMutation = useMutation({
    mutationFn: (templateId: number) => {
      return removeCardsTemplate(templateId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
    },
  });

  return {
    useCardsTemplatesQuery,
    cardsTemplatesRemoveMutation,
  };
};
