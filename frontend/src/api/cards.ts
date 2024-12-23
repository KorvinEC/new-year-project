import { AddImageToCardApiType, CardType, CreateCardApiType, ImageToAddType } from "../types/card"
import { useAxiosInstance } from "./api-client"

export const useFetchCards = () => {
  const axiosInstance = useAxiosInstance()

  return async (): Promise<CardType[]> => {
    const response = await axiosInstance.get("cards/")
    return response.data
  }
}

export const useCreateCardWithImage = () => {
  const axiosInstance = useAxiosInstance()

  const createCard = async (cardToCreate: CreateCardApiType): Promise<CardType> => {
    const response = await axiosInstance.post("cards/", { ...cardToCreate })
    return response.data
  }

  const addImageToCard = async (imageToAdd: AddImageToCardApiType) => {
    const formData = new FormData()

    formData.append("image_file", imageToAdd.image_file)

    const response = await axiosInstance.post(
      `cards/${imageToAdd.card_id}/data/${imageToAdd.data_id}/image`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        params: { card_data_type: imageToAdd.card_data_type }
      },
    )

    return response.data
  }

  return async (cardToCreate: CreateCardApiType, imagesToAdd: ImageToAddType[]): Promise<CardType> => {
    const responseData = await createCard(cardToCreate)

    Promise.allSettled(imagesToAdd.map((imageToAdd) =>
      addImageToCard({
        card_id: responseData.id,
        data_id: imageToAdd.index,
        card_data_type: imageToAdd.card_data_type,
        image_file: imageToAdd.image_file,
      })
    ))

    return responseData
  }
}

export const useRemoveCard = () => {
  const axiosInstance = useAxiosInstance()

  return async (cardId: number): Promise<CardType[]> => {
    const response = await axiosInstance.delete(`cards/${cardId}`)
    return response.data
  }
}
