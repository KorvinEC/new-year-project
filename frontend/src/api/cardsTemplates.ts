import { CardTemplate } from "../types/cardTemplate"
import { useAxiosInstance } from "./api-client"

export const useFetchCardsTemplates = () => {
  const axiosInstance = useAxiosInstance()

  return async (): Promise<CardTemplate[]> => {
    const response = await axiosInstance.get("cards/templates/")
    return response.data
  }
}
