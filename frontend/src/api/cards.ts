import { CardType, CreateCardApiType } from "../types/card"
import { useAxiosInstance } from "./api-client"

export const useFetchCards = () => {
  const axiosInstance = useAxiosInstance()

  return async (): Promise<CardType[]> => {
    const response = await axiosInstance.get("cards/")
    return response.data
  }
}

export const useSendCreateCard = () => {
  const axiosInstance = useAxiosInstance()

  return async (cardToCreate: CreateCardApiType): Promise<CardType[]> => {
    const response = await axiosInstance.post("cards/", { ...cardToCreate })
    return response.data
  }
}
