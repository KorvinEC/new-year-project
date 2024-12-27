import { CardTemplate, TemplateStructureType } from "../types/cardTemplate"
import { useAxiosInstance } from "./api-client"

export const useFetchCardsTemplates = () => {
  const axiosInstance = useAxiosInstance()

  return async (): Promise<CardTemplate[]> => {
    const response = await axiosInstance.get("cards/templates/")
    return response.data
  }
}

export const useCreateCardsTemplate = () => {
  const axiosInstance = useAxiosInstance()

  return async (structure: TemplateStructureType[]): Promise<CardTemplate[]> => {
    const response = await axiosInstance.post("cards/templates/", { structure })
    return response.data
  }
}

export const useRemoveCardsTemplate = () => {
  const axiosInstance = useAxiosInstance()

  return async (templatesId: number) => {
    const response = await axiosInstance.delete(`cards/templates/${templatesId}`)
    return response.data
  }
}
