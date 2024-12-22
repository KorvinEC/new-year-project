import { CardType, CreateCardApiType } from "../types/card"
import { useAxiosInstance } from "./api-client"

export const useCreateCardApi = () => {
  const axiosInstance = useAxiosInstance()

  return async (cardToCreate: CreateCardApiType): Promise<CardType[]> => {
    const response = await axiosInstance.post("cards/", { ...cardToCreate } )
    return response.data
  }
}
